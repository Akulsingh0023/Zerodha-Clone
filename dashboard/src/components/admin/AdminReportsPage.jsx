import { useState, useEffect } from "react";
import axios from "axios";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const BASE_URL = "http://localhost:4000";

const AdminReportsPage = () => {
  const [charts, setCharts] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [chartsRes, statsRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/admin-panel/charts`, { withCredentials: true }),
          axios.get(`${BASE_URL}/api/admin-panel/dashboard-stats`, { withCredentials: true }),
        ]);
        setCharts(chartsRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error("Failed to load reports data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleExportCSV = () => {
    if (!charts) return;
    let csv = "Date,New Users,Trading Volume,Revenue\n";
    const allDates = new Set([
      ...(charts.usersGrowth || []).map((d) => d._id),
      ...(charts.tradingVolume || []).map((d) => d._id),
      ...(charts.revenue || []).map((d) => d._id),
    ]);

    [...allDates].sort().forEach((date) => {
      const users = charts.usersGrowth?.find((d) => d._id === date)?.count || 0;
      const volume = charts.tradingVolume?.find((d) => d._id === date)?.volume || 0;
      const revenue = Math.round((charts.revenue?.find((d) => d._id === date)?.total || 0) * 0.0003);
      csv += `${date},${users},${volume},${revenue}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `platform_report_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) return <div className="admin-page-loading">Loading reports...</div>;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: "#94a3b8" } } },
    scales: {
      x: { ticks: { color: "#64748b", maxRotation: 45 }, grid: { color: "rgba(51,65,85,0.3)" } },
      y: { ticks: { color: "#64748b" }, grid: { color: "rgba(51,65,85,0.3)" } },
    },
  };

  const usersGrowthData = {
    labels: charts?.usersGrowth?.map((d) => d._id) || [],
    datasets: [{
      label: "New Users",
      data: charts?.usersGrowth?.map((d) => d.count) || [],
      borderColor: "#3b82f6",
      backgroundColor: "rgba(59, 130, 246, 0.15)",
      fill: true,
      tension: 0.4,
    }],
  };

  const dailyTradesData = {
    labels: charts?.tradingVolume?.map((d) => d._id) || [],
    datasets: [{
      label: "Number of Trades",
      data: charts?.tradingVolume?.map((d) => d.count) || [],
      backgroundColor: "rgba(245, 158, 11, 0.6)",
      borderColor: "#f59e0b",
      borderWidth: 1,
    }],
  };

  const revenueData = {
    labels: charts?.revenue?.map((d) => d._id) || [],
    datasets: [{
      label: "Revenue (₹)",
      data: charts?.revenue?.map((d) => Math.round(d.total * 0.0003)) || [],
      borderColor: "#10b981",
      backgroundColor: "rgba(16, 185, 129, 0.15)",
      fill: true,
      tension: 0.4,
    }],
  };

  const overviewData = {
    labels: ["Users", "Orders", "Deposits (₹K)", "Withdrawals (₹K)"],
    datasets: [{
      data: [
        stats?.totalUsers || 0,
        stats?.totalOrders || 0,
        Math.round((stats?.totalDeposits || 0) / 1000),
        Math.round((stats?.totalWithdrawals || 0) / 1000),
      ],
      backgroundColor: ["#3b82f6", "#8b5cf6", "#10b981", "#ef4444"],
    }],
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Reports & Analytics</h1>
        <p>Platform performance insights</p>
      </div>

      <div className="admin-toolbar">
        <button className="admin-btn primary" onClick={handleExportCSV}>📥 Export Report (CSV)</button>
      </div>

      <div className="admin-charts-grid">
        <div className="admin-chart-card">
          <h3>User Growth (30 Days)</h3>
          <div className="admin-chart-wrapper">
            <Line data={usersGrowthData} options={chartOptions} />
          </div>
        </div>
        <div className="admin-chart-card">
          <h3>Daily Trades Count</h3>
          <div className="admin-chart-wrapper">
            <Bar data={dailyTradesData} options={chartOptions} />
          </div>
        </div>
        <div className="admin-chart-card">
          <h3>Platform Revenue</h3>
          <div className="admin-chart-wrapper">
            <Line data={revenueData} options={chartOptions} />
          </div>
        </div>
        <div className="admin-chart-card">
          <h3>Platform Overview</h3>
          <div className="admin-chart-wrapper" style={{ maxWidth: "350px", margin: "0 auto" }}>
            <Doughnut
              data={overviewData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: "#94a3b8" } } },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReportsPage;
