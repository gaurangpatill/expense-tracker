import bcrypt from "bcrypt";

import { prisma } from "@/db/prisma";

export async function changePassword(userId: string, currentPassword: string, newPassword: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error("User not found");
  }

  if (!user.passwordHash) {
    throw new Error("Password not set for this account");
  }

  const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isValid) {
    throw new Error("Current password is incorrect");
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });

  return { ok: true };
}

export async function softDeleteUser(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { deletedAt: new Date() },
  });

  await prisma.session.deleteMany({ where: { userId } });
  return { ok: true };
}
