import express from "express";
import { getPrediction } from "../controllers/cement_data.controller.js";

const router = express.Router();
router.post("/data", getPrediction);

export default router;
   