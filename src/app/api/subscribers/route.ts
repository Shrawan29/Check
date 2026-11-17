import { handleError, ok, readBody } from "@/server/http";
import { findOne, insert } from "@/server/storage";
import { subscriberInput } from "@/server/validation";

export const runtime = "nodejs";

/** POST /api/subscribers — sign up for drop alerts. Body: { email }. Signing up twice is not an error. */
export async function POST(request: Request) {
  const body = await readBody(request, subscriberInput);
  if ("response" in body) return body.response;

  try {
    const { email } = body.data;
    if (await findOne("subscribers", (row) => row.email === email)) return ok({ subscribed: true, already: true });
    await insert("subscribers", { email, createdAt: new Date().toISOString() });
    return ok({ subscribed: true, already: false }, 201);
  } catch (err) {
    return handleError(err, "Drop alerts aren't switched on yet, so we couldn't save your email. Follow us on Instagram for now.");
  }
}
