import {io} from "../index.js";


function generateRandomMetrics(prev = {}) {
  return {
    ts: Date.now(),
    temperature: +(prev.temperature || 1400 + Math.random() * 50).toFixed(2),
    kilnSpeed: +(prev.kilnSpeed || 3 + Math.random() * 0.5).toFixed(2),
    pressure: +(prev.pressure || 1.2 + Math.random() * 0.2).toFixed(2),
    o2: +(prev.o2 || 2 + Math.random() * 0.5).toFixed(2),
    rawMoisture: +(prev.rawMoisture || 5 + Math.random() * 1).toFixed(2),
    productionRate: +(prev.productionRate || 250 + Math.random() * 20).toFixed(2),
  };
}


// --- recommendation logic ---
function calculateRecommendations(metrics) {
  const recs = [];

  if (metrics.temperature > 1450) {
    recs.push("🔥 Reduce kiln fuel input to avoid overheating.");
  }
  if (metrics.o2 < 2.5) {
    recs.push("💨 Increase airflow for better combustion.");
  }
  if (metrics.rawMoisture > 5.5) {
    recs.push("💧 Pre-dry raw feed to improve efficiency.");
  }
  if (metrics.productionRate < 260) {
    recs.push("⚡ Optimize grinding unit load to boost throughput.");
  }

  if (recs.length === 0) recs.push("✅ Plant running optimally.");

  return recs;
}

// --- controller loop ---
const monitoringIntervals = new Map();

const startPlantMonitoring = async (req, res) => {
  try {
    const plantId = req.params.plant_id;
    // first snapshot
    let metrics = generateRandomMetrics();
    let recs = calculateRecommendations(metrics);

    // send first snapshot
    res.status(200).json({ metrics, recs, message: "Monitoring started" });
    // prevent multiple intervals
    if (monitoringIntervals.has(plantId)) {
      return;
    }

    // start interval
    const intervalId = setInterval(() => {
      metrics = generateRandomMetrics(); // new random metrics every interval
      recs = calculateRecommendations(metrics);

      // emit to all connected sockets
     io.to(plantId).emit("plantMetrics", metrics);
     io.to(plantId).emit("recommendations", recs);

    }, 3000);

    monitoringIntervals.set(plantId, intervalId);

  } catch (error) {
    return res.status(500).json({ message: "Failed to start monitoring", error: error.message });
  }
};





export { startPlantMonitoring }; 