import type { StorageAdapter } from "./types";
import { localStorage } from "./local";

export const storage: StorageAdapter = localStorage;
