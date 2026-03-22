import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const marketHours = [
  "9:15","9:30","9:45","10:00","10:15","10:30","10:45","11:00",
  "11:15","11:30","11:45","12:00","12:15","12:30","12:45","13:00",
  "13:15","13:30","13:45","14:00","14:15","14:30","14:45","15:00",
  "15:15","15:30"
];

function StockChart({ symbol, priceData, isProfit }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !priceData || priceData.length === 0) return;

    const ctx = canvasRef.current.getContext('2d');
    const color = isProfit ? '#22c55e' : '#ef4444';

    const gradient = ctx.createLinearGradient(0, 0, 0, 220);
    gradient.addColorStop(0, isProfit ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: marketHours,
        datasets: [{
          data: priceData.slice(0, 26),
          borderColor: color,
          borderWidth: 2,
          backgroundColor: gradient,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: color,
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1a1a1a',
            titleColor: '#888',
            bodyColor: '#fff',
            borderColor: '#333',
            borderWidth: 1,
            padding: 10,
            callbacks: {
              label: (item) => '₹' + item.raw.toFixed(2)
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: '#888',
              font: { size: 11 },
              maxTicksLimit: 8,
              autoSkip: true
            }
          },
          y: {
            position: 'right',
            grid: { color: 'rgba(200,200,200,0.08)' },
            ticks: {
              color: '#888',
              font: { size: 11 },
              callback: (v) => '₹' + v.toFixed(0)
            }
          }
        }
      }
    });

    return () => chart.destroy();
  }, [symbol, priceData, isProfit]);

  return (
    <div style={{ position: 'relative', height: '220px', width: '100%', marginTop: '16px' }}>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

export default StockChart;
