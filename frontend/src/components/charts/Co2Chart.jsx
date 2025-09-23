import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

export default function CO2Chart({ data, co2Target }) {

  const chartData = {
  
    labels: data.map(d => d.date) , // month or year
    labels: data.map(d => d.year), // month or year
    datasets: [
      {
        label: "Actual CO₂ Emissions (Tons)",
        data: data.map(d => d.co2 ),
        borderColor: "red",
        backgroundColor: "rgba(255,0,0,0.2)",
        tension: 0.3,
      },
      {
        label: "Target CO₂ Limit",
        data: data.map(() => co2Target), // same value for each month
        borderColor: "green",
        borderDash: [5, 5],
        fill: false,
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
            return `CO₂: ${context.parsed.y} Tons | Clinker: ${row.clinkerProduction} TPD | Fuel: ${row.fuel_type}`;
          }
        }
      }
    },
    scales: {
      y: {
        title: { display: true, text: "CO₂ Emissions (Tons)" }
      }
    }
  };

  return <Line data={chartData} options={options} />;
}

