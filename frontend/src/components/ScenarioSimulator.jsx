import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { APIURL } from "../../utils";

const ScenarioSimulator = ({ baseInput }) => {
  const [scenarios, setScenarios] = useState([{ alternativeFuel: 5, hydrogenFuel: 0 }]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);


  

  const addScenario = () => setScenarios([...scenarios, { alternativeFuel: 0, hydrogenFuel: 0 }]);

  const handleChange = (index, field, value) => {
    const updated = [...scenarios];
    updated[index][field] = parseFloat(value);
    setScenarios(updated);
  };

  baseInput = baseInput || {
    plantId: "JKCEMENT-PLANT1",
    kilnTemperature: 1500,
    clinkerProduction: 5000,
    rawMaterialQuality: 85,
    currentFuelMix: { conventionalFuel: 90, alternativeFuel: 5, hydrogenFuel: 5 },
    grindingEfficiency: 75,
    ambientTemperature: 30,
    humidity: 60
  };

  const runSimulation = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${APIURL}/api/ai/optimization/scenario`, { baseInput, scenarios }, {
        headers: { 'Content-Type': 'application/json' },
      });

      setResults(res.data);
    } catch (err) {
      toast.error('Simulation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Cement Plant Scenario Simulator</h2>

      <div className="grid gap-4 md:grid-cols-2 mb-6">
        {scenarios.map((s, idx) => (
          <div key={idx} className="p-4 bg-white shadow-lg rounded-xl flex flex-col gap-2">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Scenario #{idx + 1}</h3>
            <div className="flex flex-col sm:flex-row sm:gap-4 items-start">
              <div className="flex flex-col mb-2 sm:mb-0">
                <label className="text-gray-600 font-medium mb-1">Alternative Fuel %</label>
                <input
                  type="number"
                  value={s.alternativeFuel}
                  onChange={(e) => handleChange(idx, 'alternativeFuel', e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-600 font-medium mb-1">Hydrogen Fuel %</label>
                <input
                  type="number"
                  value={s.hydrogenFuel}
                  onChange={(e) => handleChange(idx, 'hydrogenFuel', e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <button onClick={addScenario} className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2 rounded-xl shadow-md transition duration-300">
          Add Scenario
        </button>
        <button onClick={runSimulation} className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-xl shadow-md transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          {loading ? 'Running...' : 'Run Simulation'}
        </button>
      </div>

      <div className="grid gap-6">
        {results?.length > 0 ? results.map((r, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300 border-l-4 border-blue-500">
            <h3 className="text-2xl font-bold mb-4 text-blue-600 text-center">Scenario #{idx + 1}</h3>
            <div className="flex flex-col md:flex-row gap-6 justify-between mb-4">
              <div className="flex-1 bg-gray-50 p-4 rounded-lg shadow-inner">
                <p className="text-gray-700 font-medium mb-1">Predicted Energy</p>
                <p className="text-2xl font-bold text-gray-800">{r.energyConsumption?.toLocaleString(undefined, { maximumFractionDigits: 2 })} kWh</p>
              </div>
              <div className="flex-1 bg-gray-50 p-4 rounded-lg shadow-inner">
                <p className="text-gray-700 font-medium mb-1">Predicted CO₂</p>
                <p className="text-2xl font-bold text-gray-800">{r.co2Emission?.toLocaleString(undefined, { maximumFractionDigits: 2 })} tons</p>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-2 text-gray-700">Recommendations</h4>
              <ul className="space-y-3">
                {r.recommendations?.map((rec, i) => (
                  <li key={i} className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl shadow hover:shadow-lg transition duration-300">
                    <p><strong>Action:</strong> {rec.action}</p>
                    <p><strong>Reason:</strong> {rec.reason}</p>
                    <p><strong>Expected Impact:</strong> {rec.expected_impact}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )) : (
          <div className="text-gray-500 text-center py-10 text-lg">No simulation results yet. Run a scenario to see predictions.</div>
        )}
      </div>
    </div>
  );
};

export default ScenarioSimulator;
