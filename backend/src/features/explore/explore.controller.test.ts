import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response } from "express";
import { exploreController } from "./explore.controller.js";
import { tmdbFetch } from "../../shared/tmdbClient.js";

vi.mock("../../shared/tmdbClient.js", () => ({
  tmdbFetch: vi.fn(),
}));

function createMockResponse() {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

describe("exploreController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns combined movies, actors, and directors when searching by text", async () => {
    vi.mocked(tmdbFetch).mockImplementation((endpoint: string) => {
      if (endpoint === "/search/movie") {
        return Promise.resolve({
          results: [
            {
              id: 1,
              title: "Spider-Man",
              poster_path: "/spiderman.jpg",
              vote_average: 8,
              release_date: "2024-01-01",
            },
          ],
        });
      }
      if (endpoint === "/search/person") {
        return Promise.resolve({
          results: [
            {
              id: 10,
              name: "Tom Holland",
              known_for_department: "Acting",
              profile_path: "/tom.jpg",
            },
            {
              id: 20,
              name: "Jon Watts",
              known_for_department: "Directing",
              profile_path: null,
            },
          ],
        });
      }
      return Promise.resolve({ results: [] });
    });

    const req = { query: { search: "spiderman" } } as unknown as Request;
    const res = createMockResponse();

    await exploreController(req, res);

    expect(res.json).toHaveBeenCalledWith({
      movies: [
        {
          id: 1,
          title: "Spider-Man",
          posterUrl: "https://image.tmdb.org/t/p/w500/spiderman.jpg",
          voteAverage: 8,
          releaseYear: 2024,
        },
      ],
      actors: [
        {
          id: 10,
          name: "Tom Holland",
          photoUrl: "https://image.tmdb.org/t/p/w200/tom.jpg",
        },
      ],
      directors: [{ id: 20, name: "Jon Watts", photoUrl: null }],
    });
  });

  it("uses discover/movie with filters when there is no search text", async () => {
    vi.mocked(tmdbFetch).mockResolvedValue({
      results: [
        {
          id: 2,
          title: "Action Movie",
          poster_path: null,
          vote_average: 7,
          release_date: "2023-05-01",
        },
      ],
    });

    const req = {
      query: { genre: "28", minRating: "6", sort: "popularity.desc" },
    } as unknown as Request;
    const res = createMockResponse();

    await exploreController(req, res);

    expect(tmdbFetch).toHaveBeenCalledWith("/discover/movie", {
      with_genres: "28",
      "vote_average.gte": "6",
      sort_by: "popularity.desc",
    });
    expect(res.json).toHaveBeenCalledWith({
      movies: [
        {
          id: 2,
          title: "Action Movie",
          posterUrl: null,
          voteAverage: 7,
          releaseYear: 2023,
        },
      ],
      actors: [],
      directors: [],
    });
  });

  it("returns 502 when TMDB request fails", async () => {
    vi.mocked(tmdbFetch).mockRejectedValue(new Error("TMDB is down"));

    const req = { query: { search: "spiderman" } } as unknown as Request;
    const res = createMockResponse();

    await exploreController(req, res);

    expect(res.status).toHaveBeenCalledWith(502);
    expect(res.json).toHaveBeenCalledWith({
      error: "Failed to fetch data from TMDB",
    });
  });
});
