import React from "react";
import moment from "moment";

const alertColors = {
  Normal: "bg-green-100 text-green-800",
  Warning: "bg-yellow-100 text-yellow-800",
  Critical: "bg-red-100 text-red-800",
};

export default function PlantHealthCard({ plant }) {
  const {  healthScore, nextMaintenance } = plant;
  const colorClass = alertColors[alert] || "bg-gray-100 text-gray-800";

  return (
    <div className="p-4 rounded-xl shadow-lg border border-gray-200 bg-white w-full transition hover:scale-105">
      <div className={`px-3 py-1 rounded-full inline-block mb-2 font-semibold ${colorClass}`}>
        {/* {alert} */}
      </div>
      <h3 className="text-2xl font-bold mb-2">Health: {healthScore.toFixed(2)}%</h3>
      <p className="text-gray-600">
        Next Maintenance:{" "}
        <span className="font-medium">
          {moment(nextMaintenance).format("DD MMM YYYY, HH:mm")}
        </span>
      </p>
      <div className="mt-4 w-full bg-gray-200 h-3 rounded-full">
        <div
          className={`h-3 rounded-full ${
            healthScore > 80
              ? "bg-green-500"
              : healthScore > 60
              ? "bg-yellow-500"
              : "bg-red-500"
          }`}
          style={{ width: `${healthScore}%` }}
        />
      </div>
    </div>
  );
}
