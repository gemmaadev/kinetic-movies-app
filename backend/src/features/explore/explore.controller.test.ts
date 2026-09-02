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

  // Scenario: Search by text returns combined movies, actors, and directors
  //   Given a search query
  //   When exploreController is called
  //   Then it should return matching movies, actors, and directors
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
          total_pages: 3,
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
      totalPages: 3,
    });
  });

  // Scenario: Person search fails, but movie search succeeds
  //   Given the person search fails
  //   When exploreController is called
  //   Then it should still return movies, with empty actors/directors
  it("returns movies only (empty actors/directors) when only the person search fails", async () => {
    vi.mocked(tmdbFetch).mockImplementation((endpoint: string) => {
      if (endpoint === "/search/movie") {
        return Promise.resolve({
          results: [
            {
              id: 1,
              title: "Spider-Man",
              poster_path: null,
              vote_average: 8,
              release_date: "2024-01-01",
            },
          ],
          total_pages: 1,
        });
      }
      return Promise.reject(new Error("TMDB person search down"));
    });

    const req = { query: { search: "spiderman" } } as unknown as Request;
    const res = createMockResponse();

    await exploreController(req, res);

    expect(res.status).not.toHaveBeenCalledWith(502);
    expect(res.json).toHaveBeenCalledWith({
      movies: [
        {
          id: 1,
          title: "Spider-Man",
          posterUrl: null,
          voteAverage: 8,
          releaseYear: 2024,
        },
      ],
      actors: [],
      directors: [],
      totalPages: 1,
    });
  });

  // Scenario: Both searches fail
  //   Given both movie and person searches fail
  //   When exploreController is called
  //   Then it should return 502
  it("returns 502 when both search calls fail", async () => {
    vi.mocked(tmdbFetch).mockRejectedValue(new Error("TMDB is down"));

    const req = { query: { search: "spiderman" } } as unknown as Request;
    const res = createMockResponse();

    await exploreController(req, res);

    expect(res.status).toHaveBeenCalledWith(502);
    expect(res.json).toHaveBeenCalledWith({
      error: "Failed to fetch data from TMDB",
    });
  });

  // Scenario: No search text, uses discover/movie with filters
  //   Given filters but no search text
  //   When exploreController is called
  //   Then it should call discover/movie with the mapped filter params, including page
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
      total_pages: 8,
    });

    const req = {
      query: { genre: "28", minRating: "6", sort: "popularity.desc" },
    } as unknown as Request;
    const res = createMockResponse();

    await exploreController(req, res);

    expect(tmdbFetch).toHaveBeenCalledWith("/discover/movie", {
      with_genres: "28",
      "vote_average.gte": "6",
      "vote_count.gte": "50",
      sort_by: "popularity.desc",
      page: "1",
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
      totalPages: 8,
    });
  });

  // Scenario: discover/movie fails
  //   Given TMDB is unreachable
  //   When exploreController is called
  //   Then it should return 502
  it("returns 502 when discover/movie fails", async () => {
    vi.mocked(tmdbFetch).mockRejectedValue(new Error("TMDB is down"));

    const req = { query: { genre: "28" } } as unknown as Request;
    const res = createMockResponse();

    await exploreController(req, res);

    expect(res.status).toHaveBeenCalledWith(502);
  });
});
