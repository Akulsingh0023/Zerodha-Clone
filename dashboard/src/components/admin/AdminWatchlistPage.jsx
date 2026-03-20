import { useState, useEffect } from "react";
import axios from "axios";
import API from "../../config";

const BASE_URL = API;

const AdminWatchlistPage = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/admin-panel/watchlist`, { withCredentials: true });
        setWatchlist(res.data);
      } catch (err) {
        console.error("Failed to fetch watchlist");
      } finally {
        setLoading(false);
      }
    };
    fetchWatchlist();
  }, []);

  const filteredWatchlist = watchlist.filter(
    (w) =>
      w.symbol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.user?.fullname?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="admin-page-loading">Loading watchlist...</div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Watchlist Overview</h1>
        <p>{watchlist.length} watchlist items across all users</p>
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
              <th>User</th>
              <th>Stock Symbol</th>
              <th>Stock Name</th>
              <th>Added Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredWatchlist.length === 0 ? (
              <tr><td colSpan="5" className="admin-no-data">No watchlist items found</td></tr>
            ) : (
              filteredWatchlist.map((w, i) => (
                <tr key={w._id}>
                  <td>{i + 1}</td>
                  <td className="bold">{w.user?.fullname || "N/A"}</td>
                  <td className="bold">{w.symbol}</td>
                  <td>{w.name || "-"}</td>
                  <td>{new Date(w.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminWatchlistPage;
