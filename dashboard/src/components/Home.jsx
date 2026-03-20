import React, { useState } from "react";

import Dashboard from "./Dashboard";
import TopBar from "./TopBar";
import MobileSidebar from "./MobileSidebar";

const Home = () => {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <>
      <TopBar onToggleNav={() => setNavOpen((prev) => !prev)} />
      <MobileSidebar open={navOpen} onClose={() => setNavOpen(false)} />
      <Dashboard />
    </>
  );
};

export default Home;
