import type { Request, Response } from "express";
import { tmdbFetch, TmdbError } from "../../shared/tmdbClient.js";
import type {
  TmdbPersonDetailRaw,
  TmdbMovieCreditRaw,
  MovieCredit,
  PersonDetail,
} from "./person.types.js";

function mapMovieCredit(credit: TmdbMovieCreditRaw): MovieCredit {
  return {
    id: credit.id,
    title: credit.title,
    posterUrl: credit.poster_path
      ? `https://image.tmdb.org/t/p/w500${credit.poster_path}`
      : null,
    voteAverage: credit.vote_average,
    releaseYear: credit.release_date
      ? new Date(credit.release_date).getFullYear()
      : null,
    job: credit.job,
    character: credit.character,
  };
}

function mapPersonDetail(person: TmdbPersonDetailRaw): PersonDetail {
  const filmography = person.movie_credits.cast
    .map(mapMovieCredit)
    .sort(
      (firstCredit, secondCredit) =>
        (secondCredit.releaseYear ?? 0) - (firstCredit.releaseYear ?? 0),
    );

  const filmographyAsDirector = person.movie_credits.crew
    .filter((credit) => credit.job === "Director")
    .map(mapMovieCredit);

  return {
    id: person.id,
    name: person.name,
    photoUrl: person.profile_path
      ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
      : null,
    biography: person.biography,
    birthday: person.birthday,
    placeOfBirth: person.place_of_birth,
    filmography,
    filmographyAsDirector,
  };
}

export async function getPersonDetail(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const person = await tmdbFetch(`/person/${id}`, {
      append_to_response: "movie_credits",
      language: "es-ES",
    });
    return res.json(mapPersonDetail(person));
  } catch (error) {
    if (error instanceof TmdbError && error.status === 404) {
      return res.status(404).json({ error: "Person not found" });
    }
    console.error(`Failed to fetch person detail for id ${id}:`, error);
    return res.status(502).json({ error: "Failed to fetch data from TMDB" });
  }
}
