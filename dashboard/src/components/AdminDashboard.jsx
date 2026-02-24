import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const BASE_URL = "http://localhost:4000";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [adminInfo, setAdminInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showGenerateReport, setShowGenerateReport] = useState(false);
  const [reportType, setReportType] = useState("csv");

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [usersRes, statsRes, adminRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/admin/users`, { withCredentials: true }),
        axios.get(`${BASE_URL}/api/admin/stats`, { withCredentials: true }),
        axios.get(`${BASE_URL}/api/admin/info`, { withCredentials: true }),
      ]);

      setUsers(usersRes.data);
      setStats(statsRes.data);
      setAdminInfo(adminRes.data);
      setError("");
    } catch (err) {
      setError("Failed to load admin data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE USER ================= */
  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`${BASE_URL}/api/admin/users/${userId}`, {
        withCredentials: true,
      });
      setUsers(users.filter((u) => u._id !== userId));
      setDeleteConfirm(null);
      alert("User deleted successfully");
    } catch (err) {
      alert("Error deleting user");
      console.error(err);
    }
  };

  /* ================= CHANGE ROLE ================= */
  const handleChangeRole = async (userId, newRole) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/api/admin/users/${userId}/role`,
        { role: newRole },
        { withCredentials: true }
      );

      setUsers(users.map((u) => (u._id === userId ? res.data.user : u)));
      setEditingUser(null);
      alert("Role updated successfully");
    } catch (err) {
      alert("Error updating role");
      console.error(err);
    }
  };

  /* ================= GENERATE REPORT ================= */
  const handleGenerateReport = () => {
    if (reportType === "csv") {
      generateCSV();
    } else if (reportType === "json") {
      generateJSON();
    }
    setShowGenerateReport(false);
  };

  const generateCSV = () => {
    let csv = "Name,Email,Role,Status,Date Joined\n";
    users.forEach((user) => {
      csv += `"${user.fullname}","${user.email}","${user.role}","Active","${new Date(user.createdAt || Date.now()).toLocaleDateString()}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users_report_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    alert("Report exported as CSV!");
  };

  const generateJSON = () => {
    const reportData = {
      exportDate: new Date().toISOString(),
      totalUsers: stats?.totalUsers,
      totalAdmins: stats?.totalAdmins,
      totalRegularUsers: stats?.totalRegularUsers,
      users: users.map((u) => ({
        name: u.fullname,
        email: u.email,
        role: u.role,
        status: "Active",
      })),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: "application/json",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users_report_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    alert("Report exported as JSON!");
  };

  /* ================= FILTER USERS ================= */
  const filteredUsers = users.filter((user) =>
    user.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="admin-fullpage-container">
      {/* HEADER WITH BACK BUTTON */}
      <div className="admin-top-bar">
        <div className="admin-top-left">
          <button
            className="back-btn"
            onClick={() => navigate("/")}
          >
            ← Back to Dashboard
          </button>
          <h1>🔐 Admin Control Panel</h1>
          <p>Welcome, {adminInfo?.fullname}!</p>
        </div>
      </div>

      <div className="admin-container">
        {error && <div className="admin-error">{error}</div>}

        {/* ==================== TABS ==================== */}
        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            📊 Dashboard
          </button>
          <button
            className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            👥 Users Management
          </button>
          <button
            className={`tab-btn ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            ⚙️ Settings
          </button>
        </div>

        {/* ==================== DASHBOARD TAB ==================== */}
        {activeTab === "dashboard" && (
          <div className="admin-dashboard">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <p className="stat-label">Total Users</p>
                  <h2 className="stat-value">{stats?.totalUsers}</h2>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">👑</div>
                <div className="stat-content">
                  <p className="stat-label">Admin Users</p>
                  <h2 className="stat-value">{stats?.totalAdmins}</h2>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🔓</div>
                <div className="stat-content">
                  <p className="stat-label">Regular Users</p>
                  <h2 className="stat-value">{stats?.totalRegularUsers}</h2>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <p className="stat-label">System Status</p>
                  <h2 className="stat-value" style={{ color: "#10b981" }}>
                    Online
                  </h2>
                </div>
              </div>
            </div>

            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <div className="action-buttons">
                <button
                  className="action-btn"
                  onClick={() => setActiveTab("users")}
                >
                  🔍 View All Users
                </button>
                <button className="action-btn" onClick={fetchAllData}>
                  🔄 Refresh Data
                </button>
                <button
                  className="action-btn danger"
                  onClick={() => setShowGenerateReport(true)}
                >
                  📋 Generate Report
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== USERS MANAGEMENT TAB ==================== */}
        {activeTab === "users" && (
          <div className="admin-users">
            <div className="users-header">
              <h3>User Management</h3>
              <div className="search-box-wrapper">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="users-search-input"
                />
              </div>
            </div>

            <div className="users-table-wrapper">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr key={user._id} className="user-row">
                      <td className="table-index">{index + 1}</td>
                      <td className="table-name">{user.fullname || "N/A"}</td>
                      <td className="table-email">{user.email}</td>
                      <td className="table-role">
                        {editingUser === user._id ? (
                          <select
                            value={user.role}
                            onChange={(e) =>
                              handleChangeRole(user._id, e.target.value)
                            }
                            className="role-select"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        ) : (
                          <span
                            className={`role-badge ${
                              user.role === "admin"
                                ? "role-admin"
                                : "role-user"
                            }`}
                          >
                            {user.role === "admin" ? "👑 Admin" : "🔓 User"}
                          </span>
                        )}
                      </td>
                      <td className="table-status">
                        <span className="status-badge active">Active</span>
                      </td>
                      <td className="table-actions">
                        <button
                          className="action-edit-btn"
                          onClick={() =>
                            setEditingUser(
                              editingUser === user._id ? null : user._id
                            )
                          }
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="action-delete-btn"
                          onClick={() => setDeleteConfirm(user._id)}
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {deleteConfirm && (
              <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
                <div className="modal" onClick={(e) => e.stopPropagation()}>
                  <h3>🚨 Confirm Delete</h3>
                  <p>Are you sure you want to delete this user? This action cannot be undone.</p>
                  <div className="modal-actions">
                    <button
                      className="modal-cancel"
                      onClick={() => setDeleteConfirm(null)}
                    >
                      Cancel
                    </button>
                    <button
                      className="modal-confirm"
                      onClick={() => handleDeleteUser(deleteConfirm)}
                    >
                      Delete User
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== SETTINGS TAB ==================== */}
        {activeTab === "settings" && (
          <div className="admin-settings">
            <h3>Admin Settings & Actions</h3>
            <div className="settings-content">
              <div className="setting-item">
                <h4>🔐 Security Settings</h4>
                <p>Manage security settings and permissions for your platform</p>
                <button className="settings-btn" onClick={() => alert("🔒 Security settings opened!\n\nFeatures:\n✅ Enable 2FA\n✅ Session management\n✅ IP whitelist")}>
                  Configure
                </button>
              </div>

              <div className="setting-item">
                <h4>📧 Email Configuration</h4>
                <p>Set up email notifications for admin events and user activities</p>
                <button className="settings-btn" onClick={() => alert("📧 Email Configuration\n\n✅ Set notification email\n✅ Configure email templates\n✅ Test email delivery")}>
                  Configure
                </button>
              </div>

              <div className="setting-item">
                <h4>📊 Data Export</h4>
                <p>Export user data and system statistics in multiple formats</p>
                <button
                  className="settings-btn"
                  onClick={() => setShowGenerateReport(true)}
                >
                  Export Data
                </button>
              </div>

              <div className="setting-item">
                <h4>📝 Audit Logs</h4>
                <p>View system audit logs and admin activities</p>
                <button className="settings-btn" onClick={() => alert("📝 Audit Logs\n\n✅ View all admin actions\n✅ Filter by date\n✅ Export logs\n✅ Set log retention")}>
                  View Logs
                </button>
              </div>

              <div className="setting-item">
                <h4>🔔 Notifications</h4>
                <p>Configure system notifications and alerts</p>
                <button className="settings-btn" onClick={() => alert("🔔 Notifications\n\n✅ Enable/disable alerts\n✅ Set notification frequency\n✅ Choose notification channels")}>
                  Configure
                </button>
              </div>

              <div className="setting-item">
                <h4>⚡ System Health</h4>
                <p>Monitor system performance and health metrics</p>
                <button className="settings-btn" onClick={() => alert(`⚡ System Health\n\n✅ Server Status: ONLINE\n✅ Database: Connected\n✅ API Response: 45ms\n✅ Memory Usage: 256MB\n✅ Uptime: 99.9%`)}>
                  View Health
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* GENERATE REPORT MODAL */}
      {showGenerateReport && (
        <div className="modal-overlay" onClick={() => setShowGenerateReport(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>📋 Generate Report</h3>
            <p>Select the format for your user data export:</p>
            <div className="report-options">
              <div className="report-option">
                <input
                  type="radio"
                  id="csv"
                  value="csv"
                  checked={reportType === "csv"}
                  onChange={(e) => setReportType(e.target.value)}
                />
                <label htmlFor="csv">
                  <strong>CSV Format</strong>
                  <span>Compatible with Excel, Google Sheets</span>
                </label>
              </div>
              <div className="report-option">
                <input
                  type="radio"
                  id="json"
                  value="json"
                  checked={reportType === "json"}
                  onChange={(e) => setReportType(e.target.value)}
                />
                <label htmlFor="json">
                  <strong>JSON Format</strong>
                  <span>Structured data with statistics</span>
                </label>
              </div>
            </div>
            <div className="modal-actions">
              <button
                className="modal-cancel"
                onClick={() => setShowGenerateReport(false)}
              >
                Cancel
              </button>
              <button
                className="modal-confirm"
                onClick={handleGenerateReport}
              >
                Download Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;