import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Response } from "express";
import { getProfile, updateProfile } from "./user.controller.js";
import type { AuthenticatedRequest } from "../../middleware/verifyFirebaseToken.js";
import { getUserByUid, updateUser } from "./user.model.js";

vi.mock("./user.model.js", () => ({
  getUserByUid: vi.fn(),
  updateUser: vi.fn(),
}));

function createMockResponse() {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

const mockUser = {
  id: "cuid123",
  uid: "firebase-uid-1",
  name: "Test User",
  email: "test@example.com",
  avatarUrl: null,
  createdAt: new Date(),
};

describe("user.controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getProfile", () => {
    // Scenario: Get the authenticated user's own profile
    //   Given a valid Firebase token for an existing user
    //   When getProfile is called
    //   Then the user's data should be returned
    it("returns the user's profile when they exist", async () => {
      vi.mocked(getUserByUid).mockResolvedValue(mockUser);

      const req = {
        userId: "firebase-uid-1",
      } as unknown as AuthenticatedRequest;
      const res = createMockResponse();

      await getProfile(req, res);

      expect(getUserByUid).toHaveBeenCalledWith("firebase-uid-1");
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    // Scenario: Profile requested for a user not in the DB
    //   Given a valid Firebase token with no matching User row
    //   When getProfile is called
    //   Then it should return 404
    it("returns 404 when the user does not exist", async () => {
      vi.mocked(getUserByUid).mockResolvedValue(null);

      const req = { userId: "unknown-uid" } as unknown as AuthenticatedRequest;
      const res = createMockResponse();

      await getProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    // Scenario: No user id in the request
    //   Given a request without a verified userId
    //   When getProfile is called
    //   Then it should return 401
    it("returns 401 when there is no userId", async () => {
      const req = {} as unknown as AuthenticatedRequest;
      const res = createMockResponse();

      await getProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  describe("updateProfile", () => {
    // Scenario: Update the authenticated user's own profile
    //   Given a valid Firebase token for an existing user
    //   When updateProfile is called with a new name
    //   Then the user's data should be updated and returned
    it("updates and returns the user when they exist", async () => {
      vi.mocked(getUserByUid).mockResolvedValue(mockUser);
      vi.mocked(updateUser).mockResolvedValue({
        ...mockUser,
        name: "New Name",
      });

      const req = {
        userId: "firebase-uid-1",
        body: { name: "New Name" },
      } as unknown as AuthenticatedRequest;
      const res = createMockResponse();

      await updateProfile(req, res);

      expect(updateUser).toHaveBeenCalledWith({
        uid: "firebase-uid-1",
        name: "New Name",
        avatarUrl: undefined,
      });
      expect(res.json).toHaveBeenCalledWith({ ...mockUser, name: "New Name" });
    });

    // Scenario: Update a profile that doesn't exist
    //   Given a valid Firebase token with no matching User row
    //   When updateProfile is called
    //   Then it should return 404 without attempting the update
    it("returns 404 when the user does not exist", async () => {
      vi.mocked(getUserByUid).mockResolvedValue(null);

      const req = {
        userId: "unknown-uid",
        body: { name: "New Name" },
      } as unknown as AuthenticatedRequest;
      const res = createMockResponse();

      await updateProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(updateUser).not.toHaveBeenCalled();
    });

    // Scenario: No user id in the request
    //   Given a request without a verified userId
    //   When updateProfile is called
    //   Then it should return 401
    it("returns 401 when there is no userId", async () => {
      const req = { body: {} } as unknown as AuthenticatedRequest;
      const res = createMockResponse();

      await updateProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });
});
