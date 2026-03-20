import { useState, useEffect } from "react";
import axios from "axios";
import API from "../../config";

const BASE_URL = API;

const AdminWalletPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [addFundsData, setAddFundsData] = useState({ userId: "", amount: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [txnRes, usersRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/admin-panel/transactions`, { withCredentials: true }),
        axios.get(`${BASE_URL}/api/admin-panel/users`, { withCredentials: true }),
      ]);
      setTransactions(txnRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddFunds = async () => {
    if (!addFundsData.userId || !addFundsData.amount) {
      alert("Please select a user and enter amount");
      return;
    }
    try {
      await axios.post(
        `${BASE_URL}/api/admin-panel/funds/add`,
        { userId: addFundsData.userId, amount: addFundsData.amount },
        { withCredentials: true }
      );
      alert("Funds added successfully");
      setShowAddFunds(false);
      setAddFundsData({ userId: "", amount: "" });
      fetchData();
    } catch (err) {
      alert("Failed to add funds");
    }
  };

  const filteredTxns = transactions.filter((t) => {
    const matchesSearch =
      t.userId?.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === "ALL" ||
      (filterType === "DEPOSIT" && t.type === "credit" && t.reason === "manual_add") ||
      (filterType === "WITHDRAW" && t.type === "debit" && t.reason === "withdraw") ||
      (filterType === "TRADE" && ["stock_buy", "stock_sell"].includes(t.reason));
    return matchesSearch && matchesFilter;
  });

  const totalDeposits = transactions
    .filter((t) => t.type === "credit" && t.reason === "manual_add")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalWithdrawals = transactions
    .filter((t) => t.type === "debit" && t.reason === "withdraw")
    .reduce((sum, t) => sum + t.amount, 0);

  if (loading) return <div className="admin-page-loading">Loading wallet data...</div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Wallet Management</h1>
        <p>{transactions.length} total transactions</p>
      </div>

      <div className="admin-stats-grid small">
        <div className="admin-stat-card" style={{ borderLeft: "4px solid #10b981" }}>
          <div className="admin-stat-icon">💰</div>
          <div className="admin-stat-info">
            <p className="admin-stat-label">Total Deposits</p>
            <h3 className="admin-stat-value">₹{totalDeposits.toLocaleString()}</h3>
          </div>
        </div>
        <div className="admin-stat-card" style={{ borderLeft: "4px solid #ef4444" }}>
          <div className="admin-stat-icon">💸</div>
          <div className="admin-stat-info">
            <p className="admin-stat-label">Total Withdrawals</p>
            <h3 className="admin-stat-value">₹{totalWithdrawals.toLocaleString()}</h3>
          </div>
        </div>
        <div className="admin-stat-card" style={{ borderLeft: "4px solid #3b82f6" }}>
          <div className="admin-stat-icon">📊</div>
          <div className="admin-stat-info">
            <p className="admin-stat-label">Net Flow</p>
            <h3 className="admin-stat-value">₹{(totalDeposits - totalWithdrawals).toLocaleString()}</h3>
          </div>
        </div>
      </div>

      <div className="admin-toolbar">
        <input
          type="text"
          placeholder="Search by user..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="admin-search-input"
        />
        <div className="admin-filter-group">
          {["ALL", "DEPOSIT", "WITHDRAW", "TRADE"].map((type) => (
            <button
              key={type}
              className={`admin-btn-sm ${filterType === type ? "active" : "secondary"}`}
              onClick={() => setFilterType(type)}
            >
              {type}
            </button>
          ))}
        </div>
        <button className="admin-btn primary" onClick={() => setShowAddFunds(true)}>
          ➕ Add Funds to User
        </button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Reason</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredTxns.length === 0 ? (
              <tr><td colSpan="6" className="admin-no-data">No transactions found</td></tr>
            ) : (
              filteredTxns.map((t, i) => (
                <tr key={t._id}>
                  <td>{i + 1}</td>
                  <td className="bold">{t.userId?.fullname || "N/A"}</td>
                  <td className="bold">₹{t.amount?.toLocaleString()}</td>
                  <td>
                    <span className={`admin-badge ${t.type === "credit" ? "badge-green" : "badge-red"}`}>
                      {t.type === "credit" ? "Deposit" : "Withdraw"}
                    </span>
                  </td>
                  <td>{t.reason?.replace(/_/g, " ")}</td>
                  <td>{new Date(t.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Funds Modal */}
      {showAddFunds && (
        <div className="admin-modal-overlay" onClick={() => setShowAddFunds(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add Funds to User</h3>
            <div className="admin-form-group">
              <label>Select User</label>
              <select
                value={addFundsData.userId}
                onChange={(e) => setAddFundsData({ ...addFundsData, userId: e.target.value })}
                className="admin-select full"
              >
                <option value="">-- Select User --</option>
                {users
                  .filter((u) => u.role === "user")
                  .map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.fullname} ({u.email}) - ₹{(u.walletBalance || 0).toLocaleString()}
                    </option>
                  ))}
              </select>
            </div>
            <div className="admin-form-group">
              <label>Amount (₹)</label>
              <input
                type="number"
                min="1"
                placeholder="Enter amount"
                value={addFundsData.amount}
                onChange={(e) => setAddFundsData({ ...addFundsData, amount: e.target.value })}
                className="admin-input"
              />
            </div>
            <div className="admin-modal-actions">
              <button className="admin-btn secondary" onClick={() => setShowAddFunds(false)}>Cancel</button>
              <button className="admin-btn primary" onClick={handleAddFunds}>Add Funds</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWalletPage;
