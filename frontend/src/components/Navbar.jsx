import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import LoginButton from "./Login";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // null if logged out
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-blue-600">
            Teamlify
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/home" className="text-gray-700 hover:text-blue-600">
              Home
            </Link>
            <Link to="/profile" className="text-gray-700 hover:text-blue-600">
              <img
                  src={user?.photoURL || "https://i.pravatar.cc/40"}
                  alt={user?.displayName || "User"}
                  className="w-10 h-10 rounded-full border"
                />
            </Link>

            {/* User / Login */}
            {user ? (
              <div className="flex items-center space-x-3">
                
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-500 hover:underline"
                >
                  Logout
                </button>
              </div>
            ) : (
              <LoginButton />
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
          <Link to="/home" onClick={() => setIsOpen(false)}>
            Home
          </Link>
          <Link to="/profile" onClick={() => setIsOpen(false)}>
            Profile
          </Link>

          {user ? (
            <div className="flex items-center space-x-3">
              <img
                src={user?.photoURL || "https://i.pravatar.cc/40"}
                alt={user?.displayName || "User"}
                className="w-10 h-10 rounded-full border"
              />
              <span className="text-gray-700">{user.displayName}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 hover:underline"
              >
                Logout
              </button>
            </div>
          ) : (
            <LoginButton />
          )}
        </div>
      )}
    </nav>
  );
}
