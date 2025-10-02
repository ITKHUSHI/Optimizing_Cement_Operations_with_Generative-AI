// components/CementPlantDashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { APIURL } from "../../utils.js";

export default function CementPlantDashboard() {
  const [plantData, setPlantData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
const plant = JSON.parse(localStorage.getItem("plantData") || "null");
const plant_id = plant?.id; 
  useEffect(() => {
    const fetchPlantData = async () => {
      try {
       const res = await axios.get(`${APIURL}/api/cement/cement-plant/plant_id/${plant_id}`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        setPlantData(res?.data?.plant);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch plant data");
        setLoading(false);
      }
    };

    fetchPlantData();
  }, []);
  console.log(plantData)
  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-500 underline ">{plantData?.plantName} </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="font-semibold text-lg mb-2">Basic Info</h2>
          <p><span className="font-medium">Plant Name:</span> {plantData?.plantName}</p>
          <p><span className="font-medium">Organization Name:</span> {plantData?.organizationName}</p>
          <p><span className="font-medium">Organization Email:</span> {plantData?.organizationEmail}</p>
        </div>

        <div>
          <h2 className="font-semibold text-lg mb-2">Location</h2>
          <p><span className="font-medium">Country:</span> {plantData?.location?.country.label}</p>
          <p><span className="font-medium">State:</span> {plantData?.location?.state.label}</p>
          <p><span className="font-medium">City:</span> {plantData?.location?.city.label}</p>
         
        </div>

        <div>
          <h2 className="font-semibold text-lg mb-2">Operations</h2>
          <p><span className="font-medium">Capacity (TPD):</span> {plantData?.capacityTPD}</p>
          <p><span className="font-medium">Kiln Count:</span> {plantData?.kilnCount}</p>
          <p><span className="font-medium">Kiln Type:</span> {plantData?.kilnType}</p>
          <p><span className="font-medium">Production Lines:</span> {plantData?.productionLines}</p>
          <p><span className="font-medium">Primary Fuel:</span> {plantData?.primaryFuel}</p>
          {plantData.alternativeFuels?.length > 0 && (
            <p><span className="font-medium">Alternative Fuels:</span> {plantData?.alternativeFuels.join(", ")}</p>
          )}
        </div>

        <div>
          <h2 className="font-semibold text-lg mb-2">Energy & Environment</h2>
          <p><span className="font-medium">Power Capacity (MW):</span> {plantData?.powerCapacityMW}</p>
          <p><span className="font-medium">Thermal Substitution Rate (TSR %):</span> {plantData?.tsr}</p>
          <p><span className="font-medium">CO₂ Baseline (kg/ton clinker):</span> {plantData?.co2Baseline}</p>
          <p><span className="font-medium">Energy Baseline (kWh/ton cement):</span> {plantData?.energyBaseline}</p>
        </div>

        <div className="md:col-span-2">
          <h2 className="font-semibold text-lg mb-2">Extra Details</h2>
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
