import { PredictionServiceClient } from '@google-cloud/aiplatform';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const forecastClient = new PredictionServiceClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  apiEndpoint: 'us-central1-aiplatform.googleapis.com',
});
const endpointPath = process.env.GCP_API_ENDPOINT;
const ai = new GoogleGenAI({
  vertexai: true,
  project: process.env.GCP_PROJECT_ID,
  location: process.env.GCP_LOCATION || 'us-central1',
});

function createProtobufValue(value) {
  return typeof value === 'number'
    ? { numberValue: value }
    : { stringValue: String(value) };
}
function predictCO2WithRandom(instance) {
  const energy = Number(instance.energy_consumption_kwh) || 1000; // fallback default

  // 🔹 Emission factors (tons CO2 per kWh approx)
  let emissionFactor = 0.0009; // default coal baseline
  if (instance.fuelType?.toLowerCase().includes("hydrogen")) {
    emissionFactor = 0.0002; // much cleaner
  } else if (instance.fuelType?.toLowerCase().includes("alternative")) {
    emissionFactor = 0.0006; // mid-way cleaner
  }

  // 🔹 Alternative fuel impact
  const altFuelPct = Number(instance.altFuelPct) || 0;
  const reductionFactor = 1 - (altFuelPct * 0.004); // each % reduces 0.4%

  // 🔹 Random variability (±5%)
  const randomFactor = 1 + (Math.random() * 0.1 - 0.05);

  const predictedCO2 = energy * emissionFactor * reductionFactor * randomFactor;

  return parseFloat(predictedCO2.toFixed(3)); // tons
}

async function getForecast(instances) {
  try {
    const formattedInstances = instances.map(instance => {
      const predictedCO2 = predictCO2WithRandom(instance);

      const enrichedInstance = {
        ...instance,
        co2_emissions_tons: predictedCO2, // always number
      };

      return {
        structValue: {
          fields: Object.fromEntries(
            Object.entries(enrichedInstance).map(([key, value]) => {
              return [key, createProtobufValue(value)];
            })
          )
        }
      };
    });

    const request = { endpoint: endpointPath, instances: formattedInstances };

    const [response] = await forecastClient.predict(request);

    const predictedEnergy =
      response.predictions[0].structValue.fields.value.numberValue;


    return predictedEnergy;
  } catch (error) {
    throw new Error("Forecast prediction failed",error);
  }
}



async function getRecommendations(predictedEnergy, plantData) {
  try {
    const prompt = `
You are an expert industrial AI specialized in advanced cement plant optimization.

Predicted Energy Consumption: ${predictedEnergy} kWh
Plant Snapshot: ${JSON.stringify(plantData)}

Based on this, suggest highly actionable optimizations including hybrid fuel strategies, alloy-metal use, reducing SPC, enhancing TSR, and minimizing CO2.

Respond as structured JSON array of objects with:
- action
- reason
- expected impact
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      temperature: 0.2,
      maxOutputTokens: 700,
    });

    const cleanText = response.text
      .replace(/^```json\s*/, '')
      .replace(/\s*```$/, '')
      .trim();

    const parsedResult = JSON.parse(cleanText);

    return parsedResult;
  } catch (error) {
    return res.status(500).json([{ action: 'Error', reason: 'Failed to generate recommendations', expected_impact: '' ,error:error}]);
  }
}


function calculatePredictedCO2(predictedEnergy, fuelType, altFuelPct) {
  // Example formula:
  const baseEmissionFactor = 0.85; // kg CO2 per kWh for fossil fuels
  const altFuelReductionFactor = altFuelPct * 0.005; // Each % of alt fuel reduces CO2 by 0.5%
  const fuelTypeFactor = fuelType.toLowerCase().includes('hydrogen') ? 0.1 : 1; // Hydrogen is cleaner

  const predictedCO2 = predictedEnergy * baseEmissionFactor * fuelTypeFactor * (1 - altFuelReductionFactor);

  return parseFloat(predictedCO2.toFixed(2)); // Return as number rounded to 2 decimals
}
async function getOptimizationResults(req, res) {
  try {
    const inputData = req.body;

    const prompt = `
You are an expert cement plant optimization AI.
Analyze the following plant inputs and predict:
1. Energy consumption (kWh)
2. CO2 emissions (tons)
3. Provide actionable recommendations

Plant Input:
${JSON.stringify(inputData)}

Return output as JSON only:
{
  "energyConsumption": <float>,
  "co2Emission": <float>,
  "recommendations": [
    { "type": "energy", "action": "...", "value": "...", "priority": 1 },
    { "type": "co2", "action": "...", "value": "...", "priority": 2 }
  ]
}
`;

    // ✅ Call Gemini properly
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 500,
      },
    });


    // ✅ Extract text safely
    let rawText = null;
    if (response.candidates?.[0]?.content?.[0]?.parts?.[0]?.text) {
      rawText = response.candidates[0].content[0].parts[0].text;
    } else if (response.candidates?.[0]?.content?.[0]?.text) {
      rawText = response.candidates[0].content[0].text;
    } else if (response.text) {
      rawText = response.text;
    }

    if (!rawText) {
      return res.status(400).json(("AI did not return any text content"));
    }

    // ✅ Clean JSON fences
    const cleanText = rawText
      .replace(/^```json\s*/, "")
      .replace(/```$/, "")
      .trim();
    // ✅ Parse safely
    let parsedResult;
    try {
      parsedResult = JSON.parse(cleanText);
    } catch (err) {
      return res.status(500).json({
        error: "AI output not valid JSON",
        raw: cleanText,
      });
    }

    return res.status(200).json(parsedResult);
  } catch (error) {
    return res.status(500).json({
      error: "Optimization workflow failed",
      details: error.message,
    });
  }
}
const getCementOptimizationBasedOnData = async (req, res) => {
  try {
    const { plant_id } = req.params;
    if (!plant_id) return res.status(400).json({ error: "plantId is required" });

    const chartData = req.body.chartDataArray;
    if (!chartData || !Array.isArray(chartData) || chartData.length === 0) {
      return res.status(400).json({ error: "chartDataArray is required and cannot be empty" });
    }
    const prompt = `
You are an expert cement plant optimization AI. 
Analyze the following plant data (monthly/yearly averages, last 5 years only) and provide actionable recommendations 
to optimize energy consumption, CO₂ emissions, alternative fuel usage, clinker and cement production, and kiln temperature.

Data: ${JSON.stringify(chartData)}

Provide clear, numbered recommendations as plain text. Separate each recommendation with a newline.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 500,
      },
    });

    let rawText = null;
    if (response.candidates?.[0]?.content?.[0]?.parts?.[0]?.text) {
      rawText = response.candidates[0].content[0].parts[0].text;
    } else if (response.candidates?.[0]?.content?.[0]?.text) {
      rawText = response.candidates[0].content[0].text;
    } else if (response.text) {
      rawText = response.text;
    }

    if (!rawText) throw new Error("AI did not return any text content");

    // Split the text into lines for frontend mapping
    const recommendations = rawText
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0);

    return res.status(200).json({
      chartData,
      recommendations,
    });

  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch cement optimization data",err });
  }
};

 


export { getForecast, getRecommendations, calculatePredictedCO2 ,getOptimizationResults,getCementOptimizationBasedOnData}