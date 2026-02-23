// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import "./index.css";
// import HomePage from "./landing_page/home/HomePage";
// import Signup from "./landing_page/signup/Signup";
// import AboutPage from "./landing_page/about/AboutPage";
// import ProductsPage from "./landing_page/products/ProductsPage";
// import PricingPage from "./landing_page/pricing/PricingPage";
// import SupportPage from "./landing_page/support/SupportPage";
// import Navbar from "./landing_page/Navbar";
// import Footer from "./landing_page/Footer";
// import NotFound from "./landing_page/NotFound";
// // import Signup from "./landing_page/signup/Signup";
// import Login from "./landing_page/login/Login";
// // import App from './App.jsx'

// createRoot(document.getElementById("root")).render(
//   <BrowserRouter>
//   <Navbar/>
//     <Routes>
//       <Route path="/" element={<HomePage />} />
//       <Route path="/signup" element={<Signup />} />
//         <Route path="/login" element={<Login />} />
//       <Route path="/about" element={<AboutPage />} />
//       <Route path="/products" element={<ProductsPage />} />
//       <Route path="/pricing" element={<PricingPage />} />
//       <Route path="/support" element={<SupportPage />} />
//       <Route path="*" element={<NotFound/>} />
//     </Routes>
//     <Footer/>
//   </BrowserRouter>
// );
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import HomePage from "./landing_page/home/HomePage";
import Signup from "./landing_page/signup/Signup";
import AboutPage from "./landing_page/about/AboutPage";
import ProductsPage from "./landing_page/products/ProductsPage";
import PricingPage from "./landing_page/pricing/PricingPage";
import SupportPage from "./landing_page/support/SupportPage";
import Navbar from "./landing_page/Navbar";
import Footer from "./landing_page/Footer";
import NotFound from "./landing_page/NotFound";
import Login from "./landing_page/login/Login";
import AdminRoute from "./landing_page/adminroute/AdminRoute";

// ✅ New Import
import ForgotPassword from "./landing_page/forgotpassword/ForgotPassword";
import ResetPassword from "./landing_page/resetpassword/ResetPassword";
import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:4000";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* ✅ Forgot Password Route */}
      <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route path="/adminroute" element={<AdminRoute/>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    <Footer />
  </BrowserRouter>
);
