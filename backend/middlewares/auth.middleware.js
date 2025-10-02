import cookie from "cookie";
import jwt from "jsonwebtoken";
import { CementPlant } from "../model/cement.model.js";

const socketAuth = async(socket, next) => {
  try {
    const rawCookie = socket?.request?.headers?.cookie;
    if (!rawCookie) throw new Error("No cookies sent");

    const parsedCookies = cookie.parse(rawCookie);
    const token = parsedCookies?.token;
    if (!token) throw new Error("Authentication required");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const plantId = decoded?.id;
    if (!plantId) throw new Error("Invalid token");

   const plant= await CementPlant.findById(plantId).select("-password")
      
        socket.plant = plant;       
         next(); // allow connection
      
  } catch (error) {
    next(new Error("Socket authentication failed"));
  }
};

export { socketAuth };
