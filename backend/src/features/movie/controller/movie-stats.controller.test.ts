import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Response } from "express";
import type { AuthenticatedRequest } from "../../../middleware/verifyFirebaseToken.js";
import {
  getMyRankedMovies,
  getGlobalKineticRankedMovies,
} from "./movie-stats.controller.js";
import {
  getGlobalRanking,
  getRankedMoviesByUser,
} from "../model/movie-stats.model.js";

vi.mock("../model/movie-stats.model.js", () => ({
  getRankedMoviesByUser: vi.fn(),
  getGlobalRanking: vi.fn(),
}));

function createMockResponse() {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

describe("movie-stats.controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getMyRankedMovies", () => {
    // Scenario: List the authenticated user's rated movies
    //   Given the user has rated movies
    //   When getMyRankedMovies is called
    //   Then it should return them mapped to the frontend's shape
    it("returns the user's ranked movies", async () => {
      vi.mocked(getRankedMoviesByUser).mockResolvedValue([
        {
          id: "cuid1",
          userId: "firebase-uid-1",
          movieId: 550,
          userRating: 9,
          isFavourite: false,
          addedAt: new Date(),
          title: "Fight Club",
          posterUrl: "https://example.com/poster.jpg",
          voteAverage: 8.4,
          releaseYear: 1999,
        },
      ]);

      const req = {
        userId: "firebase-uid-1",
      } as unknown as AuthenticatedRequest;
      const res = createMockResponse();

      await getMyRankedMovies(req, res);

      expect(getRankedMoviesByUser).toHaveBeenCalledWith("firebase-uid-1");
      expect(res.json).toHaveBeenCalledWith({
        ranking: [
          {
            id: 550,
            title: "Fight Club",
            posterUrl: "https://example.com/poster.jpg",
            voteAverage: 8.4,
            releaseYear: 1999,
            userRating: 9,
          },
        ],
      });
    });

    // Scenario: No user id in the request
    //   Given a request without a verified userId
    //   When getMyRankedMovies is called
    //   Then it should return 401
    it("returns 401 when there is no userId", async () => {
      const req = {} as unknown as AuthenticatedRequest;
      const res = createMockResponse();

      await getMyRankedMovies(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  describe("getGlobalKineticRankedMovies", () => {
    // Scenario: Return the global Top 10 ranking, mapped to id (not movieId)
    //   Given aggregated ranking data exists
    //   When getGlobalKineticRankedMovies is called
    //   Then it should return the top 10 ranked movies with movieId mapped to id
    it("returns the global ranking, limited to 10, mapped to id", async () => {
      vi.mocked(getGlobalRanking).mockResolvedValue([
        {
          movieId: 550,
          title: "Fight Club",
          posterUrl: "https://example.com/poster.jpg",
          releaseYear: 1999,
          averageRating: 8.5,
          ratingCount: 3,
        },
      ]);

      const req = {} as unknown as AuthenticatedRequest;
      const res = createMockResponse();

      await getGlobalKineticRankedMovies(req, res);

      expect(getGlobalRanking).toHaveBeenCalledWith(10);
      expect(res.json).toHaveBeenCalledWith({
        ranking: [
          {
            id: 550,
            title: "Fight Club",
            posterUrl: "https://example.com/poster.jpg",
            releaseYear: 1999,
            averageRating: 8.5,
            ratingCount: 3,
          },
        ],
      });
    });

    // Scenario: Backend error while fetching the ranking
    //   Given getGlobalRanking throws an error
    //   When getGlobalKineticRankedMovies is called
    //   Then it should return 500
    it("returns 500 when fetching the ranking fails", async () => {
      vi.mocked(getGlobalRanking).mockRejectedValue(new Error("DB error"));

      const req = {} as unknown as AuthenticatedRequest;
      const res = createMockResponse();

      await getGlobalKineticRankedMovies(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
