import type { Response } from "express";
import { AuthenticatedRequest } from "../../../middleware/verifyFirebaseToken.js";
import {
  getFavoritesByUser,
  updateMovieFavorite,
  updateMovieRating,
} from "../movie.model.js";

export async function getFavoriteMovies(
  req: AuthenticatedRequest,
  res: Response,
) {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ error: "No user id in request" });
  }

  try {
    const favorites = await getFavoritesByUser(userId);

    const movies = favorites.map((favorite) => ({
      id: favorite.movieId,
      title: favorite.title,
      posterUrl: favorite.posterUrl,
      voteAverage: favorite.voteAverage,
      releaseYear: favorite.releaseYear,
      userRating: favorite.userRating,
      addedAt: favorite.addedAt,
    }));

    return res.json({ favorites: movies });
  } catch (error) {
    console.error("Failed to fetch favorite movies:", error);
    return res.status(500).json({ error: "Failed to fetch favorite movies" });
  }
}

export async function toggleFavorite(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  const { movieId, title, posterUrl, voteAverage, releaseYear } = req.body;

  if (!userId) {
    return res.status(401).json({ error: "No user id in request" });
  }

  if (typeof movieId !== "number") {
    return res.status(400).json({ error: "movieId must be a number" });
  }

  try {
    const result = await updateMovieFavorite({
      userId,
      movieId,
      title,
      posterUrl,
      voteAverage,
      releaseYear,
    });
    return res.json(result);
  } catch (error) {
    console.error("Failed to toggle favorite:", error);
    return res.status(500).json({ error: "Failed to toggle favorite" });
  }
}

export async function rateMovie(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  const { movieId, rating } = req.body;

  if (!userId) {
    return res.status(401).json({ error: "No user id in request" });
  }

  if (typeof movieId !== "number") {
    return res.status(400).json({ error: "movieId must be a number" });
  }

  if (typeof rating !== "number" || rating < 1 || rating > 10) {
    return res
      .status(400)
      .json({ error: "rating must be a number between 1 and 10" });
  }

  try {
    const result = await updateMovieRating({ userId, movieId, rating });
    return res.json(result);
  } catch (error) {
    console.error("Failed to rate movie:", error);
    return res.status(500).json({ error: "Failed to rate movie" });
  }
}
