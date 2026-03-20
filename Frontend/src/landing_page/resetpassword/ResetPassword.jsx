import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { API } from "../../config";

export default function ResetPassword() {
  const { token } = useParams(); // URL se token
  const navigate = useNavigate();

  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${API}/api/auth/reset-password`,
        {
          token,
          newPassword: form.newPassword,
        }
      );

      toast.success(res.data.message || "Password reset successfully");

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Invalid or expired reset link"
      );
    }

    setLoading(false);
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
              Reset Password
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-bold">
                  New Password
                </label>
                <input
                  type="password"
                  className="form-control form-control-lg"
                  placeholder="Enter new password"
                  value={form.newPassword}
                  onChange={(e) =>
                    setForm({ ...form, newPassword: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="form-control form-control-lg"
                  placeholder="Confirm new password"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-success w-100 btn-lg"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>

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


