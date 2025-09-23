import React, { useEffect, useState, Suspense ,lazy} from "react";
import axios from "axios";
import ManualUpload from "../components/Manuallyupload";
import CsvUpload from "../components/CSVFilezUpload";
const EnergyChart =lazy(()=>import( "../components/charts/EnergyChart"));
const CO2Chart =lazy(()=>import("../components/charts/Co2Chart"));
const FuelMixChart=lazy(()=>import( "../components/charts/FuelMixChart"));
import { APIURL } from "../../utils";
import toast from "react-hot-toast";


export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState(null);
  const plantId = localStorage.getItem("plantId");
  const [recommendations, setRecommendations] = useState([]);
  const [recLoading, setRecLoading] = useState(false);

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  // Fetch dashboard data
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${APIURL}/api/cement/dashboard/plant_id/${plantId}`, {
        headers: { "Content-Type": "application/json" },
      });
      setData(res.data);
    } catch (err) {
       setData(null);
      return(err);
     
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (plantId) fetchData();
  }, [plantId]);

  const handleSubmit = async (records) => {
    try {
      await axios.post(
        `${APIURL}/api/cement/add/cement-plant/record/plant_id/${plantId}`,
        { records },
        { headers: { "Content-Type": "application/json" } }
      );
      setMode(null);
      fetchData();
    } catch (err) {
      toast.error("Failed to submit data");
    }
  };

  // Transform backend data for charts
  const chartDataArray = data?.labels
    ? data.labels.map((date, i) => {
        const d = new Date(date);
        return {
          date: monthNames[d.getMonth()],
          year: d.getFullYear(),
          clinkerProduction: data.clinkerProduction[i],
          cementProduction: data.cementProduction[i],
          kilnTemp: data.kilnTemp[i],
          altFuel: data.altFuel[i],
          energy: data.energyConsumption[i],
          co2: data.co2Emissions[i],
          fuel_type: data.fuel_type[i],
        };
      })
    : [];

  // Get AI recommendations
  const getDataRecommendation = async () => {
    try {
      setRecLoading(true);
      const res = await axios.post(
        `${APIURL}/api/ai/dashboard-rec/plant_id/${plantId}`,
        { chartDataArray },
        { headers: { "Content-Type": "application/json" } }
      );
      setRecommendations(res.data.recommendations);
    } catch (err) {
      setRecommendations("Failed to fetch recommendations.",err);
    } finally {
      setRecLoading(false);
    }
  };

  
  if (loading)
    return <p className="text-center mt-6 text-gray-700">Loading dashboard...</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Cement Plant Dashboard</h1>

      <h4 className="text-center font-bold text-4xl mb-4 text-blue-600">Data Analysis</h4>

      {loading || chartDataArray.length > 0 ? (
         <Suspense fallback={<div className="text-center text-black  mt-10">Loading Charts...</div>}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-6 rounded-lg shadow h-[400px]">
              <EnergyChart data={chartDataArray} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow h-[400px]">
              <CO2Chart data={chartDataArray} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow h-[400px]">
              <FuelMixChart data={chartDataArray} />
            </div>
          </div>
        </Suspense>
      ) : (
        <p className="mb-6 text-red-600 font-medium">No data available. Please add records.</p>
      )}

      {/* Input Options */}
      {!mode && (
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition text-lg font-medium"
            onClick={() => setMode("manual")}
          >
            Add Records Manually
          </button>
          <button
            className="flex-1 bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition text-lg font-medium"
            onClick={() => setMode("csv")}
          >
            Upload CSV File
          </button>
        </div>
      )}

      {/* Manual / CSV Forms */}
      {mode && (
        <div className="p-6 bg-gray-50 border rounded-lg shadow mb-8">
          <button
            className="mb-6 text-gray-600 hover:text-gray-800 font-medium"
            onClick={() => setMode(null)}
          >
            ← Back to Dashboard
          </button>
          {mode === "manual" && (
            <ManualUpload onSubmit={handleSubmit} isLoading={loading} />
          )}
          {mode === "csv" && (
            <CsvUpload onSubmit={handleSubmit} isLoading={loading} />
          )}
        </div>
      )}

      {/* AI Recommendations */}
      <div className="p-4 border rounded shadow-md">
        <h2 className="text-xl font-semibold mb-4">Cement Plant Optimization</h2>

        <button
          onClick={getDataRecommendation}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
        >
          {recLoading ? "Generating..." : "Get AI Recommendations"}
        </button>
          {recommendations && recommendations.length > 0 && (
  <div className="bg-white shadow-lg rounded-xl p-6 mt-6">
    <h3 className="text-2xl font-bold mb-4 text-gray-800">
      AI Recommendations
    </h3>
    <div className="bg-gray-100 text-black p-4 rounded-lg ">
      {recommendations && recommendations.length > 0 && (
  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mt-6 shadow-sm max-w-4xl mx-auto">
    <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">
      AI Recommendations
    </h3>
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      {recommendations.map((r, index) => (
        <p key={index} className="text-gray-700 leading-relaxed text-sm sm:text-base">
           {typeof r === "string" ? r : r.text || JSON.stringify(r)}
        </p>
      ))}
    </div>
  </div>
)}

    </div>
  </div>
)}

      </div>
    </div>
  );
}

