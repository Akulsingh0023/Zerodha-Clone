import React from "react";

import Menu from "./Menu";

const TopBar = ({ onToggleWatchlist, isWatchlistOpen }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light topbar-container px-3">
      <div className="d-flex align-items-center gap-2">
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

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#dashboardSidebar"
          aria-controls="dashboardSidebar"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
      </div>

      <div className="indices-container d-none d-md-flex ms-3">
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

      <div className="ms-auto d-none d-lg-flex">
        <Menu />
      </div>

      <div
        className="offcanvas offcanvas-end d-lg-none"
        tabIndex="-1"
        id="dashboardSidebar"
        aria-labelledby="dashboardSidebarLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="dashboardSidebarLabel">Menu</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" />
        </div>
        <div className="offcanvas-body p-0">
          <Menu />
        </div>
      </div>
    </nav>
  );
};

export default TopBar;
