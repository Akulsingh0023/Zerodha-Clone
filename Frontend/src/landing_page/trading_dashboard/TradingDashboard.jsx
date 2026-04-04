import { useMemo, useState } from "react";

const USERS = {
  akul: {
    name: "Akul",
    margin: 252400,
    openBal: 230000,
    pnl: 18450,
    pnlPos: true,
    portfolio: 270850,
    bars: [14, 18, 22, 28, 25, 31, 34, 36, 42, 48],
    movers: [
      { symbol: "INFY", change: 2.84 },
      { symbol: "TCS", change: -1.26 },
      { symbol: "RELIANCE", change: 1.73 },
    ],
    orders: [
      { symbol: "HDFCBANK", side: "BUY", qty: 12, price: 1648.5 },
      { symbol: "TATASTEEL", side: "SELL", qty: 8, price: 148.35 },
      { symbol: "ITC", side: "BUY", qty: 30, price: 431.2 },
    ],
  },
  neha: {
    name: "Neha",
    margin: 142100,
    openBal: 156700,
    pnl: -3650,
    pnlPos: false,
    portfolio: 152980,
    bars: [10, 14, 17, 20, 22, 24, 26, 23, 19, 16],
    movers: [
      { symbol: "WIPRO", change: -2.22 },
      { symbol: "SBIN", change: 1.18 },
      { symbol: "LT", change: 0.91 },
    ],
    orders: [
      { symbol: "LT", side: "BUY", qty: 6, price: 3682.15 },
      { symbol: "WIPRO", side: "SELL", qty: 20, price: 512.75 },
      { symbol: "ASIANPAINT", side: "BUY", qty: 4, price: 2877.6 },
    ],
  },
  rohit: {
    name: "Rohit",
    margin: 321500,
    openBal: 301200,
    pnl: 9250,
    pnlPos: true,
    portfolio: 334920,
    bars: [12, 16, 19, 24, 29, 33, 37, 40, 44, 46],
    movers: [
      { symbol: "ADANIPORTS", change: 3.12 },
      { symbol: "HCLTECH", change: 1.64 },
      { symbol: "BAJFINANCE", change: -0.88 },
    ],
    orders: [
      { symbol: "ADANIPORTS", side: "BUY", qty: 10, price: 1334.55 },
      { symbol: "BAJFINANCE", side: "SELL", qty: 3, price: 7188.1 },
      { symbol: "HCLTECH", side: "BUY", qty: 9, price: 1572.45 },
    ],
  },
};

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

const formatDate = (date) => {
  const fmt = new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return fmt.format(date);
};

const TradingDashboard = () => {
  const userKeys = useMemo(() => Object.keys(USERS), []);
  const [activeUserKey, setActiveUserKey] = useState(userKeys[0]);

  const activeUser = USERS[activeUserKey];
  const today = useMemo(() => formatDate(new Date()), []);

  const barMax = Math.max(...activeUser.bars, 1);

  return (
    <div className="td-page">
      <div className="td-container">
        <header className="td-header td-card">
          <div className="td-head-left">
            <h1>Hi, {activeUser.name}!</h1>
            <span>{today}</span>
          </div>

          <div className="td-user-switch" role="tablist" aria-label="User switch">
            {userKeys.map((key) => (
              <button
                key={key}
                type="button"
                className={`td-user-pill ${activeUserKey === key ? "active" : ""}`}
                onClick={() => setActiveUserKey(key)}
              >
                {USERS[key].name}
              </button>
            ))}
          </div>
        </header>

        <section className="td-stats-grid">
          <article className="td-card td-stat-card">
            <p>Margin available</p>
            <h3>{currency.format(activeUser.margin)}</h3>
          </article>

          <article className="td-card td-stat-card">
            <p>Opening balance</p>
            <h3>{currency.format(activeUser.openBal)}</h3>
          </article>

          <article className="td-card td-stat-card">
            <div className="td-stat-head">
              <p>P&amp;L today</p>
              <span className="td-new-badge">new</span>
            </div>
            <h3 className={activeUser.pnlPos ? "td-gain" : "td-loss"}>
              {currency.format(activeUser.pnl)}
            </h3>
          </article>

          <article className="td-card td-stat-card">
            <div className="td-stat-head">
              <p>Portfolio value</p>
              <span className="td-new-badge">new</span>
            </div>
            <h3>{currency.format(activeUser.portfolio)}</h3>
          </article>
        </section>

        <section className="td-middle-grid">
          <article className="td-card td-chart-card">
            <div className="td-card-head">
              <h2>P&amp;L chart</h2>
              <button type="button" className="td-add-btn">add karo</button>
            </div>

            <div className="td-bars" aria-label="P&L bars">
              {activeUser.bars.map((value, index) => {
                const isLastThree = index >= activeUser.bars.length - 3;
                return (
                  <div className="td-bar-col" key={`${activeUserKey}-bar-${index}`}>
                    <div
                      className={`td-bar ${isLastThree ? "dark" : "light"}`}
                      style={{ height: `${Math.max((value / barMax) * 100, 8)}%` }}
                      title={`₹${value}`}
                    />
                  </div>
                );
              })}
            </div>

            <p className="td-caption">Today's P&amp;L over time</p>
          </article>

          <article className="td-card td-movers-card">
            <div className="td-card-head">
              <h2>Top movers</h2>
              <button type="button" className="td-add-btn">add karo</button>
            </div>

            <div className="td-list">
              {activeUser.movers.map((stock) => (
                <div className="td-list-row" key={`${activeUserKey}-${stock.symbol}`}>
                  <span>{stock.symbol}</span>
                  <strong className={stock.change >= 0 ? "td-gain" : "td-loss"}>
                    {stock.change >= 0 ? "+" : ""}
                    {stock.change.toFixed(2)}%
                  </strong>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="td-card td-orders-card">
          <div className="td-card-head">
            <h2>Recent orders</h2>
            <button type="button" className="td-add-btn">add karo</button>
          </div>

          <div className="td-orders-list">
            {activeUser.orders.map((order, index) => (
              <div
                key={`${activeUserKey}-${order.symbol}-${index}`}
                className="td-order-row"
              >
                <span className="td-order-symbol">{order.symbol}</span>
                <span className={`td-side-badge ${order.side === "BUY" ? "buy" : "sell"}`}>
                  {order.side}
                </span>
                <span className="td-order-qty">{order.qty}</span>
                <span className="td-order-price">{currency.format(order.price)}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default TradingDashboard;
