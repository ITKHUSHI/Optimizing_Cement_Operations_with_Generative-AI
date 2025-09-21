import React, { useState } from "react";
import axios from "axios";
import { APIURL } from "../../utils";
import { useNavigate ,Link} from "react-router-dom";

export default function CementPlantRegister() {
  const [inputs, setInputs] = useState({
    plant_name: "",
    location: "",
    capacity_tpd:"",
    password:""
  });
 const navigate=useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    setIsLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await axios.post(`${APIURL}/api/cement/register-cement-plant`, inputs, {
        headers: { "Content-Type": "application/json" },
      });
      setSuccessMsg(res.data.message);
      navigate('/cement-plant');
      localStorage.setItem('plantData',JSON.stringify(res.data.plant));
      localStorage.setItem('plantId',JSON.stringify(res.data.plant.plant_id));

      setInputs({ plant_id: "", plant_name: "", location: "", capacity_tpd: "" });
    } catch (err) {
      const message = err.response?.data?.error || "Failed to register plant.";
      setErrorMsg(message);
    } finally { 
      setIsLoading(false);

    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Register Cement Plant
      </h1>

      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full">
        {successMsg && (
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded mb-4">{successMsg}</div>
        )}
        {errorMsg && (
          <div className="bg-red-100 text-red-800 px-4 py-2 rounded mb-4">{errorMsg}</div>
        )}

        <div className="space-y-4">
          {[
            { label: "Plant Name", name: "plant_name", type: "text" },
            { label: "Location", name: "location", type: "text" },
            { label: "Capacity (TPD)", name: "capacity_tpd", type: "number" },
            { label: "password", name: "password", type: "password" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-gray-700 font-medium mb-1">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={inputs[field.name]}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleRegister}
          disabled={isLoading}
          className={`mt-6 w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg font-semibold transition-all duration-300 ${
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:from-indigo-600 hover:to-blue-500"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span>Registering...</span>
            </div>
          ) : (
            "Register Plant"
          )}
        </button>
        <div className="text-center mt-4">
          <p>Already have an account <Link to={'/login-cement-plant'} className="text-blue-500" >Login</Link></p>
        </div>
      </div>
    </div>
  );
}
