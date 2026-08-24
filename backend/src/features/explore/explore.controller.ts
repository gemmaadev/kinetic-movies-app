import type { Request, Response } from "express";
import { tmdbFetch } from "../../shared/tmdbClient.js";
import type {
  TmdbMovieRaw,
  TmdbPersonRaw,
  Movie,
  Person,
} from "./explore.types.js";

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

function mapPerson(person: TmdbPersonRaw): Person {
  return {
    id: person.id,
    name: person.name,
    photoUrl: person.profile_path
      ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
      : null,
  };
}

export async function exploreController(req: Request, res: Response) {
  const { search, genre, minRating, year, language, page } = req.query;

  try {
    if (search && typeof search === "string") {
      const [movieResults, personResults] = await Promise.all([
        tmdbFetch("/search/movie", { query: search }).catch((error) => {
          console.error("Movie search failed:", error);
          return null;
        }),
        tmdbFetch("/search/person", { query: search }).catch((error) => {
          console.error("Person search failed:", error);
          return null;
        }),
      ]);

      if (movieResults === null && personResults === null) {
        return res
          .status(502)
          .json({ error: "Failed to fetch data from TMDB" });
      }

      const actors = personResults
        ? personResults.results
            .filter(
              (person: TmdbPersonRaw) =>
                person.known_for_department === "Acting",
            )
            .map(mapPerson)
        : [];

      const directors = personResults
        ? personResults.results
            .filter(
              (person: TmdbPersonRaw) =>
                person.known_for_department === "Directing",
            )
            .map(mapPerson)
        : [];

      return res.json({
        movies: movieResults ? movieResults.results.map(mapMovie) : [],
        actors,
        directors,
      });
    }

    const params: Record<string, string> = {};
    if (genre) params.with_genres = String(genre);
    if (minRating) params["vote_average.gte"] = String(minRating);
    if (year) params.primary_release_year = String(year);
    if (language) params.with_original_language = String(language);
    if (page) params.page = String(page);

    params["vote_count.gte"] = "50";
    params.sort_by = "popularity.desc";

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
