import cookie from "cookie";
import jwt from "jsonwebtoken";
import { CementPlant } from "../model/cement.model.js";

const userAuth = async(req, res, next) => {
  try {
    
    const token = req?.headers?.cookie;
    if (!token) throw new Error("Authentication required");
    const parsedCookies = cookie.parse(token);
    const jwtToken = parsedCookies?.token;
    if (!jwtToken) throw new Error("Authentication required");
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
    const plantId = decoded?.id || decoded?._id;
    if (!plantId) throw new Error("Invalid token");
    next();


  } catch (error) {
    return res.status(401).json({ message: "Authentication failed", error: error.message });
  }
}

const socketAuth = async(socket, next) => {
  try {
    const rawCookie = socket?.request?.headers?.cookie;
    if (!rawCookie) throw new Error("No cookies sent");

    const parsedCookies = cookie.parse(rawCookie);
    const token = parsedCookies?.token;
    if (!token) throw new Error("Authentication required");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const plantId = decoded?.id || decoded?._id;
    if (!plantId) throw new Error("Invalid token");

   const plant= await CementPlant.findById(plantId).select("-password")
        socket.plant = plant;       
         next(); // allow connection
      
  } catch (error) {
    next(new Error("Socket authentication failed",error.message));
  }
};

export { socketAuth,userAuth };
