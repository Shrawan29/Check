import type { Metadata } from "next";
import { Suspense } from "react";
import { brand } from "@/lib/catalog";
import { ShopView } from "@/components/shop/ShopView";

export const metadata: Metadata = {
  title: "Shop",
  description: `Shop every ${brand.name} piece: dresses, co-ords, tops, bottoms, denim and festive wear, made in small batches in India.`,
};

export default function ShopPage() {
  return (
    // ShopView reads its filters from the query string, which needs a Suspense boundary.
    <Suspense fallback={<div className="page-head" style={{ minHeight: "60vh" }} />}>
      <ShopView />
    </Suspense>
  );
}
