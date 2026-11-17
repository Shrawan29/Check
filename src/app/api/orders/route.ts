import { CartRejectedError, createOrder } from "@/server/orders";
import { fail, handleError, ok, readBody } from "@/server/http";
import { orderInput } from "@/server/validation";

export const runtime = "nodejs";

/**
 * POST /api/orders — place a cash-on-delivery order.
 * Body: { items: [{ id, size, qty }], customer: { name, phone, email, address, city, state, pincode }, payment: "cod", note? }
 * The total is recalculated here from the catalogue; whatever the browser thinks the price is, is ignored.
 */
export async function POST(request: Request) {
  const body = await readBody(request, orderInput);
  if ("response" in body) return body.response;

  try {
    const order = await createOrder(body.data);
    return ok({ number: order.number, total: order.total, subtotal: order.subtotal, shipping: order.shipping, payment: order.payment, lines: order.lines }, 201);
  } catch (err) {
    if (err instanceof CartRejectedError) {
      const detail = err.issues.map((i) => i.message).join(" ");
      return fail(409, "cart_changed", detail || "Your bag is empty.", Object.fromEntries(err.issues.map((i) => [`item:${i.id}:${i.size}`, i.message])));
    }
    return handleError(err, "Online ordering isn't switched on yet, so this order was not placed. Please message us to order.");
  }
}
