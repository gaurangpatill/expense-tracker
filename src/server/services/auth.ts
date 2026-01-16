import { auth } from "@/auth";
import { prisma } from "@/db/prisma";

export async function requireUser() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.deletedAt) {
    throw new Error("Unauthorized");
  }

  return { userId, session };
}
