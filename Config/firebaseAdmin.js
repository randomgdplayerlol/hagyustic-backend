// Config/firebaseAdmin.js
// Firebase Admin SDK setup using separate Render env variables

import admin from "firebase-admin";

// Initialize Firebase Admin SDK only once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

export const verifyToken = async (idToken) => {
  try {
    if (!idToken) throw new Error("No token provided");
    const decoded = await admin.auth().verifyIdToken(idToken);
    return decoded;
  } catch (err) {
    throw new Error("Token verification failed");
  }
};
