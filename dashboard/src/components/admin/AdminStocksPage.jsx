import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:4000";

const AdminStocksPage = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editingStock, setEditingStock] = useState(null);
  const [formData, setFormData] = useState({ name: "", price: "", change: "", changePercent: "", marketCap: "" });

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin-panel/stocks`, { withCredentials: true });
      setStocks(res.data);
    } catch (err) {
      console.error("Failed to fetch stocks");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStock = async () => {
    if (!formData.name || !formData.price) {
      alert("Name and price are required");
      return;
    }
    try {
      const res = await axios.post(`${BASE_URL}/api/admin-panel/stocks`, formData, { withCredentials: true });
      setStocks([...stocks, res.data]);
      setShowAdd(false);
      resetForm();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add stock");
    }
  };

  const handleUpdateStock = async () => {
    try {
      const res = await axios.put(
        `${BASE_URL}/api/admin-panel/stocks/${editingStock._id}`,
        formData,
        { withCredentials: true }
      );
      setStocks(stocks.map((s) => (s._id === editingStock._id ? res.data : s)));
      setEditingStock(null);
      resetForm();
    } catch (err) {
      alert("Failed to update stock");
    }
  };

  const handleDeleteStock = async (stockId) => {
    if (!window.confirm("Delete this stock?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/admin-panel/stocks/${stockId}`, { withCredentials: true });
      setStocks(stocks.filter((s) => s._id !== stockId));
    } catch (err) {
      alert("Failed to delete stock");
    }
  };

  const startEdit = (stock) => {
    setEditingStock(stock);
    setFormData({
      name: stock.name,
      price: stock.price,
      change: stock.change,
      changePercent: stock.changePercent,
      marketCap: stock.marketCap,
    });
  };

  const resetForm = () => {
    setFormData({ name: "", price: "", change: "", changePercent: "", marketCap: "" });
  };

  const filteredStocks = stocks.filter((s) =>
    s.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="admin-page-loading">Loading stocks...</div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Stock Management</h1>
        <p>{stocks.length} stocks in database</p>
      </div>

      <div className="admin-toolbar">
        <input
          type="text"
          placeholder="Search stock..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="admin-search-input"
        />
        <button className="admin-btn primary" onClick={() => { setShowAdd(true); resetForm(); }}>
          ➕ Add Stock
        </button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Stock Name</th>
              <th>Price</th>
              <th>Change</th>
              <th>Change %</th>
              <th>Market Cap</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStocks.length === 0 ? (
              <tr><td colSpan="7" className="admin-no-data">No stocks found</td></tr>
            ) : (
              filteredStocks.map((s, i) => (
                <tr key={s._id}>
                  <td>{i + 1}</td>
                  <td className="bold">{s.name}</td>
                  <td>₹{s.price?.toLocaleString()}</td>
                  <td className={s.change >= 0 ? "profit-cell" : "loss-cell"}>
                    {s.change >= 0 ? "+" : ""}₹{s.change?.toFixed(2)}
                  </td>
                  <td className={s.changePercent >= 0 ? "profit-cell" : "loss-cell"}>
                    {s.changePercent >= 0 ? "+" : ""}{s.changePercent?.toFixed(2)}%
                  </td>
                  <td>{s.marketCap || "-"}</td>
                  <td className="admin-actions-cell">
                    <button className="admin-btn-sm warning" onClick={() => startEdit(s)}>✏️</button>
                    <button className="admin-btn-sm danger" onClick={() => handleDeleteStock(s._id)}>🗑️</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Stock Modal */}
      {(showAdd || editingStock) && (
        <div className="admin-modal-overlay" onClick={() => { setShowAdd(false); setEditingStock(null); resetForm(); }}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editingStock ? "Update Stock" : "Add New Stock"}</h3>
            <div className="admin-form-group">
              <label>Stock Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="admin-input"
                placeholder="e.g. RELIANCE"
                disabled={!!editingStock}
              />
            </div>
            <div className="admin-form-group">
              <label>Price (₹)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="admin-input"
                placeholder="Enter price"
              />
            </div>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label>Change (₹)</label>
                <input
                  type="number"
                  value={formData.change}
                  onChange={(e) => setFormData({ ...formData, change: e.target.value })}
                  className="admin-input"
                  placeholder="0"
                />
              </div>
              <div className="admin-form-group">
                <label>Change %</label>
                <input
                  type="number"
                  value={formData.changePercent}
                  onChange={(e) => setFormData({ ...formData, changePercent: e.target.value })}
                  className="admin-input"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="admin-form-group">
              <label>Market Cap</label>
              <input
                type="text"
                value={formData.marketCap}
                onChange={(e) => setFormData({ ...formData, marketCap: e.target.value })}
                className="admin-input"
                placeholder="e.g. ₹18.5L Cr"
              />
            </div>
            <div className="admin-modal-actions">
              <button className="admin-btn secondary" onClick={() => { setShowAdd(false); setEditingStock(null); resetForm(); }}>Cancel</button>
              <button className="admin-btn primary" onClick={editingStock ? handleUpdateStock : handleAddStock}>
                {editingStock ? "Update" : "Add Stock"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStocksPage;
