import { useState, useEffect } from "react";
import axios from "axios";
import API from "../../config";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const BASE_URL = API;

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, chartsRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/admin-panel/dashboard-stats`, { withCredentials: true }),
          axios.get(`${BASE_URL}/api/admin-panel/charts`, { withCredentials: true }),
        ]);
        setStats(statsRes.data);
        setCharts(chartsRes.data);
      } catch (err) {
        console.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="admin-page-loading">Loading dashboard...</div>;

  const statCards = [
    { label: "Total Users", value: stats?.totalUsers || 0, icon: "👥", color: "#3b82f6" },
    { label: "Total Orders", value: stats?.totalOrders || 0, icon: "📋", color: "#8b5cf6" },
    { label: "Trades Today", value: stats?.tradesToday || 0, icon: "📊", color: "#f59e0b" },
    { label: "Total Deposits", value: `₹${(stats?.totalDeposits || 0).toLocaleString()}`, icon: "💰", color: "#10b981" },
    { label: "Total Withdrawals", value: `₹${(stats?.totalWithdrawals || 0).toLocaleString()}`, icon: "💸", color: "#ef4444" },
    { label: "Platform Revenue", value: `₹${(stats?.platformRevenue || 0).toLocaleString()}`, icon: "🏦", color: "#06b6d4" },
    { label: "Active Users Today", value: stats?.activeUsers || 0, icon: "🟢", color: "#22c55e" },
  ];

  const usersGrowthData = {
    labels: charts?.usersGrowth?.map((d) => d._id) || [],
    datasets: [
      {
        label: "New Users",
        data: charts?.usersGrowth?.map((d) => d.count) || [],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const tradingVolumeData = {
    labels: charts?.tradingVolume?.map((d) => d._id) || [],
    datasets: [
      {
        label: "Trading Volume (₹)",
        data: charts?.tradingVolume?.map((d) => d.volume) || [],
        backgroundColor: "rgba(139, 92, 246, 0.6)",
        borderColor: "#8b5cf6",
        borderWidth: 1,
      },
    ],
  };

  const revenueData = {
    labels: charts?.revenue?.map((d) => d._id) || [],
    datasets: [
      {
        label: "Revenue (₹)",
        data: charts?.revenue?.map((d) => Math.round(d.total * 0.0003)) || [],
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: "#94a3b8" } } },
    scales: {
      x: { ticks: { color: "#64748b", maxRotation: 45 }, grid: { color: "rgba(51,65,85,0.3)" } },
      y: { ticks: { color: "#64748b" }, grid: { color: "rgba(51,65,85,0.3)" } },
    },
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Dashboard Overview</h1>
        <p>Real-time platform statistics</p>
      </div>

      <div className="admin-stats-grid">
        {statCards.map((card, i) => (
          <div key={i} className="admin-stat-card" style={{ borderLeft: `4px solid ${card.color}` }}>
            <div className="admin-stat-icon">{card.icon}</div>
            <div className="admin-stat-info">
              <p className="admin-stat-label">{card.label}</p>
              <h3 className="admin-stat-value">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-charts-grid">
        <div className="admin-chart-card">
          <h3>Users Growth (Last 30 Days)</h3>
          <div className="admin-chart-wrapper">
            <Line data={usersGrowthData} options={chartOptions} />
          </div>
        </div>
        <div className="admin-chart-card">
          <h3>Daily Trading Volume</h3>
          <div className="admin-chart-wrapper">
            <Bar data={tradingVolumeData} options={chartOptions} />
          </div>
        </div>
        <div className="admin-chart-card full-width">
          <h3>Revenue Graph</h3>
          <div className="admin-chart-wrapper">
            <Line data={revenueData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
