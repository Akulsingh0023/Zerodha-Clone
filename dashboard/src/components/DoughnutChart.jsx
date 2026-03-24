import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);



export function DoughnutChart({data}) {
  return (
    <div style={{ width: "100%", maxWidth: "100%", minHeight: "220px", overflowX: "hidden" }}>
      <Doughnut data={data} />
    </div>
  );
}
