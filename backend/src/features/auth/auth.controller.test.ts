import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Response } from "express";
import {
  createUserRecord,
  syncUserOnLogin,
  deleteUserRecord,
} from "./auth.controller.js";
import type { AuthenticatedRequest } from "../../middleware/verifyFirebaseToken.js";
import {
  createUser,
  getUserByUid,
  updateUser,
  deleteUser,
} from "../user/user.model.js";

vi.mock("../user/user.model.js", () => ({
  createUser: vi.fn(),
  getUserByUid: vi.fn(),
  updateUser: vi.fn(),
  deleteUser: vi.fn(),
}));

function createMockResponse() {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.send = vi.fn().mockReturnValue(res);
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

describe("auth.controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createUserRecord", () => {
    // Scenario: Register a new user
    //   Given a valid Firebase token with a uid that doesn't exist in the DB yet
    //   When createUserRecord is called
    //   Then a new user should be created and returned with status 201
    it("creates a new user when they don't already exist", async () => {
      vi.mocked(getUserByUid).mockResolvedValue(null);
      vi.mocked(createUser).mockResolvedValue(mockUser);

      const req = {
        userId: "firebase-uid-1",
        body: { name: "Test User", email: "test@example.com" },
      } as unknown as AuthenticatedRequest;
      const res = createMockResponse();

      await createUserRecord(req, res);

      expect(createUser).toHaveBeenCalledWith({
        uid: "firebase-uid-1",
        name: "Test User",
        email: "test@example.com",
        avatarUrl: undefined,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    // Scenario: Register an already-existing user
    //   Given a Firebase token with a uid that already exists in the DB
    //   When createUserRecord is called
    //   Then the existing user should be returned with status 200,
    //   without creating a duplicate
    it("returns the existing user without creating a duplicate", async () => {
      vi.mocked(getUserByUid).mockResolvedValue(mockUser);

      const req = {
        userId: "firebase-uid-1",
        body: { name: "Test User", email: "test@example.com" },
      } as unknown as AuthenticatedRequest;
      const res = createMockResponse();

      await createUserRecord(req, res);

      expect(createUser).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    // Scenario: No user id in the request
    //   Given a request without a verified userId
    //   When createUserRecord is called
    //   Then it should return 401
    it("returns 401 when there is no userId", async () => {
      const req = { body: {} } as unknown as AuthenticatedRequest;
      const res = createMockResponse();

      await createUserRecord(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  describe("syncUserOnLogin", () => {
    // Scenario: Sync an existing user on login
    //   Given a Firebase token for a user that already exists in the DB
    //   When syncUserOnLogin is called
    //   Then the user's name/avatar should be updated and returned
    it("updates and returns the user when they exist", async () => {
      vi.mocked(getUserByUid).mockResolvedValue(mockUser);
      vi.mocked(updateUser).mockResolvedValue({
        ...mockUser,
        name: "Updated Name",
      });

      const req = {
        userId: "firebase-uid-1",
        body: { name: "Updated Name" },
      } as unknown as AuthenticatedRequest;
      const res = createMockResponse();

      await syncUserOnLogin(req, res);

      expect(updateUser).toHaveBeenCalledWith({
        uid: "firebase-uid-1",
        name: "Updated Name",
        avatarUrl: undefined,
      });
      expect(res.json).toHaveBeenCalledWith({
        ...mockUser,
        name: "Updated Name",
      });
    });

    // Scenario: Login for a user that was never registered
    //   Given a Firebase token for a uid with no matching user in the DB
    //   When syncUserOnLogin is called
    //   Then it should return 404
    it("returns 404 when the user does not exist", async () => {
      vi.mocked(getUserByUid).mockResolvedValue(null);

      const req = {
        userId: "unknown-uid",
        body: { name: "Someone" },
      } as unknown as AuthenticatedRequest;
      const res = createMockResponse();

      await syncUserOnLogin(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(updateUser).not.toHaveBeenCalled();
    });
  });

  describe("deleteUserRecord", () => {
    // Scenario: Delete the authenticated user's own account
    //   Given a valid Firebase token
    //   When deleteUserRecord is called
    //   Then the user should be deleted and 204 returned
    it("deletes the user and returns 204", async () => {
      vi.mocked(deleteUser).mockResolvedValue(undefined);

      const req = {
        userId: "firebase-uid-1",
      } as unknown as AuthenticatedRequest;
      const res = createMockResponse();

      await deleteUserRecord(req, res);

      expect(deleteUser).toHaveBeenCalledWith("firebase-uid-1");
      expect(res.status).toHaveBeenCalledWith(204);
    });

    // Scenario: No user id in the request
    //   Given a request without a verified userId
    //   When deleteUserRecord is called
    //   Then it should return 401
    it("returns 401 when there is no userId", async () => {
      const req = {} as unknown as AuthenticatedRequest;
      const res = createMockResponse();

      await deleteUserRecord(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });
});
