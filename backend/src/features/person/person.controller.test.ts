import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response } from "express";
import { getPersonDetail } from "./person.controller.js";
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

describe("getPersonDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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
});
