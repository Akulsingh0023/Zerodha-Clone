import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminDashboardPage from "./admin/AdminDashboardPage";
import AdminUsersPage from "./admin/AdminUsersPage";
import AdminOrdersPage from "./admin/AdminOrdersPage";
import AdminHoldingsPage from "./admin/AdminHoldingsPage";
import AdminWatchlistPage from "./admin/AdminWatchlistPage";
import AdminWalletPage from "./admin/AdminWalletPage";
import AdminStocksPage from "./admin/AdminStocksPage";
import AdminTransactionsPage from "./admin/AdminTransactionsPage";
import AdminReportsPage from "./admin/AdminReportsPage";
import AdminSettingsPage from "./admin/AdminSettingsPage";
import "./AdminPanel.css";
import API from "../config";

const BASE_URL = API;

const sidebarItems = [
  { path: "/admin", label: "Dashboard", icon: "📊" },
  { path: "/admin/users", label: "Users", icon: "👥" },
  { path: "/admin/orders", label: "Orders", icon: "📋" },
  { path: "/admin/holdings", label: "Holdings", icon: "💼" },
  { path: "/admin/watchlist", label: "Watchlist", icon: "👁️" },
  { path: "/admin/wallet", label: "Wallet", icon: "💰" },
  { path: "/admin/stocks", label: "Stocks", icon: "📈" },
  { path: "/admin/transactions", label: "Transactions", icon: "🔄" },
  { path: "/admin/reports", label: "Reports", icon: "📉" },
  { path: "/admin/settings", label: "Settings", icon: "⚙️" },
];

const AdminPanel = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [adminInfo, setAdminInfo] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/admin-panel/info`, { withCredentials: true });
        setAdminInfo(res.data);
      } catch (err) {
        console.error("Failed to load admin info");
      }
    };
    fetchAdmin();
  }, []);

  const isActive = (path) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="admin-panel">
      <div className={`admin-sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="admin-sidebar-header">
          <h2>{sidebarCollapsed ? "AP" : "Admin Panel"}</h2>
          <button className="sidebar-toggle" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            {sidebarCollapsed ? "→" : "←"}
          </button>
        </div>

        <nav className="admin-sidebar-nav">
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-sidebar-item ${isActive(item.path) ? "active" : ""}`}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {!sidebarCollapsed && <span className="sidebar-label">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button className="back-to-dashboard-btn" onClick={() => navigate("/")}>
            {sidebarCollapsed ? "←" : "← Back to Dashboard"}
          </button>
          {!sidebarCollapsed && adminInfo && (
            <div className="admin-user-info">
              <div className="admin-avatar">
                {adminInfo.fullname?.substring(0, 2).toUpperCase() || "AD"}
              </div>
              <div>
                <p className="admin-name">{adminInfo.fullname}</p>
                <p className="admin-role">Administrator</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="admin-main-content">
        <Routes>
          <Route index element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="holdings" element={<AdminHoldingsPage />} />
          <Route path="watchlist" element={<AdminWatchlistPage />} />
          <Route path="wallet" element={<AdminWalletPage />} />
          <Route path="stocks" element={<AdminStocksPage />} />
          <Route path="transactions" element={<AdminTransactionsPage />} />
          <Route path="reports" element={<AdminReportsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPanel;
