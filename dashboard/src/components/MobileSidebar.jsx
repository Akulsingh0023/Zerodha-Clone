import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import API, { SITE_URL } from "../config";

const BASE_URL = API;

const navItems = [
  { path: "/", label: "Dashboard" },
  { path: "/orders", label: "Orders" },
  { path: "/holdings", label: "Holdings" },
  { path: "/positions", label: "Positions" },
  { path: "/funds", label: "Funds" },
  { path: "/apps", label: "Apps" },
];

const MobileSidebar = ({ open, onClose }) => {
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    onClose?.();
  }, [location.pathname, onClose]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/auth/profile`, {
          withCredentials: true,
        });
        setUser(res.data);
      } catch {
        // ignore; route guards handle auth
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = SITE_URL;
  };

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <div
        className={`mobile-sidebar-overlay ${open ? "show" : ""}`}
        onClick={onClose}
        aria-hidden
      />
      <aside className={`mobile-sidebar ${open ? "open" : ""}`}>
        <div className="mobile-sidebar-header">
          <div className="mobile-sidebar-brand">
            <span className="brand-dot" />
            <h4>Dashboard</h4>
          </div>
          <button type="button" className="mobile-sidebar-close" onClick={onClose}>
            ×
          </button>
        </div>

        <nav className="mobile-sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`mobile-sidebar-link ${isActive(item.path) ? "active" : ""}`}
            >
              {item.label}
            </Link>
          ))}

          {user?.role === "admin" && (
            <Link
              to="/admin"
              className={`mobile-sidebar-link ${isActive("/admin") ? "active" : ""}`}
            >
              Admin Panel
            </Link>
          )}
        </nav>

        <div className="mobile-sidebar-footer">
          <Link to="/profile" className="mobile-sidebar-action">
            Profile
          </Link>
          <Link to="/wallet" className="mobile-sidebar-action">
            Wallet
          </Link>
          {user?.role === "user" && (
            <Link to="/support" className="mobile-sidebar-action">
              Customer Support
            </Link>
          )}
          <button type="button" className="mobile-sidebar-action logout" onClick={handleLogout}>
            Log Out
          </button>
          {user && (
            <div className="mobile-sidebar-user">
              <div className="mobile-sidebar-avatar">
                {user?.name ? user.name.substring(0, 2).toUpperCase() : "US"}
              </div>
              <div>
                <p className="mobile-sidebar-name">{user?.name || "User"}</p>
                <p className="mobile-sidebar-role">{user?.role || "member"}</p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default MobileSidebar;
