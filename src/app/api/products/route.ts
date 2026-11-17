import type { NextRequest } from "next/server";
import { categories, filterProducts, plans, SIZES } from "@/lib/catalog";
import { fail, ok } from "@/server/http";

export const runtime = "nodejs";

const SORTS = ["featured", "low", "high", "scarce"];

/**
 * GET /api/products — the catalogue, with optional filters:
 *   q      free-text search          cat   category id        plan  occasion id
 *   size   XS–XL, in stock only      stock "1" hides sold out  drop  "1" for this week's drop
 *   sort   featured | low | high | scarce
 */
export function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const cat = params.get("cat") ?? undefined;
  const plan = params.get("plan") ?? undefined;
  const size = params.get("size") ?? undefined;
  const sort = params.get("sort") ?? "featured";
  const q = (params.get("q") ?? "").trim().slice(0, 80);

  if (cat && !categories.some((c) => c.id === cat)) return fail(400, "unknown_category", `There is no category called "${cat}".`);
  if (plan && !plans.some((p) => p.id === plan)) return fail(400, "unknown_plan", `There is no plan called "${plan}".`);
  if (size && !SIZES.includes(size)) return fail(400, "unknown_size", `Sizes run ${SIZES.join(", ")}.`);
  if (!SORTS.includes(sort)) return fail(400, "unknown_sort", `Sort must be one of: ${SORTS.join(", ")}.`);

  const items = filterProducts({ cat, plan, size, sort, q: q || undefined, stock: params.get("stock") === "1", drop: params.get("drop") === "1" });
  return ok({ total: items.length, items });
}
