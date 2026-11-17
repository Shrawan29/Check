"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useShop, type PanelName } from "@/lib/shop-context";
import { Icon } from "@/components/Icon";
import { cx } from "@/lib/format";

type Props = {
  name: PanelName;
  side: "left" | "right" | "top";
  label?: string;
  labelledBy?: string;
  children: ReactNode;
};

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

/** A slide-in dialog: traps focus, closes on Escape, and is inert while closed. */
export function Panel({ name, side, label, labelledBy, children }: Props) {
  const { panel, closePanel } = useShop();
  const open = panel === name;
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const el = ref.current;
    if (!el) return;
    const first = el.querySelector<HTMLElement>("[data-autofocus]") ?? el.querySelector<HTMLElement>("[data-close]");
    const timer = setTimeout(() => first?.focus({ preventScroll: true }), 60);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closePanel();
        return;
      }
      if (e.key !== "Tab") return;
      const items = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((n) => n.offsetParent !== null);
      if (!items.length) return;
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstItem) {
        e.preventDefault();
        lastItem.focus();
      } else if (!e.shiftKey && document.activeElement === lastItem) {
        e.preventDefault();
        firstItem.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, closePanel]);

  return (
    <aside
      ref={ref}
      className={cx("panel", `panel--${side}`, open && "is-open")}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      aria-labelledby={labelledBy}
      inert={!open}
    >
      {children}
    </aside>
  );
}

export function CloseButton({ label }: { label: string }) {
  const { closePanel } = useShop();
  return (
    <button className="icon-btn" type="button" data-close onClick={closePanel} aria-label={label}>
      <Icon name="close" />
    </button>
  );
}
