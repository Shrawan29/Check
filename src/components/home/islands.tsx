"use client";

/* The interactive parts of the home page. Everything else on the page is server-rendered. */

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { brand, categories, imgSrc, inCat, inPlan, plans, products } from "@/lib/catalog";
import { cssVars, cx, pieces } from "@/lib/format";
import { useReveal } from "@/lib/use-reveal";
import { postJson } from "@/lib/api-client";
import { Icon } from "@/components/Icon";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";

/* ------------------------------- Countdown ------------------------------ */
function nextDrop(now = new Date()) {
  const d = new Date(now);
  d.setHours(brand.drop.hour, 0, 0, 0);
  let add = (brand.drop.weekday - d.getDay() + 7) % 7;
  if (add === 0 && d <= now) add = 7;
  d.setDate(d.getDate() + add);
  return d;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Counts down to the next Friday drop. Renders zeros on the server and starts ticking once mounted. */
export function Countdown() {
  const [target, setTarget] = useState<Date | null>(null);
  const [now, setNow] = useState(0);

  useEffect(() => {
    setTarget(nextDrop());
    setNow(Date.now());
    const timer = setInterval(() => {
      setNow(Date.now());
      setTarget((t) => (t && t.getTime() <= Date.now() ? nextDrop() : t));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const secs = target ? Math.max(0, Math.floor((target.getTime() - now) / 1000)) : 0;
  const when = target ? target.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" }) + ", 7 PM" : "Friday, 7 PM";
  const parts: [string, number][] = [
    ["days", Math.floor(secs / 86400)],
    ["hours", Math.floor((secs % 86400) / 3600)],
    ["mins", Math.floor((secs % 3600) / 60)],
    ["secs", secs % 60],
  ];

  return (
    <>
      <p>
        Drop Nº {brand.drop.number + 1} lands<strong>{when}</strong>
      </p>
      <div className="clock" role="timer" aria-label="Time until the next drop">
        {parts.map(([label, value]) => (
          <span key={label}>
            <b>{pad(value)}</b>
            {label}
          </span>
        ))}
      </div>
    </>
  );
}

/* ----------------------------- Shop by plan ----------------------------- */
export function Plans() {
  const [active, setActive] = useState(0);
  return (
    <ul className="plans">
      {plans.map((plan, i) => (
        <li
          key={plan.id}
          className={cx("plan", i === active && "is-active")}
          onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
          onFocus={() => setActive(i)}
        >
          <Link href={`/shop?plan=${plan.id}`}>
            <span className="plan__name">{plan.name}</span>
            <span className="plan__line">{plan.line}</span>
            <span className="plan__count">{pieces(inPlan(plan.id).length)}</span>
            <Image className="plan__img" src={imgSrc(plan.img)} alt="" width={1100} height={1375} sizes="(min-width: 960px) 40vw, 68vw" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

/* --------------------------- This week's drop --------------------------- */
const TABS = [
  { key: "drop", label: "This week", items: products.filter((p) => p.isNew) },
  { key: "dresses", label: "Dresses", items: inCat("dresses") },
  { key: "coords", label: "Co-ords", items: inCat("coords") },
  { key: "tops", label: "Tops", items: inCat("tops") },
  { key: "bottoms", label: "Bottoms", items: inCat("bottoms") },
];

export function DropSection() {
  const [tab, setTab] = useState("drop");
  const current = TABS.find((t) => t.key === tab) ?? TABS[0];
  return (
    <section className="section section--muslin" id="drop" aria-labelledby="drop-title">
      <div className="wrap">
        <Reveal as="header" className="sec-head sec-head--split">
          <div className="sec-head__copy">
            <p className="eyebrow">
              Drop Nº {brand.drop.number} · {pieces(TABS[0].items.length)}
            </p>
            <h2 id="drop-title">
              Fresh off <em>the table</em>
            </h2>
          </div>
          <div className="tabs" role="group" aria-label="Filter pieces">
            {TABS.map((t) => (
              <button key={t.key} className="chip" type="button" aria-pressed={t.key === tab} onClick={() => setTab(t.key)}>
                {t.label}
              </button>
            ))}
          </div>
        </Reveal>
        <div className="grid" aria-live="polite">
          {current.items.slice(0, 8).map((p, i) => (
            <ProductCard key={`${tab}-${p.id}`} product={p} i={i % 4} />
          ))}
        </div>
        <p className="sec-foot">
          <Link className="btn btn--outline" href="/shop">
            See all {products.length} pieces
          </Link>
        </p>
      </div>
    </section>
  );
}

/* -------------------------------- The rail ------------------------------ */
export function Rail() {
  const [ref, shown] = useReveal<HTMLDivElement>(0.35);
  const [nudged, setNudged] = useState(false);

  // One nudge when the rail scrolls into view, as if someone brushed past it.
  useEffect(() => {
    if (!shown || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setNudged(true);
    const timer = setTimeout(() => setNudged(false), 2600);
    return () => clearTimeout(timer);
  }, [shown]);

  return (
    <div className="rail-wrap">
      <div className={cx("rail", nudged && "is-nudged")} ref={ref}>
        <ul className="rail__list">
          {categories.map((c, i) => (
            <li className="hang" key={c.id} style={cssVars({ "--i": i })}>
              <Link href={`/shop?cat=${c.id}`}>
                <svg className="hang__hook" viewBox="0 0 24 40" aria-hidden="true">
                  <path d="M12 40V25c0-5.5 7-5 7-11.5a7 7 0 1 0-14 0" />
                </svg>
                <svg className="hang__arms" viewBox="0 0 100 26" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M50 1L1 25h98L50 1z" vectorEffect="non-scaling-stroke" />
                </svg>
                <span className="hang__img">
                  <Image src={imgSrc(c.img)} alt="" width={900} height={1200} sizes="(min-width: 1080px) 16vw, 210px" />
                </span>
                <span className="hang__name">{c.name}</span>
                <span className="hang__count">{pieces(inCat(c.id).length)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------ Denim edit ------------------------------ */
export function DenimCarousel() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const sync = () => {
      setAtStart(el.scrollLeft < 4);
      setAtEnd(el.scrollLeft + el.clientWidth > el.scrollWidth - 4);
    };
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      el.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  const go = (dir: 1 | -1) => {
    const el = ref.current;
    const first = el?.firstElementChild;
    if (!el || !first) return;
    const step = first.getBoundingClientRect().width + parseFloat(getComputedStyle(el).columnGap || "0");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * step, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div className="denim__side">
      <Reveal as="header" className="sec-head sec-head--split">
        <div className="sec-head__copy">
          <p className="eyebrow">The denim edit</p>
          <h2 id="denim-title">
            Jeans that <em>get on with it</em>
          </h2>
        </div>
        <div className="carousel-nav">
          <button type="button" onClick={() => go(-1)} disabled={atStart} aria-label="Previous denim pieces">
            <Icon name="left" />
          </button>
          <button type="button" onClick={() => go(1)} disabled={atEnd} aria-label="More denim pieces">
            <Icon name="right" />
          </button>
        </div>
      </Reveal>
      <div className="carousel" ref={ref} tabIndex={0} aria-label="Denim pieces">
        {inCat("denim").map((p) => (
          <ProductCard key={p.id} product={p} reveal={false} />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ Drop alerts ----------------------------- */
export function AlertsForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<{ kind: "idle" | "busy" | "ok" | "error"; message: string }>({ kind: "idle", message: "" });
  const inputRef = useRef<HTMLInputElement | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setState({ kind: "error", message: "That doesn't look like an email address. Check it and try again." });
      inputRef.current?.focus();
      return;
    }
    setState({ kind: "busy", message: "" });
    const res = await postJson("/api/subscribers", { email });
    if (res.ok) {
      setEmail("");
      setState({ kind: "ok", message: "You're on the list. See you Friday at 6:45." });
    } else {
      setState({ kind: "error", message: res.fields.email ?? res.error });
    }
  };

  return (
    <form onSubmit={submit} noValidate>
      <div className="field">
        <label htmlFor="alert-email">Email address</label>
        <div className="field-row">
          <input
            ref={inputRef}
            className="input"
            id="alert-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
            required
            aria-describedby="alert-msg"
            aria-invalid={state.kind === "error" || undefined}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className={cx("btn btn--ink", state.kind === "busy" && "is-busy")} type="submit" disabled={state.kind === "busy"}>
            {state.kind === "busy" ? "Saving…" : "Remind me"}
          </button>
        </div>
        <p className={cx("field-msg", state.kind === "error" && "is-error", state.kind === "ok" && "is-ok")} id="alert-msg" role="status" aria-live="polite">
          {state.message}
        </p>
      </div>
    </form>
  );
}
