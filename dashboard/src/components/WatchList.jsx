import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useContext,
} from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import SearchBar from "./SearchBar";
import WatchlistItem from "./WatchlistItem";
import { DoughnutChart } from "./DoughnutChart";
import BASE_URL from "../config";
import GeneralContext from "./GeneralContext";
import "./WatchList.css";

const MAX_WATCHLIST = 50;
const PRICE_REFRESH_MS = 8000;
const PRICE_DEBOUNCE_MS = 400;

// Seed-based pseudo-random price so each symbol gets a consistent base price
const seedPrice = (symbol) => {
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
  }
  return 200 + Math.abs(hash % 4800); // price range ₹200 – ₹5000
};

// Generate a mock price with small random variation to simulate live movement
const mockPrice = (symbol) => {
  const base = seedPrice(symbol);
  const jitter = (Math.random() - 0.5) * base * 0.02; // ±1%
  const ltp = +(base + jitter).toFixed(2);
  const change = +jitter.toFixed(2);
  const changePercent = +((jitter / base) * 100).toFixed(2);
  return { symbol, ltp, change, changePercent };
};

const useDebouncedValue = (value, delayMs) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => clearTimeout(timeoutId);
  }, [value, delayMs]);

  return debouncedValue;
};

/* ================= MAIN WATCHLIST ================= */
const WatchList = ({ onClose }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [isTabVisible, setIsTabVisible] = useState(
    typeof document === "undefined" ? true : !document.hidden
  );
  const { livePriceMap, setLivePriceMap, mergeLivePrices } = useContext(GeneralContext);
  const priceMapRef = useRef(livePriceMap);

  useEffect(() => {
    priceMapRef.current = livePriceMap;
  }, [livePriceMap]);

  useEffect(() => {
    const handleVisibilityChange = () => setIsTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  /* ── fetch watchlist from backend ── */
  const fetchWatchlist = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/watchlist`);
      const items = Array.isArray(res.data) ? res.data : [];
      setWatchlist(
        items
          .map((it) => ({ symbol: it.symbol, name: it.name }))
          .filter((it) => typeof it.symbol === "string" && it.symbol.trim().length > 0)
      );
    } catch (err) {
      console.error("Error fetching watchlist:", err);
      setWatchlist([]);
    }
  }, []);

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  const symbolsCsv = useMemo(
    () => watchlist.map((s) => s.symbol).filter(Boolean).join(","),
    [watchlist]
  );

  const debouncedSymbolsCsv = useDebouncedValue(symbolsCsv, PRICE_DEBOUNCE_MS);

  const { data: fetchedPriceMap = {} } = useQuery({
    queryKey: ["live-prices", debouncedSymbolsCsv],
    enabled: Boolean(debouncedSymbolsCsv),
    staleTime: PRICE_REFRESH_MS,
    refetchInterval: isTabVisible ? PRICE_REFRESH_MS : false,
    refetchIntervalInBackground: false,
    queryFn: async () => {
      const symbols = debouncedSymbolsCsv
        .split(",")
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean);

      if (symbols.length === 0) return {};

      try {
        const res = await axios.get(`${BASE_URL}/api/live-prices`, {
          params: { symbols: symbols.join(",") },
          timeout: 3500,
        });

        const prices = Array.isArray(res.data?.prices) ? res.data.prices : [];
        const map = {};

        for (const item of prices) {
          const symbol = String(item?.symbol || "")
            .trim()
            .toUpperCase();
          if (!symbol) continue;
          map[symbol] = {
            symbol,
            ltp: Number(item?.ltp ?? 0),
            change: Number(item?.change ?? 0),
            changePercent: Number(item?.changePercent ?? 0),
          };
        }

        for (const symbol of symbols) {
          if (!map[symbol]) {
            const last = priceMapRef.current?.[symbol];
            map[symbol] = last ? { ...last, symbol } : mockPrice(symbol);
          }
        }

        return map;
      } catch (err) {
        console.error("Batch live price fetch failed:", err);
        const map = {};
        for (const symbol of symbols) {
          const last = priceMapRef.current?.[symbol];
          map[symbol] = last ? { ...last, symbol } : mockPrice(symbol);
        }
        return map;
      }
    },
  });

  useEffect(() => {
    if (!fetchedPriceMap || Object.keys(fetchedPriceMap).length === 0) return;
    mergeLivePrices(fetchedPriceMap);
  }, [fetchedPriceMap, mergeLivePrices]);

  /* ── add stock ── */
  const handleAddStock = (stock) => {
    if (watchlist.length >= MAX_WATCHLIST) return;
    if (watchlist.some((w) => w.symbol === stock.symbol)) return;

    (async () => {
      try {
        const res = await axios.post(`${BASE_URL}/watchlist`, {
          symbol: stock.symbol,
          name: stock.name,
        });
        const items = Array.isArray(res.data) ? res.data : [];
        setWatchlist(items.map((it) => ({ symbol: it.symbol, name: it.name })));
      } catch (err) {
        console.error("Error adding to watchlist:", err);
      }
    })();
  };

  /* ── remove stock ── */
  const handleRemoveStock = (symbol) => {
    (async () => {
      try {
        const res = await axios.delete(
          `${BASE_URL}/watchlist/${encodeURIComponent(symbol)}`
        );
        const items = Array.isArray(res.data) ? res.data : [];
        setWatchlist(items.map((it) => ({ symbol: it.symbol, name: it.name })));
      } catch (err) {
        console.error("Error removing from watchlist:", err);
        // fallback: update UI even if API fails
        setWatchlist((prev) => prev.filter((s) => s.symbol !== symbol));
      } finally {
        setLivePriceMap((prev) => {
          const copy = { ...prev };
          delete copy[symbol];
          return copy;
        });
      }
    })();
  };

  /* ── drag & drop reorder ── */
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const handleDragStart = (index) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    const copy = [...watchlist];
    const [removed] = copy.splice(dragItem.current, 1);
    copy.splice(dragOverItem.current, 0, removed);
    dragItem.current = null;
    dragOverItem.current = null;
    setWatchlist(copy);
  };

  /* ── doughnut chart data ── */
  // Use live LTP if available, otherwise show equal segments so chart is always visible
  const chartData = (() => {
    if (watchlist.length === 0) return null;

    const hasLivePrices = watchlist.some((s) => livePriceMap[s.symbol]?.ltp);

    return {
      labels: watchlist.map((s) => s.symbol),
      datasets: [
        {
          label: hasLivePrices ? "LTP" : "Stocks",
          data: watchlist.map((s) =>
            hasLivePrices ? (livePriceMap[s.symbol]?.ltp || 0) : 1
          ),
          backgroundColor: [
            "rgba(65,132,243,0.6)",
            "rgba(255,99,132,0.6)",
            "rgba(75,192,192,0.6)",
            "rgba(255,206,86,0.6)",
            "rgba(153,102,255,0.6)",
            "rgba(255,159,64,0.6)",
            "rgba(54,162,235,0.6)",
            "rgba(104,211,145,0.6)",
            "rgba(255,127,80,0.6)",
            "rgba(186,85,211,0.6)",
          ],
        },
      ],
    };
  })();

  return (
    <div className="watchlist-container">
      {typeof onClose === "function" && (
        <div className="wl-mobile-header">
          <h4>Watchlist</h4>
          <button type="button" className="wl-close" onClick={onClose}>
            ×
          </button>
        </div>
      )}
      {/* Search bar */}
      <SearchBar
        watchlist={watchlist}
        onAddStock={handleAddStock}
        watchlistCount={watchlist.length}
      />

      {/* Watchlist items */}
      {watchlist.length === 0 ? (
        <div className="wl-empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#b1b1b1" strokeWidth="1.5">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p>Search and add stocks to your watchlist</p>
        </div>
      ) : (
        <>
          {/* Column headers */}
          <div className="wl-table-header">
            <span className="wl-th-symbol">Symbol</span>
            <span className="wl-th-change">Change (₹)</span>
            <span className="wl-th-percent">Change %</span>
            <span className="wl-th-ltp">LTP</span>
          </div>

          <ul className="wl-list">
            {watchlist.map((stock, index) => (
              <div
                key={stock.symbol}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragEnter={() => handleDragEnter(index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                className="wl-drag-wrapper"
              >
                <WatchlistItem
                  stock={stock}
                  priceData={livePriceMap[stock.symbol]}
                  onRemove={handleRemoveStock}
                />
              </div>
            ))}
          </ul>

          {/* Doughnut Chart — always visible below watchlist */}
          {chartData && <DoughnutChart data={chartData} />}
        </>
      )}
    </div>
  );
};

export default WatchList;
