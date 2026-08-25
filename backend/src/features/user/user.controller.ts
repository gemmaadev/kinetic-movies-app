import type { Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/verifyFirebaseToken.js";
import { getUserByUid, updateUser } from "./user.model.js";

export async function getProfile(req: AuthenticatedRequest, res: Response) {
  const uid = req.userId;

  if (!uid) {
    return res.status(401).json({ error: "No user id in request" });
  }

  try {
    const user = await getUserByUid(uid);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    console.error("Failed to get profile:", error);
    return res.status(500).json({ error: "Failed to get profile" });
  }
}

export async function updateProfile(req: AuthenticatedRequest, res: Response) {
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
    console.error("Failed to update profile:", error);
    return res.status(500).json({ error: "Failed to update profile" });
  }
}
