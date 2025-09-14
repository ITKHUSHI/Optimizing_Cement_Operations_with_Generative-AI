import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import LoginButton from "../components/Login";
const auth = getAuth();

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Watch auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe(); // cleanup
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-lg text-gray-600 animate-pulse">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="p-6 bg-white shadow-xl rounded-2xl text-center">
          <h2 className="text-2xl font-semibold text-gray-700">Not Logged In</h2>
          <p className="text-gray-500 mt-2">
            Please login to view your profile.
          </p>
          <LoginButton /> {/* 👈 reuse login/logout */}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <div className="w-full max-w-md bg-white shadow-xl rounded-3xl p-8">
        <div className="flex flex-col items-center text-center">
          <img
            src={user.photoURL || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-blue-500 shadow-lg"
          />
          <h1 className="mt-4 text-2xl font-bold text-gray-800">
            {user.displayName || "Anonymous User"}
          </h1>
          <p className="text-gray-500">{user.email}</p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">UID</p>
            <p className="font-mono text-xs text-gray-700 truncate">{user.uid}</p>
          </div>
          <div className="bg-gradient-to-r from-pink-100 to-pink-200 rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Email Verified</p>
            <p className="text-gray-700 font-medium">
              {user.emailVerified ? "✅ Yes" : "❌ No"}
            </p>
          </div>
        </div>

        {/* 👇 Reuse LoginButton instead of writing logout manually */}
      </div>
    </div>
  );
}
