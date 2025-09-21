import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { APIURL } from '../../utils';

const ScenarioSimulator = ({ baseInput }) => {
  const [scenarios, setScenarios] = useState([{ alternativeFuel: 5, hydrogenFuel: 0 }]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load previous results from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('cementOptimizationResult');
    if (saved) {
      try {
        setResults([JSON.parse(saved)]); // wrap in array
      } catch (err) {
        console.error('Failed to parse saved results', err);
      }
    }
  }, []);

  const addScenario = () => setScenarios([...scenarios, { alternativeFuel: 0, hydrogenFuel: 0 }]);

  const handleChange = (index, field, value) => {
    const updated = [...scenarios];
    updated[index][field] = parseFloat(value);
    setScenarios(updated);
  };

  // Example baseInput if not passed as prop
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
      console.log('Simulation response:', res.data);

      localStorage.setItem('cementOptimizationResult', JSON.stringify(res.data));
      setResults([res.data]); // set as array to match UI mapping
    } catch (err) {
      console.error(err);
      alert('Simulation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold mb-2">Scenario Simulation</h2>

      {scenarios.map((s, idx) => (
        <div key={idx} className="mb-2 flex gap-2 items-center">
          <label>Alternative fuel %</label>
          <input
            type="number"
            value={s.alternativeFuel}
            onChange={(e) => handleChange(idx, 'alternativeFuel', e.target.value)}
            className="border p-1 w-36"
          />
          <label>Hydrogen fuel %</label>
          <input
            type="number"
            value={s.hydrogenFuel}
            onChange={(e) => handleChange(idx, 'hydrogenFuel', e.target.value)}
            className="border p-1 w-36"
          />
        </div>
      ))}

      <div className="flex gap-2 mb-4">
        <button onClick={addScenario} className="bg-blue-500 text-white px-4 py-1 rounded">Add Scenario</button>
        <button onClick={runSimulation} className="bg-green-500 text-white px-4 py-1 rounded">
          {loading ? 'Running...' : 'Run Simulation'}
        </button>
      </div>

      <div className="mt-4">
        {results?.length > 0 ? (
          results.map((r, idx) => (
            <div key={idx} className="p-4 mb-4 border rounded-lg shadow-sm bg-amber-100">
              <div className="text-lg font-bold mb-2 text-amber-900">Scenario #{idx + 1}</div>
              <div className="mb-1">
                <span className="font-semibold">Predicted Energy:</span> {r.energyConsumption.toLocaleString(undefined, { maximumFractionDigits: 2 })} kWh
              </div>
              <div className="mb-2">
                <span className="font-semibold">Predicted CO₂:</span> {r.co2Emission.toLocaleString(undefined, { maximumFractionDigits: 2 })} tons
              </div>

              <div className="mt-2">
                <div className="font-semibold mb-1">Recommendations:</div>
                <ul className="space-y-2">
                  {r.recommendations.map((rec, i) => (
                    <li key={i} className={`p-2 rounded ${rec.type === "energy" ? "bg-green-100 text-green-900" : "bg-red-100 text-red-900"}`}>
                      <div className="font-semibold">{rec.type.toUpperCase()}</div>
                      <div>{rec.action}</div>
                      <div className="text-sm text-gray-700">{rec.value}</div>
                      <div className="text-xs font-medium mt-1">Priority {rec.priority}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-700 text-center py-4">No simulation results yet. Run a scenario to see predictions.</div>
        )}
      </div>
    </div>
  );
};

export default ScenarioSimulator;
