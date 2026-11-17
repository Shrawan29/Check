import Link from "next/link";
import { brand, categories, plans } from "@/lib/catalog";
import { Icon, Mark, Wordmark } from "@/components/Icon";

/** The two words of the brand name, defined the way a tailor would. */
export function Lexicon({ className, id }: { className: string; id?: string }) {
  return (
    <dl className={className} id={id}>
      {brand.lexicon.map((entry) => (
        <div key={entry.word}>
          <dt>
            {entry.word} <small>{entry.kind}</small>
          </dt>
          <dd>{entry.text}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer mat">
      <div className="wrap">
        <div className="footer__top">
          <div className="footer__word" aria-hidden="true">
            <Mark />
            <span>
              <Wordmark />
            </span>
          </div>
          <Lexicon className="footer__def" />
        </div>

        <div className="footer__cols">
          <div>
            <h3>Shop</h3>
            <ul>
              <li>
                <Link href="/shop?drop=1">New drop</Link>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <Link href={`/shop?cat=${c.id}`}>{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>By plan</h3>
            <ul>
              {plans.map((p) => (
                <li key={p.id}>
                  <Link href={`/shop?plan=${p.id}`}>{p.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Help</h3>
            <ul>
              <li>
                <Link href="/story#contact">Track your order</Link>
              </li>
              <li>
                <Link href="/story#contact">Returns &amp; exchange</Link>
              </li>
              <li>
                <Link href="/story#contact">Shipping</Link>
              </li>
              <li>
                <Link href="/story#contact">Contact us</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3>Say hello</h3>
            <ul>
              <li>
                <a href={`mailto:${brand.email}`}>{brand.email}</a>
              </li>
              <li>
                <a href={`tel:${brand.phone.replace(/\s/g, "")}`}>{brand.phone}</a>
              </li>
              <li>
                <Link href="/story">Our story</Link>
              </li>
            </ul>
            <div className="footer__social">
              <a className="icon-btn" href="#" aria-label="Instagram">
                <Icon name="instagram" />
              </a>
              <a className="icon-btn" href="#" aria-label="WhatsApp">
                <Icon name="whatsapp" />
              </a>
              <a className="icon-btn" href="#" aria-label="YouTube">
                <Icon name="youtube" />
              </a>
            </div>
          </div>
        </div>

        <div className="care">
          <div className="care__icons" aria-hidden="true">
            <Icon name="wash" />
            <Icon name="nobleach" />
            <Icon name="dryflat" />
            <Icon name="iron" />
          </div>
          <p>Care label for this website: scroll gently · do not bleach · best worn out of the house · made in India</p>
        </div>

        <div className="footer__base">
          <span>
            © {year} {brand.name}
          </span>
          <span>Cash on delivery · UPI and cards coming soon</span>
        </div>
      </div>
    </footer>
  );
}
