import { useState, useEffect } from "react";
import axios from "axios";
import API from "../../config";

const BASE_URL = API;

const AdminTransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/admin-panel/transactions`, { withCredentials: true });
        setTransactions(res.data);
      } catch (err) {
        console.error("Failed to fetch transactions");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const filteredTxns = transactions.filter((t) => {
    const matchesSearch =
      t.userId?.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.reason?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "ALL" || t.type === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const totalCredit = transactions
    .filter((t) => t.type === "credit")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalDebit = transactions
    .filter((t) => t.type === "debit")
    .reduce((sum, t) => sum + t.amount, 0);

  if (loading) return <div className="admin-page-loading">Loading transactions...</div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>All Transactions</h1>
        <p>{transactions.length} total financial transactions</p>
      </div>

      <div className="admin-stats-grid small">
        <div className="admin-stat-card" style={{ borderLeft: "4px solid #10b981" }}>
          <div className="admin-stat-icon">📥</div>
          <div className="admin-stat-info">
            <p className="admin-stat-label">Total Credits</p>
            <h3 className="admin-stat-value">₹{totalCredit.toLocaleString()}</h3>
          </div>
        </div>
        <div className="admin-stat-card" style={{ borderLeft: "4px solid #ef4444" }}>
          <div className="admin-stat-icon">📤</div>
          <div className="admin-stat-info">
            <p className="admin-stat-label">Total Debits</p>
            <h3 className="admin-stat-value">₹{totalDebit.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      <div className="admin-toolbar">
        <input
          type="text"
          placeholder="Search by user or reason..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="admin-search-input"
        />
        <div className="admin-filter-group">
          {["ALL", "CREDIT", "DEBIT"].map((type) => (
            <button
              key={type}
              className={`admin-btn-sm ${filterType === type ? "active" : "secondary"}`}
              onClick={() => setFilterType(type)}
            >
              {type}
            </button>
          ))}
        </div>
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
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTxns.length === 0 ? (
              <tr><td colSpan="7" className="admin-no-data">No transactions found</td></tr>
            ) : (
              filteredTxns.map((t, i) => (
                <tr key={t._id}>
                  <td>{i + 1}</td>
                  <td className="bold">{t.userId?.fullname || "N/A"}</td>
                  <td className="bold">₹{t.amount?.toLocaleString()}</td>
                  <td>
                    <span className={`admin-badge ${t.type === "credit" ? "badge-green" : "badge-red"}`}>
                      {t.type}
                    </span>
                  </td>
                  <td>{t.reason?.replace(/_/g, " ")}</td>
                  <td>{new Date(t.createdAt).toLocaleString()}</td>
                  <td>
                    <span className="admin-badge badge-green">Completed</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTransactionsPage;
