"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { brand, categories, imgSrc, inCat, plans, products, type Product } from "@/lib/catalog";
import { cx, money, pieces, ProductName } from "@/lib/format";
import { useShop } from "@/lib/shop-context";
import { Icon, Mark, Wordmark } from "@/components/Icon";
import { CartDrawer } from "./CartDrawer";
import { CloseButton, Panel } from "./Panel";

/* ------------------------------ Mobile menu ----------------------------- */
function MenuDrawer() {
  const { closePanel } = useShop();
  return (
    <Panel name="menu" side="left" label="Menu">
      <div className="panel__head">
        <Link className="logo" href="/" aria-label={`${brand.name}, home`} onClick={closePanel}>
          <Mark className="logo__mark" />
          <span className="logo__word">
            <Wordmark />
          </span>
        </Link>
        <CloseButton label="Close menu" />
      </div>
      <div className="panel__body">
        <nav className="menu__nav" aria-label="Shop">
          <Link className="is-drop" href="/shop?drop=1" onClick={closePanel}>
            New drop <small>Nº {brand.drop.number}</small>
          </Link>
          {categories.map((c) => (
            <Link key={c.id} href={`/shop?cat=${c.id}`} onClick={closePanel}>
              {c.name} <small>{inCat(c.id).length}</small>
            </Link>
          ))}
        </nav>
        <div className="menu__group">
          <p className="eyebrow">Shop by plan</p>
          <div className="menu__chips">
            {plans.map((p) => (
              <Link key={p.id} className="chip" href={`/shop?plan=${p.id}`} onClick={closePanel}>
                {p.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="menu__group menu__meta">
          <Link href="/shop?saved=1" onClick={closePanel}>
            Saved pieces
          </Link>
          <Link href="/story" onClick={closePanel}>
            Our story
          </Link>
          <Link href="/story#contact" onClick={closePanel}>
            Contact &amp; help
          </Link>
        </div>
      </div>
    </Panel>
  );
}

/* --------------------------------- Search ------------------------------- */
const POPULAR = ["Slip dress", "Co-ord", "Jeans", "Kurta set", "Saree", "White shirt"];

function ResultRow({ p, onPick }: { p: Product; onPick: () => void }) {
  return (
    <li>
      <Link className="result" href={`/product/${p.id}`} onClick={onPick}>
        <Image src={imgSrc(p.img[0])} alt="" width={112} height={140} sizes="56px" />
        <span>
          <b>
            <ProductName name={p.name} />
          </b>
          <small>
            {p.colour}
            {p.soldOut ? " · sold out" : ""}
          </small>
        </span>
        <span>{money(p.price)}</span>
      </Link>
    </li>
  );
}

function SearchPanel() {
  const { panel, openPanel, closePanel } = useShop();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<Product[] | null>(null);
  const [failed, setFailed] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const q = query.trim();

  // Ask the API as the shopper types (debounced); stale responses are dropped.
  useEffect(() => {
    if (!q) {
      setHits(null);
      setFailed(false);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?q=${encodeURIComponent(q)}`, { signal: controller.signal });
        if (!res.ok) throw new Error(String(res.status));
        const data: { items: Product[] } = await res.json();
        setHits(data.items);
        setFailed(false);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setHits([]);
        setFailed(true);
      }
    }, 160);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [q]);

  // "/" opens search from anywhere outside a form field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName ?? "").toUpperCase();
      if (e.key !== "/" || panel || ["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return;
      e.preventDefault();
      openPanel("search");
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [panel, openPanel]);

  const fresh = products.filter((p) => p.isNew).slice(0, 6);

  return (
    <Panel name="search" side="top" label="Search">
      <form
        className="search__form"
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          if (!q) return;
          closePanel();
          router.push(`/shop?q=${encodeURIComponent(q)}`);
        }}
      >
        <Icon name="search" />
        <label className="sr-only" htmlFor="search-q">
          Search the shop
        </label>
        <input
          ref={inputRef}
          className="search__input"
          id="search-q"
          type="search"
          data-autofocus
          placeholder="Search dresses, denim, kurta sets"
          autoComplete="off"
          enterKeyHint="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <CloseButton label="Close search" />
      </form>

      <div className="search__body">
        {!q ? (
          <>
            <p className="eyebrow">Popular right now</p>
            <div className="search__chips">
              {POPULAR.map((term) => (
                <button
                  key={term}
                  className="chip"
                  type="button"
                  onClick={() => {
                    setQuery(term);
                    inputRef.current?.focus();
                  }}
                >
                  {term}
                </button>
              ))}
            </div>
            <p className="eyebrow" style={{ marginTop: 30 }}>
              Fresh off the table
            </p>
            <ul className="search__results">
              {fresh.map((p) => (
                <ResultRow key={p.id} p={p} onPick={closePanel} />
              ))}
            </ul>
          </>
        ) : hits === null ? (
          <p className="search__none" role="status">
            Searching…
          </p>
        ) : failed ? (
          <p className="search__none" role="status">
            Search isn&apos;t responding right now. Check your connection and try again.
          </p>
        ) : hits.length === 0 ? (
          <p className="search__none" role="status">
            Nothing matches “{q}”. Try “dress”, “denim” or “kurta”.
          </p>
        ) : (
          <>
            <p className="eyebrow" role="status">
              {pieces(hits.length)} for “{q}”
            </p>
            <ul className="search__results">
              {hits.slice(0, 6).map((p) => (
                <ResultRow key={p.id} p={p} onPick={closePanel} />
              ))}
            </ul>
            {hits.length > 6 && (
              <Link className="link search__all" href={`/shop?q=${encodeURIComponent(q)}`} onClick={closePanel}>
                See all {hits.length} <Icon name="arrow" />
              </Link>
            )}
          </>
        )}
      </div>
    </Panel>
  );
}

/* ------------------------------- Size guide ----------------------------- */
const SIZE_CHART: [string, number, number, number][] = [
  ["XS", 81, 64, 89],
  ["S", 86, 69, 94],
  ["M", 91, 74, 99],
  ["L", 97, 80, 105],
  ["XL", 102, 86, 111],
];

function SizeGuide() {
  const [unit, setUnit] = useState<"cm" | "in">("cm");
  const conv = (cm: number) => (unit === "in" ? String(Math.round((cm / 2.54) * 2) / 2) : String(cm));
  return (
    <Panel name="sizeguide" side="right" labelledBy="sg-title">
      <div className="panel__head">
        <h2 className="panel__title" id="sg-title">
          Size guide
        </h2>
        <CloseButton label="Close size guide" />
      </div>
      <div className="panel__body">
        <div className="unit-toggle" role="group" aria-label="Units">
          {(["cm", "in"] as const).map((u) => (
            <button key={u} type="button" aria-pressed={unit === u} onClick={() => setUnit(u)}>
              {u}
            </button>
          ))}
        </div>
        <table className="sizeguide">
          <caption className="sr-only">Body measurements by size, in {unit === "in" ? "inches" : "centimetres"}</caption>
          <thead>
            <tr>
              <th scope="col">Size</th>
              <th scope="col">Bust</th>
              <th scope="col">Waist</th>
              <th scope="col">Hip</th>
            </tr>
          </thead>
          <tbody>
            {SIZE_CHART.map(([size, bust, waist, hip]) => (
              <tr key={size}>
                <td>{size}</td>
                <td>{conv(bust)}</td>
                <td>{conv(waist)}</td>
                <td>{conv(hip)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="sizeguide-note">
          These are body measurements, not garment measurements. Between sizes? Go up for satin and rigid denim, down for knits and anything with a drawstring.
        </p>
        <p className="sizeguide-note">Still unsure? Message us your measurements and we&apos;ll tell you honestly.</p>
      </div>
    </Panel>
  );
}

/* --------------------------------- Toasts ------------------------------- */
function Toasts() {
  const { toasts } = useShop();
  return (
    <div className="toasts" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={cx("toast", t.leaving && "is-out")}>
          <span>{t.message}</span>
          {t.action && (
            <button type="button" onClick={t.action.run}>
              {t.action.label}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

/** Everything that floats above the page: scrim, drawers, search and toasts. */
export function Overlays() {
  const { panel, closePanel } = useShop();
  return (
    <>
      <div className={cx("scrim", panel && "is-on")} onClick={closePanel} />
      <MenuDrawer />
      <CartDrawer />
      <SizeGuide />
      <SearchPanel />
      <Toasts />
    </>
  );
}
