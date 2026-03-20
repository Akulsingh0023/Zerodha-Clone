import { useState, useEffect } from "react";
import axios from "axios";
import API, { SITE_URL } from "../../config";

const BASE_URL = API;

const AdminSettingsPage = () => {
  const [adminInfo, setAdminInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({ fullname: "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [profileMsg, setProfileMsg] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/admin-panel/info`, { withCredentials: true });
        setAdminInfo(res.data);
        setProfileForm({ fullname: res.data.fullname || "" });
      } catch (err) {
        console.error("Failed to fetch admin info");
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMsg("");
    try {
      const res = await axios.put(`${BASE_URL}/api/admin-panel/profile`, profileForm, { withCredentials: true });
      setAdminInfo(res.data);
      setProfileMsg("Profile updated successfully");
    } catch (err) {
      setProfileMsg(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMsg("Passwords do not match");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordMsg("Password must be at least 8 characters");
      return;
    }

    try {
      const res = await axios.put(
        `${BASE_URL}/api/admin-panel/change-password`,
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        { withCredentials: true }
      );
      setPasswordMsg(res.data.message);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPasswordMsg(err.response?.data?.message || "Failed to change password");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = SITE_URL;
  };

  if (loading) return <div className="admin-page-loading">Loading settings...</div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Admin Settings</h1>
        <p>Manage your account</p>
      </div>

      <div className="admin-settings-grid">
        {/* Profile Section */}
        <div className="admin-settings-card">
          <h3>👤 Update Profile</h3>
          <form onSubmit={handleUpdateProfile}>
            <div className="admin-form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={profileForm.fullname}
                onChange={(e) => setProfileForm({ ...profileForm, fullname: e.target.value })}
                className="admin-input"
              />
            </div>
            <div className="admin-form-group">
              <label>Email</label>
              <input type="email" value={adminInfo?.email || ""} className="admin-input" disabled />
              <small className="admin-hint">Email cannot be changed</small>
            </div>
            {profileMsg && (
              <p className={`admin-form-msg ${profileMsg.includes("success") ? "success" : "error"}`}>
                {profileMsg}
              </p>
            )}
            <button type="submit" className="admin-btn primary">Save Changes</button>
          </form>
        </div>

        {/* Password Section */}
        <div className="admin-settings-card">
          <h3>🔒 Change Password</h3>
          <form onSubmit={handleChangePassword}>
            <div className="admin-form-group">
              <label>Current Password</label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                className="admin-input"
                required
              />
            </div>
            <div className="admin-form-group">
              <label>New Password</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="admin-input"
                required
                minLength={8}
              />
            </div>
            <div className="admin-form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                className="admin-input"
                required
              />
            </div>
            {passwordMsg && (
              <p className={`admin-form-msg ${passwordMsg.includes("success") ? "success" : "error"}`}>
                {passwordMsg}
              </p>
            )}
            <button type="submit" className="admin-btn primary">Update Password</button>
          </form>
        </div>

        {/* Logout Section */}
        <div className="admin-settings-card">
          <h3>🚪 Session</h3>
          <p className="admin-settings-desc">
            Logged in as <strong>{adminInfo?.fullname}</strong> ({adminInfo?.email})
          </p>
          <p className="admin-settings-desc">
            Role: <span className="admin-badge badge-red">Admin</span>
          </p>
          <button className="admin-btn danger" onClick={handleLogout} style={{ marginTop: "16px" }}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
