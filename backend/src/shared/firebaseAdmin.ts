import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { readFileSync } from "fs";

function loadServiceAccount() {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

  if (serviceAccountJson) {
    return JSON.parse(serviceAccountJson);
  }

  if (serviceAccountPath) {
    return JSON.parse(readFileSync(serviceAccountPath, "utf-8"));
  }

  throw new Error(
    "Neither FIREBASE_SERVICE_ACCOUNT_JSON nor FIREBASE_SERVICE_ACCOUNT_PATH is defined in environment variables",
  );
}

const serviceAccount = loadServiceAccount();

const firebaseApp = initializeApp({
  credential: cert(serviceAccount),
});

export const firebaseAuth = getAuth(firebaseApp);
