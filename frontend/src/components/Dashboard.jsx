import React, { useState } from "react";
import axios from "axios";
import { APIURL } from "../../utils";

export default function Dashboard() {
  const [inputs, setInputs] = useState({
    plant_id: "",
    plant_name: "",
    // timestampDate: "", // YYYY-MM-DD
    // timestampTime: "", // HH:MM
    clinker_production_tpd: "",
    cement_production_tpd: "",
    kiln_temperature_c: "",
    alt_fuel_pct: "",
    raw_material_limestone_tpd: "",
    raw_material_clay_tpd: "",
    raw_material_gypsum_tpd: "",
    electricity_cost_usd: "",
    maintenance_downtime_hr: "",
    fuel_type: "",
    co2_emissions_tons: "",
  });

  const [prediction, setPrediction] = useState({
    energy: null,
    co2: null,
    recommendations: "",
  });

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handlePredict = async () => {
    try {
      const payload = { ...inputs };

      // Combine date and time to ISO 8601
      // if (payload.timestampDate && payload.timestampTime) {
      //   const combined = new Date(`${payload.timestampDate}T${payload.timestampTime}:00`);
      //   payload.timestamp = combined.toISOString();
      // } else {
      //   alert("Please provide both date and time for timestamp.");
      //   return;
      // }

      // Remove individual date/time fields before sending
      delete payload.timestampDate;
      delete payload.timestampTime;

      const res = await axios.post(`${APIURL}/api/predict-energy/data`, payload, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      setPrediction({
        energy: res.data.predictedEnergy,
        co2: res.data.predictedCO2,
        recommendations: res.data.recommendations,
      });
    } catch (err) {
      console.error("Prediction error:", err);
      alert("Error predicting energy. Check console for details.");
    }
  };

  const inputFields = [
    { label: "Plant ID", name: "plant_id", type: "text" },
    { label: "Plant Name", name: "plant_name", type: "text" },
    // { label: "Date", name: "timestampDate", type: "date" },
    // { label: "Time", name: "timestampTime", type: "time" },
    { label: "Clinker Production (TPD)", name: "clinker_production_tpd", type: "number" },
    { label: "Cement Production (TPD)", name: "cement_production_tpd", type: "number" },
    { label: "Kiln Temperature (°C)", name: "kiln_temperature_c", type: "number" },
    { label: "Alternative Fuel (%)", name: "alt_fuel_pct", type: "number" },
    { label: "Limestone (TPD)", name: "raw_material_limestone_tpd", type: "number" },
    { label: "Clay (TPD)", name: "raw_material_clay_tpd", type: "number" },
    { label: "Gypsum (TPD)", name: "raw_material_gypsum_tpd", type: "number" },
    { label: "Electricity Cost (USD)", name: "electricity_cost_usd", type: "number" },
    { label: "Maintenance Downtime (hr)", name: "maintenance_downtime_hr", type: "number" },
    { label: "Fuel Type", name: "fuel_type", type: "text" },
    { label: "CO₂ Emissions (Tons)", name: "co2_emissions_tons", type: "number" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
        Cement Plant Optimizer
      </h1>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {inputFields.map((field) => (
          <div key={field.name} className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              value={inputs[field.name]}
              onChange={handleChange}
              className="border text-orange-500 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
            />
          </div>
        ))}
      </section>

      <button
        onClick={handlePredict}
        className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 text-white px-6 py-3 rounded-xl shadow-lg font-semibold transition-all duration-300 mb-6"
      >
        Predict Energy
      </button>

      {/* Prediction Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-3xl shadow-lg text-center hover:shadow-2xl transition-shadow duration-300">
          <p className="text-gray-500">Predicted Energy (kWh)</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">
            {prediction.energy ?? "-"}
          </h2>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-lg text-center hover:shadow-2xl transition-shadow duration-300">
          <p className="text-gray-500">Predicted CO₂ Emissions (Tons)</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">
            {prediction.co2 ?? "-"}
          </h2>
        </div>
      </section>

      {/* AI Recommendations */}
      <section className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-3">AI Recommendations</h3>
        <p className="text-gray-600 whitespace-pre-wrap">
          {prediction.recommendations || "No recommendations yet."}
        </p>
      </section>
    </div>
  );
}
