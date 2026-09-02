import { describe, it, expect, vi } from "vitest";
import type { Response, NextFunction } from "express";
import { verifyFirebaseToken } from "./verifyFirebaseToken.js";
import type { AuthenticatedRequest } from "./verifyFirebaseToken.js";
import { firebaseAuth } from "../shared/firebaseAdmin.js";

vi.mock("../shared/firebaseAdmin.js", () => ({
  firebaseAuth: {
    verifyIdToken: vi.fn(),
  },
}));

function createMockResponse() {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

describe("verifyFirebaseToken", () => {
  // Scenario: Valid token
  //   Given a request with a valid Firebase token
  //   When verifyFirebaseToken runs
  //   Then it should attach userId to the request and call next()
  it("calls next() and sets req.userId when the token is valid", async () => {
    vi.mocked(firebaseAuth.verifyIdToken).mockResolvedValue({
      uid: "user-123",
    } as any);

    const req = {
      headers: { authorization: "Bearer valid-token" },
    } as AuthenticatedRequest;
    const res = createMockResponse();
    const next = vi.fn() as NextFunction;

    await verifyFirebaseToken(req, res, next);

    expect(req.userId).toBe("user-123");
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  // Scenario: Invalid or expired token
  //   Given a request with a token that Firebase rejects
  //   When verifyFirebaseToken runs
  //   Then it should return 401 without calling next()
  it("returns 401 when the token is invalid", async () => {
    vi.mocked(firebaseAuth.verifyIdToken).mockRejectedValue(
      new Error("Invalid token"),
    );

    const req = {
      headers: { authorization: "Bearer invalid-token" },
    } as AuthenticatedRequest;
    const res = createMockResponse();
    const next = vi.fn() as NextFunction;

    await verifyFirebaseToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid or expired token",
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Scenario: No token provided
  //   Given a request without an Authorization header
  //   When verifyFirebaseToken runs
  //   Then it should return 401 without calling next()
  it("returns 401 when no token is provided", async () => {
    const req = { headers: {} } as AuthenticatedRequest;
    const res = createMockResponse();
    const next = vi.fn() as NextFunction;

    await verifyFirebaseToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "No token provided" });
    expect(next).not.toHaveBeenCalled();
  });
});
