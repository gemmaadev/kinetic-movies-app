import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response } from "express";
import { getPersonDetail } from "./person.controller.js";
import { TmdbError, tmdbFetch } from "../../shared/tmdbClient.js";

vi.mock("../../shared/tmdbClient.js", () => ({
  tmdbFetch: vi.fn(),
  TmdbError: class TmdbError extends Error {
    status: number;
    constructor(status: number, statusText: string) {
      super(`TMDB request failed: ${status} ${statusText}`);
      this.status = status;
    }
  },
}));

function createMockResponse() {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

describe("getPersonDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Scenario: Fetch full person detail
  //   Given TMDB returns a person with acting and directing credits
  //   When getPersonDetail is called
  //   Then filmography and filmographyAsDirector should be correctly separated and mapped
  it("returns person detail with filmography and filmographyAsDirector", async () => {
    vi.mocked(tmdbFetch).mockResolvedValue({
      id: 525,
      name: "Christopher Nolan",
      biography: "British-American film director.",
      birthday: "1970-07-30",
      place_of_birth: "London, UK",
      profile_path: "/nolan.jpg",
      movie_credits: {
        cast: [],
        crew: [
          {
            id: 27205,
            title: "Inception",
            poster_path: "/inception.jpg",
            release_date: "2010-07-16",
            vote_average: 8.4,
            job: "Director",
          },
          {
            id: 157336,
            title: "Interstellar",
            poster_path: "/interstellar.jpg",
            release_date: "2014-11-07",
            vote_average: 8.6,
            job: "Writer",
          },
        ],
      },
    });

    const req = { params: { id: "525" } } as unknown as Request;
    const res = createMockResponse();

    await getPersonDetail(req, res);

    expect(tmdbFetch).toHaveBeenCalledWith("/person/525", {
      append_to_response: "movie_credits",
      language: "es-ES",
    });

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 525,
        name: "Christopher Nolan",
        photoUrl: "https://image.tmdb.org/t/p/w500/nolan.jpg",
        filmographyAsDirector: [
          {
            id: 27205,
            title: "Inception",
            posterUrl: "https://image.tmdb.org/t/p/w500/inception.jpg",
            voteAverage: 8.4,
            releaseYear: 2010,
            job: "Director",
            character: undefined,
          },
        ],
      }),
    );
  });

  // Scenario: TMDB fails with a generic error
  //   Given TMDB is unreachable
  //   When getPersonDetail is called
  //   Then it should return 502
  it("returns 502 when TMDB fails", async () => {
    vi.mocked(tmdbFetch).mockRejectedValue(new Error("TMDB is down"));

    const req = { params: { id: "999" } } as unknown as Request;
    const res = createMockResponse();

    await getPersonDetail(req, res);

    expect(res.status).toHaveBeenCalledWith(502);
    expect(res.json).toHaveBeenCalledWith({
      error: "Failed to fetch data from TMDB",
    });
  });

  // Scenario: TMDB returns 404 (person not found)
  //   Given TMDB responds with a 404 for this person id
  //   When getPersonDetail is called
  //   Then it should return 404 with a clear "Person not found" message
  it("returns 404 when the person doesn't exist", async () => {
    vi.mocked(tmdbFetch).mockRejectedValue(new TmdbError(404, "Not Found"));

    const req = { params: { id: "999999999" } } as unknown as Request;
    const res = createMockResponse();

    await getPersonDetail(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Person not found" });
  });
});
