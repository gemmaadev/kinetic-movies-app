import { describe, it, expect, beforeEach, afterAll } from "vitest";
import prisma from "../../../config/db.js";
import {
  getGlobalRanking,
  getRankedMoviesByUser,
} from "./movie-stats.model.js";

async function createTestUser(suffix: string) {
  return prisma.user.create({
    data: {
      uid: `test-uid-${suffix}-${Date.now()}`,
      name: `Test User ${suffix}`,
      email: `test-${suffix}-${Date.now()}@test.com`,
    },
  });
}

describe("movie.model aggregations", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("getGlobalRanking", () => {
    // Scenario: Movie with no ratings is excluded from the ranking
    //   Given a movie has never been rated by anyone
    //   When getGlobalRanking is called
    //   Then that movie should not appear in the results
    it("excludes movies with zero ratings", async () => {
      const user = await createTestUser("no-rating");
      await prisma.userMovie.create({
        data: { userId: user.id, movieId: 99999, isFavourite: true },
      });

      const ranking = await getGlobalRanking(50);

      const found = ranking.find((entry) => entry.movieId === 99999);
      expect(found).toBeUndefined();

      await prisma.userMovie.deleteMany({ where: { userId: user.id } });
      await prisma.user.delete({ where: { id: user.id } });
    });

    // Scenario: Movie with a single rating shows that exact average
    //   Given a movie has been rated once, with an 8
    //   When getGlobalRanking is called
    //   Then its average should be exactly 8, with a count of 1
    it("calculates the correct average for a single rating", async () => {
      const user = await createTestUser("single-rating");
      await prisma.userMovie.create({
        data: {
          userId: user.id,
          movieId: 88888,
          userRating: 8,
          title: "Test Movie",
        },
      });

      const ranking = await getGlobalRanking(50);

      const found = ranking.find((entry) => entry.movieId === 88888);
      expect(found).toEqual(
        expect.objectContaining({
          movieId: 88888,
          averageRating: 8,
          ratingCount: 1,
          title: "Test Movie",
        }),
      );

      await prisma.userMovie.deleteMany({ where: { userId: user.id } });
      await prisma.user.delete({ where: { id: user.id } });
    });

    // Scenario: Movie with multiple ratings shows the correct average
    //   Given a movie has been rated by two different users (6 and 10)
    //   When getGlobalRanking is called
    //   Then its average should be 8, with a count of 2
    it("calculates the correct average across multiple ratings", async () => {
      const userA = await createTestUser("multi-a");
      const userB = await createTestUser("multi-b");

      await prisma.userMovie.create({
        data: { userId: userA.id, movieId: 77777, userRating: 6 },
      });
      await prisma.userMovie.create({
        data: { userId: userB.id, movieId: 77777, userRating: 10 },
      });

      const ranking = await getGlobalRanking(50);

      const found = ranking.find((entry) => entry.movieId === 77777);
      expect(found).toEqual(
        expect.objectContaining({
          movieId: 77777,
          averageRating: 8,
          ratingCount: 2,
        }),
      );

      await prisma.userMovie.deleteMany({
        where: { userId: { in: [userA.id, userB.id] } },
      });
      await prisma.user.deleteMany({
        where: { id: { in: [userA.id, userB.id] } },
      });
    });

    // Scenario: Results are ordered by average rating, descending
    //   Given two movies with different averages (5 and 9)
    //   When getGlobalRanking is called
    //   Then the higher-rated movie should come first
    it("orders results by average rating, descending", async () => {
      const user = await createTestUser("order-check");

      await prisma.userMovie.create({
        data: { userId: user.id, movieId: 66661, userRating: 5 },
      });
      await prisma.userMovie.create({
        data: { userId: user.id, movieId: 66662, userRating: 9 },
      });

      const ranking = await getGlobalRanking(50);

      const index1 = ranking.findIndex((entry) => entry.movieId === 66661);
      const index2 = ranking.findIndex((entry) => entry.movieId === 66662);

      expect(index2).toBeLessThan(index1);

      await prisma.userMovie.deleteMany({ where: { userId: user.id } });
      await prisma.user.delete({ where: { id: user.id } });
    });
  });

  describe("getRankedMoviesByUser", () => {
    // Scenario: Only returns movies the user has actually rated
    //   Given the user has one rated movie and one favorite without a rating
    //   When getRankedMoviesByUser is called
    //   Then only the rated movie should be returned
    it("excludes unrated movies from the user's own ranking", async () => {
      const user = await createTestUser("mixed");

      await prisma.userMovie.create({
        data: { userId: user.id, movieId: 55551, userRating: 7 },
      });
      await prisma.userMovie.create({
        data: { userId: user.id, movieId: 55552, isFavourite: true },
      });

      const ranked = await getRankedMoviesByUser(user.id);

      expect(ranked).toHaveLength(1);
      expect(ranked[0].movieId).toBe(55551);

      await prisma.userMovie.deleteMany({ where: { userId: user.id } });
      await prisma.user.delete({ where: { id: user.id } });
    });
  });
});
