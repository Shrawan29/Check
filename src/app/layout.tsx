import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { DM_Mono, Fraunces, Hanken_Grotesk } from "next/font/google";
import { brand } from "@/lib/catalog";
import { ShopProvider } from "@/lib/shop-context";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Overlays } from "@/components/overlays/Overlays";
import "./globals.css";

// "latin-ext" carries the rupee sign (₹); without it prices fall back to a system font.
const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--font-fraunces",
  display: "swap",
});
const hanken = Hanken_Grotesk({ subsets: ["latin", "latin-ext"], variable: "--font-hanken", display: "swap" });
const dmMono = DM_Mono({ subsets: ["latin", "latin-ext"], weight: ["400", "500"], variable: "--font-dm-mono", display: "swap" });

// Vercel sets these at build time; locally we fall back to the dev server.
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

const description =
  "Small-batch womenswear cut and sewn in our own workshop in India. A new drop every Friday at 7 PM. Dresses, co-ords, denim and festive wear, sold direct.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${brand.name} — Small-batch womenswear, straight off the cutting table`,
    template: `%s — ${brand.name}`,
  },
  description,
  openGraph: {
    siteName: brand.name,
    type: "website",
    locale: "en_IN",
    description,
    images: [{ url: "/img/products/hauzkhas-coord-2.webp", width: 1200, height: 1800, alt: "A model in a coral and teal printed co-ord set" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f67aa9",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // The inline script adds a `js` class before paint so scroll-reveal styles only apply when scripts run.
    <html lang="en" className={`${fraunces.variable} ${hanken.variable} ${dmMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: 'document.documentElement.classList.add("js")' }} />
      </head>
      <body>
        <ShopProvider>
          <a className="skip" href="#main">
            Skip to content
          </a>
          <Header />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <Overlays />
        </ShopProvider>
      </body>
    </html>
  );
}
