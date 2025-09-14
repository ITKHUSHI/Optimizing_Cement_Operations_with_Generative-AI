import { auth } from "../config/firebase.js";

 const login = async (req, res) => {
  // frontend will send Firebase ID token
  const { token } = req.body;
  try {
    const decoded = await auth.verifyIdToken(token);
    res.json({ message: "Login successful", user: decoded });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

 const profile = (req, res) => {
  res.json({ user: req.user });
};

export {
	login,
	profile
}
