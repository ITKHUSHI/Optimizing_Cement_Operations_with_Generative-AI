import { useEffect, useState } from "react";
import axios from "axios";
import { APIURL } from "../../utils.js";

export default function CementPlantDashboard() {
  const [plantData, setPlantData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const plant_id = JSON.parse(localStorage.getItem("plantId") || "null");

  useEffect(() => {
    const fetchPlantData = async () => {
      try {
        const res = await axios.get(`${APIURL}/api/cement/cement-plant/plant_id/${plant_id}`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        setPlantData(res?.data?.plant);

      } catch (err) {
        setError("Failed to fetch plant data");
      } finally {
        setLoading(false);
      }
    };
    fetchPlantData();
  }, [plant_id]);

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading plant data...</p>;
  if (error)
    return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-gray-50 shadow-xl rounded-3xl">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-600 underline">
        {plantData?.plantName}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
          <h2 className="font-semibold text-xl mb-3 text-gray-700">Basic Info</h2>
          <p><span className="font-medium">Plant Name:</span> {plantData?.plantName}</p>
          <p><span className="font-medium">Organization Name:</span> {plantData?.organizationName}</p>
          <p><span className="font-medium">Organization Email:</span> {plantData?.organizationEmail}</p>
        </div>

        {/* Location */}
        <div className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
          <h2 className="font-semibold text-xl mb-3 text-gray-700">Location</h2>
          <p><span className="font-medium">Country:</span> {plantData?.location?.country?.label}</p>
          <p><span className="font-medium">State:</span> {plantData?.location?.state?.label}</p>
          <p><span className="font-medium">City:</span> {plantData?.location?.city?.label}</p>
        </div>

        {/* Operations */}
        <div className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
          <h2 className="font-semibold text-xl mb-3 text-gray-700">Operations</h2>
          <p><span className="font-medium">Capacity (TPD):</span> {plantData?.capacityTPD}</p>
          <p><span className="font-medium">Kiln Count:</span> {plantData?.kilnCount}</p>
          <p><span className="font-medium">Kiln Type:</span> {plantData?.kilnType}</p>
          <p><span className="font-medium">Production Lines:</span> {plantData?.productionLines}</p>
          <p><span className="font-medium">Primary Fuel:</span> {plantData?.primaryFuel}</p>
          {plantData.alternativeFuels?.length > 0 && (
            <p><span className="font-medium">Alternative Fuels:</span> {plantData?.alternativeFuels.join(", ")}</p>
          )}
        </div>

        {/* Energy & Environment */}
        <div className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
          <h2 className="font-semibold text-xl mb-3 text-gray-700">Energy & Environment</h2>
          <p><span className="font-medium">Power Capacity (MW):</span> {plantData?.powerCapacityMW}</p>
          <p><span className="font-medium">TSR (%):</span> {plantData?.tsr}</p>
          <p><span className="font-medium">CO₂ Baseline (kg/ton clinker):</span> {plantData?.co2Baseline}</p>
          <p><span className="font-medium">Energy Baseline (kWh/ton cement):</span> {plantData?.energyBaseline}</p>
        </div>

        {/* Extra Details */}
        <div className="md:col-span-2 bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
          <h2 className="font-semibold text-xl mb-3 text-gray-700">Extra Details</h2>
          {plantData.rawMaterialQuality && (
            <p><span className="font-medium">Limestone Grade (% CaCO₃):</span> {plantData?.rawMaterialQuality?.limestoneGrade}</p>
          )}
          <p><span className="font-medium">Constraints:</span> {plantData?.constraints}</p>
          <p><span className="font-medium">Year Commissioned:</span> {plantData?.yearCommissioned}</p>
        </div>
      </div>
    </div>
  );
}
