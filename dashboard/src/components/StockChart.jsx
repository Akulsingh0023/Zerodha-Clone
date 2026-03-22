import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

function StockChart({ symbol, isProfit, priceData, timeLabels }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !priceData || !timeLabels) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const color = isProfit ? "#22c55e" : "#ef4444";
    const gradient = ctx.createLinearGradient(0, 0, 0, 220);
    gradient.addColorStop(
      0,
      isProfit ? "rgba(34,197,94,0.28)" : "rgba(239,68,68,0.28)"
    );
    gradient.addColorStop(1, "rgba(0,0,0,0)");

    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: timeLabels,
        datasets: [
          {
            data: priceData,
            borderColor: color,
            borderWidth: 2,
            backgroundColor: gradient,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: { position: "right" },
        },
      },
    });

    return () => chart.destroy();
  }, [symbol, priceData, timeLabels, isProfit]);

  return <canvas ref={canvasRef} />;
}

export default StockChart;
