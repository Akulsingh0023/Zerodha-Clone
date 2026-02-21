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
import React from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav
      className="navbar navbar-expand-lg border-bottom"
      style={{ backgroundColor: "#FFF" }}
    >
      <div className="container p-2">
        {/* Logo */}
        <NavLink className="navbar-brand" to="/">
          <img
            src="/media/images/logo.svg"
            alt="Logo"
            style={{ width: "25%" }}
          />
        </NavLink>

        {/* Toggle button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <form className="d-flex ms-auto">
            <ul className="navbar-nav mb-lg-0">

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

            </ul>
          </form>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
