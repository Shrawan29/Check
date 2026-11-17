import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { brand } from "@/lib/catalog";
import { cssVars } from "@/lib/format";
import { Icon } from "@/components/Icon";
import { Lexicon } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { ContactForm } from "@/components/story/ContactForm";

export const metadata: Metadata = {
  title: "Our story",
  description: `${brand.name} is a womenswear label that owns its own sewing machines. Small batches, cut and stitched under one roof in India and sold direct.`,
};

const rise = (i: number) => cssVars({ "--i": i });

export default function StoryPage() {
  return (
    <>
      <section className="story-hero mat" aria-labelledby="story-title">
        <div className="wrap">
          <p className="eyebrow rise" style={rise(0)}>
            Our story
          </p>
          <h1 id="story-title" className="rise" style={rise(1)}>
            A label that owns its <em>sewing machines.</em>
          </h1>
          <p className="lede rise" style={rise(2)}>
            We started on the factory floor, making clothes for other people&apos;s labels. {brand.name} is what happened when we started making them for you instead.
          </p>
          <div className="rise" style={rise(3)}>
            <Lexicon className="story-def" />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="floor-title">
        <div className="wrap story-split">
          <Reveal as="figure">
            <Image src="/img/story/flatlay.webp" alt="Thread cones, tailor's scissors and a measuring tape laid out on a cutting table" width={1200} height={1500} sizes="(min-width: 960px) 40vw, 100vw" />
            <figcaption>
              <span className="label">The cutting table</span>
            </figcaption>
          </Reveal>
          <Reveal className="prose">
            <p className="eyebrow">From the floor</p>
            <h2 id="floor-title">
              It began with <em>leftover fabric</em>
            </h2>
            <p>
              For years our workshop cut and stitched for bigger names. We knew what the fabric cost, what the stitching cost, and what the tag in the mall said at the end. The gap between those numbers never sat right.
            </p>
            <p>
              So one Friday we cut forty dresses from a roll that was left over, photographed them on the cutting table and posted them online. They were gone by Sunday. We did it again the next week, and we haven&apos;t missed a Friday since.
            </p>
            <p>That is still the whole model. A small batch, cut once. A fair price, because nobody stands between the sewing machine and your front door.</p>
          </Reveal>
        </div>
      </section>

      <section className="section section--muslin" aria-labelledby="values-title">
        <div className="wrap">
          <Reveal as="header" className="sec-head">
            <p className="eyebrow">How we work</p>
            <h2 id="values-title">
              Three rules on <em>the workshop wall</em>
            </h2>
          </Reveal>
          <ul className="values">
            <Reveal as="li" i={0}>
              <Icon name="scissors" strokeWidth={1.4} />
              <h3>Cut small</h3>
              <p>Batches of 24 to 100. If it sells out, good. If you loved it, tell us and we may cut it again.</p>
            </Reveal>
            <Reveal as="li" i={1}>
              <Icon name="needle" strokeWidth={1.4} />
              <h3>Finish it properly</h3>
              <p>One tailor per piece, start to end. Seams are bound, hems are deep and buttonholes are tight.</p>
            </Reveal>
            <Reveal as="li" i={2}>
              <Icon name="box" strokeWidth={1.4} />
              <h3>Sell it straight</h3>
              <p>No agents, no distributors, no mall rent. The price pays for the dress and the people who made it.</p>
            </Reveal>
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="hands-title">
        <div className="wrap story-split story-split--flip">
          <Reveal as="figure">
            <Image src="/img/story/machine.webp" alt="A tailor's hands guiding white fabric under a sewing machine" width={1100} height={1375} sizes="(min-width: 960px) 40vw, 100vw" />
            <figcaption>
              <span className="label">Batch {brand.drop.number}, in progress</span>
            </figcaption>
          </Reveal>
          <Reveal className="prose">
            <p className="eyebrow">The hands</p>
            <h2 id="hands-title">
              Every batch card <em>is signed</em>
            </h2>
            <p>
              Each batch leaves the workshop with a card: what was cut, how many, and who stitched it. It is on the swing tag in your parcel. If a seam ever gives up before you do, that card tells us exactly what to fix.
            </p>
            <p>We pay by the month, not by the piece, so nobody is rushing your hem to make rent.</p>
            <p>
              <Link className="btn btn--ink" href="/shop?drop=1">
                See this week&apos;s batch
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section section--muslin" id="contact" aria-labelledby="contact-title">
        <div className="wrap contact__grid">
          <Reveal>
            <p className="eyebrow">Contact &amp; help</p>
            <h2 id="contact-title" style={{ marginTop: 16 }}>
              Talk to <em>the workshop</em>
            </h2>
            <p className="lede" style={{ marginTop: 18 }}>
              Orders, exchanges, sizing, or a piece you want us to cut again. A person replies, usually the same day.
            </p>
            <ul className="contact__list">
              <li>
                <span>Email</span>
                <a href={`mailto:${brand.email}`}>{brand.email}</a>
              </li>
              <li>
                <span>Phone &amp; WhatsApp</span>
                <a href={`tel:${brand.phone.replace(/\s/g, "")}`}>{brand.phone}</a>
              </li>
              <li>
                <span>Hours</span>
                <b>Mon to Sat, 10 AM to 7 PM</b>
              </li>
            </ul>
          </Reveal>
          <Reveal>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
