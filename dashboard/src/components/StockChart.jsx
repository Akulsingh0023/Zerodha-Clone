import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

function StockChart({ symbol, currentPrice, avgPrice, change, changePercent }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const [activeRange, setActiveRange] = useState('1D');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isProfit = currentPrice >= avgPrice;
  const color = isProfit ? '#22c55e' : '#ef4444';

  // IMPORTANT: Replace this URL with whatever endpoint 
  // our backend uses to get NSE chart data for a symbol
  const getChartUrl = (sym) => `/api/chart/${sym}`;

  useEffect(() => {
    if (!symbol) return;
    const fetchChart = async () => {
      setLoading(true);
      setError('');
      setChartData([]);

      try {
        const res = await fetch(getChartUrl(symbol));
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        let data;
        try {
          data = await res.json();
        } catch (err) {
          throw new Error('Invalid JSON response');
        }

        if (!data?.formatted || data.formatted.length === 0) {
          setChartData([]);
          setLoading(false);
          return;
        }

        const sanitized = data.formatted
          .filter((item) => item && item.time)
          .map((item) => ({
            time: item.time,
            price: Number(item.price),
          }))
          .filter((item) => Number.isFinite(item.price));

        setChartData(sanitized);
        setLoading(false);
      } catch (err) {
        console.error('Chart fetch failed:', err);
        setChartData([]);
        setLoading(false);
      }
    };

    fetchChart();
  }, [symbol, activeRange]);

  useEffect(() => {
    if (!canvasRef.current || chartData.length === 0) return;

    const priceData = chartData.map((item) => item.price);
    const labels = chartData.map((item) => item.time);

    const ctx = canvasRef.current.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 220);
    gradient.addColorStop(0, isProfit 
      ? 'rgba(34,197,94,0.25)' 
      : 'rgba(239,68,68,0.25)'
    );
    gradient.addColorStop(1, 'rgba(0,0,0,0)');

    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          data: priceData,
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

    return () => {
      if (chartRef.current) chartRef.current.destroy();
    };
  }, [chartData, color, isProfit]);

  return (
    <div style={{ 
      background: '#111', borderRadius: '12px', 
      padding: '20px', marginTop: '16px', color: '#fff' 
    }}>
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', 
        alignItems: 'flex-start', marginBottom: '16px' 
      }}>
        <div>
          <p style={{ fontSize: '13px', color: '#888', margin: '0 0 4px' }}>
            {symbol}
          </p>
          <p style={{ fontSize: '26px', fontWeight: '500', margin: '0' }}>
            ₹{Number(currentPrice).toFixed(2)}
          </p>
          <p style={{ fontSize: '13px', color: color, margin: '4px 0 0' }}>
            {change > 0 ? '+' : ''}{change} ({changePercent}%) today
          </p>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['1D','1W','1M','1Y'].map(r => (
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

      {loading ? (
        <div style={{ 
          height: '220px', display: 'flex', 
          alignItems: 'center', justifyContent: 'center', 
          color: '#444', fontSize: '13px' 
        }}>
          Loading chart...
        </div>
      ) : chartData.length === 0 ? (
        <div style={{ 
          height: '220px', display: 'flex', 
          alignItems: 'center', justifyContent: 'center', 
          color: '#888', fontSize: '13px' 
        }}>
          Chart data unavailable right now
        </div>
      ) : (
        <div style={{ position: 'relative', height: '220px', width: '100%' }}>
          <canvas ref={canvasRef}></canvas>
        </div>
      )}
    </div>
  );
}

export default StockChart;