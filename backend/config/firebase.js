import admin from "firebase-admin";
import { readFileSync } from "fs";
import dotenv from "dotenv";

dotenv.config();
const serviceAccount = JSON.parse(
  readFileSync(GOOGLE_APPLICATION_CREDENTIALS, "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const auth = admin.auth();
export const db = admin.firestore(); // if you want Firestore
