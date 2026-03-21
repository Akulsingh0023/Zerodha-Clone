import React, { useState } from "react";

import Dashboard from "./Dashboard";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";

const Home = () => {
  const [watchlistOpen, setWatchlistOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="zd-shell">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="zd-main">
        <TopBar
          onToggleWatchlist={() => setWatchlistOpen((prev) => !prev)}
          isWatchlistOpen={watchlistOpen}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />
        <Dashboard
          watchlistOpen={watchlistOpen}
          onCloseWatchlist={() => setWatchlistOpen(false)}
        />
      </div>
    </div>
  );
};

export default Home;
