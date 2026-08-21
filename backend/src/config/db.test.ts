import { describe, it, expect, afterAll } from "vitest";
import prisma from "./db.js";

describe("Database connection", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("connects and creates a test User and Movie record", async () => {
    const testUid = `test-${Date.now()}`;

    const user = await prisma.user.create({
      data: { uid: testUid, name: "Test", email: `${testUid}@test.com` },
    });

    const movie = await prisma.movie.create({
      data: { userId: user.id, movieId: 1, rating: 5, title: "Test" },
    });

    expect(user.uid).toBe(testUid);
    expect(movie.title).toBe("Test");

    await prisma.movie.delete({ where: { id: movie.id } });
    await prisma.user.delete({ where: { id: user.id } });
  });
});
