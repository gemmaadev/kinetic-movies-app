import type { Request, Response } from "express";
import { tmdbFetch } from "../../../shared/tmdbClient.js";
import type {
  TmdbMovieRaw,
  TmdbMovieDetailRaw,
  Movie,
  MovieDetailFromTmdb,
} from "../movie.types.js";
import type { AuthenticatedRequest } from "../../../middleware/verifyFirebaseToken.js";
import { getUserMovie } from "../model/movie.model.js";

function mapMovie(movie: TmdbMovieRaw): Movie {
  return {
    id: movie.id,
    title: movie.title,
    posterUrl: movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : null,
    voteAverage: movie.vote_average,
    releaseYear: movie.release_date
      ? new Date(movie.release_date).getFullYear()
      : null,
  };
}

function mapMovieDetail(movie: TmdbMovieDetailRaw): MovieDetailFromTmdb {
  const trailer = movie.videos.results.find(
    (video) => video.site === "YouTube" && video.type === "Trailer",
  );

  const director = movie.credits.crew.find(
    (member) => member.job === "Director",
  );

  const writers = movie.credits.crew
    .filter((member) => member.job === "Writer" || member.job === "Screenplay")
    .map((member) => member.name);

  const watchProviders =
    movie["watch/providers"].results.ES?.flatrate?.map((provider) => ({
      providerId: provider.provider_id,
      providerName: provider.provider_name,
      logoUrl: `https://image.tmdb.org/t/p/w92${provider.logo_path}`,
    })) ?? [];

  const watchProvidersLink = movie["watch/providers"].results.ES?.link ?? null;

  return {
    ...mapMovie(movie),
    overview: movie.overview,
    backdropUrl: movie.backdrop_path
      ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
      : null,
    runtime: movie.runtime,
    genres: movie.genres,
    tagline: movie.tagline,
    cast: movie.credits.cast.slice(0, 10).map((member) => ({
      id: member.id,
      name: member.name,
      character: member.character,
      photoUrl: member.profile_path
        ? `https://image.tmdb.org/t/p/w200${member.profile_path}`
        : null,
    })),
    director: director ? { id: director.id, name: director.name } : null,
    writers,
    trailerUrl: trailer
      ? `https://www.youtube.com/watch?v=${trailer.key}`
      : null,
    watchProviders,
    watchProvidersLink,
  };
}

function getPageParam(req: Request): string {
  const page = Number(req.query.page);
  return page > 0 ? String(page) : "1";
}

export async function getPopular(req: Request, res: Response) {
  try {
    const results = await tmdbFetch("/movie/popular", {
      page: getPageParam(req),
    });
    return res.json({
      movies: results.results.map(mapMovie),
      totalPages: results.total_pages,
    });
  } catch (error) {
    console.error("Failed to fetch popular movies:", error);
    return res.status(502).json({ error: "Failed to fetch data from TMDB" });
  }
}

export async function getNowPlaying(req: Request, res: Response) {
  try {
    const results = await tmdbFetch("/movie/now_playing", {
      region: "ES",
      page: getPageParam(req),
    });
    return res.json({
      movies: results.results.map(mapMovie),
      totalPages: results.total_pages,
    });
  } catch (error) {
    console.error("Failed to fetch now playing movies:", error);
    return res.status(502).json({ error: "Failed to fetch data from TMDB" });
  }
}

export async function getTrending(req: Request, res: Response) {
  try {
    const results = await tmdbFetch("/trending/movie/week", {
      page: getPageParam(req),
    });
    return res.json({
      movies: results.results.map(mapMovie),
      totalPages: results.total_pages,
    });
  } catch (error) {
    console.error("Failed to fetch trending movies:", error);
    return res.status(502).json({ error: "Failed to fetch data from TMDB" });
  }
}

export async function getTopRated(req: Request, res: Response) {
  try {
    const results = await tmdbFetch("/movie/top_rated", {
      region: "ES",
      "vote_count.gte": "1000",
      page: getPageParam(req),
    });
    return res.json({
      movies: results.results.map(mapMovie),
      totalPages: results.total_pages,
    });
  } catch (error) {
    console.error("Failed to fetch top rated movies:", error);
    return res.status(502).json({ error: "Failed to fetch data from TMDB" });
  }
}

export async function getUpcoming(req: Request, res: Response) {
  try {
    const results = await tmdbFetch("/movie/upcoming", {
      region: "ES",
      page: getPageParam(req),
    });
    return res.json({
      movies: results.results.map(mapMovie),
      totalPages: results.total_pages,
    });
  } catch (error) {
    console.error("Failed to fetch upcoming movies:", error);
    return res.status(502).json({ error: "Failed to fetch data from TMDB" });
  }
}

export async function getMovieDetail(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const movie = await tmdbFetch(`/movie/${id}`, {
      append_to_response: "credits,videos,watch/providers",
      language: "es-ES",
    });

    let isFavourite = false;
    let userRating: number | null = null;
    if (userId) {
      const userMovie = await getUserMovie(userId, Number(id));
      isFavourite = userMovie?.isFavourite ?? false;
      userRating = userMovie?.userRating ?? null;
    }

    return res.json({ ...mapMovieDetail(movie), isFavourite, userRating });
  } catch (error) {
    console.error(`Failed to fetch movie detail for id ${id}:`, error);
    return res.status(502).json({ error: "Failed to fetch data from TMDB" });
  }
}