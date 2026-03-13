import { useState, useEffect, useRef } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:4000";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteTyped, setDeleteTyped] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const deleteInputRef = useRef(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/admin-panel/users`, { withCredentials: true });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    setDeleting(true);
    try {
      await axios.delete(`${BASE_URL}/api/admin-panel/users/${userId}`, { withCredentials: true });
      setUsers(users.filter((u) => u._id !== userId));
      setDeleteTarget(null);
      setDeleteTyped("");
    } catch (err) {
      alert("Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };

  const openDeleteModal = (user) => {
    setDeleteTarget(user);
    setDeleteTyped("");
    setTimeout(() => deleteInputRef.current?.focus(), 100);
  };

  const closeDeleteModal = () => {
    if (deleting) return;
    setDeleteTarget(null);
    setDeleteTyped("");
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/api/admin-panel/users/${userId}/role`,
        { role: newRole },
        { withCredentials: true }
      );
      setUsers(users.map((u) => (u._id === userId ? res.data.user : u)));
      setEditingRole(null);
    } catch (err) {
      alert("Failed to update role");
    }
  };

  const handleBlockUser = async (userId) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/api/admin-panel/users/${userId}/block`,
        {},
        { withCredentials: true }
      );
      setUsers(users.map((u) => (u._id === userId ? res.data.user : u)));
    } catch (err) {
      alert("Failed to block/unblock user");
    }
  };

  const viewUserDetails = async (userId) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin-panel/users/${userId}`, { withCredentials: true });
      setSelectedUser(res.data);
    } catch (err) {
      alert("Failed to fetch user details");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="admin-page-loading">Loading users...</div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Users Management</h1>
        <p>{users.length} registered users</p>
      </div>

      <div className="admin-toolbar">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="admin-search-input"
        />
        <button className="admin-btn primary" onClick={() => fetchUsers(true)} disabled={refreshing}>
          {refreshing ? "⏳ Refreshing..." : "🔄 Refresh"}
        </button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Wallet Balance</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr><td colSpan="8" className="admin-no-data">No users found</td></tr>
            ) : (
              filteredUsers.map((user, i) => (
                <tr key={user._id}>
                  <td>{i + 1}</td>
                  <td className="user-id-cell">{user._id.slice(-6)}</td>
                  <td className="bold">{user.fullname || "N/A"}</td>
                  <td>{user.email}</td>
                  <td className="bold">₹{(user.walletBalance || 0).toLocaleString()}</td>
                  <td>
                    {editingRole === user._id ? (
                      <select
                        value={user.role}
                        onChange={(e) => handleChangeRole(user._id, e.target.value)}
                        className="admin-select"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span className={`admin-badge ${user.role === "admin" ? "badge-red" : "badge-green"}`}>
                        {user.role === "admin" ? "👑 Admin" : "User"}
                      </span>
                    )}
                  </td>
                  <td>
                    <span className={`admin-badge ${user.blocked ? "badge-red" : "badge-green"}`}>
                      {user.blocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="admin-actions-cell">
                    <button className="admin-btn-sm info" onClick={() => viewUserDetails(user._id)}>👁️</button>
                    <button className="admin-btn-sm warning" onClick={() => setEditingRole(editingRole === user._id ? null : user._id)}>✏️</button>
                    <button className="admin-btn-sm secondary" onClick={() => handleBlockUser(user._id)}>
                      {user.blocked ? "🔓" : "🔒"}
                    </button>
                    <button className="admin-btn-sm danger" onClick={() => openDeleteModal(user)}>🗑️</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="admin-modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>User Details</h3>
            <div className="admin-detail-grid">
              <div className="admin-detail-item">
                <label>Full Name</label>
                <p>{selectedUser.fullname}</p>
              </div>
              <div className="admin-detail-item">
                <label>Email</label>
                <p>{selectedUser.email}</p>
              </div>
              <div className="admin-detail-item">
                <label>Role</label>
                <p>{selectedUser.role}</p>
              </div>
              <div className="admin-detail-item">
                <label>Wallet Balance</label>
                <p>₹{(selectedUser.walletBalance || 0).toLocaleString()}</p>
              </div>
              <div className="admin-detail-item">
                <label>User ID</label>
                <p style={{ fontSize: "12px", wordBreak: "break-all" }}>{selectedUser._id}</p>
              </div>
              <div className="admin-detail-item">
                <label>Joined</label>
                <p>{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="admin-modal-actions">
              <button className="admin-btn secondary" onClick={() => setSelectedUser(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="admin-modal-overlay" onClick={closeDeleteModal}>
          <div className="admin-modal delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-header">
              <div className="delete-icon-circle">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              </div>
              <h3>Delete User Account</h3>
              <p className="delete-subtitle">This action is permanent and cannot be undone.</p>
            </div>

            <div className="delete-user-card">
              <div className="delete-user-avatar">
                {deleteTarget.fullname?.charAt(0).toUpperCase() || "?"}
              </div>
              <div className="delete-user-info">
                <span className="delete-user-name">{deleteTarget.fullname || "N/A"}</span>
                <span className="delete-user-email">{deleteTarget.email}</span>
              </div>
            </div>

            <div className="delete-warning-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="none">
                <path d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6zm-1 5v4h2v-4h-2zm0 6v2h2v-2h-2z"/>
              </svg>
              <div>
                <strong>The following data will be permanently deleted:</strong>
                <ul>
                  <li>User account & profile info</li>
                  <li>All orders & trade history</li>
                  <li>Holdings & positions</li>
                  <li>Watchlist items</li>
                  <li>Wallet transactions</li>
                </ul>
              </div>
            </div>

            <div className="delete-confirm-input">
              <label>Type <strong>DELETE</strong> to confirm</label>
              <input
                ref={deleteInputRef}
                type="text"
                value={deleteTyped}
                onChange={(e) => setDeleteTyped(e.target.value)}
                placeholder="Type DELETE here"
                className="admin-input"
                autoComplete="off"
                spellCheck="false"
                disabled={deleting}
              />
            </div>

            <div className="delete-modal-actions">
              <button className="admin-btn secondary" onClick={closeDeleteModal} disabled={deleting}>
                Cancel
              </button>
              <button
                className={`admin-btn danger delete-confirm-btn ${deleteTyped !== "DELETE" ? "disabled" : ""}`}
                onClick={() => handleDeleteUser(deleteTarget._id)}
                disabled={deleteTyped !== "DELETE" || deleting}
              >
                {deleting ? (
                  <span className="delete-spinner-wrap">
                    <span className="delete-spinner"></span>
                    Deleting...
                  </span>
                ) : (
                  "Permanently Delete User"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
