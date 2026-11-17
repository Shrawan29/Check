"use client";

import { createElement, type ReactNode } from "react";
import { useReveal } from "@/lib/use-reveal";
import { cssVars, cx } from "@/lib/format";

type Props = {
  as?: "div" | "header" | "section" | "ul" | "li" | "figure" | "aside" | "p";
  className?: string;
  /** Stagger index: each step delays the entrance by 60ms. */
  i?: number;
  id?: string;
  children: ReactNode;
};

/** Wraps content so it fades up the first time it scrolls into view. */
export function Reveal({ as = "div", className, i, id, children }: Props) {
  const [ref, shown] = useReveal<HTMLElement>();
  return createElement(
    as,
    { ref, id, className: cx("reveal", shown && "is-in", className), style: i != null ? cssVars({ "--i": i }) : undefined },
    children
  );
}
