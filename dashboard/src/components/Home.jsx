import React, { useState } from "react";

import Dashboard from "./Dashboard";
import TopBar from "./TopBar";
import DashboardSidebar from "./DashboardSidebar";

const Home = () => {
  const [watchlistOpen, setWatchlistOpen] = useState(false);

  return (
    <>
      <DashboardSidebar />
      <TopBar
        onToggleWatchlist={() => setWatchlistOpen((prev) => !prev)}
        isWatchlistOpen={watchlistOpen}
      />
      <Dashboard
        watchlistOpen={watchlistOpen}
        onCloseWatchlist={() => setWatchlistOpen(false)}
      />
    </>
  );
};

export default Home;
