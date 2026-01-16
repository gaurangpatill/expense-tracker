import { prisma } from "@/db/prisma";
import { categorySchema, categoryUpdateSchema } from "@/server/validators/category";

export async function listCategories(userId: string) {
  return prisma.category.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });
}

export async function createCategory(userId: string, data: unknown) {
  const parsed = categorySchema.parse(data);
  return prisma.category.create({
    data: {
      ...parsed,
      userId,
    },
  });
}

export async function updateCategory(userId: string, data: unknown) {
  const parsed = categoryUpdateSchema.parse(data);
  const result = await prisma.category.updateMany({
    where: { id: parsed.id, userId },
    data: {
      name: parsed.name,
      color: parsed.color,
      icon: parsed.icon,
    },
  });

  if (result.count === 0) {
    throw new Error("Category not found");
  }

  return prisma.category.findUniqueOrThrow({
    where: { id: parsed.id },
  });
}

export async function deleteCategory(userId: string, categoryId: string) {
  const transactionCount = await prisma.transaction.count({
    where: { userId, categoryId },
  });

  if (transactionCount > 0) {
    return { ok: false, error: "Category has transactions. Reassign or delete them first." };
  }

  const result = await prisma.category.deleteMany({
    where: { id: categoryId, userId },
  });

  if (result.count === 0) {
    return { ok: false, error: "Category not found" };
  }

  return { ok: true };
}
