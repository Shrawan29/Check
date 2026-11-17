"use client";

import Image from "next/image";
import Link from "next/link";
import { brand, byId, imgSrc } from "@/lib/catalog";
import { money, ProductName } from "@/lib/format";
import { useShop } from "@/lib/shop-context";
import { Icon, Mark } from "@/components/Icon";
import { CloseButton, Panel } from "./Panel";

export function CartDrawer() {
  const { cart, count, subtotal, setQty, removeLine, closePanel } = useShop();
  const left = Math.max(0, brand.freeShippingOver - subtotal);

  return (
    <Panel name="cart" side="right" labelledBy="cart-title">
      <div className="panel__head">
        <h2 className="panel__title" id="cart-title">
          Your bag {count > 0 && <small>({count})</small>}
        </h2>
        <CloseButton label="Close bag" />
      </div>

      {count === 0 ? (
        <div className="panel__body">
          <div className="cart-empty">
            <Mark />
            <h3>Nothing in here yet</h3>
            <p>Batches are small and Friday&apos;s drop won&apos;t wait around.</p>
            <Link className="btn btn--ink" href="/shop?drop=1" onClick={closePanel}>
              Shop the drop <Icon name="arrow" />
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="ship">
            {left > 0 ? (
              <>
                <strong>{money(left)}</strong> away from free shipping
              </>
            ) : (
              <>
                <strong>Free shipping</strong> unlocked
              </>
            )}
            <div
              className="ship__bar"
              role="progressbar"
              aria-label="Progress to free shipping"
              aria-valuemin={0}
              aria-valuemax={brand.freeShippingOver}
              aria-valuenow={Math.min(subtotal, brand.freeShippingOver)}
            >
              <span style={{ transform: `scaleX(${Math.min(1, subtotal / brand.freeShippingOver)})` }} />
            </div>
          </div>

          <div className="panel__body">
            <ul className="lines">
              {cart.map((item, i) => {
                const p = byId(item.id);
                if (!p) return null;
                return (
                  <li className="line" key={`${item.id}-${item.size}`}>
                    <Link className="line__img" href={`/product/${p.id}`} tabIndex={-1} aria-hidden="true" onClick={closePanel}>
                      <Image src={imgSrc(p.img[0])} alt="" width={168} height={210} sizes="84px" />
                    </Link>
                    <div className="line__main">
                      <Link className="line__name" href={`/product/${p.id}`} onClick={closePanel}>
                        <ProductName name={p.name} />
                      </Link>
                      <span className="line__price">{money(p.price * item.qty)}</span>
                      <span className="line__meta">
                        {p.colour} · {item.size}
                      </span>
                      <div className="line__row">
                        <div className="qty">
                          <button type="button" onClick={() => setQty(i, item.qty - 1)} aria-label={`Decrease quantity of ${p.name}`}>
                            <Icon name="minus" />
                          </button>
                          <output aria-label="Quantity">{item.qty}</output>
                          <button type="button" onClick={() => setQty(i, item.qty + 1)} aria-label={`Increase quantity of ${p.name}`}>
                            <Icon name="plus" />
                          </button>
                        </div>
                        <button className="line__remove" type="button" onClick={() => removeLine(i)} aria-label={`Remove ${p.name}`}>
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="panel__foot">
            <div className="cart-total">
              <span>Subtotal</span>
              <span>{money(subtotal)}</span>
            </div>
            <p className="cart-note">Taxes included. Shipping is worked out at checkout.</p>
            <Link className="btn btn--ink btn--block" href="/checkout" onClick={closePanel}>
              Checkout <Icon name="arrow" />
            </Link>
          </div>
        </>
      )}
    </Panel>
  );
}
