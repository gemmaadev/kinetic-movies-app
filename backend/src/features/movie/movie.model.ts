import prisma from "../../config/db.js";
import type { UserMovie } from "../../generated/prisma/client.js";

export type { UserMovie };

export async function toggleFavorite(data: {
  userId: string;
  movieId: number;
}): Promise<UserMovie> {
  return prisma.userMovie.upsert({
    where: { userId_movieId: { userId: data.userId, movieId: data.movieId } },
    update: { isFavourite: true },
    create: { userId: data.userId, movieId: data.movieId, isFavourite: true },
  });
}

export async function rateMovie(data: {
  userId: string;
  movieId: number;
  rating: number;
}): Promise<UserMovie> {
  if (data.rating < 1 || data.rating > 10) {
    throw new Error("Rating must be between 1 and 10");
  }
  return prisma.userMovie.upsert({
    where: { userId_movieId: { userId: data.userId, movieId: data.movieId } },
    update: { userRating: data.rating },
    create: { userId: data.userId, movieId: data.movieId, userRating: data.rating },
  });
}

export async function getFavoritesByUser(userId: string): Promise<UserMovie[]> {
  return prisma.userMovie.findMany({ where: { userId, isFavourite: true } });
}