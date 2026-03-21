import React from "react";

const stocks = [
  { name: "NIFTY 50", price: "22,410.25", change: "+0.42%", trend: "up" },
  { name: "SENSEX", price: "73,188.60", change: "-0.18%", trend: "down" },
  { name: "BANKNIFTY", price: "47,920.15", change: "+0.31%", trend: "up" },
  { name: "NIFTY IT", price: "37,540.80", change: "+0.68%", trend: "up" },
  { name: "NIFTY FMCG", price: "54,210.40", change: "-0.12%", trend: "down" },
  { name: "NIFTY AUTO", price: "21,980.55", change: "+0.26%", trend: "up" },
];

const DashboardWatchlist = () => {
  return (
    <section className="zd-watchlist-section">
      <div className="zd-watchlist-header">
        <h4>Watchlist</h4>
        <span className="zd-watchlist-sub">Quick market glance</span>
      </div>
      <div className="zd-watchlist-grid">
        {stocks.map((stock) => (
          <div key={stock.name} className="zd-watchlist-card">
            <div className="zd-watchlist-title">{stock.name}</div>
            <div className="zd-watchlist-row">
              <span className="zd-watchlist-price">{stock.price}</span>
              <span className={`zd-watchlist-change ${stock.trend}`}>{stock.change}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DashboardWatchlist;
