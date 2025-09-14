import { BigQuery } from "@google-cloud/bigquery";
import dotenv from "dotenv";
dotenv.config();

const bigquery = new BigQuery({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  projectId: process.env.GCP_PROJECT_ID,
});

// Get plant data (for display)
 async function getPlantData() {
  const query = `SELECT * FROM \`${process.env.CEMENT_PLANT_DATASET_TABLE}\` LIMIT 100`;
  const [rows] = await bigquery.query(query);
  return rows;
}

// Insert prediction result (after model predicts)
 async function insertPrediction(predictionData) {
  await bigquery
    .dataset('your_dataset')
    .table('predictions')
    .insert([predictionData]);
}

export default bigquery;
export { getPlantData,insertPrediction };
