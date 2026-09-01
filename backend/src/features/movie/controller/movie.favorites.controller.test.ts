import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Response } from "express";
import type { AuthenticatedRequest } from "../../../middleware/verifyFirebaseToken.js";
import {
  updateMovieFavorite,
  updateMovieRating,
  getFavoritesByUser,
} from "../model/movie.model.js";
import {
  getFavoriteMovies,
  toggleFavorite,
  rateMovie,
} from "./movie.favorites.controller.js";

vi.mock("../model/movie.model.js", () => ({
  updateMovieFavorite: vi.fn(),
  updateMovieRating: vi.fn(),
  getFavoritesByUser: vi.fn(),
}));

function createMockResponse() {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

const mockUserMovie = {
  id: "cuid123",
  userId: "firebase-uid-1",
  movieId: 550,
  userRating: null,
  isFavourite: true,
  addedAt: new Date(),
  title: "Fight Club",
  posterUrl: "https://image.tmdb.org/t/p/w500/fightclub.jpg",
  voteAverage: 8.4,
  releaseYear: 1999,
};

describe("movie.favorites.controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getFavoriteMovies", () => {
    // Scenario: List the authenticated user's favorite movies
    //   Given the user has favorite movies saved
    //   When getFavoriteMovies is called
    //   Then it should return their list of favorites, mapped to the
    //   frontend's Movie shape
    it("returns the user's favorites mapped to Movie shape", async () => {
      vi.mocked(getFavoritesByUser).mockResolvedValue([mockUserMovie]);

      const req = {
        userId: "firebase-uid-1",
      } as unknown as AuthenticatedRequest;
      const res = createMockResponse();

      await getFavoriteMovies(req, res);

      expect(getFavoritesByUser).toHaveBeenCalledWith("firebase-uid-1");
      expect(res.json).toHaveBeenCalledWith({
        favorites: [
          {
            id: 550,
            title: "Fight Club",
            posterUrl: "https://image.tmdb.org/t/p/w500/fightclub.jpg",
            voteAverage: 8.4,
            releaseYear: 1999,
            userRating: null,
            addedAt: mockUserMovie.addedAt,
          },
        ],
      });
    });

    // Scenario: No user id in the request
    //   Given a request without a verified userId
    //   When getFavoriteMovies is called
    //   Then it should return 401
    it("returns 401 when there is no userId", async () => {
      const req = {} as unknown as AuthenticatedRequest;
      const res = createMockResponse();

      await getFavoriteMovies(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  describe("toggleFavorite", () => {
    // Scenario: Toggle a movie's favorite status
    //   Given a valid movieId and movie details
    //   When toggleFavorite is called
    //   Then it should update the favorite status and return the record
    it("toggles the favorite and returns the updated record", async () => {
      vi.mocked(updateMovieFavorite).mockResolvedValue(mockUserMovie);

      const req = {
        userId: "firebase-uid-1",
        body: {
          movieId: 550,
          title: "Fight Club",
          posterUrl: "https://image.tmdb.org/t/p/w500/fightclub.jpg",
          voteAverage: 8.4,
          releaseYear: 1999,
        },
      } as unknown as AuthenticatedRequest;
      const res = createMockResponse();

      await toggleFavorite(req, res);

      expect(updateMovieFavorite).toHaveBeenCalledWith({
        userId: "firebase-uid-1",
        movieId: 550,
        title: "Fight Club",
        posterUrl: "https://image.tmdb.org/t/p/w500/fightclub.jpg",
        voteAverage: 8.4,
        releaseYear: 1999,
      });
      expect(res.json).toHaveBeenCalledWith(mockUserMovie);
    });

    // Scenario: Invalid movieId type
    //   Given a movieId that is not a number
    //   When toggleFavorite is called
    //   Then it should return 400 without touching the database
    it("returns 400 when movieId is not a number", async () => {
      const req = {
        userId: "firebase-uid-1",
        body: { movieId: "not-a-number" },
      } as unknown as AuthenticatedRequest;
      const res = createMockResponse();

      await toggleFavorite(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(updateMovieFavorite).not.toHaveBeenCalled();
    });

    // Scenario: No user id in the request
    //   Given a request without a verified userId
    //   When toggleFavorite is called
    //   Then it should return 401
    it("returns 401 when there is no userId", async () => {
      const req = { body: { movieId: 550 } } as unknown as AuthenticatedRequest;
      const res = createMockResponse();

      await toggleFavorite(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  describe("rateMovie", () => {
    // Scenario: Rate a movie within valid range
    //   Given a rating between 1 and 10
    //   When rateMovie is called
    //   Then it should save the rating and return the updated record
    it("saves the rating and returns the updated record", async () => {
      vi.mocked(updateMovieRating).mockResolvedValue({
        ...mockUserMovie,
        userRating: 8,
      });

      const req = {
        userId: "firebase-uid-1",
        body: { movieId: 550, rating: 8 },
      } as unknown as AuthenticatedRequest;
      const res = createMockResponse();

      await rateMovie(req, res);

      expect(updateMovieRating).toHaveBeenCalledWith({
        userId: "firebase-uid-1",
        movieId: 550,
        rating: 8,
      });
      expect(res.json).toHaveBeenCalledWith({
        ...mockUserMovie,
        userRating: 8,
      });
    });

    // Scenario: Rating above the valid range
    //   Given a rating greater than 10
    //   When rateMovie is called
    //   Then it should return 400 without saving anything
    it("returns 400 when rating is above 10", async () => {
      const req = {
        userId: "firebase-uid-1",
        body: { movieId: 550, rating: 15 },
      } as unknown as AuthenticatedRequest;
      const res = createMockResponse();

      await rateMovie(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(updateMovieRating).not.toHaveBeenCalled();
    });

    // Scenario: Rating below the valid range
    //   Given a rating less than 1
    //   When rateMovie is called
    //   Then it should return 400 without saving anything
    it("returns 400 when rating is below 1", async () => {
      const req = {
        userId: "firebase-uid-1",
        body: { movieId: 550, rating: 0 },
      } as unknown as AuthenticatedRequest;
      const res = createMockResponse();

      await rateMovie(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(updateMovieRating).not.toHaveBeenCalled();
    });

    // Scenario: No user id in the request
    //   Given a request without a verified userId
    //   When rateMovie is called
    //   Then it should return 401
    it("returns 401 when there is no userId", async () => {
      const req = {
        body: { movieId: 550, rating: 8 },
      } as unknown as AuthenticatedRequest;
      const res = createMockResponse();

      await rateMovie(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });
});
