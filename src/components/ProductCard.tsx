"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { imgSrc, labelFor, type Product } from "@/lib/catalog";
import { cssVars, cx, money, ProductName } from "@/lib/format";
import { useShop } from "@/lib/shop-context";
import { useReveal } from "@/lib/use-reveal";
import { Icon } from "@/components/Icon";

type Props = {
  product: Product;
  /** Load the photo straight away (cards visible on first paint). */
  eager?: boolean;
  /** Fade up on scroll; `i` staggers cards in the same row. */
  reveal?: boolean;
  i?: number;
};

const SIZES_ATTR = "(min-width: 1080px) 25vw, (min-width: 720px) 33vw, 50vw";

export function ProductCard({ product: p, eager = false, reveal = true, i = 0 }: Props) {
  const { addToBag, isSaved, toggleSaved, toast } = useShop();
  const [picking, setPicking] = useState(false);
  const [ref, shown] = useReveal<HTMLElement>();
  const addRef = useRef<HTMLButtonElement | null>(null);
  const label = labelFor(p);
  const href = `/product/${p.id}`;
  const more = p.swatches.length - 1;

  // The size picker closes on Escape or a click outside the card.
  useEffect(() => {
    if (!picking) return;
    const card = ref.current;
    const firstSize = card?.querySelector<HTMLButtonElement>(".card__sizes-list button:not(:disabled)");
    const timer = setTimeout(() => firstSize?.focus({ preventScroll: true }), 80);
    const onClick = (e: MouseEvent) => {
      if (card && !card.contains(e.target as Node)) setPicking(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setPicking(false);
      addRef.current?.focus({ preventScroll: true });
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [picking, ref]);

  const quickAdd = () => {
    if (p.sizes.length === 1) addToBag(p.id, p.sizes[0]);
    else setPicking(true);
  };

  return (
    <article
      ref={ref}
      className={cx("card", p.soldOut && "is-sold", picking && "is-picking", reveal && "reveal", reveal && shown && "is-in")}
      style={reveal ? cssVars({ "--i": i }) : undefined}
    >
      <div className="card__media">
        <Link className="card__img" href={href} tabIndex={-1} aria-hidden="true">
          <Image src={imgSrc(p.img[0])} alt="" width={900} height={1125} sizes={SIZES_ATTR} loading={eager ? "eager" : "lazy"} />
          {p.img[1] && <Image className="card__img-alt" src={imgSrc(p.img[1])} alt="" width={900} height={1125} sizes={SIZES_ATTR} />}
        </Link>
        {label && <span className={`label label--${label.tone}`}>{label.text}</span>}
        <button className="card__wish" type="button" aria-pressed={isSaved(p.id)} aria-label={`Save ${p.name}`} onClick={() => toggleSaved(p.id)}>
          <span>
            <Icon name="heart" />
          </span>
        </button>

        {p.soldOut ? (
          <button className="card__notify" type="button" onClick={() => toast(`We'll message you when ${p.name} is back on the rail.`)}>
            Notify me
          </button>
        ) : (
          <>
            <button ref={addRef} className="card__add" type="button" aria-expanded={picking} aria-label={`Quick add ${p.name}`} onClick={quickAdd}>
              <Icon name="plus" />
            </button>
            <div className="card__sizes" inert={!picking}>
              <div className="card__sizes-head">
                <span>Add a size</span>
                <button
                  type="button"
                  aria-label="Close sizes"
                  onClick={() => {
                    setPicking(false);
                    addRef.current?.focus({ preventScroll: true });
                  }}
                >
                  <Icon name="close" />
                </button>
              </div>
              <div className="card__sizes-list">
                {p.sizes.map((size) => {
                  const off = p.out.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      disabled={off}
                      aria-label={off ? `${size}, sold out` : undefined}
                      onClick={() => {
                        setPicking(false);
                        addToBag(p.id, size);
                      }}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="card__body">
        <h3 className="card__name">
          <Link href={href}>
            <ProductName name={p.name} />
          </Link>
        </h3>
        <p className="card__meta">
          {p.colour}
          {more > 0 && ` · +${more} colour${more > 1 ? "s" : ""}`}
        </p>
        <p className={cx("card__price", p.was != null && "is-sale")}>
          {money(p.price)}
          {p.was != null && <s>{money(p.was)}</s>}
        </p>
      </div>
    </article>
  );
}
