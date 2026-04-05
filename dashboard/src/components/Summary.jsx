import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import BASE_URL from "../config";
import "./Summary.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

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

const getWatchlistSymbol = (item) =>
  String(item?.symbol || item?.name || item?.tradingsymbol || "")
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

const safeNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const Summary = () => {
  const [userName, setUserName] = useState("");
  const [marginAvailable, setMarginAvailable] = useState(0);
  const [holdings, setHoldings] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [liveQuotes, setLiveQuotes] = useState({});
  const [quotesLoading, setQuotesLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setDataLoading(true);

      const [profileRes, walletRes, holdingsRes, watchlistRes, ordersRes] = await Promise.allSettled([
        axios.get(`${BASE_URL}/api/auth/profile`, { withCredentials: true }),
        axios.get(`${BASE_URL}/wallet/balance`),
        axios.get(`${BASE_URL}/holdings`),
        axios.get(`${BASE_URL}/watchlist`),
        axios.get(`${BASE_URL}/newOrder`),
      ]);

      if (profileRes.status === "fulfilled") {
        const user = profileRes.value?.data?.user || profileRes.value?.data || {};
        setUserName(user.fullname || user.name || user.email || "User");
      }

      if (walletRes.status === "fulfilled") {
        setMarginAvailable(Number(walletRes.value?.data?.balance || 0));
      }

      setHoldings(
        holdingsRes.status === "fulfilled" && Array.isArray(holdingsRes.value?.data)
          ? holdingsRes.value.data
          : []
      );

      setWatchlist(
        watchlistRes.status === "fulfilled" && Array.isArray(watchlistRes.value?.data)
          ? watchlistRes.value.data
          : []
      );

      setOrders(
        ordersRes.status === "fulfilled" && Array.isArray(ordersRes.value?.data)
          ? ordersRes.value.data
          : []
      );

      setDataLoading(false);
    };

    fetchData();
    const onTrade = () => fetchData();
    window.addEventListener("walletUpdated", onTrade);
    return () => window.removeEventListener("walletUpdated", onTrade);
  }, []);

  const fallbackBySymbol = useMemo(() => {
    const next = {};

    holdings.forEach((holding) => {
      const symbol = getHoldingSymbol(holding);
      if (!symbol) return;

      next[symbol] = {
        symbol,
        ltp: safeNumber(holding?.price, safeNumber(holding?.avg, 0)),
        changePercent: parsePercent(holding?.day),
        hasLiveChange: false,
      };
    });

    watchlist.forEach((item) => {
      const symbol = getWatchlistSymbol(item);
      if (!symbol || next[symbol]) return;

      next[symbol] = {
        symbol,
        ltp: 0,
        changePercent: 0,
        hasLiveChange: false,
      };
    });

    return next;
  }, [holdings, watchlist]);

  const quoteSymbols = useMemo(() => Object.keys(fallbackBySymbol), [fallbackBySymbol]);

  const fetchQuotes = useCallback(async () => {
    if (!quoteSymbols.length) {
      setLiveQuotes({});
      setQuotesLoading(false);
      return;
    }

    setQuotesLoading(true);

    const results = await Promise.allSettled(
      quoteSymbols.map(async (symbol) => {
        const fallback = fallbackBySymbol[symbol] || {
          symbol,
          ltp: 0,
          changePercent: 0,
          hasLiveChange: false,
        };

        try {
          const res = await axios.get(`${BASE_URL}/api/live-price/${encodeURIComponent(symbol)}`, {
            timeout: 7000,
          });

          const rawChange = res.data?.changePercent ?? res.data?.pChange;
          return {
            symbol,
            ltp: safeNumber(res.data?.ltp ?? res.data?.lastPrice ?? res.data?.price, fallback.ltp),
            changePercent: safeNumber(rawChange, fallback.changePercent),
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
  }, [quoteSymbols, fallbackBySymbol]);

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
        const ltp = safeNumber(liveQuotes[symbol]?.ltp, safeNumber(holding?.price, avg));
        const investment = qty * avg;
        const currentValue = qty * ltp;
        const pnl = currentValue - investment;
        const liveQuote = liveQuotes[symbol];
        const fallbackChangePercent = avg > 0 ? ((ltp - avg) / avg) * 100 : 0;
        const holdingDayPercent = parsePercent(holding?.day);
        const changePercent = liveQuote?.hasLiveChange
          ? safeNumber(liveQuote?.changePercent, 0)
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
  const pnlToday = portfolioValue - openingBalance;
  const isPortfolioLoading =
    dataLoading || (holdings.length > 0 && quotesLoading && Object.keys(liveQuotes).length === 0);

  const topMovers = useMemo(
    () =>
      watchlist
        .map((item) => {
          const symbol = getWatchlistSymbol(item);
          const quote = liveQuotes[symbol];

          return {
            symbol,
            changePercent: safeNumber(quote?.changePercent, 0),
          };
        })
        .filter((item) => Number.isFinite(item.changePercent))
        .filter((item) => item.symbol)
        .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
        .slice(0, 3),
    [watchlist, liveQuotes]
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

  const chartSeries = useMemo(() => {
    const sorted = [...todaysOrders].sort((a, b) => {
      const aTime = new Date(getOrderTime(a) || 0).getTime();
      const bTime = new Date(getOrderTime(b) || 0).getTime();
      return aTime - bTime;
    });

    let running = 0;
    return sorted.slice(-10).map((order) => {
      const qty = Number(order?.qty || 0);
      const price = Number(order?.price || 0);
      const side = getOrderSide(order);
      const value = qty * price;

      if (side === "BUY") running -= value;
      if (side === "SELL" || side === "AUTO SQUARE OFF") running += value;

      return {
        label: new Date(getOrderTime(order) || Date.now()).toLocaleTimeString("en-IN", {
          hour: "numeric",
          minute: "2-digit",
          hour12: false,
        }),
        value: running,
      };
    });
  }, [todaysOrders]);

  const barData = {
    labels: chartSeries.map((p) => p.label),
    datasets: [
      {
        data: chartSeries.map((p) => p.value),
        borderRadius: 6,
        maxBarThickness: 30,
        backgroundColor: chartSeries.map((p) => (p.value >= 0 ? "#16a34a" : "#dc2626")),
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => money.format(Number(ctx.parsed.y || 0)),
        },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { display: false } },
    },
  };

  const recentOrders = useMemo(
    () =>
      [...todaysOrders]
        .sort((a, b) => new Date(getOrderTime(b) || 0).getTime() - new Date(getOrderTime(a) || 0).getTime())
        .slice(0, 5),
    [todaysOrders]
  );

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
          {isPortfolioLoading ? (
            <h3>Loading...</h3>
          ) : (
            <h3 className={pnlToday >= 0 ? "value-pos" : "value-neg"}>
              {pnlToday >= 0 ? "+" : ""}
              {money.format(pnlToday)}
            </h3>
          )}
        </article>
        <article className="stat-card">
          <small>Portfolio value</small>
          <h3>{isPortfolioLoading ? "Loading..." : money.format(portfolioValue)}</h3>
        </article>
      </div>

      <div className="summary-grid-row">
        <section className="summary-card pnl-card">
          <div className="card-head">
            <h4>P&amp;L chart</h4>
          </div>
          {chartSeries.length ? (
            <div className="chart-wrap">
              <Bar data={barData} options={barOptions} />
            </div>
          ) : (
            <div className="empty">No P&amp;L data for today</div>
          )}
          <p className="card-foot">Today's P&amp;L over time</p>
        </section>

        <section className="summary-card movers-card">
          <div className="card-head">
            <h4>Top movers</h4>
          </div>
          {quotesLoading && topMovers.length === 0 ? (
            <div className="empty">Loading movers...</div>
          ) : topMovers.length ? (
            <div className="movers-list">
              {topMovers.map((item, idx) => (
                <div key={`${item.symbol}-${idx}`} className="mover-row">
                  <strong>{item.symbol}</strong>
                  <span className={item.changePercent >= 0 ? "value-pos" : "value-neg"}>
                    {item.changePercent >= 0 ? "+" : ""}
                    {item.changePercent.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty">No movers available</div>
          )}
        </section>
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
