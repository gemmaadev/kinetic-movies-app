export class TmdbError extends Error {
  status: number;

  constructor(status: number, statusText: string) {
    super(`TMDB request failed: ${status} ${statusText}`);
    this.name = "TmdbError";
    this.status = status;
  }
}

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = process.env.TMDB_BASE_URL;

if (!TMDB_API_KEY) {
  throw new Error("TMDB_API_KEY is not defined in environment variables");
}

const apiKey: string = TMDB_API_KEY;

export async function tmdbFetch(
  endpoint: string,
  params: Record<string, string> = {},
) {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", apiKey);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new TmdbError(response.status, response.statusText);
  }

  return response.json();
}
