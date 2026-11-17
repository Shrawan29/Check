import { handleError, ok, readBody } from "@/server/http";
import { insert } from "@/server/storage";
import { messageInput } from "@/server/validation";

export const runtime = "nodejs";

/** POST /api/messages — the contact form. Body: { name, email, order?, message }. */
export async function POST(request: Request) {
  const body = await readBody(request, messageInput);
  if ("response" in body) return body.response;

  try {
    await insert("messages", { ...body.data, createdAt: new Date().toISOString() });
    return ok({ received: true }, 201);
  } catch (err) {
    return handleError(err, "The contact form isn't switched on yet, so your message was not sent. Please email or call us instead.");
  }
}
