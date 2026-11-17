/** Small fetch helper for the storefront's own API. Never throws: failures come back as `{ ok: false }`. */

export type ApiOk<T> = { ok: true; status: number; data: T };
export type ApiFail = {
  ok: false;
  status: number;
  /** A message that is safe to show to the shopper. */
  error: string;
  /** Per-field validation messages, keyed by field name (e.g. "customer.phone"). */
  fields: Record<string, string>;
};

export async function postJson<T = unknown>(url: string, body: unknown): Promise<ApiOk<T> | ApiFail> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => null);
    if (res.ok) return { ok: true, status: res.status, data: data as T };
    return {
      ok: false,
      status: res.status,
      error: data?.error?.message ?? "Something went wrong on our side. Please try again in a moment.",
      fields: data?.error?.fields ?? {},
    };
  } catch {
    return { ok: false, status: 0, error: "We couldn't reach the server. Check your connection and try again.", fields: {} };
  }
}
