"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { brand, categories, imgSrc, isLow, labelFor, type Product } from "@/lib/catalog";
import { cx, money, ProductName } from "@/lib/format";
import { useShop } from "@/lib/shop-context";
import { Icon } from "@/components/Icon";

/** Gallery, options and add-to-bag for one product. */
export function ProductView({ product: p }: { product: Product }) {
  const { addToBag, isSaved, toggleSaved, openPanel, toast } = useShop();
  const [slide, setSlide] = useState(0);
  const [colour, setColour] = useState(p.swatches[0][0]);
  const [size, setSize] = useState(p.sizes.length === 1 && !p.soldOut && !p.out.includes(p.sizes[0]) ? p.sizes[0] : "");
  const [error, setError] = useState("");
  const [barOn, setBarOn] = useState(false);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const sizesRef = useRef<HTMLDivElement | null>(null);
  const buyRef = useRef<HTMLButtonElement | null>(null);

  const cat = categories.find((c) => c.id === p.cats[0])!;
  const label = labelFor(p);
  const low = isLow(p);
  const [made, left] = p.batch;

  // Real photos first, then a close crop of the first photo standing in for a fabric detail shot.
  const slides = [
    ...p.img.map((src, i) => ({ src, alt: i === 0 ? p.alt : `${p.name}, view ${i + 1}`, detail: false })),
    { src: p.img[0], alt: `Close-up of the ${p.name} fabric`, detail: true },
  ];

  const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const scrollToSlide = (i: number) => {
    const track = trackRef.current;
    if (track) track.scrollTo({ left: i * track.clientWidth, behavior: reduceMotion() ? "auto" : "smooth" });
  };

  // Keep the counter and thumbnails in step with swipes.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setSlide(Math.round(track.scrollLeft / track.clientWidth)));
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
    };
  }, []);

  // On small screens a sticky bar takes over whenever the main button is out of view.
  useEffect(() => {
    const btn = buyRef.current;
    if (!btn || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([entry]) => setBarOn(!entry.isIntersecting));
    io.observe(btn);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.classList.toggle("has-buybar", barOn);
    return () => document.body.classList.remove("has-buybar");
  }, [barOn]);

  const add = () => {
    if (p.soldOut) return;
    if (!size) {
      setError("Pick a size first.");
      sizesRef.current?.scrollIntoView({ block: "center", behavior: reduceMotion() ? "auto" : "smooth" });
      sizesRef.current?.querySelector<HTMLInputElement>("input:not(:disabled)")?.focus({ preventScroll: true });
      return;
    }
    setError("");
    addToBag(p.id, size);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    add();
  };

  const batchLine = p.soldOut
    ? `All ${made} are gone. Hit notify and we'll message you if we cut it again.`
    : low
      ? `Only ${left} left from a batch of ${made}. Most pieces are cut once and not restocked.`
      : `${left} of ${made} left. Each batch is cut once, by hand, in our workshop.`;

  return (
    <div className="pdp">
      <div className="gallery">
        <div className="gallery__stage">
          <div
            className="gallery__track"
            ref={trackRef}
            tabIndex={0}
            aria-label={`Product photos, ${slides.length} images`}
            onKeyDown={(e) => {
              if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
              e.preventDefault();
              scrollToSlide(Math.max(0, Math.min(slides.length - 1, slide + (e.key === "ArrowRight" ? 1 : -1))));
            }}
          >
            {slides.map((s, i) => (
              <div className={cx("gallery__slide", s.detail && "gallery__slide--detail")} key={i}>
                <Image
                  src={imgSrc(s.src)}
                  alt={s.alt}
                  width={900}
                  height={1125}
                  sizes="(min-width: 960px) 45vw, 100vw"
                  loading={i === 0 ? "eager" : "lazy"}
                  fetchPriority={i === 0 ? "high" : undefined}
                />
              </div>
            ))}
          </div>
          {label && <span className={`label label--${label.tone}`}>{label.text}</span>}
          <span className="gallery__count" aria-hidden="true">
            {slide + 1} / {slides.length}
          </span>
        </div>
        <div className="gallery__thumbs">
          {slides.map((s, i) => (
            <button
              key={i}
              type="button"
              className={s.detail ? "is-detail" : undefined}
              aria-label={`Show photo ${i + 1} of ${slides.length}`}
              aria-current={i === slide}
              onClick={() => scrollToSlide(i)}
            >
              <Image src={imgSrc(s.src)} alt="" width={120} height={150} sizes="68px" />
            </button>
          ))}
        </div>
      </div>

      <div className="pdp__info">
        <p className="eyebrow">
          {cat.name}
          {p.isNew && ` · Drop Nº ${brand.drop.number}`}
        </p>
        <h1>
          <ProductName name={p.name} />
        </h1>
        <p className="pdp__price">
          <span className={p.was != null ? "is-sale" : undefined}>{money(p.price)}</span>
          {p.was != null && <s>{money(p.was)}</s>}
          <small>Incl. of all taxes</small>
        </p>
        <p className="pdp__desc">{p.desc}</p>

        <div className="opt">
          <div className="opt__head">
            <span>
              Colour <span>· {colour}</span>
            </span>
          </div>
          <div className="swatches">
            {p.swatches.map(([name, hex]) => (
              <button
                key={name}
                className="swatch"
                type="button"
                aria-pressed={colour === name}
                aria-label={name}
                style={{ ["--c" as string]: hex }}
                onClick={() => setColour(name)}
              >
                <i />
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={onSubmit} noValidate>
          <div className="opt" role="radiogroup" aria-labelledby="size-label" aria-describedby="size-error">
            <div className="opt__head">
              <span id="size-label">Size</span>
              {p.sizes.length > 1 && (
                <button type="button" onClick={() => openPanel("sizeguide")}>
                  Size guide
                </button>
              )}
            </div>
            <div className="sizes" ref={sizesRef}>
              {p.sizes.map((s) => {
                const off = p.soldOut || p.out.includes(s);
                return (
                  <label className="size" key={s}>
                    <input
                      type="radio"
                      name="size"
                      value={s}
                      disabled={off}
                      checked={size === s}
                      onChange={() => {
                        setSize(s);
                        setError("");
                      }}
                    />
                    <span>
                      {s}
                      {off && <span className="sr-only">, sold out</span>}
                    </span>
                  </label>
                );
              })}
            </div>
            <p className="opt__error" id="size-error" role="alert">
              {error}
            </p>
          </div>

          <div className="pdp__actions">
            {p.soldOut ? (
              <button className="btn btn--outline" type="button" onClick={() => toast(`We'll message you when ${p.name} is back on the rail.`)}>
                Notify me when it&apos;s back
              </button>
            ) : (
              <button className="btn btn--ink" type="submit" ref={buyRef}>
                Add to bag · {money(p.price)}
              </button>
            )}
            <button className="pdp__wish" type="button" aria-pressed={isSaved(p.id)} aria-label={`Save ${p.name}`} onClick={() => toggleSaved(p.id)}>
              <Icon name="heart" />
            </button>
          </div>
        </form>

        <div className={cx("batch", low && "is-low")}>
          <div className="batch__top">
            <span>
              Batch {brand.drop.number}-{p.id.slice(0, 2).toUpperCase()}
            </span>
            <span>{made} made</span>
          </div>
          <div className="batch__bar" role="img" aria-label={`${left} of ${made} left`}>
            <span style={{ transform: `scaleX(${left / made})` }} />
          </div>
          <p>{batchLine}</p>
        </div>

        <ul className="perks">
          <li>
            <Icon name="box" />
            Free shipping over {money(brand.freeShippingOver)}, dispatched in a day
          </li>
          <li>
            <Icon name="swap" />
            Exchange within 7 days if the size isn&apos;t right
          </li>
          <li>
            <Icon name="cash" />
            Pay by cash on delivery
          </li>
        </ul>

        <div className="accordion">
          <details open>
            <summary>
              The details <Icon name="plus" />
            </summary>
            <div className="accordion__body">
              <dl>
                <dt>Fabric</dt>
                <dd>{p.fabric}</dd>
                <dt>Fit</dt>
                <dd>{p.fit}</dd>
                <dt>Colour</dt>
                <dd>{p.colour}</dd>
                <dt>Made in</dt>
                <dd>Our own workshop, India</dd>
              </dl>
            </div>
          </details>
          <details>
            <summary>
              Fabric &amp; care <Icon name="plus" />
            </summary>
            <div className="accordion__body">
              <div className="care-icons" aria-hidden="true">
                <Icon name="wash" />
                <Icon name="nobleach" />
                <Icon name="dryflat" />
                <Icon name="iron" />
              </div>
              <p>{p.care}</p>
            </div>
          </details>
          <details>
            <summary>
              Shipping &amp; exchange <Icon name="plus" />
            </summary>
            <div className="accordion__body">
              <p>
                Packed within a day of your order and usually at your door in three to five working days. Shipping is free over {money(brand.freeShippingOver)}, and {money(brand.shippingFee)} below that.
              </p>
              <p>If the size isn&apos;t right, exchange it within 7 days of delivery for another size or store credit. Pieces bought on sale can&apos;t be returned.</p>
            </div>
          </details>
        </div>
      </div>

      {!p.soldOut && (
        <div className={cx("buybar", barOn && "is-on")} inert={!barOn}>
          <div>
            <b>{p.name}</b>
            <span>{money(p.price)}</span>
          </div>
          <button className="btn btn--ink" type="button" onClick={add}>
            Add to bag
          </button>
        </div>
      )}
    </div>
  );
}
