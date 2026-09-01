import type { Response } from "express";
import type { AuthenticatedRequest } from "../../../middleware/verifyFirebaseToken.js";
import {
  getGlobalRanking,
  getRankedMoviesByUser,
} from "../model/movie-stats.model.js";

export async function getMyRankedMovies(
  req: AuthenticatedRequest,
  res: Response,
) {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ error: "No user id in request" });
  }

  try {
    const rankedMovies = await getRankedMoviesByUser(userId);

    const movies = rankedMovies.map((movie) => ({
      id: movie.movieId,
      title: movie.title,
      posterUrl: movie.posterUrl,
      voteAverage: movie.voteAverage,
      releaseYear: movie.releaseYear,
      userRating: movie.userRating,
    }));

    return res.json({ ranking: movies });
  } catch (error) {
    console.error("Failed to fetch user's ranked movies:", error);
    return res.status(500).json({ error: "Failed to fetch ranked movies" });
  }
}

export async function getGlobalKineticRankedMovies(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const ranking = await getGlobalRanking(10);

    const movies = ranking.map((entry) => ({
      id: entry.movieId,
      title: entry.title,
      posterUrl: entry.posterUrl,
      averageRating: entry.averageRating,
      ratingCount: entry.ratingCount,
    }));

    return res.json({ ranking: movies });
  } catch (error) {
    console.error("Failed to fetch global ranking:", error);
    return res.status(500).json({ error: "Failed to fetch global ranking" });
  }
}
