import React, { useState } from "react";
import Papa from "papaparse";

const CsvUpload = ({ onSubmit ,isLoading}) => {
  const [csvData, setCsvData] = useState([]);
  const [showSample, setShowSample] = useState(false);
  const [sampleData, setSampleData] = useState([]);
  

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        // Map CSV headers to BigQuery schema if necessary
        const normalized = result.data.map(r => ({
          plant_name:r.plant_name || "",
          timestamp: r.timestamp || r.date || "",
           clinker_production_tpd: r.clinkerProduction || r.clinker_production_tpd || "",
           cement_production_tpd: r.cementProduction || r.cement_production_tpd || "",
          kiln_temperature_c: r.kilnTemp || r.kiln_temperature_c || "",
          alt_fuel_pct: r.altFuel || r.alt_fuel_pct || "",
          energy_consumption_kwh: r.energy || r.energy_consumption_kwh || "",
          co2_emissions_tons: r.co2 || r.co2_emissions_tons || "",
          fuel_type: r.fuelType || r.fuel_type || "",
          raw_material_limestone_tpd: r.limestone || r.raw_material_limestone_tpd || "",
          raw_material_clay_tpd: r.clay || r.raw_material_clay_tpd || "",
          raw_material_gypsum_tpd: r.gypsum || r.raw_material_gypsum_tpd || "",
          electricity_cost_usd: r.electricityCost || r.electricity_cost_usd || "",
          maintenance_downtime_hr: r.maintenanceDowntime || r.maintenance_downtime_hr || "",
        }));
        setCsvData(normalized);
      },
    });
  };

  const handleSeeSample = async () => {
    const res = await fetch("/sample.csv");
    const text = await res.text();
    const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
    setSampleData(parsed.data);
    setShowSample(true);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">CSV Upload</h2>

      <p className="mb-2 text-sm">
        <button
          className="text-blue-600 underline mr-4"
          onClick={handleSeeSample}
        >
          See Sample CSV
        </button>
        <a
          href="/sample.csv"
          download
          className="text-green-600 underline"
        >
          Download Sample CSV
        </a>
      </p>

      <input type="file" accept=".csv" className="mb-4 border text-center bg-amber-50 p-2" onChange={handleFileUpload} />

      {csvData.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Preview (first 5 rows):</h4>
          <table className="border-collapse border w-full text-center">
            <thead className="bg-gray-200">
              <tr>
                {Object.keys(csvData[0]).map((key) => (
                  <th key={key} className="border p-1">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {csvData.slice(0, 5).map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((val, i) => (
                    <td key={i} className="border p-1">{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <button
            className="bg-blue-500 text-white px-4 py-1 rounded mt-2 hover:bg-blue-600"
            onClick={() => onSubmit(csvData)}
          >
            {isLoading? "file uploading":"submit CSV File"} 
          </button>
        </div>
      )}

      {/* Modal for sample CSV */}
      {showSample && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50">
          <div className="bg-white p-4 rounded shadow-lg max-w-3xl w-full max-h-[80vh] overflow-auto">
            <h3 className="text-lg font-bold mb-2">Sample CSV</h3>
            <table className="border-collapse border w-full text-center">
              <thead className="bg-gray-200">
                <tr>
                  {Object.keys(sampleData[0] || {}).map((key) => (
                    <th key={key} className="border p-1">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sampleData.map((row, idx) => (
                  <tr key={idx}>
                    {Object.values(row).map((val, i) => (
                      <td key={i} className="border p-1">{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              className="mt-2 bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
              onClick={() => setShowSample(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CsvUpload;
