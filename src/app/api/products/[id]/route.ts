import { byId } from "@/lib/catalog";
import { fail, ok } from "@/server/http";

export const runtime = "nodejs";

/** GET /api/products/:id — one product. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = byId(id);
  if (!product) return fail(404, "not_found", "That piece isn't in the catalogue.");
  return ok(product);
}
