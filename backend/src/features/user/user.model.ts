import prisma from "../../config/db.js";
import type { User } from "../../generated/prisma/client.js";

export type { User };

export async function createUser(data: {
  uid: string;
  name: string;
  email: string;
  avatarUrl?: string;
}): Promise<User> {
  return prisma.user.create({ data });
}

export async function getUserByUid(uid: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { uid } });
}

export async function updateUser(data: {
  uid: string;
  name: string;
  avatarUrl?: string;
}): Promise<User> {
  return prisma.user.update({
    where: { uid: data.uid },
    data: { name: data.name, avatarUrl: data.avatarUrl },
  });
}

export async function deleteUser(uid: string): Promise<void> {
  await prisma.user.delete({ where: { uid } });
}
