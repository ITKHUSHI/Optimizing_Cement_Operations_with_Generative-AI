import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const plantId = localStorage.getItem("plantId");
  const Navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("plantId");
    localStorage.removeItem("plantData");
    Navigate("/")

  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center  h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-blue-600">
            SmartCemAi
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            {plantId ? (
              <>
              <Link to="/dashboard" className="text-gray-700 m-2 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                Dashboard
              </Link>
                <Link to="/home" className=" m-2 text-gray-700 hover:text-blue-600">
                  Energy OPT
                </Link>
                <Link
                  to="/scenario"
                  className="text-gray-700  hover:text-blue-600 m-2"
                >
                  Scenario
                </Link>
                <Link
                  to="/cement-plant"
                  className="text-gray-700  hover:text-blue-600 m-2"
                >
                  Cement Plant
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login-cement-plant"
                  className="text-gray-700 hover:text-blue-600 mr-2"
                >
                  Login
                </Link>
                <Link
                  to="/register-cement-plant"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "✖" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md px-6 py-4 space-y-4">
          {plantId ? (
            <>
              <Link to="/dashboard" className="text-gray-700 m-2 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                Dashboard
              </Link>
              <Link to="/home" className="text-gray-700 m-2 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                Energy OPT
              </Link>
              <Link
                  to="/scenario"
                  className="text-gray-700  hover:text-blue-600 m-2"
                >
                  Scenario
                </Link>
              <Link
                to="/cement-plant"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 m-2 hover:text-blue-600"
              >
                Cement Plant
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login-cement-plant" className="mr-2" onClick={() => setIsOpen(false)}>
                Login
              </Link>
              <Link
                to="/register-cement-plant"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-blue-600"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
