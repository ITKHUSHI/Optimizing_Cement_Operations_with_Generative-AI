// models/PlantPerformanceHistory.js
import mongoose from "mongoose";

const plantPerformanceHistorySchema = new mongoose.Schema(
  {
	plant_id: {
	  type: mongoose.Schema.Types.ObjectId,
	  ref: 'CementPlant',
	},
    plant_name: {
      type: String,
      required: true,
      trim: true,
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
    },
    clinker_production_tpd: {
      type: Number,
      default: 0,
    },
    cement_production_tpd: {
      type: Number,
      default: 0,
    },
    kiln_temperature_c: {
      type: Number,
      default: 0,
    },
    alt_fuel_pct: {
      type: Number,
      default: 0,
    },
    energy_consumption_kwh: {
      type: Number,
      default: 0,
    },
    co2_emissions_tons: {
      type: Number,
      default: 0,
    },
    fuel_type: {
      type: String,
      trim: true,
    },
    raw_material_limestone_tpd: {
      type: Number,
      default: 0,
    },
    raw_material_clay_tpd: {
      type: Number,
      default: 0,
    },
    raw_material_gypsum_tpd: {
      type: Number,
      default: 0,
    },
    electricity_cost_usd: {
      type: Number,
      default: 0,
    },
    maintenance_downtime_hr: {
      type: Number,
      default: 0,
    },
    location: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
    collection: "plant_performance_history",
  }
);

export const PlantPerformanceHistory = mongoose.model(
  "PlantPerformanceHistory",
  plantPerformanceHistorySchema
);


