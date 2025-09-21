import React, { useState } from "react";

const ManualUpload = ({ onSubmit , isLoading }) => {
  const [records, setRecords] = useState([
    {
      timestamp: "",
      clinkerProduction: "",
      cementProduction: "",
      kilnTemp: "",
      altFuel: "",
      energy: "",
      co2: "",
      fuelType: "",
      limestone: "",
      clay: "",
      gypsum: "",
      electricityCost: "",
      maintenanceDowntime: "",
    },
  ]);

  const handleChange = (index, field, value) => {
    const newRecords = [...records];
    newRecords[index][field] = value;
    setRecords(newRecords);
  };

  const addRecord = () => {
    setRecords([
      ...records,
      {
        timestamp: "",
        clinkerProduction: "",
        cementProduction: "",
        kilnTemp: "",
        altFuel: "",
        energy: "",
        co2: "",
        fuelType: "",
        limestone: "",
        clay: "",
        gypsum: "",
        electricityCost: "",
        maintenanceDowntime: "",
      },
    ]);
  };

  const removeRecord = (index) => {
    setRecords(records.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Manual Entry</h2>
      {records.map((record, index) => (
        <div key={index} className="flex flex-wrap gap-2 mb-2 items-center border-b pb-2">
          <div className="flex flex-col">
            <label>Date</label>
            <input
              type="date"
              className="border rounded p-1 w-36"
              value={record.timestamp}
              onChange={(e) => handleChange(index, "timestamp", e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label>Clinker Production (TPD)</label>
            <input
              type="number"
              className="border rounded p-1 w-36"
              value={record.clinkerProduction}
              onChange={(e) => handleChange(index, "clinkerProduction", e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label>Cement Production (TPD)</label>
            <input
              type="number"
              className="border rounded p-1 w-36"
              value={record.cementProduction}
              onChange={(e) => handleChange(index, "cementProduction", e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label>Kiln Temperature (°C)</label>
            <input
              type="number"
              className="border rounded p-1 w-32"
              value={record.kilnTemp}
              onChange={(e) => handleChange(index, "kilnTemp", e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label>Alternative Fuel (%)</label>
            <input
              type="number"
              className="border rounded p-1 w-32"
              value={record.altFuel}
              onChange={(e) => handleChange(index, "altFuel", e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label>Energy Consumption (kWh)</label>
            <input
              type="number"
              className="border rounded p-1 w-32"
              value={record.energy}
              onChange={(e) => handleChange(index, "energy", e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label>CO₂ Emissions (Tons)</label>
            <input
              type="number"
              className="border rounded p-1 w-32"
              value={record.co2}
              onChange={(e) => handleChange(index, "co2", e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label>Fuel Type</label>
            <input
              type="text"
              className="border rounded p-1 w-32"
              value={record.fuelType}
              onChange={(e) => handleChange(index, "fuelType", e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label>Limestone (TPD)</label>
            <input
              type="number"
              className="border rounded p-1 w-32"
              value={record.limestone}
              onChange={(e) => handleChange(index, "limestone", e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label>Clay (TPD)</label>
            <input
              type="number"
              className="border rounded p-1 w-32"
              value={record.clay}
              onChange={(e) => handleChange(index, "clay", e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label>Gypsum (TPD)</label>
            <input
              type="number"
              className="border rounded p-1 w-32"
              value={record.gypsum}
              onChange={(e) => handleChange(index, "gypsum", e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label>Electricity Cost (USD)</label>
            <input
              type="number"
              className="border rounded p-1 w-32"
              value={record.electricityCost}
              onChange={(e) => handleChange(index, "electricityCost", e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label>Maintenance Downtime (hr)</label>
            <input
              type="number"
              className="border rounded p-1 w-32"
              value={record.maintenanceDowntime}
              onChange={(e) => handleChange(index, "maintenanceDowntime", e.target.value)}
            />
          </div>

          <button
            className="text-red-500 hover:text-red-700 mt-5"
            onClick={() => removeRecord(index)}
          >
            ✕
          </button>
        </div>
      ))}

      <div className="flex gap-2 mt-2">
        <button
          className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
          onClick={addRecord}
        >
          + Add Row
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
          onClick={() => onSubmit(records)}
        >
          {isLoading?"data loading":"submit"}
        </button>
      </div>
    </div>
  );
};

export default ManualUpload;
