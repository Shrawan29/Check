"use client";

import { useEffect, useMemo, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { brand, categories, filterProducts, plans, products, SIZES } from "@/lib/catalog";
import { pieces } from "@/lib/format";
import { useShop } from "@/lib/shop-context";
import { Mark } from "@/components/Icon";
import { ProductCard } from "@/components/ProductCard";

type Filters = { cat: string; plan: string; size: string; stock: boolean; sort: string; q: string; saved: boolean; drop: boolean };

const SORTS = [
  { value: "featured", label: "Sort: Newest first" },
  { value: "low", label: "Sort: Price, low to high" },
  { value: "high", label: "Sort: Price, high to low" },
  { value: "scarce", label: "Sort: Nearly gone" },
];

/** The shop. Every filter lives in the URL, so any view can be linked to, shared and reached with the back button. */
export function ShopView() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { saved, ready } = useShop();

  const catParam = params.get("cat") ?? "";
  const planParam = params.get("plan") ?? "";
  const sizeParam = params.get("size") ?? "";
  const sortParam = params.get("sort") ?? "featured";
  const f: Filters = {
    cat: categories.some((c) => c.id === catParam) ? catParam : "",
    plan: plans.some((p) => p.id === planParam) ? planParam : "",
    size: SIZES.includes(sizeParam) ? sizeParam : "",
    stock: params.get("stock") === "1",
    sort: SORTS.some((s) => s.value === sortParam) ? sortParam : "featured",
    q: (params.get("q") ?? "").trim(),
    saved: params.get("saved") === "1",
    drop: params.get("drop") === "1",
  };

  const update = (patch: Partial<Filters>) => {
    const next = { ...f, ...patch };
    const p = new URLSearchParams();
    if (next.drop) p.set("drop", "1");
    if (next.saved) p.set("saved", "1");
    if (next.q) p.set("q", next.q);
    if (next.cat) p.set("cat", next.cat);
    if (next.plan) p.set("plan", next.plan);
    if (next.size) p.set("size", next.size);
    if (next.stock) p.set("stock", "1");
    if (next.sort !== "featured") p.set("sort", next.sort);
    const qs = p.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };
  const reset = () => router.replace(pathname, { scroll: false });

  const savedKey = saved.join(",");
  const list = useMemo(
    () => filterProducts({ cat: f.cat, plan: f.plan, size: f.size, stock: f.stock, sort: f.sort, q: f.q, drop: f.drop }, f.saved ? products.filter((p) => saved.includes(p.id)) : products),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [f.cat, f.plan, f.size, f.stock, f.sort, f.q, f.drop, f.saved, savedKey]
  );

  const cat = categories.find((c) => c.id === f.cat);
  const plan = plans.find((p) => p.id === f.plan);
  let title: ReactNode;
  let blurb: string;
  let crumb: string;
  if (f.saved) {
    title = (
      <>
        Saved <em>pieces</em>
      </>
    );
    blurb = "The ones you had your eye on. Batches are small, so don't sit on them too long.";
    crumb = "Saved";
  } else if (f.q) {
    title = `“${f.q}”`;
    blurb = "Search results across the whole rail.";
    crumb = "Search";
  } else if (f.drop) {
    title = (
      <>
        Drop <em>Nº {brand.drop.number}</em>
      </>
    );
    blurb = "Cut this week, live now. When a batch is gone, it's gone.";
    crumb = "New drop";
  } else if (cat) {
    title = cat.name;
    blurb = cat.blurb;
    crumb = cat.name;
  } else if (plan) {
    title = <em>{plan.name}</em>;
    blurb = plan.line;
    crumb = plan.name;
  } else {
    title = (
      <>
        The whole <em>rail</em>
      </>
    );
    blurb = "Everything we've cut, in one place. Filter by what it is or where you're wearing it.";
    crumb = "Shop";
  }

  useEffect(() => {
    document.title = `${crumb} — ${brand.name}`;
  }, [crumb]);

  const filtered = Boolean(f.cat || f.plan || f.size || f.stock || f.q || f.saved || f.drop);
  const waitingForSaved = f.saved && !ready;
  const nothingSaved = f.saved && ready && saved.length === 0;

  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{crumb}</span>
          </nav>
          <h1>{title}</h1>
          <p className="lede">{blurb}</p>
        </div>
      </section>

      <section className="wrap shop" aria-label="Products">
        <div className="filters">
          <div className="filters__chips" role="group" aria-label="Category">
            <button className="chip" type="button" aria-pressed={f.cat === ""} onClick={() => update({ cat: "" })}>
              All
            </button>
            {categories.map((c) => (
              <button key={c.id} className="chip" type="button" aria-pressed={f.cat === c.id} onClick={() => update({ cat: c.id })}>
                {c.name}
              </button>
            ))}
          </div>
          <div className="filters__selects">
            <label className="sr-only" htmlFor="plan-select">
              Where you&apos;re wearing it
            </label>
            <select className="select" id="plan-select" value={f.plan} onChange={(e) => update({ plan: e.target.value })}>
              <option value="">Any plan</option>
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <label className="sr-only" htmlFor="sort-select">
              Sort by
            </label>
            <select className="select" id="sort-select" value={f.sort} onChange={(e) => update({ sort: e.target.value })}>
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="shop__meta">
          <span role="status" aria-live="polite">
            {waitingForSaved ? "" : pieces(list.length)}
          </span>
          <div className="shop__refine">
            <div className="sizepick" role="group" aria-label="Size">
              {SIZES.map((s) => (
                <button key={s} type="button" aria-pressed={f.size === s} onClick={() => update({ size: f.size === s ? "" : s })}>
                  {s}
                </button>
              ))}
            </div>
            <label className="check">
              <input type="checkbox" checked={f.stock} onChange={(e) => update({ stock: e.target.checked })} />
              In stock only
            </label>
            {filtered && (
              <button type="button" onClick={reset}>
                Clear filters
              </button>
            )}
          </div>
        </div>

        {waitingForSaved ? null : list.length > 0 ? (
          <div className="grid">
            {list.map((p, i) => (
              <ProductCard key={p.id} product={p} eager={i < 4} i={i % 4} />
            ))}
          </div>
        ) : (
          <div className="empty">
            <Mark />
            <h2>{nothingSaved ? "Nothing saved yet" : "Nothing on the rail for that"}</h2>
            <p>{nothingSaved ? "Tap the heart on any piece and it will wait for you here." : "Try loosening a filter or two. Sizes sell out fast in small batches."}</p>
            <button className="btn btn--ink" type="button" onClick={reset}>
              Show everything
            </button>
          </div>
        )}
      </section>
    </>
  );
}
