import React, { useState } from "react";

import Dashboard from "./Dashboard";
import TopBar from "./TopBar";

const Home = () => {
  const [watchlistOpen, setWatchlistOpen] = useState(false);

  return (
    <>
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
