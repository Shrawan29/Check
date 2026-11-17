import { priceCart } from "@/server/orders";
import { ok, readBody } from "@/server/http";
import { cartPriceInput } from "@/server/validation";

export const runtime = "nodejs";

/**
 * POST /api/cart/price — price a bag on the server.
 * Body: { items: [{ id, size, qty }] }
 * Returns the lines with current prices, shipping, the total, and any lines that can no longer be bought.
 */
export async function POST(request: Request) {
  const body = await readBody(request, cartPriceInput);
  if ("response" in body) return body.response;
  return ok(priceCart(body.data.items));
}
