import React from "react";
import { useNavigate } from "react-router-dom";

function OpenAccount() {
  const navigate = useNavigate();

  return (
    <div className="container p-5 mb-5 hero-section">
      <div className="row text-center">
        <h1 className="mt-5 mb-3">Open a Zerodha account</h1>
        <p className="text-muted mb-4">
          Modern platforms and apps, ₹0 investments, and flat ₹20 intraday and
          F&O trades.
        </p>

        <button
          className="p-2 btn btn-primary fs-5 mb-5 hero-cta"
          onClick={() => navigate("/signup")}
        >
          Signup Now
        </button>
      </div>
    </div>
  );
}

export default OpenAccount;
