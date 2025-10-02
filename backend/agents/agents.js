import { getForecast,getRecommendations,calculatePredictedCO2 } from "../controllers/ai.controller.js";

const agents = {
  forecaster: async (input) => await getForecast([input]),
  co2: async (predictedEnergy, input) => calculatePredictedCO2(predictedEnergy, input.fuel_type, input.alt_fuel_pct),
  recommender: async (predictedEnergy, input) => await getRecommendations(predictedEnergy, input),
  fuelOptimizer: async (input) => {
    if (input.alt_fuel_pct > 50) {
      return [
        {
          action: "Adjust fuel mix",
          reason: "Alt fuel > 50%, reduce coal by 10%",
          expectedImpact: "Reduce CO2 and energy use"
        }
      ];
    }
    return [];
  }
};

// 🔹 Planner Agent
const Planner = async (input) => {
  const steps = [];
  steps.push({ step: "forecastEnergy", agent: "forecaster" });
  if (!input.fuel_type.toLowerCase().includes("hydrogen")) steps.push({ step: "calculateCO2", agent: "co2" });
  if (input.alt_fuel_pct > 50) steps.push({ step: "fuelOptimization", agent: "fuelOptimizer" });
  steps.push({ step: "generateRecommendations", agent: "recommender" });
  return steps;
};

// 🔹 Critic Agent
const Critic = async (results) => {
  if (!results.predictedEnergy || isNaN(results.predictedEnergy)) throw new Error("Invalid energy prediction");
  if (results.predictedCO2 !== undefined && isNaN(results.predictedCO2)) throw new Error("Invalid CO₂ prediction");
  if (!Array.isArray(results.recommendations)) throw new Error("Invalid recommendations format");
  return results;
};

// 🔹 Orchestrator
const Orchestrator = async (inputData) => {
  const plan = await Planner(inputData);
  let context = { input: inputData };

  for (const task of plan) {
    if (task.agent === "forecaster") context.predictedEnergy = await agents.forecaster(context.input);
    if (task.agent === "co2") context.predictedCO2 = await agents.co2(context.predictedEnergy, context.input);
    if (task.agent === "fuelOptimizer") context.fuelRecommendations = await agents.fuelOptimizer(context.input);
    if (task.agent === "recommender") context.recommendations = await agents.recommender(context.predictedEnergy, context.input);
  }

  return await Critic(context);
};

export {
	Orchestrator
}