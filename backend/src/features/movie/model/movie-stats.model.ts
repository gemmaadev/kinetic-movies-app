import prisma from "../../../config/db.js";
import type { UserMovie } from "./movie.model.js";

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
