import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cementDataRoutes from "./routes/cement_data.route.js"
import aiRoute from "./routes/ai.route.js"

dotenv.config();

const app = express();
const allowedOrigins = [
  process.env.CORS_ORIGIN   // sometimes Vite uses 127.0.0.1
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/cement",cementDataRoutes)
app.use("/api/ai",aiRoute)


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
