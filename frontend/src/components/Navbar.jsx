import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const plantId = localStorage.getItem("plantId");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("plantId");
    localStorage.removeItem("plantData");
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-lg fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-extrabold text-blue-600 tracking-wide">
            SmartCemAi
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            {plantId ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/historical-data"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Historical Data
                </Link>
                <Link
                  to="/pridict-energy"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Energy OPT
                </Link>
                <Link
                  to="/scenario"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Scenario
                </Link>
                <Link
                  to="/cement-plant"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Cement Plant
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login-cement-plant"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register-cement-plant"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700 focus:outline-none text-2xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "✖" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg px-6 py-4 space-y-4 animate-fade-in">
          {plantId ? (
            <>
              <Link
                to="/dashboard"
                className="block text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/historical-data"
                className="block text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setIsOpen(false)}
              >
                historical Data
              </Link>
              <Link
                to="/pridict-energy"
                className="block text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Energy OPT
              </Link>
              <Link
                to="/scenario"
                className="block text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Scenario
              </Link>
              <Link
                to="/cement-plant"
                className="block text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Cement Plant
              </Link>
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login-cement-plant"
                className="block text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register-cement-plant"
                className="block text-gray-700 hover:text-blue-600 font-medium"
                onClick={() => setIsOpen(false)}
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
