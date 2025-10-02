import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cementDataRoutes from "./routes/cement_data.route.js"
import aiRoute from "./routes/ai.route.js"
import connectDB from "./db/index.js";
import { Server } from "socket.io";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { socketAuth } from "./middlewares/auth.middleware.js";


dotenv.config();
const app = express();
const server=http.createServer(app);
  
// ✅ Define allowed origins as an array
const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [];
// ✅ Socket.IO setup with CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST','PUT','DELETE'],
    credentials: true,
  },
});
const connectedPlants = new Map();

io.use(socketAuth);

io.on("connection", (socket) => {
  const plant = socket.plant;
  const plantId = plant._id.toString();
  // Join a room for this plant
  socket.join(plantId);

  // Example: emit test data every 5 seconds
  setInterval(() => {
    const data = { temperature: Math.random() * 100 };
    io.to(plantId).emit("plantData", data);
  }, 5000);

  socket.on("disconnect", () => {
    console.log("❌ Plant disconnected:", plantId, socket.id);
  });
});



app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" })); 
app.use(express.static("public"));
app.use(cookieParser());
io.use((socket, next) => {
  cookieParser()(socket.request, {}, (err) => {
    if (err) return next(err);
    socketAuth(socket, next);
  });
});

// Routes

app.use("/api/cement",cementDataRoutes)
app.use("/api/ai",aiRoute)

 
connectDB()
.then(()=>{
	server.listen(process.env.PORT ,()=>{
		console.log(`server is runing at port ${process.env.PORT}`);
	} )
})
.catch((err)=>{
	console.log("Mongo db Connection faild !!!",err);
}) 


export { io, connectedPlants ,server};