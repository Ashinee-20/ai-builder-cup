import "server-only";
import { timingSafeEqual } from "node:crypto";

export function hasWorkspaceAccess(request: Request) {
  const expectedValue = process.env.CHALKEVO_WORKSPACE_ACCESS_CODE?.trim();
  if (!expectedValue) return process.env.NODE_ENV !== "production";
  const suppliedValue = request.headers.get("x-chalkevo-access-code") || "";
  const expected = Buffer.from(expectedValue);
  const supplied = Buffer.from(suppliedValue);
  return expected.length === supplied.length && timingSafeEqual(expected, supplied);
}

