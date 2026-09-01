import prisma from "../../config/db.js";
import type { UserMovie, Prisma } from "../../generated/prisma/client.js";

export type { UserMovie };

async function updateOrInsertMovie(data: {
  userId: string;
  movieId: number;
  update: Prisma.UserMovieUpdateInput;
  create: Prisma.UserMovieUncheckedCreateInput;
}): Promise<UserMovie> {
  return prisma.userMovie.upsert({
    where: { userId_movieId: { userId: data.userId, movieId: data.movieId } },
    update: data.update,
    create: data.create,
  });
}

export async function updateMovieFavorite(data: {
  userId: string;
  movieId: number;
  title?: string;
  posterUrl?: string | null;
  voteAverage?: number;
  releaseYear?: number | null;
}): Promise<UserMovie> {
  const existing = await prisma.userMovie.findUnique({
    where: { userId_movieId: { userId: data.userId, movieId: data.movieId } },
  });

  const newFavoriteStatus = !existing?.isFavourite;

  return updateOrInsertMovie({
    userId: data.userId,
    movieId: data.movieId,
    update: { isFavourite: newFavoriteStatus },
    create: {
      userId: data.userId,
      movieId: data.movieId,
      isFavourite: true,
      title: data.title,
      posterUrl: data.posterUrl,
      voteAverage: data.voteAverage,
      releaseYear: data.releaseYear,
    },
  });
}

export async function updateMovieRating(data: {
  userId: string;
  movieId: number;
  rating: number;
}): Promise<UserMovie> {
  if (data.rating < 1 || data.rating > 10) {
    throw new Error("Rating must be between 1 and 10");
  }

  return updateOrInsertMovie({
    userId: data.userId,
    movieId: data.movieId,
    update: { userRating: data.rating },
    create: {
      userId: data.userId,
      movieId: data.movieId,
      userRating: data.rating,
    },
  });
}

export async function getFavoritesByUser(userId: string): Promise<UserMovie[]> {
  return prisma.userMovie.findMany({ where: { userId, isFavourite: true } });
}

export async function getUserMovie(
  userId: string,
  movieId: number,
): Promise<UserMovie | null> {
  return prisma.userMovie.findUnique({
    where: { userId_movieId: { userId, movieId } },
  });
}

export async function getRankedMoviesByUser(
  userId: string,
): Promise<UserMovie[]> {
  return prisma.userMovie.findMany({
    where: { userId, userRating: { not: null } },
    orderBy: { userRating: "desc" },
  });
}

export async function getGlobalRanking(limit: number): Promise<
  {
    movieId: number;
    title: string | null;
    posterUrl: string | null;
    averageRating: number;
    ratingCount: number;
  }[]
> {
  const grouped = await prisma.userMovie.groupBy({
    by: ["movieId"],
    where: { userRating: { not: null } },
    _avg: { userRating: true },
    _count: { userRating: true },
    orderBy: { _avg: { userRating: "desc" } },
    take: limit,
  });

  const movieIds = grouped.map((group) => group.movieId);

  const movieDetails = await prisma.userMovie.findMany({
    where: { movieId: { in: movieIds } },
    distinct: ["movieId"],
    select: { movieId: true, title: true, posterUrl: true },
  });

  const detailsMap = new Map(
    movieDetails.map((movie) => [movie.movieId, movie]),
  );

  return grouped.map((group) => ({
    movieId: group.movieId,
    title: detailsMap.get(group.movieId)?.title ?? null,
    posterUrl: detailsMap.get(group.movieId)?.posterUrl ?? null,
    averageRating: group._avg.userRating ?? 0,
    ratingCount: group._count.userRating,
  }));
}
