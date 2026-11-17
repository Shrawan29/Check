import { Fragment, type CSSProperties } from "react";

export const money = (n: number) => "₹" + n.toLocaleString("en-IN");
export const pieces = (n: number) => `${n} ${n === 1 ? "piece" : "pieces"}`;

/** Join class names, skipping falsy values. */
export const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(" ");

/** Pass CSS custom properties through the `style` prop. */
export const cssVars = (vars: Record<string, string | number>) => vars as CSSProperties;

/** A product name with hyphenated words (Co-ord, Lace-up) kept on one line. */
export function ProductName({ name }: { name: string }) {
  return (
    <>
      {name.split(" ").map((word, i) => (
        <Fragment key={i}>
          {i > 0 && " "}
          {word.includes("-") ? <span className="nb">{word}</span> : word}
        </Fragment>
      ))}
    </>
  );
}
