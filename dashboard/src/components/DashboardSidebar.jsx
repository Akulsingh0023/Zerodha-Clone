import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const DashboardSidebar = () => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = (event) => setIsMobile(event.matches);

    setIsMobile(media.matches);
    if (media.addEventListener) {
      media.addEventListener("change", update);
    } else {
      media.addListener(update);
    }

    return () => {
      if (media.removeEventListener) {
        media.removeEventListener("change", update);
      } else {
        media.removeListener(update);
      }
    };
  }, []);

  if (!isMobile) return null;

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const items = [
    { path: "/", label: "Dashboard", icon: "📊" },
    { path: "/", label: "Watchlist", icon: "👁️" },
    { path: "/orders", label: "Orders", icon: "📋" },
    { path: "/holdings", label: "Holdings", icon: "💼" },
    { path: "/positions", label: "Positions", icon: "📌" },
    { path: "/wallet", label: "Wallet", icon: "💰" },
    { path: "/profile", label: "My Profile", icon: "👤" },
  ];

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-header">
        <h2>Dashboard</h2>
        <div className="admin-sidebar-actions">
          <button className="sidebar-toggle" type="button">
            ←
          </button>
          <button className="sidebar-close" type="button">
            ×
          </button>
        </div>
      </div>

      <nav className="admin-sidebar-nav">
        {items.map((item) => (
          <Link
            key={`${item.label}-${item.path}`}
            to={item.path}
            className={`admin-sidebar-item ${isActive(item.path) ? "active" : ""}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <button className="back-to-dashboard-btn" type="button">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
