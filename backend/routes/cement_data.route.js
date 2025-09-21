import express from "express";
import { getPrediction,registerCementPlant,getCementPlants, loginCementPlant, addRecords ,getDashboardData} from "../controllers/cement_data.controller.js";

const router = express.Router();
router.post("/data", getPrediction);
router.post("/register-cement-plant", registerCementPlant);
router.post("/login-cement-plant", loginCementPlant);
router.get("/cement-plant/plant_id/:plant_id", getCementPlants);
router.post("/add/cement-plant/record/plant_id/:plant_id", addRecords);
router.get("/dashboard/plant_id/:plant_id", getDashboardData);

export default router;
    