import type { Request, Response } from "express";
import { tmdbFetch } from "../../shared/tmdbClient.js";

interface TmdbMovieRaw {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
}

interface TmdbPersonRaw {
  id: number;
  name: string;
  known_for_department: string;
  profile_path: string | null;
}

function mapMovie(movie: TmdbMovieRaw) {
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

function mapPerson(person: TmdbPersonRaw) {
  return {
    id: person.id,
    name: person.name,
    photoUrl: person.profile_path
      ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
      : null,
  };
}

export async function exploreController(req: Request, res: Response) {
  const { search, genre, minRating, sort, year, language, page } = req.query;

  try {
    if (search && typeof search === "string") {
      const [movieResults, personResults] = await Promise.all([
        tmdbFetch("/search/movie", { query: search }),
        tmdbFetch("/search/person", { query: search }),
      ]);

      const actors = personResults.results
        .filter(
          (person: TmdbPersonRaw) => person.known_for_department === "Acting",
        )
        .map(mapPerson);

      const directors = personResults.results
        .filter(
          (person: TmdbPersonRaw) =>
            person.known_for_department === "Directing",
        )
        .map(mapPerson);

      return res.json({
        movies: movieResults.results.map(mapMovie),
        actors,
        directors,
      });
    }

    const params: Record<string, string> = {};
    if (genre) params.with_genres = String(genre);
    if (minRating) params["vote_average.gte"] = String(minRating);
    if (sort) params.sort_by = String(sort);
    if (year) params.primary_release_year = String(year);
    if (language) params.with_original_language = String(language);
    if (page) params.page = String(page);

    const discoverResults = await tmdbFetch("/discover/movie", params);

    return res.json({
      movies: discoverResults.results.map(mapMovie),
      actors: [],
      directors: [],
    });
  } catch (error) {
    return res.status(502).json({ error: "Failed to fetch data from TMDB" });
  }
}
