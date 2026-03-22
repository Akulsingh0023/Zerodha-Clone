import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

const marketHours = [
  "9:15","9:30","9:45","10:00","10:15","10:30","10:45","11:00",
  "11:15","11:30","11:45","12:00","12:15","12:30","12:45","13:00",
  "13:15","13:30","13:45","14:00","14:15","14:30","14:45","15:00",
  "15:15","15:30"
];

const ranges = ['1D', '1W', '1M', '1Y'];

function StockChart({ symbol, avgPrice, currentPrice, change, changePercent, priceData }) {
  const canvasRef = useRef(null);
  const [activeRange, setActiveRange] = useState('1D');
  const isProfit = currentPrice >= avgPrice;
  const color = isProfit ? '#22c55e' : '#ef4444';

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, 0, 220);
    gradient.addColorStop(0, isProfit ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: marketHours,
        datasets: [{
          data: priceData ? priceData.slice(0, 26) : [],
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
            titleColor: '#aaa',
            bodyColor: '#fff',
            borderColor: '#333',
            borderWidth: 1,
            padding: 10,
            displayColors: false,
            callbacks: {
              title: (items) => items[0].label,
              label: (item) => '₹' + Number(item.raw).toFixed(2)
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: '#666',
              font: { size: 11 },
              maxTicksLimit: 7,
              autoSkip: true
            }
          },
          y: {
            position: 'right',
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: {
              color: '#666',
              font: { size: 11 },
              callback: (v) => '₹' + v.toFixed(0)
            }
          }
        }
      }
    });

    return () => chart.destroy();
  }, [symbol, priceData, activeRange, isProfit]);

  return (
    <div style={{
      background: '#111',
      borderRadius: '12px',
      padding: '20px',
      marginTop: '16px',
      color: '#fff'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <p style={{ fontSize: '13px', color: '#888', margin: '0 0 4px' }}>{symbol}</p>
          <p style={{ fontSize: '26px', fontWeight: '500', margin: '0' }}>₹{Number(currentPrice).toFixed(2)}</p>
          <p style={{ fontSize: '13px', color: color, margin: '4px 0 0' }}>
            {change > 0 ? '+' : ''}{change} ({changePercent}%) today
          </p>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {ranges.map(r => (
            <button
              key={r}
              onClick={() => setActiveRange(r)}
              style={{
                padding: '4px 10px',
                fontSize: '12px',
                borderRadius: '20px',
                cursor: 'pointer',
                background: activeRange === r ? '#fff' : 'transparent',
                color: activeRange === r ? '#000' : '#888',
                border: activeRange === r ? 'none' : '1px solid #333',
                fontWeight: activeRange === r ? '500' : '400'
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <div style={{ position: 'relative', height: '220px', width: '100%' }}>
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
}

export default StockChart;
