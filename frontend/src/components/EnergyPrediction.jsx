import React, { useState } from "react";
import axios from "axios";
import { APIURL } from "../../utils";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const plantId = JSON.parse(localStorage.getItem("plantId")) || "";

  const [inputs, setInputs] = useState({
    plant_id: plantId,
    plant_name: "",
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
  });

  const [prediction, setPrediction] = useState({
    energy: null,
    co2: null,
    recommendations: [],
  });

  const handleChange = (e) => {
    const value = e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setInputs({ ...inputs, [e.target.name]: value });
  };

  const handlePredict = async () => {
    try {
      setIsLoading(true);
      const payload = { ...inputs };

      const res = await axios.post(`${APIURL}/api/cement/data`, payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      setPrediction({
        energy: res.data.predictedEnergy,
        co2: res.data.predictedCO2,
        recommendations: Array.isArray(res.data.recommendations) ? res.data.recommendations : [],
      });
    } catch (err) {
      alert("Error predicting energy. Check console for details.",err);
    } finally {
      setIsLoading(false);
    }
  };

  const inputFields = [
    { label: "Plant Name", name: "plant_name", type: "text" },
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
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Cement Plant Energy Optimizer</h1>
      <p className="text-gray-700 text-center mb-8 border-b-2 border-amber-200 pb-4">
        Fill in the plant details and run the simulation to see predicted energy consumption, CO₂ emissions, and AI-generated recommendations.
      </p>

      {/* Input Form */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-1">Plant ID</label>
          <input
            type="text"
            name="plant_id"
            value={inputs.plant_id}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm text-orange-500"
            disabled
          />
        </div>
        {inputFields.map((field) => (
          <div key={field.name} className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              value={inputs[field.name]}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm text-orange-500"
            />
          </div>
        ))}
      </section>

      {/* Predict Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={handlePredict}
          disabled={isLoading}
          className={`bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg font-semibold transition-all duration-300 ${
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:from-indigo-600 hover:to-blue-500"
          }`}
        >
          {isLoading ? "Predicting..." : "Predict Energy"}
        </button>
      </div>

      {/* Prediction Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-3xl shadow-lg text-center hover:shadow-2xl transition-shadow duration-300">
          <p className="text-gray-500">Predicted Energy (kWh)</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">{prediction.energy ?? "-"}</h2>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-lg text-center hover:shadow-2xl transition-shadow duration-300">
          <p className="text-gray-500">Predicted CO₂ Emissions (Tons)</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">{prediction.co2 ?? "-"}</h2>
        </div>
      </section>

      {/* AI Recommendations */}
      <section className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
        <h3 className="text-xl font-semibold text-gray-700 mb-6 text-center">AI Recommendations</h3>
        {isLoading ? (
          <div className="flex justify-center items-center space-x-2">
            <svg className="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span>Fetching recommendations...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {prediction.recommendations.length ? (
              prediction.recommendations.map((rec, idx) => (
                <div key={idx} className="bg-gradient-to-r from-green-50 to-green-100 p-5 rounded-xl shadow hover:shadow-lg transition duration-300">
                  <p className="text-green-700 font-semibold mb-1"><strong>Action:</strong> {rec.action}</p>
                  <p className="text-gray-700 mb-1"><strong>Reason:</strong> {rec.reason}</p>
                  <p className="text-gray-600"><strong>Expected Impact:</strong> {rec.expected_impact}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-full">No recommendations available.</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
