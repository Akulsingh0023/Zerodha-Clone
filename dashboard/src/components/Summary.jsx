import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import BASE_URL from "../config";
import PnlBarChart from "./PnlBarChart";
import "./Summary.css";

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

const prettyDate = (date) =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);

const getOrderTime = (order) =>
  order?.createdAt || order?.updatedAt || order?.timestamp || order?.date || null;

const getOrderSide = (order) =>
  String(order?.mode || order?.transaction_type || order?.side || "").toUpperCase();

const statusClass = (status) => {
  const value = String(status || "").toLowerCase();
  if (value === "rejected") return "status-rejected";
  if (value === "pending" || value === "open") return "status-pending";
  return "status-complete";
};

const getHoldingSymbol = (holding) =>
  String(
    holding?.name ||
      holding?.symbol ||
      holding?.tradingsymbol ||
      holding?.stock ||
      ""
  )
    .trim()
    .toUpperCase();

const parsePercent = (value) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  const raw = String(value ?? "").replace("%", "").trim();
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 0;
};

const Summary = () => {
  const [userName, setUserName] = useState("");
  const [marginAvailable, setMarginAvailable] = useState(0);
  const [holdings, setHoldings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [liveQuotes, setLiveQuotes] = useState({});
  const [quotesLoading, setQuotesLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [initialLoadError, setInitialLoadError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchData = async ({ showSkeleton } = { showSkeleton: false }) => {
      if (showSkeleton) {
        setInitialLoading(true);
        setInitialLoadError("");
      }

      try {
        const [profileRes, walletRes, holdingsRes, ordersRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/auth/profile`, { withCredentials: true }),
          axios.get(`${BASE_URL}/wallet/balance`),
          axios.get(`${BASE_URL}/holdings`),
          axios.get(`${BASE_URL}/newOrder`),
        ]);

        if (!isMounted) return;

        const user = profileRes?.data?.user || profileRes?.data || {};
        setUserName(user.fullname || user.name || user.email || "User");

        setMarginAvailable(Number(walletRes?.data?.balance || 0));

        setHoldings(Array.isArray(holdingsRes?.data) ? holdingsRes.data : []);
        setOrders(Array.isArray(ordersRes?.data) ? ordersRes.data : []);

        if (showSkeleton) setInitialLoading(false);
      } catch {
        if (!isMounted) return;

        if (showSkeleton) {
          setInitialLoadError("Failed to load dashboard data. Please refresh.");
          setInitialLoading(false);
        }
      }
    };

    fetchData({ showSkeleton: true });
    const onTrade = () => fetchData({ showSkeleton: false });
    window.addEventListener("walletUpdated", onTrade);
    return () => {
      isMounted = false;
      window.removeEventListener("walletUpdated", onTrade);
    };
  }, []);

  const fetchQuotes = useCallback(async () => {
    if (!holdings.length) {
      setLiveQuotes({});
      return;
    }

    setQuotesLoading(true);

    const results = await Promise.allSettled(
      holdings.map(async (holding) => {
        const symbol = getHoldingSymbol(holding);
        const dayPercent = parsePercent(holding?.day);
        const fallback = {
          symbol,
          ltp: Number(holding?.price ?? 0),
          changePercent: dayPercent,
          hasLiveChange: false,
        };

        if (!symbol) return fallback;

        try {
          const res = await axios.get(`${BASE_URL}/api/live-price/${encodeURIComponent(symbol)}`, {
            timeout: 7000,
          });

          const rawChange = res.data?.changePercent ?? res.data?.pChange;
          return {
            symbol,
            ltp: Number(
              res.data?.ltp ?? res.data?.lastPrice ?? res.data?.price ?? holding?.price ?? 0
            ),
            changePercent: Number(rawChange ?? dayPercent),
            hasLiveChange: rawChange !== null && rawChange !== undefined,
          };
        } catch {
          return fallback;
        }
      })
    );

    const next = {};
    results.forEach((item) => {
      if (item.status === "fulfilled" && item.value?.symbol) {
        next[item.value.symbol] = item.value;
      }
    });

    setLiveQuotes(next);
    setQuotesLoading(false);
  }, [holdings]);

  useEffect(() => {
    fetchQuotes();
    const timer = setInterval(fetchQuotes, 10000);
    return () => clearInterval(timer);
  }, [fetchQuotes]);

  const holdingsWithMetrics = useMemo(
    () =>
      holdings.map((holding) => {
        const symbol = getHoldingSymbol(holding);
        const qty = Number(holding?.qty || 0);
        const avg = Number(holding?.avg || 0);
        const ltp = Number(liveQuotes[symbol]?.ltp ?? holding?.price ?? 0);
        const investment = qty * avg;
        const currentValue = qty * ltp;
        const pnl = currentValue - investment;
        const liveQuote = liveQuotes[symbol];
        const fallbackChangePercent = avg > 0 ? ((ltp - avg) / avg) * 100 : 0;
        const holdingDayPercent = parsePercent(holding?.day);
        const changePercent = liveQuote?.hasLiveChange
          ? Number(liveQuote?.changePercent ?? 0)
          : holdingDayPercent || fallbackChangePercent;
        return {
          ...holding,
          symbol,
          qty,
          avg,
          ltp,
          investment,
          currentValue,
          pnl,
          changePercent,
        };
      }),
    [holdings, liveQuotes]
  );

  const openingBalance = holdingsWithMetrics.reduce((sum, item) => sum + item.investment, 0);
  const portfolioValue = holdingsWithMetrics.reduce((sum, item) => sum + item.currentValue, 0);
  const pnlToday = marginAvailable - openingBalance;

  const topMovers = useMemo(
    () =>
      [...holdingsWithMetrics]
        .filter((item) => Number(item.qty) > 0)
        .map((item) => ({
          symbol: item.symbol || item.name,
          changePercent: Number(item.changePercent || 0),
        }))
        .filter((item) => Number.isFinite(item.changePercent))
        .filter((item) => item.symbol)
        .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
        .slice(0, 3),
    [holdingsWithMetrics]
  );

  const todaysOrders = useMemo(
    () =>
      orders.filter((order) => {
        const when = getOrderTime(order);
        if (!when) return false;
        const orderDate = new Date(when);
        if (Number.isNaN(orderDate.getTime())) return false;
        return orderDate.toDateString() === new Date().toDateString();
      }),
    [orders]
  );

  const recentOrders = useMemo(
    () =>
      [...todaysOrders]
        .sort((a, b) => new Date(getOrderTime(b) || 0).getTime() - new Date(getOrderTime(a) || 0).getTime())
        .slice(0, 5),
    [todaysOrders]
  );

  if (initialLoadError) {
    return (
      <div className="summary-layout">
        <div className="summary-head">
          <h2>Dashboard</h2>
          <p>{prettyDate(new Date())}</p>
        </div>
        <section className="summary-card">
          <div className="empty">{initialLoadError}</div>
        </section>
      </div>
    );
  }

  if (initialLoading) {
    return (
      <div className="summary-layout">
        <div className="summary-head">
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-date" />
        </div>

        <div className="stats-grid">
          <article className="stat-card">
            <div className="skeleton skeleton-label" />
            <div className="skeleton skeleton-money" />
          </article>
          <article className="stat-card">
            <div className="skeleton skeleton-label" />
            <div className="skeleton skeleton-money" />
          </article>
          <article className="stat-card">
            <div className="skeleton skeleton-label" />
            <div className="skeleton skeleton-money" />
          </article>
        </div>

        <section className="summary-card orders-card">
          <div className="card-head">
            <div className="skeleton skeleton-h4" />
          </div>
          <div className="recent-list">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="recent-row recent-row-skeleton">
                <div className="skeleton skeleton-cell" />
                <div className="skeleton skeleton-pill" />
                <div className="skeleton skeleton-cell" />
                <div className="skeleton skeleton-cell" />
                <div className="skeleton skeleton-cell" />
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="summary-layout">
      <div className="summary-head">
        <h2>Hi, {userName || "User"}!</h2>
        <p>{prettyDate(new Date())}</p>
      </div>

      <div className="stats-grid">
        <article className="stat-card">
          <small>Margin available</small>
          <h3>{money.format(marginAvailable)}</h3>
        </article>
        <article className="stat-card">
          <small>Opening balance</small>
          <h3>{money.format(openingBalance)}</h3>
        </article>
        <article className="stat-card">
          <small>P&amp;L today</small>
          <h3 className={pnlToday >= 0 ? "value-pos" : "value-neg"}>
            {pnlToday >= 0 ? "+" : ""}
            {money.format(pnlToday)}
          </h3>
        </article>
      </div>

      <section className="summary-card orders-card">
        <div className="card-head">
          <h4>Recent orders</h4>
        </div>

        {recentOrders.length ? (
          <div className="recent-list">
            {recentOrders.map((order, idx) => {
              const side = getOrderSide(order);
              return (
                <div className="recent-row" key={order?._id || idx}>
                  <strong>{order?.name || "--"}</strong>
                  <span className={`side-badge ${side === "BUY" ? "buy" : side === "SELL" ? "sell" : "auto"}`}>
                    {side || "--"}
                  </span>
                  <span className="qty">{Number(order?.qty || 0)} qty</span>
                  <span className="price">{money.format(Number(order?.price || 0))}</span>
                  <span className={`status ${statusClass(order?.status)}`}>
                    {String(order?.status || "complete").toLowerCase()}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty">No orders placed today</div>
        )}
      </section>
    </div>
  );
};

export default Summary;
