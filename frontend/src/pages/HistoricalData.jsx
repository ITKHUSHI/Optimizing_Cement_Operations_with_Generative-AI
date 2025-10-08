import React, { useEffect, useState } from "react";
import axios from "axios";
import { APIURL } from "../../utils.js";
import CO2Chart from "../components/charts/Co2Chart.jsx";
import EnergyEfficiencyChart from "../components/charts/EnergyChart.jsx";
import FuelMixChart from "../components/charts/FuelMixChart.jsx";
import ManualUpload from "../components/Manuallyupload.jsx";
import CsvUpload from "../components/CSVFilezUpload.jsx";

export default function CementPlantHistory() {
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const plant_id = JSON.parse(localStorage.getItem("plantId") || "null");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${APIURL}/api/cement/dashboard/plant_id/${plant_id}`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        setHistoricalData(res?.data?.historicalData || []);
      } catch (err) {
        setError("Failed to fetch historical data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [plant_id]);

  const handleSubmitRecords = async (records) => {
    setIsSubmitting(true);
    try {
      await axios.post(
        `${APIURL}/api/cement/add/cement-plant/record/plant_id/${plant_id}`,
        { records },
        { withCredentials: true }
      );
      // Update UI immediately
      setHistoricalData((prev) => [...prev, ...records]);
    } catch (err) {
      console.error("Error adding records:", err);
      alert("Failed to add records. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p className="text-center mt-30">Loading...</p>;
  if (error) return <p className="text-red-500 text-center mt-30">{error}</p>;

  return (
    <div className="min-h-screen p-6 bg-gary-50 mt-15">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
        Historical Data Dashboard - {historicalData?.plantName || "Plant"}
      </h1>

      {historicalData?.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl  h-[40px]">
            <h2 className="font-semibold mb-4 text-center">CO₂ Emissions</h2>
            <CO2Chart data={historicalData} co2Target={500} />
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg h-[400px]">
            <h2 className="font-semibold mb-4 text-center">Energy Efficiency</h2>
            <EnergyEfficiencyChart data={historicalData} />
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg h-[400px]">
            <h2 className="font-semibold mb-4 text-center">Fuel Mix</h2>
            <FuelMixChart data={historicalData} />
          </div>
        </div>
      )}

      <div className="text-center mb-6">
        {historicalData?.length === 0 && (
          <p className="text-gray-700 text-lg mb-2">
            No historical data found for this plant.
          </p>
        )}
        <p className="text-gray-500">
          You can add records manually or upload a CSV file below.
        </p>
      </div>
      



      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg text-black">
          
          <ManualUpload onSubmit={handleSubmitRecords} isLoading={isSubmitting} />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <CsvUpload onSubmit={handleSubmitRecords} isLoading={isSubmitting} />
        </div>
      </div>
    </div>
  );
}
