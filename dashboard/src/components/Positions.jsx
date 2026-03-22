import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import BASE_URL from "../config";
import SellActionWindow from "./SellActionWindow";
import StockChart from "./StockChart";
import "./Positions.css";

const POSITIONS_LS_KEY = "zerodha_positions";
const PRICE_REFRESH_MS = 8000; // 8 seconds
const SQUARE_OFF_HOUR = 15;
const SQUARE_OFF_MINUTE = 20;

/* ─── price helpers (mock fallback) ─── */
const seedPrice = (symbol) => {
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
  }
  return 200 + Math.abs(hash % 4800);
};

const mockLivePrice = (symbol) => {
  const base = seedPrice(symbol);
  const jitter = (Math.random() - 0.5) * base * 0.02;
  const ltp = +(base + jitter).toFixed(2);
  const changePercent = +((jitter / base) * 100).toFixed(2);
  return { ltp, changePercent };
};

/* ─── localStorage cache ─── */
const loadCached = () => {
  try {
    const d = localStorage.getItem(POSITIONS_LS_KEY);
    return d ? JSON.parse(d) : [];
  } catch {
    return [];
  }
};
const saveCache = (list) =>
  localStorage.setItem(POSITIONS_LS_KEY, JSON.stringify(list));

/* ═══════════════════════════════════════════════
   POSITIONS (INTRADAY MIS) COMPONENT
   ═══════════════════════════════════════════════ */
const Positions = () => {
  const [positions, setPositions] = useState(loadCached);
  const [priceMap, setPriceMap] = useState({});
  const [sellStock, setSellStock] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [activeTab, setActiveTab] = useState("open");
  const [loading, setLoading] = useState(true);
  const [squaredOff, setSquaredOff] = useState(false);
  const priceInterval = useRef(null);
  const squareOffTimer = useRef(null);

  /* ── fetch positions from backend ── */
  const fetchPositions = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/positions`);
      const data = Array.isArray(res.data) ? res.data : [];
      setPositions(data);
      saveCache(data);
    } catch (err) {
      console.error("Positions fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── fetch live prices with mock fallback ── */
  const fetchPrices = useCallback(async () => {
    if (positions.length === 0) return;

    const results = await Promise.allSettled(
      positions.map(async (stock) => {
        const symbol = stock.name;
        try {
          const res = await axios.get(
            `${BASE_URL}/api/live-price/${encodeURIComponent(symbol)}`,
            { timeout: 6000 }
          );
          const d = res.data;
          if (d?.success === false) throw new Error("fallback");
          const ltp = d.ltp ?? d.lastPrice ?? d.price ?? null;
          if (ltp === null) throw new Error("no ltp");
          return {
            symbol,
            ltp: Number(ltp),
            changePercent: Number(d.changePercent ?? d.pChange ?? 0),
          };
        } catch {
          return { symbol, ...mockLivePrice(symbol) };
        }
      })
    );

    const newMap = {};
    results.forEach((r) => {
      if (r.status === "fulfilled" && r.value) {
        newMap[r.value.symbol] = r.value;
      }
    });
    setPriceMap((prev) => ({ ...prev, ...newMap }));
  }, [positions]);

  /* ── intraday auto square-off at 3:20 PM ── */
  const scheduleSquareOff = useCallback(() => {
    if (squareOffTimer.current) clearTimeout(squareOffTimer.current);

    const now = new Date();
    const target = new Date(now);
    target.setHours(SQUARE_OFF_HOUR, SQUARE_OFF_MINUTE, 0, 0);

    // If 3:20 PM already passed today, don't schedule
    if (now >= target) return;

    const ms = target - now;
    squareOffTimer.current = setTimeout(async () => {
      if (positions.length === 0) return;
      setSquaredOff(true);

      // Auto-sell all open MIS positions
      try {
        await Promise.allSettled(
          positions.map((stock) => {
            const ltp = priceMap[stock.name]?.ltp ?? Number(stock.price) ?? 0;
            return axios.post(`${BASE_URL}/newOrder`, {
              name: stock.name,
              qty: Number(stock.qty),
              price: ltp,
              mode: "SELL",
              product: "MIS",
            });
          })
        );
        window.dispatchEvent(new Event("walletUpdated"));
        fetchPositions();
      } catch (err) {
        console.error("Auto square-off failed:", err);
      }

      // Clear banner after 10s
      setTimeout(() => setSquaredOff(false), 10000);
    }, ms);
  }, [positions, priceMap, fetchPositions]);

  /* ── initial load + walletUpdated listener ── */
  useEffect(() => {
    fetchPositions();
    const onUpdate = () => fetchPositions();
    window.addEventListener("walletUpdated", onUpdate);
    return () => window.removeEventListener("walletUpdated", onUpdate);
  }, [fetchPositions]);

  /* ── price refresh interval ── */
  useEffect(() => {
    fetchPrices();
    if (priceInterval.current) clearInterval(priceInterval.current);
    priceInterval.current = setInterval(fetchPrices, PRICE_REFRESH_MS);
    return () => clearInterval(priceInterval.current);
  }, [fetchPrices]);

  /* ── schedule intraday square-off ── */
  useEffect(() => {
    scheduleSquareOff();
    return () => {
      if (squareOffTimer.current) clearTimeout(squareOffTimer.current);
    };
  }, [scheduleSquareOff]);

  /* ── sell handler ── */
  const openSellWindow = (stock, ltp) => {
    setSellStock({
      name: stock.name,
      qty: Number(stock.qty) || 0,
      price: ltp,
      product: "MIS",
    });
  };

  const closeSellWindow = () => {
    setSellStock(null);
    fetchPositions();
  };

  /* ── computed totals ── */
  const totalPL = positions.reduce((sum, s) => {
    const ltp = priceMap[s.name]?.ltp ?? Number(s.price) ?? 0;
    return sum + (ltp - Number(s.avg)) * Number(s.qty);
  }, 0);

  const totalInvested = positions.reduce(
    (sum, s) => sum + Number(s.avg) * Number(s.qty),
    0
  );

  const totalCurrent = positions.reduce((sum, s) => {
    const ltp = priceMap[s.name]?.ltp ?? Number(s.price) ?? 0;
    return sum + ltp * Number(s.qty);
  }, 0);

  const isProfit = totalPL >= 0;
  const totalPLPercent =
    totalInvested > 0
      ? ((totalPL / totalInvested) * 100).toFixed(2)
      : "0.00";

  const filteredPositions = positions.filter((stock) => {
    const qty = Number(stock.qty) || 0;
    return activeTab === "open" ? qty !== 0 : qty === 0;
  });

  /* ═══════ RENDER ═══════ */
  return (
    <>
      <h3 className="title">
        Positions ({positions.length})
        <span className="pos-mis-badge">MIS · Intraday</span>
      </h3>

      {/* Auto square-off banner */}
      {squaredOff && (
        <div className="pos-squareoff-banner">
          All MIS positions were auto squared-off at 3:20 PM.
        </div>
      )}

      {loading && positions.length === 0 ? (
        <div className="pos-loading">Loading positions...</div>
      ) : positions.length === 0 ? (
        <div className="pos-empty">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12h8M12 8v8" />
          </svg>
          <p>No Open Positions</p>
          <span>Buy stocks with MIS product type to open intraday positions.</span>
        </div>
      ) : (
        <>
          <div className="pos-tabs">
            <button
              type="button"
              className={activeTab === "open" ? "pos-tab active" : "pos-tab"}
              onClick={() => setActiveTab("open")}
            >
              Open
            </button>
            <button
              type="button"
              className={activeTab === "closed" ? "pos-tab active" : "pos-tab"}
              onClick={() => setActiveTab("closed")}
            >
              Closed
            </button>
          </div>
          <div className="order-table">
            <table className="positions-table">
              <thead>
                <tr>
                  <th className="align-left">Instrument</th>
                  <th>Qty.</th>
                  <th>Avg.</th>
                  <th>LTP</th>
                  <th>P&amp;L</th>
                  <th>Day Chg.</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPositions.map((stock, index) => {
                  const qty = Number(stock.qty) || 0;
                  const avg = Number(stock.avg) || 0;
                  const priceInfo = priceMap[stock.name];
                  const ltp = priceInfo?.ltp ?? Number(stock.price) ?? 0;
                  const dayChange = priceInfo?.changePercent ?? 0;

                  const pnl = (ltp - avg) * qty;
                  const pnlPercent =
                    avg * qty > 0
                      ? ((pnl / (avg * qty)) * 100).toFixed(2)
                      : "0.00";

                  const profClass = pnl >= 0 ? "profit" : "loss";
                  const dayClass = dayChange >= 0 ? "profit" : "loss";

                  return (
                    <tr
                      key={stock.name + "-" + index}
                      onClick={() => setSelectedPosition(stock)}
                    >
                      <td className="stock-name align-left">
                        {stock.name}
                        <span className="pos-product-tag">MIS</span>
                      </td>
                      <td className="quantity">{qty}</td>
                      <td>₹{avg.toFixed(2)}</td>
                      <td className={profClass}>₹{ltp.toFixed(2)}</td>
                      <td className={profClass}>
                        {pnl >= 0 ? "+" : ""}₹{pnl.toFixed(2)}
                        <span className="pos-pnl-pct">
                          ({pnl >= 0 ? "+" : ""}{pnlPercent}%)
                        </span>
                      </td>
                      <td className={dayClass}>
                        {dayChange >= 0 ? "+" : ""}{dayChange.toFixed(2)}%
                      </td>
                      <td>
                        <button
                          type="button"
                          className="pos-exit-btn"
                          onClick={() => openSellWindow(stock, ltp)}
                        >
                          Exit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary row */}
          <div className="row">
            <div className="col">
              <h5>₹{totalInvested.toFixed(2)}</h5>
              <p>Total invested</p>
            </div>
            <div className="col">
              <h5>₹{totalCurrent.toFixed(2)}</h5>
              <p>Current value</p>
            </div>
            <div className="col">
              <h5 className={isProfit ? "profit" : "loss"}>
                {isProfit ? "+" : ""}₹{totalPL.toFixed(2)}
                <span> ({isProfit ? "+" : ""}{totalPLPercent}%)</span>
              </h5>
              <p>Total P&amp;L</p>
            </div>
          </div>

          {selectedPosition && (
            <StockChart
              symbol={selectedPosition.symbol}
              priceData={selectedPosition.priceHistory}
              isProfit={selectedPosition.pnl > 0}
            />
          )}
        </>
      )}

      {/* Sell / Exit modal */}
      {sellStock && (
        <SellActionWindow stock={sellStock} closeSellWindow={closeSellWindow} />
      )}
    </>
  );
};

export default Positions;
