import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response } from "express";
import {
  getPopular,
  getNowPlaying,
  getTrending,
  getTopRated,
  getUpcoming,
  getMovieDetail,
} from "./movie.controller.js";
import { tmdbFetch } from "../../../shared/tmdbClient.js";

vi.mock("../../../shared/tmdbClient.js", () => ({
  tmdbFetch: vi.fn(),
}));

function createMockResponse() {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

const mockRawMovie = {
  id: 1,
  title: "Interstellar",
  poster_path: "/interstellar.jpg",
  vote_average: 8.6,
  release_date: "2014-11-07",
};

const mockMappedMovie = {
  id: 1,
  title: "Interstellar",
  posterUrl: "https://image.tmdb.org/t/p/w500/interstellar.jpg",
  voteAverage: 8.6,
  releaseYear: 2014,
};

describe("movie.controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getPopular returns mapped movies from /movie/popular", async () => {
    vi.mocked(tmdbFetch).mockResolvedValue({ results: [mockRawMovie] });

    const req = {} as Request;
    const res = createMockResponse();

    await getPopular(req, res);

    expect(tmdbFetch).toHaveBeenCalledWith("/movie/popular");
    expect(res.json).toHaveBeenCalledWith({ movies: [mockMappedMovie] });
  });

  it("getPopular returns 502 when TMDB fails", async () => {
    vi.mocked(tmdbFetch).mockRejectedValue(new Error("TMDB is down"));

    const req = {} as Request;
    const res = createMockResponse();

    await getPopular(req, res);

    expect(res.status).toHaveBeenCalledWith(502);
  });

  it("getNowPlaying returns mapped movies from /movie/now_playing", async () => {
    vi.mocked(tmdbFetch).mockResolvedValue({ results: [mockRawMovie] });

    const req = {} as Request;
    const res = createMockResponse();

    await getNowPlaying(req, res);

    expect(tmdbFetch).toHaveBeenCalledWith("/movie/now_playing", {
      region: "ES",
    });
    expect(res.json).toHaveBeenCalledWith({ movies: [mockMappedMovie] });
  });

  it("getTrending returns mapped movies from /trending/movie/week", async () => {
    vi.mocked(tmdbFetch).mockResolvedValue({ results: [mockRawMovie] });

    const req = {} as Request;
    const res = createMockResponse();

    await getTrending(req, res);

    expect(tmdbFetch).toHaveBeenCalledWith("/trending/movie/week");
    expect(res.json).toHaveBeenCalledWith({ movies: [mockMappedMovie] });
  });

  it("getTopRated returns mapped movies from /movie/top_rated", async () => {
    vi.mocked(tmdbFetch).mockResolvedValue({ results: [mockRawMovie] });

    const req = {} as Request;
    const res = createMockResponse();

    await getTopRated(req, res);

    expect(tmdbFetch).toHaveBeenCalledWith("/movie/top_rated", {
      region: "ES",
      "vote_count.gte": "1000",
    });
    expect(res.json).toHaveBeenCalledWith({ movies: [mockMappedMovie] });
  });

  it("getUpcoming returns mapped movies from /movie/upcoming", async () => {
    vi.mocked(tmdbFetch).mockResolvedValue({ results: [mockRawMovie] });

    const req = {} as Request;
    const res = createMockResponse();

    await getUpcoming(req, res);

    expect(tmdbFetch).toHaveBeenCalledWith("/movie/upcoming", {
      region: "ES",
    });
    expect(res.json).toHaveBeenCalledWith({ movies: [mockMappedMovie] });
  });

  it("getMovieDetail returns full movie detail with cast, crew, trailer, and watch providers", async () => {
    vi.mocked(tmdbFetch).mockResolvedValue({
      ...mockRawMovie,
      overview: "A team travels through a wormhole.",
      backdrop_path: "/backdrop.jpg",
      runtime: 169,
      genres: [{ id: 878, name: "Science Fiction" }],
      tagline: "Mankind was born on Earth. It was never meant to die here.",
      credits: {
        cast: [
          {
            id: 100,
            name: "Matthew McConaughey",
            character: "Cooper",
            profile_path: "/mm.jpg",
          },
        ],
        crew: [
          { id: 200, name: "Christopher Nolan", job: "Director" },
          { id: 201, name: "Jonathan Nolan", job: "Writer" },
          { id: 200, name: "Christopher Nolan", job: "Writer" },
        ],
      },
      videos: {
        results: [{ key: "zSWdZVtXT7E", site: "YouTube", type: "Trailer" }],
      },
      "watch/providers": {
        results: {
          ES: {
            flatrate: [
              {
                provider_id: 8,
                provider_name: "Netflix",
                logo_path: "/netflix.jpg",
              },
            ],
          },
        },
      },
    });

    const req = { params: { id: "157336" } } as unknown as Request;
    const res = createMockResponse();

    await getMovieDetail(req, res);

    expect(tmdbFetch).toHaveBeenCalledWith("/movie/157336", {
      append_to_response: "credits,videos,watch/providers",
    });
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        title: "Interstellar",
        cast: [
          {
            id: 100,
            name: "Matthew McConaughey",
            character: "Cooper",
            photoUrl: "https://image.tmdb.org/t/p/w200/mm.jpg",
          },
        ],
        director: "Christopher Nolan",
        writers: ["Jonathan Nolan", "Christopher Nolan"],
        trailerUrl: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
        watchProviders: [
          {
            providerId: 8,
            providerName: "Netflix",
            logoUrl: "https://image.tmdb.org/t/p/w92/netflix.jpg",
          },
        ],
      }),
    );
  });

  it("getMovieDetail returns null director, empty writers, and empty watchProviders when data is missing them", async () => {
    vi.mocked(tmdbFetch).mockResolvedValue({
      ...mockRawMovie,
      overview: "A team travels through a wormhole.",
      backdrop_path: null,
      runtime: 169,
      genres: [],
      tagline: null,
      credits: { cast: [], crew: [] },
      videos: { results: [] },
      "watch/providers": { results: {} },
    });

    const req = { params: { id: "157336" } } as unknown as Request;
    const res = createMockResponse();

    await getMovieDetail(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        director: null,
        writers: [],
        trailerUrl: null,
        watchProviders: [],
      }),
    );
  });

  it("getMovieDetail returns 502 when TMDB fails", async () => {
    vi.mocked(tmdbFetch).mockRejectedValue(new Error("TMDB is down"));

    const req = { params: { id: "999" } } as unknown as Request;
    const res = createMockResponse();

    await getMovieDetail(req, res);

    expect(res.status).toHaveBeenCalledWith(502);
  });
});
