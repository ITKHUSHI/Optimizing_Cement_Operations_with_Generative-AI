import React, { useEffect, useState ,useRef} from "react";
import { getSocket } from "../utils/socket";
import axios from "axios";
import { APIURL } from "../../utils";

export default function LiveDashboard() {
  const [connected, setConnected] = useState(false);
  const [metrics, setMetrics] = useState([]);
  const [latest, setLatest] = useState(null);
  const [recs, setRecs] = useState([]);
  const socket = getSocket();
  const plantData = JSON.parse(localStorage.getItem("plantData"));
  const plantId = plantData?.id || plantData?._id;


  const MAX_POINTS = 60;

  useEffect(() => {
    if (!socket) return;

    let monitoringStarted = false;

    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    const startMonitoring = async () => {
      try {
        const res = await axios.post(
          `${APIURL}/api/cement/${plantId}/start-monitoring`,
          {},
          { headers: { "Content-Type": "application/json" }, withCredentials: true }
        );
        const { metrics: firstMetrics, recs: firstRecs } = res.data;
        if (!monitoringStarted) {
          setLatest(firstMetrics);
          setMetrics([firstMetrics]);
          setRecs(firstRecs);
          monitoringStarted = true;
        }
      } catch (err) {
        console.error(err);
      }
    };
    startMonitoring();

    const handleMetrics = (payload) => {
      setLatest(payload);
      setMetrics((prev) => {
        const next = [...prev, payload];
        if (next.length > MAX_POINTS) next.shift();
        return next;
      });
    };
    const handleRecs = (list) => setRecs(list);

    socket.on("plantMetrics", handleMetrics);
    socket.on("recommendations", handleRecs);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("plantMetrics", handleMetrics);
      socket.off("recommendations", handleRecs);
    };
  }, [socket, plantId]);

  const humanTime = (ts) => {
    try {
      return new Date(ts).toLocaleTimeString();
    } catch {
      return "-";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br mt-16  from-gray-100 via-gray-50 to-gray-100 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col  justify-between mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-blue-500 mb-2 md:mb-0 text-center">
            Cement Plant Live Updates
          </h1>
          <span
            className={`px-4 py-1 rounded-full font-semibold text-sm   text-left w-28  ${
              connected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {connected ? "Connected" : "Disconnected"}
          </span>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live Metrics */}
          <section className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <MetricCard label="Temperature (°C)" value={latest?.temperature ?? "-"} color="from-red-400 to-red-600" />
              <MetricCard label="Kiln Speed (rpm)" value={latest?.kilnSpeed ?? "-"} color="from-blue-400 to-blue-600" />
              <MetricCard label="O₂ (%)" value={latest?.o2 ?? "-"} color="from-green-400 to-green-600" />
              <MetricCard label="Pressure (kPa)" value={latest?.pressure ?? "-"} color="from-purple-400 to-purple-600" />
              <MetricCard label="Raw Moisture (%)" value={latest?.rawMoisture ?? "-"} color="from-yellow-400 to-yellow-600" />
              <MetricCard label="Prod Rate (t/h)" value={latest?.productionRate ?? "-"} color="from-pink-400 to-pink-600" />
            </div>

            
            <div className="mt-4"> <h3 className="font-medium mb-2">Temperature (last {MAX_POINTS} samples)</h3>
             <Sparkline data={metrics.map((m) => m.temperature ?? 0)} /> </div>
              <div className="mt-4"> <h3 className="font-medium mb-2">Raw stream (latest)</h3>
               <pre className="text-xs bg-gray-100 p-2 rounded">{JSON.stringify(latest, null, 2)}</pre> 
               </div>
          </section>

          {/* Recommendations */}
          <aside className="space-y-6">
            <div className="bg-white rounded-3xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
              <div className="space-y-3">
                {recs.length === 0 && <div className="text-sm  text-gray-500">No recommendations yet.</div>}
                {recs.map((r, i) => (
                  <Recommendation key={i} rec={r} />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow p-4 text-center text-gray-600">
              Last updated: {latest ? humanTime(latest.ts) : "-"}
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}

function MetricCard({ label, value, color }) {
  return (
    <div className={`relative bg-gradient-to-br ${color} p-5 rounded-3xl shadow-lg overflow-hidden transform transition hover:scale-105`}>
      <div className="text-sm font-medium text-white">{label}</div>
      <div className="text-3xl font-extrabold text-white mt-2">{value}</div>
      <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
    </div>
  );
}

function Recommendation({ rec }) {
  const colors = { info: "bg-blue-100 text-blue-800", warn: "bg-yellow-100 text-yellow-800", critical: "bg-red-100 text-red-800" };
  return (
    <div className={`p-4 rounded-2xl shadow-md ${colors[rec.level] || "bg-gray-100 text-gray-800"} transition hover:scale-105`}>
      <div className="font-semibold">{rec.title}</div>
      <div className="text-sm mt-1">{rec.detail ?? JSON.stringify(rec)}</div>
    </div>
  );
}
function Sparkline({ data = [], width = 600, height = 80 }) { const ref = useRef(null); useEffect(() => { const canvas = ref.current; if (!canvas) return; const ctx = canvas.getContext("2d"); ctx.clearRect(0, 0, width, height); if (data.length === 0) return; const max = Math.max(...data); const min = Math.min(...data); const range = max - min || 1; ctx.beginPath(); data.forEach((v, i) => { const x = (i / (data.length - 1 || 1)) * width; const y = height - ((v - min) / range) * height; if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }); ctx.stroke(); }, [data, width, height]); return <canvas ref={ref} width={width} height={height} className="w-full" />; }