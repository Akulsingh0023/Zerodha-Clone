import React from "react";

import Menu from "./Menu";
import TopProfileMenu from "./TopProfileMenu";

const TopBar = ({ onToggleWatchlist, isWatchlistOpen, onToggleSidebar }) => {
  return (
    <div className="topbar-container">
      <button
        type="button"
        className="sidebar-toggle"
        aria-label="Toggle sidebar"
        onClick={onToggleSidebar}
      >
        <span className="sidebar-toggle-line" />
        <span className="sidebar-toggle-line" />
        <span className="sidebar-toggle-line" />
      </button>
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

      <Menu />
      <div className="topbar-actions">
        <TopProfileMenu />
      </div>
    </div>
  );
};

export default TopBar;
