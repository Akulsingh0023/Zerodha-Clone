import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const PnlBarChart = () => {
  const data = useMemo(
    () => ({
      labels: ["20:13", "20:13", "20:13", "20:13", "20:13"],
      datasets: [
        {
          label: "P&L",
          data: [2100, 2400, 3100, 3800, 3200],
          backgroundColor: "#E24B4A",
          borderWidth: 0,
          borderRadius: 0,
          barPercentage: 0.55,
          categoryPercentage: 0.7,
        },
      ],
    }),
    []
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => `₹${Number(context.parsed.y || 0).toLocaleString("en-IN")}`,
          },
        },
      },
      scales: {
        y: {
          min: 0,
          max: 4000,
          grid: {
            color: "rgba(150,150,150,0.15)",
            drawBorder: false,
          },
          border: { display: false },
          ticks: {
            stepSize: 1000,
            color: "#aaa",
            font: { size: 11 },
          },
        },
        x: {
          grid: {
            color: "rgba(150,150,150,0.1)",
            drawTicks: false,
            drawBorder: false,
          },
          border: { display: false },
          ticks: {
            color: "#aaa",
            font: { size: 12 },
            padding: 8,
          },
        },
      },
    }),
    []
  );

  return (
    <div>
      <div
        style={{
          textAlign: "center",
          fontSize: "14px",
          fontWeight: 500,
          marginBottom: "10px",
        }}
      >
        P&amp;L chart
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          marginBottom: "12px",
          fontSize: "12px",
        }}
      >
        <span
          style={{
            width: "28px",
            height: "12px",
            background: "#E24B4A",
            display: "inline-block",
          }}
        />
        <span>Current Value</span>
      </div>

      <div style={{ position: "relative", width: "100%", height: "320px" }}>
        <Bar data={data} options={options} />
      </div>

      <div
        style={{
          textAlign: "center",
          fontSize: "12px",
          color: "#888",
          marginTop: "10px",
        }}
      >
        Today&apos;s P&amp;L over time
      </div>
    </div>
  );
};

export default PnlBarChart;
