import React from "react";

import Menu from "./Menu";

const TopBar = ({ onOpenWatchlist, onCloseWatchlist, watchlistOpen }) => {
  return (
    <div className="topbar-container">
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

      <Menu
        onOpenWatchlist={onOpenWatchlist}
        onCloseWatchlist={onCloseWatchlist}
        watchlistOpen={watchlistOpen}
      />
    </div>
  );
};

export default TopBar;
