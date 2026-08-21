import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { readFileSync } from "fs";

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

if (!serviceAccountPath) {
  throw new Error(
    "FIREBASE_SERVICE_ACCOUNT_PATH is not defined in environment variables",
  );
}

const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf-8"));

const firebaseApp = initializeApp({
  credential: cert(serviceAccount),
});

export const firebaseAuth = getAuth(firebaseApp);
