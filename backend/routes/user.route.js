import express from "express";
import { login, profile } from "../controllers/user.controller.js"
import { verifyFirebaseToken } from "../middlewares/auth.middleware.js"

const router = express.Router();

router.post("/login", login);
router.get("/profile", verifyFirebaseToken, profile);

export default router;
