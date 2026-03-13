import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:4000";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterMode, setFilterMode] = useState("ALL");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin-panel/orders`, { withCredentials: true });
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Cancel this order?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/admin-panel/orders/${orderId}`, { withCredentials: true });
      setOrders(orders.filter((o) => o._id !== orderId));
    } catch (err) {
      alert("Failed to cancel order");
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.user?.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterMode === "ALL" || o.mode === filterMode;
    return matchesSearch && matchesFilter;
  });

  if (loading) return <div className="admin-page-loading">Loading orders...</div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Orders Management</h1>
        <p>{orders.length} total orders</p>
      </div>

      <div className="admin-toolbar">
        <input
          type="text"
          placeholder="Search by stock or user..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="admin-search-input"
        />
        <div className="admin-filter-group">
          {["ALL", "BUY", "SELL", "AUTO SQUARE OFF"].map((mode) => (
            <button
              key={mode}
              className={`admin-btn-sm ${filterMode === mode ? "active" : "secondary"}`}
              onClick={() => setFilterMode(mode)}
            >
              {mode}
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
              <th>Stock Name</th>
              <th>Buy / Sell</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Order Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr><td colSpan="9" className="admin-no-data">No orders found</td></tr>
            ) : (
              filteredOrders.map((order, i) => (
                <tr key={order._id}>
                  <td>{i + 1}</td>
                  <td className="bold">{order.user?.fullname || "N/A"}</td>
                  <td className="bold">{order.name}</td>
                  <td>
                    <span className={`admin-badge ${order.mode === "BUY" ? "badge-green" : order.mode === "SELL" ? "badge-red" : "badge-yellow"}`}>
                      {order.mode}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-badge ${order.product === "CNC" ? "badge-blue" : "badge-purple"}`}>
                      {order.product}
                    </span>
                  </td>
                  <td>{order.qty}</td>
                  <td>₹{order.price?.toLocaleString()}</td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                  <td className="admin-actions-cell">
                    <button className="admin-btn-sm info" onClick={() => setSelectedOrder(order)}>👁️</button>
                    <button className="admin-btn-sm danger" onClick={() => handleCancelOrder(order._id)}>❌</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="admin-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Order Details</h3>
            <div className="admin-detail-grid">
              <div className="admin-detail-item">
                <label>Stock</label>
                <p>{selectedOrder.name}</p>
              </div>
              <div className="admin-detail-item">
                <label>User</label>
                <p>{selectedOrder.user?.fullname} ({selectedOrder.user?.email})</p>
              </div>
              <div className="admin-detail-item">
                <label>Mode</label>
                <p>{selectedOrder.mode}</p>
              </div>
              <div className="admin-detail-item">
                <label>Product</label>
                <p>{selectedOrder.product}</p>
              </div>
              <div className="admin-detail-item">
                <label>Quantity</label>
                <p>{selectedOrder.qty}</p>
              </div>
              <div className="admin-detail-item">
                <label>Price</label>
                <p>₹{selectedOrder.price?.toLocaleString()}</p>
              </div>
              <div className="admin-detail-item">
                <label>Total Value</label>
                <p>₹{(selectedOrder.qty * selectedOrder.price).toLocaleString()}</p>
              </div>
              <div className="admin-detail-item">
                <label>Date</label>
                <p>{new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <div className="admin-modal-actions">
              <button className="admin-btn secondary" onClick={() => setSelectedOrder(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
