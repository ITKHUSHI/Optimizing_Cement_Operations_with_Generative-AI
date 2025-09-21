import React, { useState } from "react";
import axios from "axios";
import { APIURL } from "../../utils";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [inputs, setInputs] = useState({
    plant_id: "",
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
    recommendations: "",
  });

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
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
        recommendations: res.data.recommendations,
      });
    } catch (err) {
      console.error("Prediction error:", err);
      alert("Error predicting energy. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputFields = [
    { label: "Plant ID", name: "plant_id", type: "text" },
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Cement Plant Energy Optimizer
      </h1>
          <p className="text-gray-700   border-b-2 border-amber-200 pb-4 mb-6 ">
         Fill in all the plant details above, then run the simulation to see predicted energy consumption, CO₂ emissions, and AI-generated recommendations for optimization.
         </p>
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
        disabled={isLoading}
        className={`w-full md:w-auto bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg font-semibold transition-all duration-300 mb-6 ${
          isLoading ? "opacity-50 cursor-not-allowed" : "hover:from-indigo-600 hover:to-blue-500"
        }`}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span>Predicting...</span>
          </div>
        ) : (
          "Predict Energy"
        )}
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
      {Array.isArray(prediction.recommendations) && prediction.recommendations.length ? (
        prediction.recommendations.map((rec, idx) => (
          <div key={idx} className="bg-blue-50 p-5 rounded-xl shadow hover:shadow-lg transition-shadow">
            <h4 className=" text-blue-700 mb-2"><strong className="text-gray-700 ">Action:</strong> {rec.action}</h4>
            <p className="text-gray-700 mb-2"><strong>Reason:</strong> {rec.reason}</p>
            <p className="text-gray-600"><strong>Expected Impact:</strong> {rec.expected_impact}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No recommendations available.</p>
      )}
    </div>
  )}
</section>

    </div>
  );
}
