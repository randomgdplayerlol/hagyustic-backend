// Config/firebaseAdmin.js
// Firebase Admin SDK setup for verifying Firebase Auth ID tokens (used in social login)

import admin from "firebase-admin";

// Load Firebase Admin credentials from environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY);

// Initialize Firebase Admin SDK (only once)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Function: Verifies Firebase ID token and returns decoded payload
export const verifyToken = async (idToken) => {
  try {
    if (!idToken) throw new Error("No token provided");

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    throw new Error("Token verification failed");
  }
};
