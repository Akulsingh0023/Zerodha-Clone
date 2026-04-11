import React from "react";

import Menu from "./Menu";

const TopBar = ({ onToggleWatchlist, isWatchlistOpen }) => {
  return (
    <div className="topbar-container">
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
      <div className="indices-container">
        <div className="nifty">
          <p className="index">NIFTY 50</p>
          <p className="index-points">{100.2} </p>
          <p className="percent"> </p>
        </div>
        <div className="sensex">
          <p className="index">SENSEX</p>
          <p className="index-points">{100.2}</p>
          <p className="percent"></p>
        </div>
      </div>

      <Menu onToggleWatchlist={onToggleWatchlist} />
    </div>
  );
};

export default TopBar;
