// import React from "react";
// import { Link } from "react-router-dom";
// function Navbar() {
//   return (

//       <nav class="navbar navbar-expand-lg border-bottom" style={{backgroundColor:"#FFF"}}>
//         <div class="container p-2">
//           <Link  class="navbar-brand" to="/">
//             <img src="/media/images/logo.svg" alt="Logo" style={{width:"25%"}}/>
//           </Link >
//           <button
//             class="navbar-toggler"
//             type="button"
//             data-bs-toggle="collapse"
//             data-bs-target="#navbarSupportedContent"
//             aria-controls="navbarSupportedContent"
//             aria-expanded="false"
//             aria-label="Toggle navigation"
//           >
//             <span class="navbar-toggler-icon"></span>
//           </button>
//           <div class="collapse navbar-collapse" id="navbarSupportedContent">
      
//             <form class="d-flex" role="search">
//                    <ul class="navbar-nav  mb-lg-0">
//               <li class="nav-item">
//                 <Link  class="nav-link active" aria-current="page" to="/signup">
//                   Signup
//                 </Link >
//               </li>
//               <li class="nav-item">
//                    <Link  class="nav-link active" aria-current="page" to="/about">
//                   About
//                 </Link >
//               </li>
//               <li class="nav-item">
//                    <Link  class="nav-link active" aria-current="page" to="/products">
//                   Products
//                 </Link >
//               </li>
//                <li class="nav-item">
//                  <Link  class="nav-link active" aria-current="page" to="/pricing">
//                   Pricing
//                 </Link >
//               </li>
//                <li class="nav-item">
//                  <Link  class="nav-link active" aria-current="page" to="/support">
//                   Support
//                 </Link >
//               </li>
//             </ul>
//             </form>
//           </div>
//         </div>
//       </nav>

//   );
// }

// export default Navbar;
import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <nav
      className="navbar navbar-custom border-bottom"
      style={{ backgroundColor: "#FFF" }}
    >
      <div className="container navbar-inner">
        {/* Logo */}
        <NavLink className="navbar-brand" to="/">
          <img
            src="/media/images/logo.svg"
            alt="Logo"
            className="navbar-logo"
          />
        </NavLink>

        {/* Toggle button */}
        <button
          className={`navbar-toggle ${isOpen ? "open" : ""}`}
          type="button"
          aria-controls="navbar-menu"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span className="navbar-toggle-line" />
          <span className="navbar-toggle-line" />
          <span className="navbar-toggle-line" />
        </button>

        {/* Menu */}
        <div
          className={`navbar-menu ${isOpen ? "open" : ""}`}
          id="navbar-menu"
        >
          <ul className="navbar-links">
            <li className="nav-item">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "nav-link active fw-semibold" : "nav-link"
                }
              >
                Home
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive ? "nav-link active fw-semibold" : "nav-link"
                }
              >
                About
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  isActive ? "nav-link active fw-semibold" : "nav-link"
                }
              >
                Products
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/pricing"
                className={({ isActive }) =>
                  isActive ? "nav-link active fw-semibold" : "nav-link"
                }
              >
                Pricing
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/support"
                className={({ isActive }) =>
                  isActive ? "nav-link active fw-semibold" : "nav-link"
                }
              >
                Support
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? "nav-link active fw-semibold" : "nav-link"
                }
              >
                Login
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  isActive ? "nav-link active fw-semibold" : "nav-link"
                }
              >
                Signup
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
