// Config/firebaseAdmin.js
// Firebase Admin SDK setup for verifying Firebase Auth ID tokens (used in social login)

import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Resolve __dirname for ES modules (since it's not available by default)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to your Firebase service account JSON file
const serviceAccountPath = path.join(
  __dirname,
  "hagyustic-firebase-adminsdk-fbsvc-1cf91de131.json"
);

// Read and parse the service account credentials
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));

// Initialize Firebase Admin SDK (ensure it's done only once)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Function: Verifies Firebase ID token and returns decoded payload
export const verifyToken = async (idToken) => {
  try {
    if (!idToken) throw new Error("No token provided");

    // Decode and verify Firebase token (used in social login)
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    // Standardize error message for auth failure
    throw new Error("Token verification failed");
  }
};
