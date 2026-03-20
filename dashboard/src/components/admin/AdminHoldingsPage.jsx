import { useState, useEffect } from "react";
import axios from "axios";
import API from "../../config";

const BASE_URL = API;

const AdminHoldingsPage = () => {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchHoldings = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/admin-panel/holdings`, { withCredentials: true });
        setHoldings(res.data);
      } catch (err) {
        console.error("Failed to fetch holdings");
      } finally {
        setLoading(false);
      }
    };
    fetchHoldings();
  }, []);

  const filteredHoldings = holdings.filter(
    (h) =>
      h.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.user?.fullname?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="admin-page-loading">Loading holdings...</div>;

  const totalInvestment = holdings.reduce((sum, h) => sum + h.qty * h.avg, 0);
  const totalCurrent = holdings.reduce((sum, h) => sum + h.qty * h.price, 0);
  const totalPL = totalCurrent - totalInvestment;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Holdings Overview</h1>
        <p>{holdings.length} total holdings across all users</p>
      </div>

      <div className="admin-stats-grid small">
        <div className="admin-stat-card" style={{ borderLeft: "4px solid #3b82f6" }}>
          <div className="admin-stat-icon">💰</div>
          <div className="admin-stat-info">
            <p className="admin-stat-label">Total Investment</p>
            <h3 className="admin-stat-value">₹{totalInvestment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h3>
          </div>
        </div>
        <div className="admin-stat-card" style={{ borderLeft: "4px solid #8b5cf6" }}>
          <div className="admin-stat-icon">📊</div>
          <div className="admin-stat-info">
            <p className="admin-stat-label">Current Value</p>
            <h3 className="admin-stat-value">₹{totalCurrent.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h3>
          </div>
        </div>
        <div className="admin-stat-card" style={{ borderLeft: `4px solid ${totalPL >= 0 ? "#10b981" : "#ef4444"}` }}>
          <div className="admin-stat-icon">{totalPL >= 0 ? "📈" : "📉"}</div>
          <div className="admin-stat-info">
            <p className="admin-stat-label">Total P&L</p>
            <h3 className="admin-stat-value" style={{ color: totalPL >= 0 ? "#10b981" : "#ef4444" }}>
              {totalPL >= 0 ? "+" : ""}₹{totalPL.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </h3>
          </div>
        </div>
      </div>

      <div className="admin-toolbar">
        <input
          type="text"
          placeholder="Search by stock or user..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="admin-search-input"
        />
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>User Name</th>
              <th>Stock Name</th>
              <th>Quantity</th>
              <th>Buy Price</th>
              <th>Current Price</th>
              <th>Investment</th>
              <th>Current Value</th>
              <th>Profit / Loss</th>
            </tr>
          </thead>
          <tbody>
            {filteredHoldings.length === 0 ? (
              <tr><td colSpan="9" className="admin-no-data">No holdings found</td></tr>
            ) : (
              filteredHoldings.map((h, i) => {
                const investment = h.qty * h.avg;
                const current = h.qty * h.price;
                const pl = current - investment;
                const plPercent = investment > 0 ? ((pl / investment) * 100).toFixed(2) : 0;
                return (
                  <tr key={h._id}>
                    <td>{i + 1}</td>
                    <td className="bold">{h.user?.fullname || "N/A"}</td>
                    <td className="bold">{h.name}</td>
                    <td>{h.qty}</td>
                    <td>₹{h.avg?.toFixed(2)}</td>
                    <td>₹{h.price?.toFixed(2)}</td>
                    <td>₹{investment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                    <td>₹{current.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                    <td className={pl >= 0 ? "profit-cell" : "loss-cell"}>
                      {pl >= 0 ? "+" : ""}₹{pl.toFixed(2)} ({plPercent}%)
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminHoldingsPage;
