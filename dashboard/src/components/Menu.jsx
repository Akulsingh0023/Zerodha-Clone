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

const Menu = () => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
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

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = SITE_URL;
  };

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-header">
        <h2>Dashboard</h2>
        <div className="admin-sidebar-actions">
          <button className="sidebar-toggle" type="button">←</button>
          <button className="sidebar-close" type="button">×</button>
        </div>
      </div>

      <nav className="admin-sidebar-nav">
        <Link
          to="/"
          className={`admin-sidebar-item ${location.pathname === "/" ? "active" : ""}`}
        >
          <span className="sidebar-icon">🏠</span>
          <span className="sidebar-label">Dashboard</span>
        </Link>

        <Link
          to="/"
          className={`admin-sidebar-item ${location.pathname === "/watchlist" ? "active" : ""}`}
        >
          <span className="sidebar-icon">👁️</span>
          <span className="sidebar-label">Watchlist</span>
        </Link>

        <Link
          to="/orders"
          className={`admin-sidebar-item ${location.pathname === "/orders" ? "active" : ""}`}
        >
          <span className="sidebar-icon">🧾</span>
          <span className="sidebar-label">Orders</span>
        </Link>

        <Link
          to="/holdings"
          className={`admin-sidebar-item ${location.pathname === "/holdings" ? "active" : ""}`}
        >
          <span className="sidebar-icon">💼</span>
          <span className="sidebar-label">Holdings</span>
        </Link>

        <Link
          to="/positions"
          className={`admin-sidebar-item ${location.pathname === "/positions" ? "active" : ""}`}
        >
          <span className="sidebar-icon">📊</span>
          <span className="sidebar-label">Positions</span>
        </Link>

        <Link
          to="/wallet"
          className={`admin-sidebar-item ${location.pathname === "/wallet" ? "active" : ""}`}
        >
          <span className="sidebar-icon">💳</span>
          <span className="sidebar-label">Wallet</span>
        </Link>

        <Link
          to="/profile"
          className={`admin-sidebar-item ${location.pathname === "/profile" ? "active" : ""}`}
        >
          <span className="sidebar-icon">👤</span>
          <span className="sidebar-label">My Profile</span>
        </Link>
      </nav>

      <div className="admin-sidebar-footer">
        <div
          className="admin-user-info"
          onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
          ref={dropdownRef}
        >
          <div className="admin-avatar">
            {user?.name ? user.name.substring(0, 2).toUpperCase() : "US"}
          </div>
          <div>
            <p className="admin-name">{user?.name || "Loading..."}</p>
            <p className="admin-role">Account</p>
          </div>

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
    </div>
  );
};

export default Menu;
