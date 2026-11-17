"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { brand, categories } from "@/lib/catalog";
import { cssVars, cx, money } from "@/lib/format";
import { useShop } from "@/lib/shop-context";
import { Icon, Mark, Wordmark } from "@/components/Icon";

const MESSAGES = [
  `Free shipping over ${money(brand.freeShippingOver)}`,
  "New drop every Friday, 7 PM",
  "Cash on delivery available",
  "Easy 7-day exchange",
  "Cut and sewn in small batches in India",
];
const TAPE_SPEED = 40; // px per second; the tick layer in CSS runs at the same speed

/** The announcement bar, drawn as a measuring tape being pulled across the screen. */
function TapeBar() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [paused, setPaused] = useState(false);
  const [duration, setDuration] = useState<string | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => setDuration((track.scrollWidth / 2 / TAPE_SPEED).toFixed(1) + "s");
    measure();
    document.fonts?.ready.then(measure);
  }, []);

  // Six copies: enough to fill very wide screens, and an even number so the -50% loop is seamless.
  return (
    <div className={cx("tape", paused && "is-paused")} role="region" aria-label="Store announcements" style={duration ? cssVars({ "--ticker-dur": duration }) : undefined}>
      <div className="tape__track" ref={trackRef}>
        {Array.from({ length: 6 }, (_, copy) => (
          <ul className="tape__list" key={copy} aria-hidden={copy > 0 || undefined}>
            {MESSAGES.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        ))}
      </div>
      <div className="tape__ticks" aria-hidden="true" />
      <button className="tape__toggle" type="button" aria-pressed={paused} aria-label={paused ? "Play announcements" : "Pause announcements"} onClick={() => setPaused((v) => !v)}>
        <Icon name={paused ? "play" : "pause"} />
      </button>
    </div>
  );
}

const NAV = [
  { href: "/shop?drop=1", label: "New drop", key: "drop", drop: true },
  ...categories.map((c) => ({ href: `/shop?cat=${c.id}`, label: c.name, key: "cat:" + c.id, drop: false })),
  { href: "/story", label: "Our story", key: "story", drop: false },
];

function NavLinks({ activeKey }: { activeKey: string }) {
  return (
    <nav className="nav" aria-label="Primary">
      {NAV.map((n) => (
        <Link key={n.key} href={n.href} className={n.drop ? "nav__drop" : undefined} aria-current={n.key === activeKey ? "page" : undefined}>
          {n.label}
        </Link>
      ))}
    </nav>
  );
}

// Reads the query string, so it sits behind a Suspense boundary.
function ActiveNav() {
  const pathname = usePathname();
  const params = useSearchParams();
  let key = "";
  if (pathname === "/story") key = "story";
  else if (pathname === "/shop") key = params.get("drop") ? "drop" : params.get("cat") ? "cat:" + params.get("cat") : "";
  return <NavLinks activeKey={key} />;
}

export function Header() {
  const { count, saved, openPanel } = useShop();
  return (
    <>
      <TapeBar />
      <header className="header">
        <div className="header__in">
          <button className="icon-btn header__menu" type="button" onClick={() => openPanel("menu")} aria-label="Open menu">
            <Icon name="menu" />
          </button>
          <Link className="logo" href="/" aria-label={`${brand.name}, home`}>
            <Mark className="logo__mark" />
            <span className="logo__word">
              <Wordmark />
            </span>
          </Link>
          <Suspense fallback={<NavLinks activeKey="" />}>
            <ActiveNav />
          </Suspense>
          <div className="header__tools">
            <button className="icon-btn" type="button" onClick={() => openPanel("search")} aria-label="Search">
              <Icon name="search" />
            </button>
            <Link className="icon-btn is-desktop" href="/shop?saved=1" aria-label={`Saved pieces${saved.length ? `, ${saved.length}` : ""}`}>
              <Icon name="heart" />
              {saved.length > 0 && <span className="count">{saved.length}</span>}
            </Link>
            <button className="icon-btn" type="button" onClick={() => openPanel("cart")} aria-label={`Open bag${count ? `, ${count} items` : ""}`}>
              <Icon name="bag" />
              {count > 0 && <span className="count">{count}</span>}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
