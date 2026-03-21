import React from "react";

const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);

const formatNumber = (value) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(value);

const Summary = () => {
  const equity = {
    marginAvailable: 40310.25,
    marginUsed: 12680.4,
    openingBalance: 53000.0,
  };

  const holdings = {
    count: 13,
    pnl: 15540.5,
    pnlPercent: 5.2,
    currentValue: 314300.25,
    investment: 298800.2,
  };

  const isProfit = holdings.pnl >= 0;

  return (
    <div className="dash-summary">
      {/* Welcome */}
      <section className="dash-hero" aria-label="Welcome">
        <div className="dash-hero-left">
          <p className="dash-greeting">Hi, User!</p>
          <h2 className="dash-title">Ready to trade today?</h2>
          <p className="dash-subtitle">
            Track live movements, watch your margin, and act fast when the market moves.
          </p>
        </div>
        <div className="dash-hero-right" aria-label="Market status">
          <div className="dash-pill">Market Open</div>
          <div className="dash-pill secondary">Last updated: 09:32 AM</div>
        </div>
      </section>

      {/* Equity */}
      <section className="dash-section" aria-label="Equity">
        <div className="dash-section-header">
          <h3>Equity</h3>
          <span>Margins overview</span>
        </div>
        <div className="dash-cards">
          <div className="dash-card" role="group" aria-label="Margin available">
            <p className="dash-card-label">Margin available</p>
            <h4 className="dash-card-value">{formatINR(equity.marginAvailable)}</h4>
            <p className="dash-card-meta">Instantly usable balance</p>
          </div>
          <div className="dash-card" role="group" aria-label="Margins used">
            <p className="dash-card-label">Margins used</p>
            <h4 className="dash-card-value">{formatINR(equity.marginUsed)}</h4>
            <p className="dash-card-meta">Open positions + orders</p>
          </div>
          <div className="dash-card" role="group" aria-label="Opening balance">
            <p className="dash-card-label">Opening balance</p>
            <h4 className="dash-card-value">{formatINR(equity.openingBalance)}</h4>
            <p className="dash-card-meta">Start of day funds</p>
          </div>
        </div>
      </section>

      {/* Holdings */}
      <section className="dash-section" aria-label="Holdings">
        <div className="dash-section-header">
          <h3>Holdings ({holdings.count})</h3>
          <span>Portfolio snapshot</span>
        </div>
        <div className="dash-cards">
          <div className="dash-card wide" role="group" aria-label="Profit and loss">
            <p className="dash-card-label">P&amp;L</p>
            <h4 className={`dash-card-value ${isProfit ? "pos" : "neg"}`}>
              {formatINR(holdings.pnl)}
              <small>{isProfit ? "+" : "-"}{formatNumber(Math.abs(holdings.pnlPercent))}%</small>
            </h4>
            <p className="dash-card-meta">Day-over-day change</p>
          </div>
          <div className="dash-card" role="group" aria-label="Current value">
            <p className="dash-card-label">Current value</p>
            <h4 className="dash-card-value">{formatINR(holdings.currentValue)}</h4>
            <p className="dash-card-meta">Live mark-to-market</p>
          </div>
          <div className="dash-card" role="group" aria-label="Investment">
            <p className="dash-card-label">Investment</p>
            <h4 className="dash-card-value">{formatINR(holdings.investment)}</h4>
            <p className="dash-card-meta">Total buy value</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Summary;
