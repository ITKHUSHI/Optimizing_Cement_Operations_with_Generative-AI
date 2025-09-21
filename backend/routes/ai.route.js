import express from "express";
import { getCementOptimizationBasedOnData, getOptimizationResults } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/optimization/scenario",getOptimizationResults)
router.post("/dashboard-rec/plant_id/:plant_id",getCementOptimizationBasedOnData)

export default router;
 