import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Holdings",
    },
  },
};

export function VerticalGraph({ data, title = "Holdings" }) {
  const options = {
    ...baseOptions,
    plugins: {
      ...baseOptions.plugins,
      title: {
        ...baseOptions.plugins.title,
        text: title,
      },
    },
  };

  return (
    <div className="vertical-graph-wrap">
      <Bar options={options} data={data} />
    </div>
  );
}
