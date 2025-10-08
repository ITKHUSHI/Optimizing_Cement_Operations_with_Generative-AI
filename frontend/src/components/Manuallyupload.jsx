import React, { useState } from "react";

const ManualUpload = ({ onSubmit , isLoading }) => {
  const [records, setRecords] = useState([
    {
        plant_name:"",
        timestamp: "",
        clinker_production_tpd: "",
        cement_production_tpd: "",
        kiln_temperature_c: "",
        alt_fuel_pct: "",
        energy_consumption_kwh: "",
        co2_emissions_tons: "",
        fuel_type: "",
        raw_material_limestone_tpd: "",
        raw_material_clay_tpd: "",
        raw_material_gypsum_tpd: "",
        electricity_cost_usd: "",
        maintenance_downtime_hr: "",
        location:"",
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
        plant_name:"",
        timestamp: "",
        clinker_production_tpd: "",
        cement_production_tpd: "",
        kiln_temperature_c: "",
        alt_fuel_pct: "",
        energy_consumption_kwh: "",
        co2_emissions_tons: "",
        fuel_type: "",
        raw_material_limestone_tpd: "",
        raw_material_clay_tpd: "",
        raw_material_gypsum_tpd: "",
        electricity_cost_usd: "",
        maintenance_downtime_hr: "",
        location:"",
      },
    ]);
  };

  const removeRecord = (index) => {
    setRecords(records.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-center text-blue-500">Manual Entry</h2>
      {records.map((record, index) => (
        <div key={index} className="flex flex-wrap gap-2 mb-2 items-center border-b pb-2">
          <div className="flex flex-col">
            <label>plant name</label>
            <input
              type="text"
              className="border rounded p-1 w-36"
              value={record.plant_name}
              onChange={(e) => handleChange(index, "plant_name", e.target.value)}
            />
          </div>
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
              value={record.clinker_production_tpd}
              onChange={(e) => handleChange(index, "clinker_production_tpd", e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label>Cement Production (TPD)</label>
            <input
              type="number"
              className="border rounded p-1 w-36"
              value={record.cement_production_tpd}
              onChange={(e) => handleChange(index, "cement_production_tpd", e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label>Kiln Temperature (°C)</label>
            <input
              type="number"
              className="border rounded p-1 w-32"
              value={record.kiln_temperature_c}
              onChange={(e) => handleChange(index, "kiln_temperature_c", e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label>Alternative Fuel (%)</label>
            <input
              type="number"
              className="border rounded p-1 w-32"
              value={record.alt_fuel_pct}
              onChange={(e) => handleChange(index, "alt_fuel_pct", e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label>Energy Consumption (kWh)</label>
            <input
              type="number"
              className="border rounded p-1 w-32"
              value={record.energy_consumption_kwh}
              onChange={(e) => handleChange(index, "energy_consumption_kwh", e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label>CO₂ Emissions (Tons)</label>
            <input
              type="number"
              className="border rounded p-1 w-32"
              value={record.co2_emissions_tons}
              onChange={(e) => handleChange(index, "co2_emissions_tons", e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label>Fuel Type</label>
            <input
              type="text"
              className="border rounded p-1 w-32"
              value={record.fuel_type}
              onChange={(e) => handleChange(index, "fuel_type", e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label>Limestone (TPD)</label>
            <input
              type="number"
              className="border rounded p-1 w-32"
              value={record.raw_material_limestone_tpd}
              onChange={(e) => handleChange(index, "raw_material_limestone_tpd", e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label>Clay (TPD)</label>
            <input
              type="number"
              className="border rounded p-1 w-32"
              value={record.raw_material_clay_tpd}
              onChange={(e) => handleChange(index, "raw_material_clay_tpd", e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label>Gypsum (TPD)</label>
            <input
              type="number"
              className="border rounded p-1 w-32"
              value={record.raw_material_gypsum_tpd}
              onChange={(e) => handleChange(index, "raw_material_gypsum_tpd", e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label>Electricity Cost (USD)</label>
            <input
              type="number"
              className="border rounded p-1 w-32"
              value={record.electricity_cost_usd}
              onChange={(e) => handleChange(index, "electricity_cost_usd", e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label>Maintenance Downtime (hr)</label>
            <input
              type="number"
              className="border rounded p-1 w-32"
              value={record.maintenance_downtime_hr}
              onChange={(e) => handleChange(index, "maintenance_downtime_hr", e.target.value)}
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
          {isLoading ? "data loading":"submit"}
        </button>
      </div>
    </div>
  );
};

export default ManualUpload;
