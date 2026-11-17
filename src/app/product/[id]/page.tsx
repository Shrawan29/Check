import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { byId, categories, imgSrc, products } from "@/lib/catalog";
import { money } from "@/lib/format";
import { ProductCard } from "@/components/ProductCard";
import { ProductView } from "@/components/product/ProductView";
import { Reveal } from "@/components/Reveal";

type Props = { params: Promise<{ id: string }> };

// Every product page is built ahead of time; unknown ids fall through to the 404 page.
export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const p = byId(id);
  if (!p) return { title: "Not found" };
  return {
    title: p.name,
    description: p.desc,
    openGraph: { title: `${p.name} · ${money(p.price)}`, description: p.desc, images: [{ url: imgSrc(p.img[0]), alt: p.alt }] },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const p = byId(id);
  if (!p) notFound();

  const cat = categories.find((c) => c.id === p.cats[0])!;

  // Pairs well with: pieces from other categories that share an occasion come first.
  const related = products
    .filter((x) => x.id !== p.id && !x.soldOut)
    .map((x) => ({ x, score: x.plans.filter((plan) => p.plans.includes(plan)).length * 2 + (x.cats[0] !== p.cats[0] ? 1 : 0) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((r) => r.x);

  return (
    <>
      <div className="wrap">
        <nav className="crumbs pdp__crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/shop?cat=${cat.id}`}>{cat.name}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{p.name}</span>
        </nav>
        <ProductView key={p.id} product={p} />
      </div>

      <section className="related" aria-labelledby="related-title">
        <div className="wrap">
          <Reveal as="header" className="sec-head">
            <p className="eyebrow">Same plans, different pieces</p>
            <h2 id="related-title">
              Pairs well <em>with</em>
            </h2>
          </Reveal>
          <div className="grid">
            {related.map((x, i) => (
              <ProductCard key={x.id} product={x} i={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
