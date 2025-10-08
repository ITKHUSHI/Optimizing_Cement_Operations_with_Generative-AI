import { Orchestrator } from '../agents/agents.js';
import dotenv from 'dotenv';
import bigquery from '../config/bigquery.js';
import { CementPlant } from '../model/cement.model.js';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from 'mongoose';
import { PlantPerformanceHistory } from '../model/plant_performance_history.js';
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET
const registerCementPlant = async (req, res) => {
  try {
    const {
      plantName,
      organizationName,
      organizationEmail,
      password,
      country,
      state,
      city,
      managerName,
      managerEmail,
      managerPhone,
      capacityTPD,
      kilnCount,
      kilnType,
      productionLines,
      primaryFuel,
      alternativeFuels,
      powerCapacityMW,
      tsr,
      co2Baseline,
      energyBaseline,
      rawMaterialQuality,
      constraints,
      yearCommissioned,
    } = req.body;
 
    // Validate required fields
    if (!plantName || !organizationName || !organizationEmail || !password || !country || !state || !city) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    // Check if email already exists
    const existingPlant = await CementPlant.findOne({ organizationEmail });
    if (existingPlant) {
      return res.status(400).json({ error: "Organization email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare data
    const plantData = {
      plantName,
      organizationName,
      organizationEmail,
      password: hashedPassword,
      location: {
        country:  country,
        state:  state,
        city:  city,
      },
      manager: {
        name: managerName,
        email: managerEmail,
        phone: managerPhone,
      },
      capacityTPD: Number(capacityTPD) || 0,
      kilnCount: Number(kilnCount) || 0,
      kilnType,
      productionLines: Number(productionLines) || 0,
      primaryFuel,
      alternativeFuels: Array.isArray(alternativeFuels) ? alternativeFuels : [],
      powerCapacityMW: Number(powerCapacityMW) || 0,
      tsr: Number(tsr) || 0,
      co2Baseline: Number(co2Baseline) || 0,
      energyBaseline: Number(energyBaseline) || 0,
      rawMaterialQuality: {
        limestoneGrade: Number(rawMaterialQuality?.limestoneGrade) || 0,
      },
      constraints,
      yearCommissioned: Number(yearCommissioned) || 0,
      
    };

    // Save to DB
    const newPlant = await CementPlant.create(plantData);

    // Create JWT and set cookie
    const token = jwt.sign({ id: newPlant._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

    return res.status(201).json({ message: "Cement Plant registered successfully", plant: newPlant });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

 const loginCementPlant = async (req, res) => {
  try {
    const { password,identifier } = req.body; // identifier = org email OR _id
    if (!identifier || !password) {
      return res.status(400).json({ message: "Identifier and password are required" });
    }


    const   plant = await CementPlant.findOne({
       $or: [
         { _id: identifier },
         { organizationEmail: identifier }
       ]
     });
 
 
    if (!plant) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, plant.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { _id: plant._id, organizationEmail: plant.organizationEmail },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send token in HTTP-only cookie
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(200)
      .json({
        message: "Login successful",
        plant: {
          _id: plant._id,
          plantName: plant.plantName,
          organizationName: plant.organizationName,
          organizationEmail: plant.organizationEmail,
        },
      });
  } catch (err) {
    res.status(500).json({ message: "Server error" ,err:err.message});
  }
}; 

const logoutCementPlant = (req, res) => {
  try {
    // Clear the JWT cookie
    res
      .clearCookie("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(0), // Set expiration in the past
      })
      .status(200)
      .json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
const getCementPlantData = async (req, res) => {
  try {
    const plant_id = req.params.plant_id; // from auth middleware
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(plant_id)) {
      return res.status(400).json({ message: "Invalid plant ID" });
    }

    // Fetch plant excluding password
    const plant = await CementPlant.findById(plant_id).select("-password");

    if (!plant) {
      return res.status(404).json({ message: "Cement plant not found" });
    }

    res.status(200).json({ plant });
  } catch (err) {
    res.status(500).json({ message: "Server error",err:err.message });
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
   return res.status(200).json(await Orchestrator(inputData));
  } catch (error) {
    return res.status(500).json({ error: 'Prediction workflow failed', details: error.message });
  }
}

const addRecords = async (req, res) => {
  try {
    const { records } = req.body;
    const { plant_id } = req.params;

    if (!plant_id) {
      return res.status(400).json({ error: "plantId is required" });
    }

    if (!records || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ error: "Records array is required" });
    }

    // Add plant_id to each record
    const recordsWithPlantId = records.map((record) => ({
      ...record,
      plant_id: plant_id,
      timestamp: record.timestamp ? new Date(record.timestamp) : new Date(),
    }));

    // Insert into MongoDB
    await PlantPerformanceHistory.insertMany(recordsWithPlantId);

    return res
      .status(200)
      .json({ message: "Records added successfully", count: records.length });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to insert records into MongoDB" });
  }
};

const getHistoricalData = async (req, res) => {
  try {
    const plant_id = req.params.plant_id.toString(); // from auth middleware
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(plant_id)) {
        return res.status(400).json({ message: "Invalid plant ID" });
      }

    if (!plant_id) {
      return res.status(400).json({ error: "plantId is required" });
    }

    // Check if plant exists
    const plantExists = await PlantPerformanceHistory.findById(plant_id );
    if (!plantExists) {
      return res.status(200).json({ historicalData: []});
    }

    const currentYear = new Date().getFullYear();
    const fiveYearsAgo = currentYear - 4;

    // MongoDB aggregation pipeline
    const pipeline = [
      { $match: { plant_id: plant_id } },

      // Add year and month fields
      {
        $addFields: {
          year: { $year: "$timestamp" },
          month: { $month: "$timestamp" },
        },
      },

      // Filter for last 5 years
      { $match: { year: { $gte: fiveYearsAgo } } },

      // Group by year and month for monthly averages
      {
        $group: {
          _id: { year: "$year", month: "$month" },
          clinker_production_avg: { $avg: "$clinker_production_tpd" },
          cement_production_avg: { $avg: "$cement_production_tpd" },
          kiln_temp_avg: { $avg: "$kiln_temperature_c" },
          alt_fuel_avg: { $avg: "$alt_fuel_pct" },
          energy_avg: { $avg: "$energy_consumption_kwh" },
          co2_avg: { $avg: "$co2_emissions_tons" },
          most_common_fuel: { $first: "$fuel_type" }, // approximate most common
        },
      },

      // Sort by year and month
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ];

    const results = await PlantPerformanceHistory.aggregate(pipeline);

    // Format data for charts
    const labels = results.map((r) =>
      r._id.month ? `${r._id.year}-${r._id.month}` : `${r._id.year}`
    );
    const clinkerProduction = results.map((r) => r.clinker_production_avg);
    const cementProduction = results.map((r) => r.cement_production_avg);
    const kilnTemp = results.map((r) => r.kiln_temp_avg);
    const altFuel = results.map((r) => r.alt_fuel_avg);
    const energyConsumption = results.map((r) => r.energy_avg);
    const co2Emissions = results.map((r) => r.co2_avg);
    const fuel_type = results.map((r) => r.most_common_fuel);

    return res.status(200).json({
      labels,
      clinkerProduction,
      cementProduction,
      kilnTemp,
      altFuel,
      energyConsumption,
      co2Emissions,
      fuel_type,
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch dashboard data" , err:err.message});
  }
};




export {
  registerCementPlant,
   getPrediction ,
   getCementPlantData,
   loginCementPlant,
   addRecords,
   getHistoricalData,
   logoutCementPlant
  };
