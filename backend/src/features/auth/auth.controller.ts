import type { Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/verifyFirebaseToken.js";
import {
  createUser,
  getUserByUid,
  updateUser,
  deleteUser,
} from "../user/user.model.js";

export async function createUserRecord(
  req: AuthenticatedRequest,
  res: Response,
) {
  const uid = req.userId;
  const { name, email, avatarUrl } = req.body;

  if (!uid) {
    return res.status(401).json({ error: "No user id in request" });
  }

  try {
    const existing = await getUserByUid(uid);
    if (existing) {
      return res.status(200).json(existing);
    }

    const user = await createUser({ uid, name, email, avatarUrl });
    return res.status(201).json(user);
  } catch (error) {
    console.error("Failed to create user record:", error);
    return res.status(500).json({ error: "Failed to create user record" });
  }
}

export async function syncUserOnLogin(
  req: AuthenticatedRequest,
  res: Response,
) {
  const uid = req.userId;
  const { name, avatarUrl } = req.body;

  if (!uid) {
    return res.status(401).json({ error: "No user id in request" });
  }

  try {
    const existing = await getUserByUid(uid);

    if (!existing) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = await updateUser({ uid, name, avatarUrl });
    return res.json(user);
  } catch (error) {
    console.error("Failed to sync user on login:", error);
    return res.status(500).json({ error: "Failed to sync user" });
  }
}

export async function deleteUserRecord(
  req: AuthenticatedRequest,
  res: Response,
) {
  const uid = req.userId;

  if (!uid) {
    return res.status(401).json({ error: "No user id in request" });
  }

  try {
    await deleteUser(uid);
    return res.status(204).send();
  } catch (error) {
    console.error("Failed to delete user record:", error);
    return res.status(500).json({ error: "Failed to delete user record" });
  }
}
