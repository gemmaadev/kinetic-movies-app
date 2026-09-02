import { describe, it, expect, afterAll } from "vitest";
import prisma from "./db.js";

describe("Database connection", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  // Scenario: Database connection works end-to-end
  //   Given a real connection to the database
  //   When a User and a related UserMovie are created
  //   Then both should be persisted correctly, then cleaned up
  it("connects and creates a test User and UserMovie record", async () => {
    const testUid = `test-${Date.now()}`;

    const user = await prisma.user.create({
      data: { uid: testUid, name: "Test", email: `${testUid}@test.com` },
    });

    const userMovie = await prisma.userMovie.create({
      data: { userId: user.id, movieId: 1, isFavourite: true, userRating: 8 },
    });

    expect(user.uid).toBe(testUid);
    expect(userMovie.isFavourite).toBe(true);

    await prisma.userMovie.delete({ where: { id: userMovie.id } });
    await prisma.user.delete({ where: { id: user.id } });
  });
});
