import admin from "firebase-admin";
import dotenv from "dotenv";

// Load .env in local development
dotenv.config();

// Initialize Firebase Admin SDK only once
if (!admin.apps.length) {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

    // Handle both local and Render private key formats
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.includes("\\n")
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n") // Local .env: escaped newlines
      : process.env.FIREBASE_PRIVATE_KEY; // Render: actual newlines

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error("Missing Firebase credentials in environment variables");
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });

    console.log("Firebase Admin initialized successfully");
  } catch (error) {
    console.error("Firebase Admin init failed:", error.message);
  }
}

export const verifyToken = async (idToken) => {
  try {
    if (!idToken) throw new Error("No token provided");
    return await admin.auth().verifyIdToken(idToken);
  } catch (err) {
    throw new Error("Token verification failed: " + err.message);
  }
};
