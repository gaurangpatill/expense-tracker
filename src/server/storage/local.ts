import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

import type { StorageAdapter, StoredFile } from "./types";

const uploadRoot = process.env.UPLOAD_DIR ?? "./public/uploads";

export const localStorage: StorageAdapter = {
  async saveFile(buffer: Buffer, filename: string, mimeType: string): Promise<StoredFile> {
    await mkdir(uploadRoot, { recursive: true });
    const ext = path.extname(filename) || ".bin";
    const storedName = `${randomUUID()}${ext}`;
    const storedPath = path.join(uploadRoot, storedName);
    await writeFile(storedPath, buffer);

    return {
      path: storedPath,
      url: `/uploads/${storedName}`,
      mimeType,
      size: buffer.length,
    };
  },
};
