/* Shared helpers for route handlers: one response shape, one way to validate a JSON body. */

import { NextResponse } from "next/server";
import type { z } from "zod";
import { StorageUnavailableError } from "./storage";

export type ApiError = { error: { code: string; message: string; fields?: Record<string, string> } };

export const ok = <T>(data: T, status = 200) => NextResponse.json(data, { status });

export const fail = (status: number, code: string, message: string, fields?: Record<string, string>) =>
  NextResponse.json<ApiError>({ error: { code, message, ...(fields ? { fields } : {}) } }, { status });

/**
 * Parse and validate a JSON request body. Returns the typed data, or a ready-made
 * 400/422 response describing what was wrong (per field where possible).
 */
export async function readBody<S extends z.ZodType>(request: Request, schema: S): Promise<{ data: z.infer<S> } | { response: NextResponse }> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return { response: fail(400, "invalid_json", "The request body must be valid JSON.") };
  }
  const result = schema.safeParse(raw);
  if (result.success) return { data: result.data };

  const fields: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = issue.path.join(".") || "_";
    if (!(key in fields)) fields[key] = issue.message;
  }
  return { response: fail(422, "validation_failed", "Some details need another look.", fields) };
}

/** Turn anything a handler throws into a response; unknown errors are logged, never leaked. */
export function handleError(err: unknown, unavailableMessage: string) {
  if (err instanceof StorageUnavailableError) return fail(503, "storage_unavailable", unavailableMessage);
  console.error(err);
  return fail(500, "server_error", "Something went wrong on our side. Please try again in a moment.");
}
