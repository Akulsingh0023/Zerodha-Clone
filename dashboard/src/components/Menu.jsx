// import React, { useState } from "react";

// import { Link } from "react-router-dom";

// const Menu = () => {
//   const [selectedMenu, setSelectedMenu] = useState(0);
//   const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

//   const handleMenuClick = (index) => {
//     setSelectedMenu(index);
//   };

//   const handleProfileClick = (index) => {
//     setIsProfileDropdownOpen(!isProfileDropdownOpen);
//   };

//   const menuClass = "menu";
//   const activeMenuClass = "menu selected";

//   return (
//     <div className="menu-container">
//       <img src="logo.png" style={{ width: "50px" }} />
//       <div className="menus">
//         <ul>
//           <li>
//             <Link
//               style={{ textDecoration: "none" }}
//               to="/"
//               onClick={() => handleMenuClick(0)}
//             >
//               <p className={selectedMenu === 0 ? activeMenuClass : menuClass}>
//                 Dashboard
//               </p>
//             </Link>
//           </li>
//           <li>
//             <Link
//               style={{ textDecoration: "none" }}
//               to="/orders"
//               onClick={() => handleMenuClick(1)}
//             >
//               <p className={selectedMenu === 1 ? activeMenuClass : menuClass}>
//                 Orders
//               </p>
//             </Link>
//           </li>
//           <li>
//             <Link
//               style={{ textDecoration: "none" }}
//               to="/holdings"
//               onClick={() => handleMenuClick(2)}
//             >
//               <p className={selectedMenu === 2 ? activeMenuClass : menuClass}>
//                 Holdings
//               </p>
//             </Link>
//           </li>
//           <li>
//             <Link
//               style={{ textDecoration: "none" }}
//               to="/positions"
//               onClick={() => handleMenuClick(3)}
//             >
//               <p className={selectedMenu === 3 ? activeMenuClass : menuClass}>
//                 Positions
//               </p>
//             </Link>
//           </li>
//           <li>
//             <Link
//               style={{ textDecoration: "none" }}
//               to="funds"
//               onClick={() => handleMenuClick(4)}
//             >
//               <p className={selectedMenu === 4 ? activeMenuClass : menuClass}>
//                 Funds
//               </p>
//             </Link>
//           </li>
//           <li>
//             <Link
//               style={{ textDecoration: "none" }}
//               to="/apps"
//               onClick={() => handleMenuClick(6)}
//             >
//               <p className={selectedMenu === 6 ? activeMenuClass : menuClass}>
//                 Apps
//               </p>
//             </Link>
//           </li>
//         </ul>
//         <hr />
//         <div className="profile" onClick={handleProfileClick}>
//           <div className="avatar">ZU</div>
//           <p className="username">USERID</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Menu;
// import React, { useState } from "react";
// import { Link } from "react-router-dom";

// const Menu = () => {
//   const [selectedMenu, setSelectedMenu] = useState(0);
//   const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

//   const handleMenuClick = (index) => {
//     setSelectedMenu(index);
//   };

//   const handleProfileClick = (index) => {
//     setIsProfileDropdownOpen(!isProfileDropdownOpen);
//   };

//   const menuClass = "menu";
//   const activeMenuClass = "menu selected";
//   return (
//     <div className="menu-container">
//       <img src="logo.png" alt="logo" style={{ width: "50px" }} />
//       <div className="menus">
//         <ul>
//           <li>
//             <Link
//               style={{ textDecoration: "none" }}
//               to="/"
//               onClick={() => handleMenuClick(0)}
//             >
//               <p className={selectedMenu === 0? activeMenuClass: menuClass}>Dashboard</p>
//             </Link>
//           </li>
//           <li>
//             <Link
//               style={{ textDecoration: "none" }}
//               to="/orders"
//               onClick={() => handleMenuClick(1)}
//             >
//               <p className={selectedMenu === 1? activeMenuClass: menuClass}>Orders</p>
//             </Link>
//           </li>
//           <li>
//             <Link
//               style={{ textDecoration: "none" }}
//               to="/holdings"
//               onClick={() => handleMenuClick(2)}
//             >
//               <p className={selectedMenu === 2? activeMenuClass: menuClass}>Holdings</p>
//             </Link>
//           </li>
//           <li>
//           <Link
//               style={{ textDecoration: "none" }}
//               to="/positions"
//               onClick={() => handleMenuClick(3)}
//             >
//               <p className={selectedMenu === 3? activeMenuClass: menuClass}>Positions</p>
//             </Link>
//           </li>
//           <li>
//            <Link
//               style={{ textDecoration: "none" }}
//               to="/funds"
//               onClick={() => handleMenuClick(4)}
//             >
//               <p className={selectedMenu === 4? activeMenuClass: menuClass}>Funds</p>
//             </Link>
//           </li>
//           <li>
//             <Link
//               style={{ textDecoration: "none" }}
//               to="/apps"
//               onClick={() => handleMenuClick(5)}
//             >
//               <p className={selectedMenu === 5? activeMenuClass: menuClass}>Apps</p>
//             </Link>
//           </li>
//         </ul>
//         <hr />
//         <div className="profile" onClick={handleProfileClick}>
//           <div className="avatar">ZU</div>
//           <p className="username">USERID</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Menu;

import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import API, { SITE_URL } from "../config";

const BASE_URL = API;

const Menu = ({ onToggleWatchlist }) => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  const dropdownRef = useRef();
  const location = useLocation();

  const menuClass = "menu";
  const activeMenuClass = "menu selected";

  /* ================= FETCH USER ================= */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/auth/profile`,
          { withCredentials: true }
        );
        setUser(res.data);
      } catch (error) {
        if (error.response?.status === 401) {
          window.location.href = `${SITE_URL}/login`;
        }
      }
    };

    fetchUser();
  }, []);

  /* ================= CLOSE DROPDOWN ================= */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  }, [location.pathname]);

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = SITE_URL;
  };

  return (
    <div className="menu-container">
      <img src="logo.png" alt="logo" style={{ width: "50px" }} />

      <button
        type="button"
        className="mobile-nav-toggle"
        aria-label="Open navigation menu"
        aria-expanded={isMobileMenuOpen}
        onClick={() => setIsMobileMenuOpen(true)}
      >
        ☰
      </button>

      <div className="menus">
        <ul>
          <li>
            <Link to="/" className="link">
              <p className={location.pathname === "/" ? activeMenuClass : menuClass}>
                Dashboard
              </p>
            </Link>
          </li>

          <li>
            <Link to="/orders" className="link">
              <p className={location.pathname === "/orders" ? activeMenuClass : menuClass}>
                Orders
              </p>
            </Link>
          </li>

          <li>
            <Link to="/holdings" className="link">
              <p className={location.pathname === "/holdings" ? activeMenuClass : menuClass}>
                Holdings
              </p>
            </Link>
          </li>

          <li>
            <Link to="/positions" className="link">
              <p className={location.pathname === "/positions" ? activeMenuClass : menuClass}>
                Positions
              </p>
            </Link>
          </li>

          {/* ================= ADMIN PANEL TAB ================= */}
          {user?.role === "admin" && (
            <li>
              <Link to="/admin" className="link">
                <p className={location.pathname === "/admin" ? activeMenuClass : menuClass}>
                  Admin Panel
                </p>
              </Link>
            </li>
          )}
        </ul>

        {/* ❌ <hr /> REMOVED */}
        {/* underline yahin se aa rahi thi */}
        
        {/* ================= PROFILE ================= */}
        <div
          className="profile"
          onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
          ref={dropdownRef}
          style={{ cursor: "pointer", position: "relative" }}
        >
          <div className="avatar">
            {user?.name
              ? user.name.substring(0, 2).toUpperCase()
              : "US"}
          </div>

          <p className="username">
            {user?.name || "Loading..."}
          </p>

          {isProfileDropdownOpen && (
            <div className="dropdown">
              <Link
                to="/profile"
                className="dropdown-item"
                onClick={() => setIsProfileDropdownOpen(false)}
              >
                My Profile
              </Link>

              <Link
                to="/wallet"
                className="dropdown-item"
                onClick={() => setIsProfileDropdownOpen(false)}
              >
                Wallet
              </Link>

              {user && user.role === "user" && (
                <Link
                  to="/support"
                  className="dropdown-item"
                  onClick={() => setIsProfileDropdownOpen(false)}
                >
                  Customer Support
                </Link>
              )}

              <div
                className="dropdown-item"
                onClick={handleLogout}
              >
                Log Out
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        className={`mobile-nav-overlay ${isMobileMenuOpen ? "show" : ""}`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden
      />

      <aside className={`mobile-nav-drawer ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-drawer-head">
          <span>Menu</span>
          <button
            type="button"
            className="mobile-drawer-close"
            aria-label="Close navigation menu"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            ×
          </button>
        </div>

        <nav className="mobile-drawer-links">
          <Link to="/" className="mobile-drawer-link" onClick={() => setIsMobileMenuOpen(false)}>
            Dashboard
          </Link>
          <Link to="/orders" className="mobile-drawer-link" onClick={() => setIsMobileMenuOpen(false)}>
            Orders
          </Link>
          <Link to="/holdings" className="mobile-drawer-link" onClick={() => setIsMobileMenuOpen(false)}>
            Holdings
          </Link>
          <Link to="/positions" className="mobile-drawer-link" onClick={() => setIsMobileMenuOpen(false)}>
            Positions
          </Link>
          {user?.role === "admin" && (
            <Link to="/admin" className="mobile-drawer-link" onClick={() => setIsMobileMenuOpen(false)}>
              Admin Panel
            </Link>
          )}
          <Link to="/profile" className="mobile-drawer-link" onClick={() => setIsMobileMenuOpen(false)}>
            My Profile
          </Link>
          <Link to="/wallet" className="mobile-drawer-link" onClick={() => setIsMobileMenuOpen(false)}>
            Wallet
          </Link>
          {user?.role === "user" && (
            <Link to="/support" className="mobile-drawer-link" onClick={() => setIsMobileMenuOpen(false)}>
              Customer Support
            </Link>
          )}
          <button
            type="button"
            className="mobile-drawer-link mobile-drawer-watchlist"
            onClick={() => {
              if (typeof onToggleWatchlist === "function") {
                onToggleWatchlist();
              }
              setIsMobileMenuOpen(false);
            }}
          >
            Open Watchlist
          </button>
          <button
            type="button"
            className="mobile-drawer-link"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </nav>

        <div className="mobile-drawer-user">{user?.name || "User"}</div>
      </aside>

      {/* ================= STYLE ================= */}
      <style>{`
        .link {
          text-decoration: none;
        }

        .dropdown {
          position: absolute;
          top: 50px;
          right: 0;
          width: 200px;
          background: black;
          border-radius: 6px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
          overflow: hidden;
          z-index: 1000;
        }

        .dropdown-item {
          display: block;
          padding: 12px;
          text-decoration: none;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .dropdown-item:hover {
          background: white;
          color: black;
        }

      `}</style>
    </div>
  );
};

export default Menu;
