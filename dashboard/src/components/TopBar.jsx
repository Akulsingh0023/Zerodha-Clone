import React from "react";

import Menu from "./Menu";

const TopBar = ({ onToggleWatchlist, isWatchlistOpen }) => {
  return (
    <header className="topbar-container" role="banner">
      <div className="topbar-left">
        <button
          type="button"
          className="watchlist-toggle"
          aria-label="Toggle watchlist"
          aria-expanded={isWatchlistOpen}
          onClick={onToggleWatchlist}
        >
          <span className="watchlist-toggle-line" />
          <span className="watchlist-toggle-line" />
          <span className="watchlist-toggle-line" />
        </button>
        <div className="brand" aria-label="Brand">
          <img src="logo.png" alt="Zerodha" className="brand-logo" />
          <span className="brand-name">Zerodha</span>
        </div>
      </div>

      <div className="indices-container" aria-label="Market indices">
        <div className="nifty">
          <p className="index">NIFTY 50</p>
          <p className="index-points">{22042.35}</p>
          <p className="percent up">+0.62%</p>
        </div>
        <div className="sensex">
          <p className="index">SENSEX</p>
          <p className="index-points">{72984.18}</p>
          <p className="percent down">-0.18%</p>
        </div>
      </div>

      <Menu showLogo={false} />
    </header>
  );
};

export default TopBar;
