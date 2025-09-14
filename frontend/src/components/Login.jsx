import { useEffect, useState } from "react";
import { auth, googleProvider } from "../firebase";
import { onAuthStateChanged, getIdToken, signInWithPopup, signOut } from "firebase/auth";
import axios from "axios";
import { APIURL } from "../../utils.js";

export default function LoginButton() {
  const [user, setUser] = useState(null);

  // 🔹 Track login state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // 🔥 Get Firebase ID token
        const token = await getIdToken(currentUser);

        // Send token to backend for verification
        await axios.post(
          `${APIURL}/api/users/login`,
          {},
          { headers: { Authorization: `Bearer ${token}` } ,
		
		        withCredentials:true
	}
        );
      }
    });
    return () => unsubscribe();
  }, []);

  // 🔹 Google Login
  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      throw new Error("Google login error:", err);
    }
  };

  // 🔹 Logout
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      throw new Error("Logout error:", err);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-2 m-3">
      {user ? (
        <>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            Logout
          </button>
        </>
      ) : (
        <button
          onClick={loginWithGoogle}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Sign in with Google
        </button>
      )}
    </div>
  );
}
