import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function FuelMixChart({ data }) {
  const chartData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: "Alternative Fuel (%)",
        data: data.map(d => d.altFuel),
        backgroundColor: "purple",
      },
      {
        label: "Coal (%)",
        data: data.map(d => (100 - d.altFuel)),
        backgroundColor: "gray",
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            const row = data[context.dataIndex];
            return `${context.dataset.label}: ${context.parsed.y}% | CO₂: ${row.co2} Tons`;
          }
        }
      }
    },
    scales: {
      y: {
        title: { display: true, text: "Fuel Mix (%)" },
        stacked: true,
      },
      x: { stacked: true }
    }
  };

  return <Bar data={chartData} options={options} />;
}
