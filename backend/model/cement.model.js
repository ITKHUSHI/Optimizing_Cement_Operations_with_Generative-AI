import mongoose ,{Schema} from 'mongoose';

const cementPlantSchema = new Schema({
	plantName: {
      type: String,
      required: true,
      trim: true,
    },
    plantCode: {
      type: String,
      unique: true,
      default: () => `PLANT-${Date.now()}`, // auto-generate if not given
    },
    location: {
  country: {
    name: { type: String, required: true }
  },
  state: {
    name: { type: String }
  },
  city: {
    name: { type: String }
  }
}
,
    password:{
		type:String, 
		required:true
	},
    // 🔹 Ownership / Contact
    organizationName: {
      type: String,
      required: true,
    },
	organizationEmail: {
		type: String,
		required: true
	},
    manager: {
      name: { type: String },
      email: { type: String, lowercase: true },
      phone: { type: String },
    },

    // 🔹 Operational Details
    capacityTPD: { type: Number }, // Tons per day
    kilnCount: { type: Number },
    kilnType: { type: String, enum: ["dry", "wet", "preheater", "precalciner"], default: "dry" },
    grindingUnits: [
      {
        capacityTPD: Number,
        description: String,
      },
    ],
    productionLines: { type: Number },
    primaryFuel: {
      type: String,
      enum: ["coal", "petcoke", "natural_gas", "alt_fuels", "other"],
    },
    alternativeFuels: [
      {
        type: String,
        enum: ["rdf", "biomass", "tires", "hydrogen", "other"],
      },
    ],

    // 🔹 Energy & Environment
    powerCapacityMW: { type: Number },
    tsr: { type: Number, min: 0, max: 100 }, // Thermal Substitution Rate %
    co2Baseline: { type: Number }, // kg/ton clinker
    energyBaseline: { type: Number }, // kWh/ton cement

    // 🔹 Extra
    rawMaterialQuality: {
      limestoneGrade: Number, // % CaCO3
    },
    constraints: { type: String }, // regulatory/operational
    yearCommissioned: { type: Number },
  },
  { timestamps: true }
);

export const CementPlant = mongoose.model('CementPlant', cementPlantSchema);

