import { createContext, useMemo ,useContext} from "react";
import { APIURL } from "../../utils.js";
import { io } from "socket.io-client";

const SocketContext=createContext(null);
const getSocket=()=>{
	return useContext(SocketContext)
}

const SocketProvider=({children})=>{
 
	const socket =useMemo(()=>io(APIURL, {withCredentials: true,transports:["websocket"],}),[])
	return (
		<SocketContext.Provider value={socket}>
			{children}
		</SocketContext.Provider>
	)
}

export{SocketProvider,getSocket}