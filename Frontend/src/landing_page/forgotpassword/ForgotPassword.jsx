import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:4000/api/auth/forgot-password",
        { email }
      );

      toast.success(
        res.data.message ||
          "If this email is registered, you will receive a reset link."
      );

      setEmail("");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Something went wrong. Try again."
      );
    }

    setLoading(false);
  };

  return (
    <div className="container mt-5">
      <Toaster />
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-lg p-5 position-relative">

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
