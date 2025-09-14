import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bigquery from "./config/bigquery.js";
import userRoutes from "./routes/user.route.js"
import aiRoutes from "./routes/ai.route.js"
import cementDataRoutes from "./routes/cement_data.route.js"

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
app.use("/api/users", userRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/predict-energy",cementDataRoutes)

app.get("/test-bigquery", async (req, res) => {
  try {
    const [datasets] = await bigquery.getDatasets();
    res.json({
      message: "✅ BigQuery Connected!",
      datasets: datasets.map(d => d.id),
    });
  } catch (err) {
    console.error("BigQuery error:", err);
    res.status(500).json({ error: err.message });
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
