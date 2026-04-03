import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    setError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/forgot-password`,
        { email },
        { timeout: 30000 }
      );

      if (response.data.success) {
        setStatus("success");
        toast.success(response.data.message || "Reset link sent");
        setEmail("");
      }
    } catch (err) {
      if (err.code === "ECONNABORTED") {
        setError("❌ Request timed out after 30 seconds. Please try again.");
        toast.error("Request timed out after 30 seconds. Please try again.");
      } else if (err.response?.status === 404) {
        setError("❌ This email is not registered");
        toast.error("This email is not registered");
      } else {
        setError("❌ Something went wrong. Please try again.");
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 auth-page">
      <Toaster />
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-lg p-5 position-relative auth-card">

            {/* Cross button */}
            <button
              className="btn-close position-absolute"
              style={{ top: "15px", right: "15px" }}
              onClick={() => navigate("/login")}
            ></button>

            <h2 className="text-center mb-4 text-success">
              Forgot Password
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label fw-bold">
                  Enter your registered email
                </label>
                <input
                  type="email"
                  className="form-control form-control-lg"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-success w-100 btn-lg"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            {/* Back to login */}
            <div className="text-center mt-4">
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => navigate("/login")}
              >
                Back to Login
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
