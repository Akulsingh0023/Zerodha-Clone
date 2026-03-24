// import React from "react";
// import { Route, Routes } from "react-router-dom";

// import Apps from "./Apps";
// import Funds from "./Funds";
// import Holdings from "./Holdings";

// import Orders from "./Orders";
// import Positions from "./Positions";
// import Summary from "./Summary";
// import WatchList from "./WatchList";
// import { GeneralContextProvider } from "./GeneralContext";

// const Dashboard = () => {
//   return (
//     <div className="dashboard-container">
//       <GeneralContextProvider>
//         <WatchList />
//       </GeneralContextProvider>
//       <div className="content">
//         <Routes>
//           <Route exact path="/" element={<Summary />} />
//           <Route path="/orders" element={<Orders />} />
//           <Route path="/holdings" element={<Holdings />} />
//           <Route path="/positions" element={<Positions />} />
//           <Route path="/funds" element={<Funds />} />
//           <Route path="/apps" element={<Apps />} />
//         </Routes>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

// import React from "react";
// import { Route, Routes } from "react-router-dom";

// import Apps from "./Apps";
// import Funds from "./Funds";
// import Holdings from "./Holdings";

// import Orders from "./Orders";
// // import SellOrders from "./SellOrders"; // ✅ Import SellOrders
// import Positions from "./Positions";
// import Summary from "./Summary";
// import WatchList from "./WatchList";
// import { GeneralContextProvider } from "./GeneralContext";

// const Dashboard = () => {
//   return (
//     <div className="dashboard-container">
//       <GeneralContextProvider>
//         <WatchList />
//       </GeneralContextProvider>
//       <div className="content">
//         <Routes>
//           <Route exact path="/" element={<Summary />} />
//           <Route path="/orders" element={<Orders />} />
//           {/* <Route path="/sell-orders" element={<SellOrders />} /> ✅ Added route */}
//           <Route path="/holdings" element={<Holdings />} />
//           <Route path="/positions" element={<Positions />} />
//           <Route path="/funds" element={<Funds />} />
//           <Route path="/apps" element={<Apps />} />
//         </Routes>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import Apps from "./Apps";
import Funds from "./Funds";
import Holdings from "./Holdings";
import Orders from "./Orders";
import Positions from "./Positions";
import Summary from "./Summary";
import WatchList from "./WatchList";
import Wallet from "./Wallet";
import { GeneralContextProvider } from "./GeneralContext";
import AdminPanel from "./AdminPanel";
import Profile from "./Profile";
import GlobalToast from "./GlobalToast";
import Support from "./Support";
import UserRoute from "./UserRoute";

const getViewportWidth = () => {
  if (typeof window === "undefined") return 1024;
  return window.innerWidth;
};

const useViewportWidth = () => {
  const [width, setWidth] = useState(getViewportWidth);

  useEffect(() => {
    const onResize = () => setWidth(getViewportWidth());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return width;
};

const Dashboard = ({ watchlistOpen, onCloseWatchlist }) => {
  const viewportWidth = useViewportWidth();
  const location = useLocation();
  const isAdminRoute = location.pathname === "/admin" || location.pathname.startsWith("/admin/");
  const isMobile = viewportWidth <= 480;
  const isTablet = viewportWidth > 480 && viewportWidth <= 768;

  const containerStyle = {
    width: "100%",
    maxWidth: "100%",
    overflowX: "hidden",
  };

  const contentStyle = {
    width: "100%",
    maxWidth: "100%",
    overflowX: "hidden",
    padding: isMobile ? "8px" : isTablet ? "12px" : "clamp(8px, 2vw, 24px)",
  };

  return (
    <ProtectedRoute>
      <div className="dashboard-container" style={containerStyle}>
        <GlobalToast />
        {!isAdminRoute && (
          <>
            <div className={`watchlist-shell ${watchlistOpen ? "open" : ""}`}>
              <GeneralContextProvider>
                <WatchList onClose={onCloseWatchlist} />
              </GeneralContextProvider>
            </div>
            <div
              className={`watchlist-overlay ${watchlistOpen ? "show" : ""}`}
              onClick={onCloseWatchlist}
              aria-hidden
            />
          </>
        )}

        <div className={`content ${isAdminRoute ? "admin-full" : ""}`} style={contentStyle}>
          <Routes>
            <Route path="/" element={<Summary />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/holdings" element={<Holdings />} />
            <Route path="/positions" element={<Positions />} />
            <Route path="/funds" element={<Funds />} />
            <Route path="/apps" element={<Apps />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/profile" element={<Profile />} />
            <Route
              path="/support"
              element={
                <UserRoute>
                  <Support />
                </UserRoute>
              }
            />
            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
