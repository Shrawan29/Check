/* Pricing and order creation. Prices, stock and shipping are always worked out here, never trusted from the browser. */

import { randomBytes } from "node:crypto";
import { brand, byId } from "@/lib/catalog";
import { insert } from "./storage";
import type { CartItemsInput, OrderInput } from "./validation";

export type PricedLine = { id: string; name: string; colour: string; size: string; qty: number; unitPrice: number; lineTotal: number };
export type CartIssue = { id: string; size: string; code: "not_found" | "sold_out" | "size_unavailable"; message: string };
export type PricedCart = {
  lines: PricedLine[];
  /** Lines that can't be bought; they are left out of the totals. */
  issues: CartIssue[];
  subtotal: number;
  shipping: number;
  total: number;
  freeShippingOver: number;
};

export function priceCart(items: CartItemsInput): PricedCart {
  const lines: PricedLine[] = [];
  const issues: CartIssue[] = [];

  for (const item of items) {
    const p = byId(item.id);
    if (!p) {
      issues.push({ id: item.id, size: item.size, code: "not_found", message: "This piece is no longer available." });
    } else if (p.soldOut) {
      issues.push({ id: p.id, size: item.size, code: "sold_out", message: `${p.name} has sold out.` });
    } else if (!p.sizes.includes(item.size) || p.out.includes(item.size)) {
      issues.push({ id: p.id, size: item.size, code: "size_unavailable", message: `${p.name} is no longer available in ${item.size}.` });
    } else {
      // The same piece and size sent twice is one line.
      const existing = lines.find((l) => l.id === p.id && l.size === item.size);
      if (existing) {
        existing.qty = Math.min(existing.qty + item.qty, 9);
        existing.lineTotal = existing.qty * existing.unitPrice;
      } else {
        lines.push({ id: p.id, name: p.name, colour: p.colour, size: item.size, qty: item.qty, unitPrice: p.price, lineTotal: p.price * item.qty });
      }
    }
  }

  const subtotal = lines.reduce((n, l) => n + l.lineTotal, 0);
  const shipping = subtotal === 0 || subtotal >= brand.freeShippingOver ? 0 : brand.shippingFee;
  return { lines, issues, subtotal, shipping, total: subtotal + shipping, freeShippingOver: brand.freeShippingOver };
}

export class CartRejectedError extends Error {
  constructor(public issues: CartIssue[]) {
    super("Some items in the bag can't be bought.");
    this.name = "CartRejectedError";
  }
}

export type Order = {
  number: string;
  createdAt: string;
  status: "placed";
  payment: "cod";
  customer: OrderInput["customer"];
  note?: string;
  lines: PricedLine[];
  subtotal: number;
  shipping: number;
  total: number;
};

// Short, unambiguous order numbers: no 0/O or 1/I.
const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
const orderNumber = () => "CP-" + Array.from(randomBytes(8), (b) => ALPHABET[b % ALPHABET.length]).join("");

export async function createOrder(input: OrderInput): Promise<Order> {
  const priced = priceCart(input.items);
  if (priced.issues.length || !priced.lines.length) throw new CartRejectedError(priced.issues);

  const order: Order = {
    number: orderNumber(),
    createdAt: new Date().toISOString(),
    status: "placed",
    payment: "cod",
    customer: input.customer,
    ...(input.note ? { note: input.note } : {}),
    lines: priced.lines,
    subtotal: priced.subtotal,
    shipping: priced.shipping,
    total: priced.total,
  };
  return insert("orders", order);
}
