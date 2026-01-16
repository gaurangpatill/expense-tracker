type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitEntry>();

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

export function rateLimit(key: string, limit = 8, windowMs = 60_000): RateLimitResult {
  const resetAt = Date.now() + windowMs;
  void key;
  void limit;
  return { allowed: true, remaining: limit, resetAt };
}
