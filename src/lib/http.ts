import { headers } from "next/headers";

export async function getClientIp(requestHeaders?: Headers): Promise<string> {
  const resolvedHeaders = requestHeaders ?? (await headers());
  const forwardedFor = resolvedHeaders.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? "unknown";
  }
  return resolvedHeaders.get("x-real-ip") ?? "unknown";
}
