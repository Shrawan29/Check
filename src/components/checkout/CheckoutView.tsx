"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { brand, byId, imgSrc } from "@/lib/catalog";
import { postJson } from "@/lib/api-client";
import { cx, money, ProductName } from "@/lib/format";
import { useShop } from "@/lib/shop-context";
import { Icon, Mark } from "@/components/Icon";

type CustomerField = "name" | "phone" | "email" | "address" | "city" | "state" | "pincode";
type Priced = { subtotal: number; shipping: number; total: number; issues: { id: string; size: string; message: string }[] };
type Placed = { number: string; total: number };

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

// Mirrors the server's rules so most mistakes are caught before the request; the server still has the final say.
const RULES: Record<CustomerField, (v: string) => string> = {
  name: (v) => (v.trim().length >= 2 ? "" : "Enter your full name."),
  phone: (v) => (/^(\+?91[\s-]?)?[6-9]\d{9}$/.test(v.trim()) ? "" : "Enter a 10-digit Indian mobile number."),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Enter an email address like you@example.com."),
  address: (v) => (v.trim().length >= 8 ? "" : "Enter your full address, including house or flat number."),
  city: (v) => (v.trim().length >= 2 ? "" : "Enter your city."),
  state: (v) => (v ? "" : "Choose your state."),
  pincode: (v) => (/^[1-9]\d{5}$/.test(v.trim()) ? "" : "Enter a 6-digit PIN code."),
};
const FIELDS = Object.keys(RULES) as CustomerField[];
const EMPTY: Record<CustomerField, string> = { name: "", phone: "", email: "", address: "", city: "", state: "", pincode: "" };

export function CheckoutView() {
  const { ready, cart, subtotal, clearCart } = useShop();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<CustomerField, string>>>({});
  const [priced, setPriced] = useState<Priced | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [placed, setPlaced] = useState<Placed | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  // Ask the server for the real totals whenever the bag changes.
  const cartKey = cart.map((i) => `${i.id}:${i.size}:${i.qty}`).join("|");
  useEffect(() => {
    if (!ready || !cart.length) {
      setPriced(null);
      return;
    }
    let stale = false;
    postJson<Priced>("/api/cart/price", { items: cart }).then((res) => {
      if (!stale) setPriced(res.ok ? res.data : null);
    });
    return () => {
      stale = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, cartKey]);

  if (placed) {
    return (
      <section className="wrap confirm" aria-labelledby="confirm-title">
        <Mark />
        <p className="eyebrow">Order placed</p>
        <h1 id="confirm-title">
          It&apos;s on <em>the table.</em>
        </h1>
        <p className="confirm__no">{placed.number}</p>
        <p>
          Thank you. We&apos;ll pack it within a day and it should reach you in three to five working days. Keep {money(placed.total)} ready to pay on delivery, and quote the order number above if you need us.
        </p>
        <Link className="btn btn--ink" href="/shop">
          Keep browsing <Icon name="arrow" />
        </Link>
      </section>
    );
  }

  if (!ready) return <div className="wrap" style={{ minHeight: "60vh" }} aria-busy="true" />;

  if (!cart.length) {
    return (
      <section className="wrap notfound">
        <div className="empty">
          <Mark />
          <h1>
            Your bag is <em>empty</em>
          </h1>
          <p>Add a piece or two and come back. Batches are small, so the good sizes go first.</p>
          <Link className="btn btn--ink" href="/shop?drop=1">
            Shop the drop <Icon name="arrow" />
          </Link>
        </div>
      </section>
    );
  }

  const localShipping = subtotal >= brand.freeShippingOver ? 0 : brand.shippingFee;
  const totals = priced ?? { subtotal, shipping: localShipping, total: subtotal + localShipping, issues: [] };
  const blocked = totals.issues.length > 0;

  const set = (key: CustomerField) => (e: { target: { value: string } }) => setValues((v) => ({ ...v, [key]: e.target.value }));
  const check = (key: CustomerField) => setErrors((prev) => ({ ...prev, [key]: values[key] ? RULES[key](values[key]) : prev[key] }));
  const control = (key: CustomerField) => ({
    id: `co-${key}`,
    name: key,
    value: values[key],
    onChange: set(key),
    onBlur: () => check(key),
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": `co-${key}-err`,
  });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const found = Object.fromEntries(FIELDS.map((f) => [f, RULES[f](values[f])])) as Record<CustomerField, string>;
    setErrors(found);
    const firstBad = FIELDS.find((f) => found[f]);
    if (firstBad) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstBad}"]`)?.focus();
      return;
    }

    setBusy(true);
    setNotice("");
    const res = await postJson<Placed>("/api/orders", { items: cart, customer: values, payment: "cod" });
    setBusy(false);

    if (res.ok) {
      setPlaced({ number: res.data.number, total: res.data.total });
      clearCart();
      window.scrollTo({ top: 0 });
      return;
    }
    // Field errors come back keyed as "customer.phone"; show them under the matching inputs.
    const fromServer: Partial<Record<CustomerField, string>> = {};
    for (const f of FIELDS) if (res.fields[`customer.${f}`]) fromServer[f] = res.fields[`customer.${f}`];
    setErrors(fromServer);
    setNotice(res.error);
    const firstServerBad = FIELDS.find((f) => fromServer[f]);
    if (firstServerBad) formRef.current?.querySelector<HTMLElement>(`[name="${firstServerBad}"]`)?.focus();
  };

  const err = (key: CustomerField) => (
    <p className="field-error" id={`co-${key}-err`} role="alert">
      {errors[key]}
    </p>
  );

  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/shop">Shop</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Checkout</span>
          </nav>
          <h1>
            Nearly <em>yours</em>
          </h1>
        </div>
      </section>

      <div className="wrap checkout">
        <form className="checkout__form" ref={formRef} onSubmit={submit} noValidate>
          {blocked && (
            <div className="notice" role="alert">
              {totals.issues.map((i) => i.message).join(" ")} Remove it from your bag to continue.
            </div>
          )}

          <fieldset>
            <legend>Where is it going?</legend>
            <div className={cx("field", errors.name && "has-error")}>
              <label htmlFor="co-name">Full name</label>
              <input className="input" type="text" autoComplete="name" required {...control("name")} />
              {err("name")}
            </div>
            <div className="form__two">
              <div className={cx("field", errors.phone && "has-error")}>
                <label htmlFor="co-phone">Mobile number</label>
                <input className="input" type="tel" autoComplete="tel" inputMode="tel" placeholder="98765 43210" required {...control("phone")} />
                {err("phone")}
              </div>
              <div className={cx("field", errors.email && "has-error")}>
                <label htmlFor="co-email">Email</label>
                <input className="input" type="email" autoComplete="email" inputMode="email" required {...control("email")} />
                {err("email")}
              </div>
            </div>
            <div className={cx("field", errors.address && "has-error")}>
              <label htmlFor="co-address">Address</label>
              <textarea className="textarea" autoComplete="street-address" placeholder="House or flat number, street, area, landmark" required style={{ minHeight: 96 }} {...control("address")} />
              {err("address")}
            </div>
            <div className="form__two">
              <div className={cx("field", errors.city && "has-error")}>
                <label htmlFor="co-city">City</label>
                <input className="input" type="text" autoComplete="address-level2" required {...control("city")} />
                {err("city")}
              </div>
              <div className={cx("field", errors.pincode && "has-error")}>
                <label htmlFor="co-pincode">PIN code</label>
                <input className="input" type="text" autoComplete="postal-code" inputMode="numeric" maxLength={6} required {...control("pincode")} />
                {err("pincode")}
              </div>
            </div>
            <div className={cx("field", errors.state && "has-error")}>
              <label htmlFor="co-state">State</label>
              <select className="select" autoComplete="address-level1" required {...control("state")}>
                <option value="">Choose a state</option>
                {STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {err("state")}
            </div>
          </fieldset>

          <fieldset>
            <legend>How will you pay?</legend>
            <div className="pay">
              <label>
                <input type="radio" name="payment" value="cod" defaultChecked />
                <b>Cash on delivery</b>
                <small>Pay the courier in cash or by UPI when it arrives.</small>
              </label>
              <label>
                <input type="radio" name="payment" value="online" disabled />
                <b>UPI, card or net banking</b>
                <small>Coming soon.</small>
              </label>
            </div>
          </fieldset>

          {notice && (
            <div className="notice" role="alert">
              {notice}
            </div>
          )}

          <button className={cx("btn btn--ink", busy && "is-busy")} type="submit" disabled={busy || blocked} style={{ minHeight: 56 }}>
            {busy ? "Placing your order…" : `Place order · ${money(totals.total)}`}
          </button>
        </form>

        <aside className="summary" aria-labelledby="summary-title">
          <h2 id="summary-title">In your bag</h2>
          <ul className="lines">
            {cart.map((item) => {
              const p = byId(item.id);
              if (!p) return null;
              return (
                <li className="line" key={`${item.id}-${item.size}`}>
                  <span className="line__img">
                    <Image src={imgSrc(p.img[0])} alt="" width={168} height={210} sizes="84px" />
                  </span>
                  <div className="line__main">
                    <span className="line__name">
                      <ProductName name={p.name} />
                    </span>
                    <span className="line__price">{money(p.price * item.qty)}</span>
                    <span className="line__meta">
                      {p.colour} · {item.size} · Qty {item.qty}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
          <dl className="summary__rows">
            <div>
              <dt>Subtotal</dt>
              <dd>{money(totals.subtotal)}</dd>
            </div>
            <div>
              <dt>Shipping</dt>
              <dd>{totals.shipping === 0 ? "Free" : money(totals.shipping)}</dd>
            </div>
            <div className="is-total">
              <dt>Total</dt>
              <dd>{money(totals.total)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </>
  );
}
