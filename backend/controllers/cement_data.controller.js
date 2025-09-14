import { PredictionServiceClient } from '@google-cloud/aiplatform';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

console.log('🚀 Cement Optimization Service Initialized');

const forecastClient = new PredictionServiceClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  apiEndpoint: 'us-central1-aiplatform.googleapis.com',
});

const endpointPath = process.env.GCP_API_ENDPOINT;

function createProtobufValue(value) {
  return typeof value === 'number'
    ? { numberValue: value }
    : { stringValue: String(value) };
}

async function getForecast(instances) {
  try {
    const formattedInstances = instances.map(instance => {
      const fields = Object.fromEntries(
        Object.entries(instance).map(([key, value]) => [key, createProtobufValue(value)])
      );
      return { structValue: { fields } };
    });

    const request = { endpoint: endpointPath, instances: formattedInstances };
    console.log('⏳ Sending request to forecast endpoint...');
    
    const [response] = await forecastClient.predict(request);

    const prediction = response.predictions[0].structValue.fields.value.numberValue;
    console.log('✅ Forecast response received:', prediction);

    return prediction;
  } catch (error) {
    console.error('❌ Forecast prediction error:', JSON.stringify(error, null, 2));
    throw new Error('Forecast prediction failed');
  }
}

const ai = new GoogleGenAI({
  vertexai: true,
  project: process.env.GCP_PROJECT_ID,
  location: process.env.GCP_LOCATION || 'us-central1',
});
async function getRecommendations(predictedEnergy, plantData) {
  try {
    console.log('⏳ Generating precise recommendations prompt...');

    const prompt = `
You are an expert industrial AI specialized in cement plant optimization for JK Cement.
Today’s predicted energy consumption is ${predictedEnergy} kWh.
Current plant data snapshot:
- Plant ID: ${plantData.plant_id}
- Plant Name: ${plantData.plant_name}
- Timestamp: ${plantData.timestamp}
- Clinker Production (tpd): ${plantData.clinker_production_tpd}
- Cement Production (tpd): ${plantData.cement_production_tpd}
- Fuel Type: ${plantData.fuel_type}
- Alternative Fuel Percentage: ${plantData.alt_fuel_pct}%
- CO2 Emissions (tons): ${plantData.co2_emissions_tons}
- Kiln Temperature (°C): ${plantData.kiln_temperature_c}
- Raw Material Limestone (tpd): ${plantData.raw_material_limestone_tpd}
- Raw Material Clay (tpd): ${plantData.raw_material_clay_tpd}
- Raw Material Gypsum (tpd): ${plantData.raw_material_gypsum_tpd}
- Electricity Cost (USD): ${plantData.electricity_cost_usd}
- Maintenance Downtime (hr): ${plantData.maintenance_downtime_hr}

Your goals:
- Minimize Specific Power Consumption (target: 5-8% reduction).
- Optimize Thermal Substitution Rate (target: increase by 10-15%).
- Maintain product quality within ±2% variance.
- Reduce downtime by 10-15%.

Provide **precise, actionable steps**, supported by the data. Avoid generic jargon.
For each recommendation, explain:
1. What should be adjusted.
2. Why it helps improve performance.
3. The expected impact in measurable terms (e.g., reduce power by X kWh or cut emissions by Y%).

Respond in JSON format:
[
  {
    "action": "Optimize raw material mix",
    "reason": "High clay-to-limestone ratio causes excess energy consumption.",
    "expected_impact": "Reduce energy by ~3%, improve product quality stability."
  },
  {
    "action": "Increase alternative fuel usage",
    "reason": "Current alt fuel usage is low; increasing improves TSR and lowers cost.",
    "expected_impact": "Increase TSR by ~12%, decrease fuel cost by ~5%."
  }
]  
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      temperature: 0.3,
      maxOutputTokens: 600,
    });

    // Parse the response as structured JSON if possible
    try {
      return JSON.parse(response.text);
    } catch (parseError) {
      console.warn('⚠️ Failed to parse recommendations as JSON. Returning raw text.');
      return response.text;
    }

  } catch (error) {
    console.error('❌ Text Generation Error:', error);
    return [{ action: 'Error', reason: 'Unable to generate recommendations', expected_impact: '' }];
  }
}
 

async function getPrediction(req, res) {
  try {
    const inputData = req.body;
    const requiredFields = [
      'plant_id', 'plant_name', 'clinker_production_tpd', 'cement_production_tpd',
      'kiln_temperature_c', 'alt_fuel_pct', 'raw_material_limestone_tpd', 'raw_material_clay_tpd',
      'raw_material_gypsum_tpd', 'electricity_cost_usd', 'maintenance_downtime_hr',
      'fuel_type', 'co2_emissions_tons'
    ];

    for (const field of requiredFields) {
      if (!(field in inputData)) {
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }

    const numericFields = [
      'raw_material_limestone_tpd', 'raw_material_clay_tpd', 'raw_material_gypsum_tpd',
      'electricity_cost_usd', 'maintenance_downtime_hr', 'co2_emissions_tons'
    ];
    numericFields.forEach(field => {
      inputData[field] = parseFloat(inputData[field]);
      if (isNaN(inputData[field])) {
        throw new Error(`Invalid numeric value for field: ${field}`);
      }
    });

    const now = new Date();
    inputData.timestamp = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')} ${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}:${String(now.getUTCSeconds()).padStart(2, '0')}+0000`;

    console.log('🕒 Current Timestamp:', inputData.timestamp);
    console.log('⏳ Starting forecast prediction...');
    
    const predictedEnergy = await getForecast([inputData]);
    console.log('✅ Predicted Energy:', predictedEnergy);

    console.log('⏳ Generating AI recommendations...');
    const recommendations = await getRecommendations(predictedEnergy, inputData);

    res.json({
      predictedEnergy,
      predictedCO2: inputData.co2_emissions_tons,
      recommendations
    });

  } catch (error) {
    console.error('❌ Workflow Error:', error.message);
    res.status(500).json({ error: 'Prediction workflow failed', details: error.message });
  }
}

export { getPrediction };
