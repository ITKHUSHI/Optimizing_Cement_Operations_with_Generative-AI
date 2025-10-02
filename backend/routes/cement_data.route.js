import express from "express";
import { getPrediction,registerCementPlant,getCementPlantData, loginCementPlant, addRecords ,getDashboardData} from "../controllers/cement_data.controller.js";
import { startPlantMonitoring } from "../controllers/cement_plant_optimizer.controller.js";
const router = express.Router();
router.post("/data", getPrediction);
router.post("/register-cement-plant", registerCementPlant);
router.post("/login-cement-plant", loginCementPlant);
router.get("/cement-plant/plant_id/:plant_id", getCementPlantData);
router.post("/add/cement-plant/record/plant_id/:plant_id", addRecords);
router.get("/dashboard/plant_id/:plant_id", getDashboardData);
router.post("/:plant_id/start-monitoring", startPlantMonitoring);

export default router;
    