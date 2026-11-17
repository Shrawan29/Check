import { products } from "@/lib/catalog";
import { ok } from "@/server/http";
import { storageMode } from "@/server/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/health — is the API up, and can it save anything yet? */
export function GET() {
  return ok({ ok: true, products: products.length, storage: storageMode, time: new Date().toISOString() });
}
