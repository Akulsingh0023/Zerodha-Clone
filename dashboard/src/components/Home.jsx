import React, { useState } from "react";

import Dashboard from "./Dashboard";
import TopBar from "./TopBar";

const Home = () => {
  const [watchlistOpen, setWatchlistOpen] = useState(false);

  return (
    <>
      <TopBar
        onOpenWatchlist={() => setWatchlistOpen(true)}
        onCloseWatchlist={() => setWatchlistOpen(false)}
        watchlistOpen={watchlistOpen}
      />
      <Dashboard
        watchlistOpen={watchlistOpen}
        onCloseWatchlist={() => setWatchlistOpen(false)}
      />
    </>
  );
};

export default Home;
