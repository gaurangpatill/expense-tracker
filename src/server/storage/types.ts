export type StoredFile = {
  path: string;
  url: string;
  mimeType: string;
  size: number;
};

export interface StorageAdapter {
  saveFile(buffer: Buffer, filename: string, mimeType: string): Promise<StoredFile>;
}
