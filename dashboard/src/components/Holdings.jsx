import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import BASE_URL from "../config";
import { VerticalGraph } from "./VerticalGraph";
import SellActionWindow from "./SellActionWindow";
import "./Holdings.css";

const HOLDINGS_LS_KEY = "zerodha_holdings";
const PRICE_REFRESH_MS = 10000; // 10 seconds

/* ─── price helpers (same as watchlist) ─── */
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
    const d = localStorage.getItem(HOLDINGS_LS_KEY);
    return d ? JSON.parse(d) : [];
  } catch {
    return [];
  }
};
const saveCache = (list) =>
  localStorage.setItem(HOLDINGS_LS_KEY, JSON.stringify(list));

/* ═══════════════════════════════════════════════
   HOLDINGS COMPONENT
   ═══════════════════════════════════════════════ */
const Holdings = () => {
  const [holdings, setHoldings] = useState(loadCached);
  const [priceMap, setPriceMap] = useState({}); // { SYMBOL: { ltp, changePercent } }
  const [sellStock, setSellStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

  /* ── fetch holdings from backend ── */
  const fetchHoldings = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/holdings`);
      const data = Array.isArray(res.data) ? res.data : [];
      setHoldings(data);
      saveCache(data);
    } catch (err) {
      console.error("Holdings fetch failed:", err);
      // keep cached data
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── fetch live prices ── */
  const fetchPrices = useCallback(async () => {
    if (holdings.length === 0) return;

    const results = await Promise.allSettled(
      holdings.map(async (stock) => {
        const symbol = stock.name;
        try {
          const res = await axios.get(
            `${BASE_URL}/api/live-price/${encodeURIComponent(symbol)}`,
            { timeout: 6000 }
          );
          const d = res.data;
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
  }, [holdings]);

  /* ── initial load + listen for walletUpdated event ── */
  useEffect(() => {
    fetchHoldings();
    const onUpdate = () => fetchHoldings();
    window.addEventListener("walletUpdated", onUpdate);
    return () => window.removeEventListener("walletUpdated", onUpdate);
  }, [fetchHoldings]);

  /* ── price refresh interval ── */
  useEffect(() => {
    fetchPrices();
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(fetchPrices, PRICE_REFRESH_MS);
    return () => clearInterval(intervalRef.current);
  }, [fetchPrices]);

  /* ── sell handler ── */
  const openSellWindow = (stock, ltp) => {
    setSellStock({
      name: stock.name,
      qty: stock.qty,
      price: ltp,
      product: "CNC",
    });
  };

  const closeSellWindow = () => {
    setSellStock(null);
    // Refresh holdings after sell
    fetchHoldings();
  };

  /* ── computed values ── */
  const totalInvestment = holdings.reduce(
    (sum, s) => sum + Number(s.qty) * Number(s.avg),
    0
  );

  const currentValue = holdings.reduce((sum, s) => {
    const ltp = priceMap[s.name]?.ltp ?? Number(s.price) ?? 0;
    return sum + Number(s.qty) * ltp;
  }, 0);

  const totalPL = currentValue - totalInvestment;
  const isProfit = totalPL >= 0;
  const totalPLPercent =
    totalInvestment > 0 ? ((totalPL / totalInvestment) * 100).toFixed(2) : "0.00";

  /* ── chart data ── */
  const chartData = {
    labels: holdings.map((s) => s.name),
    datasets: [
      {
        label: "Current Value",
        data: holdings.map((s) => {
          const ltp = priceMap[s.name]?.ltp ?? Number(s.price) ?? 0;
          return (Number(s.qty) * ltp).toFixed(2);
        }),
        backgroundColor: "rgba(53, 162, 235, 0.6)",
      },
    ],
  };

  /* ═══════ RENDER ═══════ */
  return (
    <>
      <h3 className="title">Holdings ({holdings.length})</h3>

      {loading && holdings.length === 0 ? (
        <div className="hld-loading">Loading holdings...</div>
      ) : holdings.length === 0 ? (
        <div className="hld-empty">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
            <path d="M3 3h18v18H3zM9 9h6v6H9z" />
          </svg>
          <p>No Holdings</p>
          <span>Buy stocks with CNC product type to see them here.</span>
        </div>
      ) : (
        <>
          <div className="order-table">
            <table className="holdings-table">
              <thead>
                <tr>
                  <th className="align-left">Instrument</th>
                  <th>Qty.</th>
                  <th>Avg. Cost</th>
                  <th>LTP</th>
                  <th>Cur. Val</th>
                  <th>P&amp;L</th>
                  <th>Day Chg.</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((stock, index) => {
                  const qty = Number(stock.qty) || 0;
                  const avg = Number(stock.avg) || 0;
                  const priceInfo = priceMap[stock.name];
                  const ltp = priceInfo?.ltp ?? Number(stock.price) ?? 0;
                  const dayChange = priceInfo?.changePercent ?? 0;

                  const curValue = ltp * qty;
                  const pnl = curValue - avg * qty;
                  const pnlPercent =
                    avg * qty > 0
                      ? ((pnl / (avg * qty)) * 100).toFixed(2)
                      : "0.00";

                  const profClass = pnl >= 0 ? "profit" : "loss";
                  const dayClass = dayChange >= 0 ? "profit" : "loss";

                  return (
                    <tr key={stock.name + index}>
                      <td className="stock-name align-left">{stock.name}</td>
                      <td className="quantity">{qty}</td>
                      <td>₹{avg.toFixed(2)}</td>
                      <td className={profClass}>₹{ltp.toFixed(2)}</td>
                      <td>₹{curValue.toFixed(2)}</td>
                      <td className={profClass}>
                        {pnl >= 0 ? "+" : ""}₹{pnl.toFixed(2)}
                        <span className="hld-pnl-pct">
                          ({pnl >= 0 ? "+" : ""}
                          {pnlPercent}%)
                        </span>
                      </td>
                      <td className={dayClass}>
                        {dayChange >= 0 ? "+" : ""}
                        {dayChange.toFixed(2)}%
                      </td>
                      <td>
                        <button
                          type="button"
                          className="hld-sell-btn"
                          onClick={() => openSellWindow(stock, ltp)}
                        >
                          Sell
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
              <h5>
                ₹{totalInvestment.toFixed(2)}
              </h5>
              <p>Total investment</p>
            </div>
            <div className="col">
              <h5>₹{currentValue.toFixed(2)}</h5>
              <p>Current value</p>
            </div>
            <div className="col">
              <h5 className={isProfit ? "profit" : "loss"}>
                {isProfit ? "+" : ""}₹{totalPL.toFixed(2)}
                <span> ({isProfit ? "+" : ""}{totalPLPercent}%)</span>
              </h5>
              <p>P&amp;L</p>
            </div>
          </div>

          {holdings.length > 0 && <VerticalGraph data={chartData} />}
        </>
      )}

      {/* Sell modal */}
      {sellStock && (
        <SellActionWindow stock={sellStock} closeSellWindow={closeSellWindow} />
      )}
    </>
  );
};

export default Holdings;
