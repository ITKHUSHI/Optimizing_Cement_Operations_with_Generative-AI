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

export default function EnergyEfficiencyChart({ data }) {
  const chartData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: "Energy per Ton (kWh/TPD)",
        data: data.map(d => (d.energy / d.clinkerProduction).toFixed(2)),
        borderColor: "blue",
        backgroundColor: "rgba(0,0,255,0.2)",
        tension: 0.3,
      },
      {
        label: "Clinker Production (TPD)",
        data: data.map(d => d.clinkerProduction),
        borderColor: "green",
        backgroundColor: "rgba(0,255,0,0.2)",
        yAxisID: 'y1',
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            const row = data[context.dataIndex];
            if(context.dataset.label === "Energy per Ton (kWh/TPD)"){
              return `Energy/Ton: ${context.parsed.y} kWh/TPD`;
            } else {
              return `Clinker: ${row.clinkerProduction} TPD | Energy: ${row.energy} kWh`;
            }
          }
        }
      }
    },
    scales: {
      y: { 
        type: 'linear',
        position: 'left',
        title: { display: true, text: "kWh/TPD" }
      },
      y1: {
        type: 'linear',
        position: 'right',
        title: { display: true, text: "Clinker Production (TPD)" },
        grid: { drawOnChartArea: false }
      }
    }
  };

  return <Line data={chartData} options={options} />;
}
