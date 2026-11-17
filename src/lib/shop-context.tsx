"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { byId } from "@/lib/catalog";

export type CartItem = { id: string; size: string; qty: number };
export type PanelName = "menu" | "cart" | "search" | "sizeguide";
export type ToastAction = { label: string; run: () => void };
export type Toast = { id: number; message: string; action?: ToastAction; leaving?: boolean };

type Shop = {
  /** True once the bag and saved list have been read from the browser. */
  ready: boolean;
  cart: CartItem[];
  count: number;
  subtotal: number;
  addToBag: (id: string, size: string, qty?: number) => void;
  setQty: (index: number, qty: number) => void;
  removeLine: (index: number) => void;
  clearCart: () => void;
  saved: string[];
  isSaved: (id: string) => boolean;
  toggleSaved: (id: string) => void;
  panel: PanelName | null;
  openPanel: (name: PanelName) => void;
  closePanel: () => void;
  toasts: Toast[];
  toast: (message: string, action?: ToastAction) => void;
};

const ShopContext = createContext<Shop | null>(null);

const BAG_KEY = "checkpink_bag";
const SAVED_KEY = "checkpink_saved";
const MAX_QTY = 9;

function read<T>(key: string, fallback: T): T {
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? "null");
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode or storage full: the session still works in memory */
  }
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [panel, setPanel] = useState<PanelName | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const lastFocus = useRef<HTMLElement | null>(null);
  const toastId = useRef(0);

  // Load the bag and saved pieces after mount, so server and first client render match.
  useEffect(() => {
    setCart(read<CartItem[]>(BAG_KEY, []).filter((i) => byId(i.id)));
    setSaved(read<string[]>(SAVED_KEY, []).filter((id) => byId(id)));
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) write(BAG_KEY, cart);
  }, [cart, ready]);

  useEffect(() => {
    if (ready) write(SAVED_KEY, saved);
  }, [saved, ready]);

  /* ------------------------------ Toasts ------------------------------ */
  const dismissToast = useCallback((id: number) => {
    setToasts((list) => list.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), 260);
  }, []);

  const toast = useCallback(
    (message: string, action?: ToastAction) => {
      const id = ++toastId.current;
      const wrapped = action ? { label: action.label, run: () => (action.run(), dismissToast(id)) } : undefined;
      setToasts((list) => [...list.slice(-1), { id, message, action: wrapped }]);
      setTimeout(() => dismissToast(id), 4200);
    },
    [dismissToast]
  );

  /* ------------------------------ Panels ------------------------------ */
  const openPanel = useCallback((name: PanelName) => {
    setPanel((current) => {
      if (!current) lastFocus.current = document.activeElement as HTMLElement | null;
      return name;
    });
  }, []);

  const closePanel = useCallback(() => {
    setPanel(null);
    const el = lastFocus.current;
    if (el && document.contains(el)) el.focus({ preventScroll: true });
  }, []);

  // Lock page scroll while a panel is open, compensating for the scrollbar.
  useEffect(() => {
    const root = document.documentElement;
    if (panel) {
      const gap = window.innerWidth - root.clientWidth;
      document.body.style.paddingRight = gap ? gap + "px" : "";
      root.classList.add("is-locked");
    } else {
      root.classList.remove("is-locked");
      document.body.style.paddingRight = "";
    }
  }, [panel]);

  // Navigating away closes whatever was open.
  useEffect(() => {
    setPanel(null);
  }, [pathname]);

  /* -------------------------------- Bag ------------------------------- */
  const addToBag = useCallback(
    (id: string, size: string, qty = 1) => {
      const p = byId(id);
      if (!p || p.soldOut || p.out.includes(size) || !p.sizes.includes(size)) return;
      setCart((items) => {
        const hit = items.find((i) => i.id === id && i.size === size);
        if (hit) return items.map((i) => (i === hit ? { ...i, qty: Math.min(i.qty + qty, MAX_QTY) } : i));
        return [...items, { id, size, qty: Math.min(qty, MAX_QTY) }];
      });
      openPanel("cart");
    },
    [openPanel]
  );

  const setQty = useCallback((index: number, qty: number) => {
    setCart((items) => (qty < 1 ? items.filter((_, i) => i !== index) : items.map((item, i) => (i === index ? { ...item, qty: Math.min(qty, MAX_QTY) } : item))));
  }, []);

  const removeLine = useCallback(
    (index: number) => {
      const removed = cart[index];
      if (!removed) return;
      setCart((items) => items.filter((_, i) => i !== index));
      toast(`Removed ${byId(removed.id)?.name ?? "item"}`, { label: "Undo", run: () => setCart((items) => [...items, removed]) });
    },
    [cart, toast]
  );

  const clearCart = useCallback(() => setCart([]), []);

  /* ------------------------------- Saved ------------------------------ */
  const isSaved = useCallback((id: string) => saved.includes(id), [saved]);

  const toggleSaved = useCallback(
    (id: string) => {
      const p = byId(id);
      if (!p) return;
      const on = !saved.includes(id);
      setSaved((ids) => (on ? [...ids, id] : ids.filter((x) => x !== id)));
      if (on) toast(`Saved ${p.name}`, { label: "View saved", run: () => router.push("/shop?saved=1") });
      else toast(`Removed ${p.name} from saved`);
    },
    [saved, toast, router]
  );

  const value = useMemo<Shop>(() => {
    const count = cart.reduce((n, i) => n + i.qty, 0);
    const subtotal = cart.reduce((n, i) => n + (byId(i.id)?.price ?? 0) * i.qty, 0);
    return { ready, cart, count, subtotal, addToBag, setQty, removeLine, clearCart, saved, isSaved, toggleSaved, panel, openPanel, closePanel, toasts, toast };
  }, [ready, cart, addToBag, setQty, removeLine, clearCart, saved, isSaved, toggleSaved, panel, openPanel, closePanel, toasts, toast]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop(): Shop {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used inside <ShopProvider>");
  return ctx;
}
