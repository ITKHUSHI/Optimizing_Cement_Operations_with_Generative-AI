// import { PredictionServiceClient } from '@google-cloud/aiplatform';
// import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

// const forecastClient = new PredictionServiceClient({
//   keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
//   apiEndpoint: 'us-central1-aiplatform.googleapis.com',
// });
// const endpointPath = process.env.GCP_API_ENDPOINT;
// const ai = new GoogleGenAI({
//   vertexai: true,
//   project: process.env.GCP_PROJECT_ID,
//   location: process.env.GCP_LOCATION || 'us-central1',
// });



// Helper to mock Protobuf-like structure
function createProtobufValue(value) {
  return typeof value === 'number'
    ? { numberValue: value }
    : { stringValue: String(value) };
}

// Static CO2 prediction based on simple rules
function predictCO2WithRandom(instance) {
  const energy = Number(instance.energy_consumption_kwh) || 1000; // fallback default
  let emissionFactor = 0.0009; // default coal baseline

  if (instance.fuelType?.toLowerCase().includes("hydrogen")) {
    emissionFactor = 0.0002;
  } else if (instance.fuelType?.toLowerCase().includes("alternative")) {
    emissionFactor = 0.0006;
  }

  const altFuelPct = Number(instance.altFuelPct) || 0;
  const reductionFactor = 1 - altFuelPct * 0.004;

  const randomFactor = 1 + (Math.random() * 0.1 - 0.05);

  return parseFloat((energy * emissionFactor * reductionFactor * randomFactor).toFixed(3));
}

// Static forecast function
async function getForecast(instances) {
  return instances.map(instance => {
    const predictedCO2 = predictCO2WithRandom(instance);

    const enrichedInstance = {
      ...instance,
      co2_emissions_tons: predictedCO2,
      predictedEnergy_kwh: Number(instance.clinker_production_tpd || 1000) * 3 +
                           Number(instance.cement_production_tpd || 800) * 2
    };

    return {
      structValue: {
        fields: Object.fromEntries(
          Object.entries(enrichedInstance).map(([key, value]) => [key, createProtobufValue(value)])
        )
      }
    };
  });
}

// Static recommendations (mock)
async function getRecommendations(predictedEnergy, plantData) {
  return [
    {
      action: "Reduce Kiln Temperature",
      reason: "High kiln temperature increases energy consumption.",
      expected_impact: "Energy savings ~5-10%"
    },
    {
      action: "Increase Alternative Fuel Usage",
      reason: "Using alternative fuels reduces CO₂ emissions.",
      expected_impact: "CO₂ reduction ~8-12%"
    },
    {
      action: "Optimize Grinding Units",
      reason: "Efficient grinding reduces electricity usage.",
      expected_impact: "Electricity savings ~7%"
    }
  ];
}

// Static CO2 calculation
function calculatePredictedCO2(predictedEnergy, fuelType, altFuelPct) {
  const baseEmissionFactor = 0.85;
  const altFuelReductionFactor = (altFuelPct || 0) * 0.005;
  const fuelTypeFactor = fuelType?.toLowerCase().includes('hydrogen') ? 0.1 : 1;

  return parseFloat((predictedEnergy * baseEmissionFactor * fuelTypeFactor * (1 - altFuelReductionFactor)).toFixed(2));
}

// Static optimization results
async function getOptimizationResults(req, res) {
  try {
    const { baseInput, scenarios } = req.body;
    const allResult = [];

    for (const scenario of scenarios) {
      const input = { ...baseInput, ...scenario };
      const predictedEnergy = Number(input.clinker_production_tpd || 1000) * 3 +
                              Number(input.cement_production_tpd || 800) * 2;

      const predictedCO2 = calculatePredictedCO2(predictedEnergy, input.fuel_type, input.alt_fuel_pct);

      const recommendations = await getRecommendations(predictedEnergy, input);

      allResult.push({
        energyConsumption: predictedEnergy,
        co2Emission: predictedCO2,
        recommendations
      });
    }

    return res.status(200).json(allResult);
  } catch (error) {
    return res.status(500).json({ error: "Optimization workflow failed", details: error.message });
  }
}

// Static cement optimization based on chart data
const getCementOptimizationBasedOnData = async (req, res) => {
  try {
    const { plant_id } = req.params;
    const chartData = req.body.chartDataArray;

    if (!plant_id) return res.status(400).json({ error: "plantId is required" });
    if (!chartData || !Array.isArray(chartData) || chartData.length === 0) {
      return res.status(400).json({ error: "chartDataArray is required and cannot be empty" });
    }

    // Static recommendations for prototype
    const recommendations = chartData.map((_, idx) => `Recommendation ${idx + 1}: Optimize process parameter X`);

    return res.status(200).json({
      chartData,
      recommendations
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch cement optimization data", err });
  }
};

export { getForecast, getRecommendations, calculatePredictedCO2, getOptimizationResults, getCementOptimizationBasedOnData };
