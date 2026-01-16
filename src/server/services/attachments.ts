import { prisma } from "@/db/prisma";
import { storage } from "@/server/storage";

const allowedMimeTypes = ["image/png", "image/jpeg", "image/webp"];

export async function uploadAttachment(userId: string, file: File) {
  if (!allowedMimeTypes.includes(file.type)) {
    throw new Error("Unsupported file type");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const stored = await storage.saveFile(buffer, file.name, file.type);

  return prisma.attachment.create({
    data: {
      userId,
      path: stored.path,
      url: stored.url,
      mimeType: stored.mimeType,
      size: stored.size,
    },
  });
}
