import { getForecast,getRecommendations,calculatePredictedCO2 } from './ai.controller.js';
import dotenv from 'dotenv';
import bigquery from '../config/bigquery.js';
dotenv.config();


const registerCementPlant=async(req,res)=>{
  try{
    const {plant_name,location,capacity_tpd,password}=req.body
    if(!password|| !plant_name || !location || !capacity_tpd){
       return res.status(400).json({ error: 'All fields are required: plant_id, plant_name, location, capacity_tpd' })
    }
    const hashPassword=password.split('').reverse().join('') + 'hashed'; 
    const id=Math.random()*123+12;
    const newPlant={
      plant_id:parseInt(id),
      plant_name,
      location,
      capacity_tpd: parseFloat(capacity_tpd),
      password:hashPassword,
      created_at: new Date().toISOString() 

    }
    await bigquery.dataset("cement_data").table("cement_plants").insert(newPlant);
    delete newPlant.password;

    res.status(201).json({ message: 'Cement plant registered successfully', plant: newPlant});
  }
  catch(error){
    res.status(500).json({ error: 'Failed to register cement plant', details: error });
  }
}
const loginCementPlant=async(req,res)=>{
  try {
    const{plant_id,password}=req.body;
    if(!plant_id || !password){
      return res.status(400).json({ error: 'Both plant_id and password are required' });
    }
    const hashPassword=password.split('').reverse().join('') + 'hashed';
    const query=`SELECT * FROM \`${process.env.GCP_PROJECT_ID}.cement_data.cement_plants\` WHERE plant_id=${parseInt(plant_id)} AND password='${hashPassword}' LIMIT 1`;
    const [cementPlant]=await bigquery.query({query})
    if(cementPlant.length===0){
      return res.status(401).json({ error: 'Cement plant not found' });
    }
    delete cementPlant[0].password;
    return res.status(200).json({ message: 'Login successful', plant: cementPlant[0] });
  } catch (error) {
    return res.status(500).json({ error: 'Login failed', details: error.message });
  }
}
const getCementPlants = async (req, res) => {
  try {

    const plant_id = req.params.plant_id;
    console.log(plant_id ,"plantid")

    if (!plant_id) {
      return res.status(400).json({ error: "plant_id is required" });
    }

    const query = `
      SELECT * FROM \`${process.env.GCP_PROJECT_ID}.cement_data.cement_plants\`
      WHERE plant_id = ${plant_id}
      LIMIT 1
    `;

    const options = {
      query: query,
      params: { plant_id },
    };

    const [rows] = await bigquery.query(options);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Cement plant not found" });
    }

    const cementPlant = rows[0];
    return res.status(200).json({ cementPlant });

  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch cement plant data", details: error.message });
  }
};

const  getPrediction=async(req, res)=> {
  try {
    const inputData = req.body;
    const requiredFields = [
      'plant_id', 'plant_name', 'clinker_production_tpd', 'cement_production_tpd',
      'kiln_temperature_c', 'alt_fuel_pct', 'raw_material_limestone_tpd',
      'raw_material_clay_tpd', 'raw_material_gypsum_tpd',
      'electricity_cost_usd', 'maintenance_downtime_hr', 'fuel_type'
    ];

    for (const field of requiredFields) {
      if (!(field in inputData)) {
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }

    const numericFields = [
     'raw_material_limestone_tpd', 'raw_material_clay_tpd', 'raw_material_gypsum_tpd',
      'electricity_cost_usd', 'maintenance_downtime_hr'
    ];
    numericFields.forEach(field => {
      inputData[field] = parseFloat(inputData[field]);
      if (isNaN(inputData[field])) {
        return res.status(400).json(`Invalid numeric value for field: ${field}`);
      }
    });

    const now = new Date();
    inputData.timestamp = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')} ${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}:${String(now.getUTCSeconds()).padStart(2, '0')}+0000`;

    const predictedEnergy = await getForecast([inputData]);

    const predictedCO2 = calculatePredictedCO2(predictedEnergy, inputData.fuel_type, inputData.alt_fuel_pct);

    const recommendations = await getRecommendations(predictedEnergy, inputData);

   return res.status(200).json({
      predictedEnergy,
      predictedCO2,
      recommendations
    });
  } catch (error) {
    return res.status(500).json({ error: 'Prediction workflow failed', details: error.message });
  }
}

const normalizeRecords = (records, plantId) => {
  return records.map((r) => ({
      plant_id: parseInt(plantId),                // INTEGER
      plant_name: r.plant_name ||null,           // STRING
      timestamp: new Date(r.timestamp).toISOString(), // TIMESTAMP
      clinker_production_tpd: r. clinker_production_tpd ? parseInt(r. clinker_production_tpd) : null,
      cement_production_tpd: r.cement_production_tpd ? parseInt(r.cement_production_tpd) : null,
      energy_consumption_kwh: r. energy_consumption_kwh ? parseInt(r. energy_consumption_kwh) : null,
      fuel_type: r.fuel_type || null,
      alt_fuel_pct: r.alt_fuel_pct ? parseInt(r.alt_fuel_pct) : null,
      co2_emissions_tons: r.co2_emissions_tons ? parseFloat(r.co2_emissions_tons) : null,
      kiln_temperature_c: r.kiln_temperature_c ? parseInt(r.kiln_temperature_c) : null,
      raw_material_limestone_tpd: r.raw_material_limestone_tpd ? parseFloat(r.raw_material_limestone_tpd) : null,
      raw_material_clay_tpd: r.raw_material_clay_tpd ? parseFloat(r.raw_material_clay_tpd) : null,
      raw_material_gypsum_tpd: r.raw_material_gypsum_tpd ? parseFloat(r.raw_material_gypsum_tpd) : null,
      electricity_cost_usd: r.electricity_cost_usd ? parseFloat(r.electricity_cost_usd) : null,
      maintenance_downtime_hr: r.maintenance_downtime_hr ? parseFloat(r.maintenance_downtime_hr) : null,  }));
};

const addRecords = async (req, res) => { 
  try {
    const { records } = req.body;
    const plant_id = req.params.plant_id;
    console.log(records);

    if (!plant_id) {
      return res.status(400).json({ error: "plantId is required" });
    }

    if (!records || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ error: "Records array is required" });
    }

    // Required fields
   
    const normalize= normalizeRecords(records,plant_id)
      console.log(normalize)
    // Insert into BigQuery
    await bigquery.dataset("cement_data").table("plant_performance").insert(normalize);

    return res.status(200).json({ message: "Records added successfully", count: normalize.length });
  } catch (err) {
    console.error("BigQuery Insert Error:", err);
    return res.status(500).json({ error: "Failed to insert records into BigQuery" });
  }
};


const getDashboardData = async (req, res) => {
  try {
    const {plant_id }=req.params;

    if (!plant_id) return res.status(400).json({ error: "plantId is required" });

    // Check if plant exists
    const checkQuery = `
      SELECT COUNT(*) AS count
      FROM \`${process.env.GCP_PROJECT_ID}.cement_data.plant_performance\`
      WHERE plant_id = ${plant_id}
    `;

    const [checkResult] = await bigquery.query({
      query: checkQuery,
       plant_id: plant_id ,
    });

    if (checkResult[0].count === 0) {
      return res.status(404).json({ error: "Plant ID not found" });
    }

    // Query for current year monthly + previous 4 years yearly averages




const query = `
WITH years_count AS (
  SELECT
    COUNT(DISTINCT EXTRACT(YEAR FROM timestamp)) AS total_years
  FROM \ ${process.env.GCP_PROJECT_ID}.cement_data.plant_performance\
  WHERE plant_id = ${plant_id}
),

-- Year-wise averages (last 5 years)
yearly_avg AS (
  SELECT
    EXTRACT(YEAR FROM timestamp) AS year,
    NULL AS month,
    AVG(clinker_production_tpd) AS clinker_production_avg,
    AVG(cement_production_tpd) AS cement_production_avg,
    AVG(kiln_temperature_c) AS kiln_temp_avg,
    AVG(alt_fuel_pct) AS alt_fuel_avg,
    AVG(energy_consumption_kwh) AS energy_avg,
    AVG(co2_emissions_tons) AS co2_avg,
    ANY_VALUE(fuel_type) AS most_common_fuel
  FROM \ ${process.env.GCP_PROJECT_ID}.cement_data.plant_performance\
  WHERE plant_id = ${plant_id}
    AND EXTRACT(YEAR FROM timestamp) >= EXTRACT(YEAR FROM CURRENT_DATE()) - 4
  GROUP BY year
  ORDER BY year ASC
  limit 5
),

-- Month-wise averages for the current year
monthly_avg AS (
  SELECT
    EXTRACT(YEAR FROM timestamp) AS year,
    EXTRACT(MONTH FROM timestamp) AS month,
    AVG(clinker_production_tpd) AS clinker_production_avg,
    AVG(cement_production_tpd) AS cement_production_avg,
    AVG(kiln_temperature_c) AS kiln_temp_avg,
    AVG(alt_fuel_pct) AS alt_fuel_avg,
    AVG(energy_consumption_kwh) AS energy_avg,
    AVG(co2_emissions_tons) AS co2_avg,
    ANY_VALUE(fuel_type) AS most_common_fuel
  FROM \ ${process.env.GCP_PROJECT_ID}.cement_data.plant_performance\
  WHERE plant_id = ${plant_id}
    AND EXTRACT(YEAR FROM timestamp) = EXTRACT(YEAR FROM CURRENT_DATE())
  GROUP BY year, month
  ORDER BY month ASC
)

SELECT * 
FROM monthly_avg
WHERE (SELECT total_years FROM years_count) = 1
UNION ALL
SELECT * 
FROM yearly_avg
WHERE (SELECT total_years FROM years_count) > 1
ORDER BY year ASC, month ASC;
`;




    const [rows] = await bigquery.query({
      query,
      plant_id ,
    });
    // Format for charts
   return res.status(200).json({
      labels: rows.map(r => r.month ? `${r.year}-${r.month}` : `${r.year}`), // x-axis
      clinkerProduction: rows.map(r => r.clinker_production_avg),
      cementProduction: rows.map(r => r.cement_production_avg),
      kilnTemp: rows.map(r => r.kiln_temp_avg),
      altFuel: rows.map(r => r.alt_fuel_avg),
      energyConsumption: rows.map(r => r.energy_avg),
      co2Emissions: rows.map(r => r.co2_avg),
       fuel_type: rows.map(r => r.most_common_fuel),
    });

  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};



export {registerCementPlant,
   getPrediction ,
   getCementPlants,
   loginCementPlant,
   addRecords,
   getDashboardData
  };
