import type { Metadata } from "next";
import Link from "next/link";
import { Mark } from "@/components/Icon";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="wrap notfound" aria-labelledby="nf-title">
      <div className="empty">
        <Mark />
        <p className="eyebrow">Error 404</p>
        <h1 id="nf-title">
          This page has left <em>the rail</em>
        </h1>
        <p>The link may be old, or the piece may have sold through. Everything we have right now is one tap away.</p>
        <div className="notfound__cta">
          <Link className="btn btn--ink" href="/shop">
            See the whole rail
          </Link>
          <Link className="btn btn--outline" href="/">
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
