import express from "express";
import { getPrediction,registerCementPlant,getCementPlantData, loginCementPlant, addRecords ,getHistoricalData} from "../controllers/cement_data.controller.js";
import { startPlantMonitoring } from "../controllers/cement_plant_optimizer.controller.js";
import { userAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.post("/data",userAuth, getPrediction);
router.post("/register-cement-plant", registerCementPlant);
router.post("/login-cement-plant", loginCementPlant);
router.get("/cement-plant/plant_id/:plant_id",userAuth, getCementPlantData);
router.post("/add/cement-plant/record/plant_id/:plant_id",userAuth, addRecords);
router.get("/dashboard/plant_id/:plant_id",userAuth, getHistoricalData);
router.post("/:plant_id/start-monitoring",userAuth, startPlantMonitoring);

export default router;
    