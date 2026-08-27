import { firebaseAuth } from "@/shared/services/firebase";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

function waitForAuthReady(): Promise<void> {
  return new Promise((resolve) => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(() => {
      unsubscribe();
      resolve();
    });
  });
}

async function getAuthToken(): Promise<string | null> {
  await waitForAuthReady();
  const user = firebaseAuth.currentUser;
  if (!user) return null;
  return user.getIdToken();
}

interface ApiClientOptions {
  method?: string;
  body?: string;
}

export async function apiClient<T>(
  endpoint: string,
  options: ApiClientOptions = {},
): Promise<T> {
  const token = await getAuthToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body,
  });

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}
