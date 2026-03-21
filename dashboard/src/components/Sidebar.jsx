import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const profileRef = useRef(null);

  const menuItems = useMemo(
    () => [
      { label: "Dashboard", to: "/" },
      { label: "Watchlist", to: "/watchlist" },
      { label: "Orders", to: "/orders" },
      { label: "Holdings", to: "/holdings" },
      { label: "Positions", to: "/positions" },
    ],
    []
  );

  const [activePath, setActivePath] = useState(location.pathname);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleMenuClick = (path) => {
    setActivePath(path);
  };

  return (
    <aside className="sidebar">
      <nav className="sidebar-menu" aria-label="Sidebar">
        <ul className="sidebar-menu-list">
          {menuItems.map((item) => (
            <li key={item.label} className="sidebar-menu-item">
              <Link
                to={item.to}
                className={`sidebar-link ${activePath === item.to ? "active" : ""}`}
                onClick={() => handleMenuClick(item.to)}
              >
                <span className="sidebar-icon" aria-hidden="true" />
                <span className="sidebar-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-profile" ref={profileRef}>
        <button
          type="button"
          className="sidebar-profile-trigger"
          onClick={() => setIsProfileOpen((prev) => !prev)}
          aria-expanded={isProfileOpen}
        >
          <div className="sidebar-avatar" aria-hidden="true" />
          <div className="sidebar-username">Username</div>
        </button>

        <div
          className={`sidebar-profile-dropdown ${isProfileOpen ? "open" : ""}`}
          hidden={!isProfileOpen}
          role="menu"
        >
          <Link className="sidebar-dropdown-item" to="/profile" role="menuitem" onClick={() => setIsProfileOpen(false)}>
            My Profile
          </Link>
          <Link className="sidebar-dropdown-item" to="/wallet" role="menuitem" onClick={() => setIsProfileOpen(false)}>
            Wallet
          </Link>
          <button type="button" className="sidebar-dropdown-item" role="menuitem" onClick={() => setIsProfileOpen(false)}>
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
