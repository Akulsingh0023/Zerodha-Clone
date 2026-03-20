import React from "react";
import { Link, useLocation } from "react-router-dom";

import Menu from "./Menu";

const titleMap = {
  "/": "Dashboard",
  "/orders": "Orders",
  "/holdings": "Holdings",
  "/positions": "Positions",
  "/funds": "Funds",
  "/apps": "Apps",
  "/wallet": "Wallet",
  "/profile": "Profile",
  "/support": "Support",
};

const TopBar = ({ onToggleNav }) => {
  const location = useLocation();
  const title = titleMap[location.pathname] || "Dashboard";

  return (
    <div className="topbar-container">
      <div className="topbar-mobile">
        <button
          type="button"
          className="nav-toggle"
          aria-label="Toggle navigation"
          onClick={onToggleNav}
        >
          <span className="nav-toggle-line" />
          <span className="nav-toggle-line" />
          <span className="nav-toggle-line" />
        </button>
        <h3 className="topbar-title">{title}</h3>
        <Link to="/profile" className="topbar-profile">
          <span className="topbar-avatar">U</span>
        </Link>
      </div>
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
    </div>
  );
};

export default TopBar;
