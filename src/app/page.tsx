import Image from "next/image";
import Link from "next/link";
import { brand, byId } from "@/lib/catalog";
import { cssVars, money, ProductName } from "@/lib/format";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { AlertsForm, Countdown, DenimCarousel, DropSection, Plans, Rail } from "@/components/home/islands";

const rise = (i: number) => cssVars({ "--i": i });

const KEPT = ["Fabric & trims", "Cutting & stitching", "Fair wages, paid on time", "Delivery to your door"];
const CUT = ["Agent's commission", "Distributor's margin", "Mall rent"];

const LOOKS = [
  { img: "look-car", href: "/shop?plan=festive", label: "Late, and worth it", wide: true, alt: "A woman in a printed tunic stepping out of a blue car" },
  { img: "look-polka", href: "/shop?cat=dresses", label: "Dots, outdoors", wide: false, alt: "Black and white photo of a woman in a polka-dot dress sitting on a rock" },
  { img: "look-trench", href: "/shop?plan=office", label: "Desk to dinner", wide: false, alt: "A woman in a trench coat and black maxi skirt in front of a red brick building" },
  { img: "look-road", href: "/shop?cat=denim", label: "Besant jeans, middle of the road", wide: true, alt: "A woman in jeans and a white top crouching on an empty road" },
  { img: "look-navy", href: "/shop?cat=festive", label: "Shaadi, day two", wide: false, alt: "A woman in a navy embroidered outfit and silver bangles" },
  { img: "look-stairs", href: "/shop?cat=denim", label: "Double denim", wide: false, alt: "A woman in a denim jacket and jeans sitting on outdoor steps" },
];

export default function HomePage() {
  const onTheTable = byId("hauzkhas-coord")!;

  return (
    <>
      {/* Hero: the cutting mat */}
      <section className="hero mat" aria-labelledby="hero-title">
        <div className="wrap hero__grid">
          <div className="hero__copy">
            <p className="eyebrow eyebrow--live rise" style={rise(0)}>
              <span className="live" aria-hidden="true" />
              Drop Nº {brand.drop.number} is live
            </p>
            <h1 className="hero__title" id="hero-title">
              <span className="rise" style={rise(1)}>
                Straight off
              </span>
              <span className="rise" style={rise(2)}>
                the <em>cutting</em>
              </span>
              <span className="rise" style={rise(3)}>
                <em>table.</em>
              </span>
            </h1>
            <p className="lede hero__lede rise" style={rise(4)}>
              Small-batch womenswear, cut and sewn in our own workshop and sent straight to you. One new drop every Friday at seven. When a batch is gone, it&apos;s gone.
            </p>
            <div className="hero__cta rise" style={rise(5)}>
              <Link className="btn btn--pink" href="/shop?drop=1">
                Shop the drop <Icon name="arrow" />
              </Link>
              <a className="btn btn--light" href="#lookbook">
                See it worn
              </a>
            </div>
          </div>

          <div className="board">
            <svg className="board__chalk" viewBox="0 0 560 638" aria-hidden="true">
              <path d="M505 44v196M497 58l8-14 8 14M497 226l8 14 8-14" />
              <path className="dash" d="M300 618c70 14 150 8 236-24" />
            </svg>
            <span className="board__note board__note--grain" aria-hidden="true">
              Grainline
            </span>
            <span className="board__note board__note--cut" aria-hidden="true">
              Cut 1<br />
              on fold
            </span>

            <figure className="piece piece--a">
              <span className="tapebit" aria-hidden="true" />
              <span className="piece__in">
                <Image
                  src="/img/products/hauzkhas-coord-2.webp"
                  alt="A woman laughing in a coral and teal printed co-ord set, seated against a white wall"
                  width={1200}
                  height={1500}
                  sizes="(min-width: 960px) 30vw, 70vw"
                  loading="eager"
                  fetchPriority="high"
                />
              </span>
            </figure>
            <figure className="piece piece--b">
              <span className="tapebit" aria-hidden="true" />
              <span className="piece__in">
                <Image src="/img/editorial/hero-orange.webp" alt="A woman seated in a flowing rust-orange dress" width={1200} height={1500} sizes="(min-width: 960px) 18vw, 42vw" loading="eager" />
              </span>
            </figure>

            <Link className="swingtag" href={`/product/${onTheTable.id}`}>
              <svg className="swingtag__string" viewBox="0 0 64 78" aria-hidden="true">
                <path d="M5 74C-2 44 30 40 58 4" />
              </svg>
              <span className="swingtag__card">
                <span className="swingtag__kicker">On the table</span>
                <span className="swingtag__name">
                  <ProductName name={onTheTable.name} />
                </span>
                <span className="swingtag__meta">
                  <span>
                    {money(onTheTable.price)} · {onTheTable.batch[0]} made
                  </span>
                  <Icon name="arrow" />
                </span>
              </span>
            </Link>
          </div>
        </div>

        <div className="drop-bar">
          <div className="wrap drop-bar__in">
            <Countdown />
            <a className="link link--light" href="#alerts">
              Remind me <Icon name="arrow" />
            </a>
          </div>
        </div>
      </section>

      {/* Shop by plan */}
      <section className="section" aria-labelledby="plans-title">
        <div className="wrap">
          <Reveal as="header" className="sec-head">
            <p className="eyebrow">Shop by plan</p>
            <h2 id="plans-title">
              Where are you <em>headed?</em>
            </h2>
          </Reveal>
          <Reveal>
            <Plans />
          </Reveal>
        </div>
      </section>

      {/* This week's drop */}
      <DropSection />

      {/* The rail: categories */}
      <section className="section" aria-labelledby="rail-title">
        <div className="wrap">
          <Reveal as="header" className="sec-head">
            <p className="eyebrow">Off the rail</p>
            <h2 id="rail-title">
              Pick a <em>hanger</em>
            </h2>
          </Reveal>
        </div>
        <Rail />
      </section>

      {/* Factory direct */}
      <section className="section mat direct" aria-labelledby="direct-title">
        <div className="wrap direct__grid">
          <Reveal>
            <p className="eyebrow">Why it costs less</p>
            <h2 id="direct-title" style={{ marginTop: 16 }}>
              We own the <em>sewing machines.</em>
            </h2>
            <p className="lede">
              Most labels design a dress, then pay a factory, an agent, a distributor and a mall before it ever reaches you. We skip to the end. Every piece is cut and stitched under our own roof and posted straight to yours.
            </p>
            <ol className="steps">
              <li>
                <Icon name="scissors" strokeWidth={1.4} />
                <h3>
                  <small>01</small>Cut
                </h3>
                <p>Fabric is cut in batches of 24 to 100. Never thousands, so nothing ends up in a warehouse.</p>
              </li>
              <li>
                <Icon name="needle" strokeWidth={1.4} />
                <h3>
                  <small>02</small>Sew
                </h3>
                <p>One tailor takes a piece from first seam to last button, then signs the batch card.</p>
              </li>
              <li>
                <Icon name="box" strokeWidth={1.4} />
                <h3>
                  <small>03</small>Ship
                </h3>
                <p>Packed the day you order and at your door in three to five. No shop floor in between.</p>
              </li>
            </ol>
            <Link className="link link--light" href="/story">
              Read our story <Icon name="arrow" />
            </Link>
          </Reveal>

          <Reveal as="aside" className="receipt">
            <svg className="receipt__string" viewBox="0 0 90 120" aria-hidden="true">
              <path d="M6 116C-8 70 40 60 84 4" />
            </svg>
            <div className="receipt__card">
              <p className="receipt__kicker">Our price tag, itemised</p>
              <h3>What you pay for</h3>
              <ul>
                {KEPT.map((item) => (
                  <li className="is-kept" key={item}>
                    <span>{item}</span>
                    <span>
                      <Icon name="check" strokeWidth={2} />
                      Kept
                    </span>
                  </li>
                ))}
                {CUT.map((item) => (
                  <li className="is-cut" key={item}>
                    <span>{item}</span>
                    <span>
                      <Icon name="scissors" strokeWidth={1.8} />
                      Cut
                    </span>
                  </li>
                ))}
              </ul>
              <p className="receipt__total">
                <span>Total</span>
                <em>Just the dress.</em>
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Denim edit */}
      <section className="section denim" aria-labelledby="denim-title">
        <div className="wrap denim__grid">
          <Reveal as="figure" className="denim__feature">
            <Image src="/img/editorial/denim-edit.webp" alt="A model in light-wash jeans and a black leather jacket" width={1100} height={1375} sizes="(min-width: 960px) 36vw, 100vw" />
            <figcaption>
              <span className="label">Washed in small lots</span>
            </figcaption>
          </Reveal>
          <DenimCarousel />
        </div>
      </section>

      {/* Lookbook */}
      <section className="section section--muslin" id="lookbook" aria-labelledby="look-title">
        <div className="wrap">
          <Reveal as="header" className="sec-head sec-head--split">
            <div className="sec-head__copy">
              <p className="eyebrow">Seen in the wild</p>
              <h2 id="look-title">
                Worn <em>out of the house</em>
              </h2>
            </div>
            <a className="link" href="#">
              {brand.instagram} on Instagram <Icon name="arrow" />
            </a>
          </Reveal>
          <div className="looks">
            {LOOKS.map((look, i) => (
              <Reveal key={look.img} className={look.wide ? "look look--wide" : "look"} i={i % 4}>
                <Link href={look.href}>
                  <Image src={`/img/editorial/${look.img}.webp`} alt={look.alt} width={1000} height={1500} sizes="(min-width: 720px) 25vw, 100vw" />
                  <span className="label">{look.label}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Drop alerts */}
      <section className="alerts gingham" id="alerts" aria-labelledby="alerts-title">
        <div className="wrap alerts__grid">
          <Reveal>
            <p className="eyebrow">Drop alerts</p>
            <h2 id="alerts-title">
              Be first to <em>the rail.</em>
            </h2>
            <p className="lede">One email on Friday at 6:45 PM, fifteen minutes before the drop goes live. Nothing else, ever.</p>
          </Reveal>
          <Reveal>
            <AlertsForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
