import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import API, { SITE_URL } from "../config";

const BASE_URL = API;

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/auth/profile`, { withCredentials: true });
        setUser(res.data);
      } catch (error) {
        if (error.response?.status === 401) {
          window.location.href = `${SITE_URL}/login`;
        }
      }
    };

    fetchUser();
  }, []);

  const menuItems = [
    { label: "Dashboard", path: "/" },
    { label: "Orders", path: "/orders" },
    { label: "Holdings", path: "/holdings" },
    { label: "Positions", path: "/positions" },
  ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const renderLink = (item) => (
    <Link
      key={item.path}
      to={item.path}
      className={`zd-sidebar-link ${isActive(item.path) ? "active" : ""}`}
      onClick={() => onClose?.()}
    >
      <span>{item.label}</span>
    </Link>
  );

  return (
    <>
      <div
        className={`zd-sidebar-overlay ${isOpen ? "show" : ""}`}
        onClick={() => onClose?.()}
        aria-hidden
      />
      <aside className={`zd-sidebar ${isOpen ? "open" : ""}`}>
        <div className="zd-sidebar-header">
          <div className="zd-logo">Z</div>
          <div>
            <div className="zd-sidebar-title">Zerodha Dashboard</div>
            <div className="zd-sidebar-subtitle">Trade overview</div>
          </div>
          <button
            type="button"
            className="zd-sidebar-close"
            aria-label="Close sidebar"
            onClick={() => onClose?.()}
          >
x
          </button>
        </div>

        <nav className="zd-sidebar-nav">
          {menuItems.map(renderLink)}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className={`zd-sidebar-link ${isActive("/admin") ? "active" : ""}`}
              onClick={() => onClose?.()}
            >
              <span>Admin Panel</span>
            </Link>
          )}
        </nav>

        <div className="zd-sidebar-profile">
          <div className="zd-avatar">
            {user?.name ? user.name.substring(0, 2).toUpperCase() : "US"}
          </div>
          <div className="zd-profile-meta">
            <div className="zd-profile-name">{user?.name || "Loading..."}</div>
            <div className="zd-profile-label">Profile</div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
