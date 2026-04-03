import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { API } from "../../config";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${API}/api/auth/forgot-password`,
        { email },
        { timeout: 30000 }
      );

      if (res.data?.success === true) {
        toast.success("✅ Reset link has been sent to your email");
      } else {
        toast.error("❌ This email is not registered");
      }

      setEmail("");
    } catch (err) {
      if (err.response?.data?.success === false) {
        toast.error("❌ This email is not registered");
      } else {
        toast.error(
          err.code === "ECONNABORTED"
            ? "Request timed out after 30 seconds. Please try again."
            : err.response?.data?.message || "Something went wrong. Try again."
        );
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
