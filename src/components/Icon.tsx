import { brand } from "@/lib/catalog";

const PATHS = {
  menu: '<path d="M3 8.5h18M3 15.5h18"/>',
  close: '<path d="M5.5 5.5l13 13M18.5 5.5l-13 13"/>',
  search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="M16 16l5 5"/>',
  heart: '<path d="M12 20.3S4.5 15.8 4.5 10.1A4.2 4.2 0 0 1 12 7.5a4.2 4.2 0 0 1 7.5 2.6c0 5.7-7.5 10.2-7.5 10.2z"/>',
  bag: '<path d="M5 8.2h14l-1 12.3H6L5 8.2z"/><path d="M9 8.2V6.6a3 3 0 0 1 6 0v1.6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  arrow: '<path d="M4 12h16M14 6l6 6-6 6"/>',
  left: '<path d="M15 5l-7 7 7 7"/>',
  right: '<path d="M9 5l7 7-7 7"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  play: '<path d="M8 5l11 7-11 7V5z"/>',
  scissors: '<circle cx="6" cy="6.5" r="2.6"/><circle cx="6" cy="17.5" r="2.6"/><path d="M8.2 8L20 17M8.2 16L20 7"/>',
  needle:
    '<path d="M20 4L7.5 16.5"/><path d="M20 4c-1.6-.4-3 .2-3.6 1.4"/><path d="M7.5 16.5c-2.2 2.2-4.3 1-3.3-.9 1.2-2.2 4.6-.6 3.5 2.2-.6 1.6-2.3 2.4-3.9 2.2"/>',
  box: '<path d="M3.5 8L12 3.5 20.5 8v8L12 20.5 3.5 16V8z"/><path d="M3.5 8L12 12.5 20.5 8M12 12.5v8"/>',
  swap: '<path d="M4 8h14M14 4l4 4-4 4M20 16H6M10 12l-4 4 4 4"/>',
  cash: '<rect x="3" y="6.5" width="18" height="11" rx="1.5"/><circle cx="12" cy="12" r="2.6"/><path d="M6.5 10v4M17.5 10v4"/>',
  instagram: '<rect x="4" y="4" width="16" height="16" rx="4.5"/><circle cx="12" cy="12" r="3.6"/><circle cx="16.6" cy="7.4" r=".6" fill="currentColor"/>',
  whatsapp: '<path d="M4.2 19.8l1.2-4.1a8 8 0 1 1 3 2.9l-4.2 1.2z"/><path d="M9.3 9c.3 2.6 2.6 4.9 5.2 5.3"/>',
  youtube: '<rect x="3" y="6" width="18" height="12" rx="3.5"/><path d="M10.2 9.4v5.2l4.6-2.6-4.6-2.6z"/>',
  // care-label symbols
  wash: '<path d="M3 7l2.2 12h13.6L21 7"/><path d="M4 10.5c1.6 1.3 3.2-1.3 4.8 0s3.2-1.3 4.8 0 3.2-1.3 4.8 0c.6.4 1.1.4 1.6 0"/>',
  nobleach: '<path d="M12 4.5l8.5 15h-17l8.5-15z"/><path d="M6 6l12 15M18 6L6 21"/>',
  dryflat: '<rect x="4" y="4" width="16" height="16"/><path d="M8 12h8"/>',
  iron: '<path d="M3.5 17.5h17l-1.8-8H9.5a4.5 4.5 0 0 0-4.5 4.5"/><path d="M5 14h14.8"/><circle cx="12.5" cy="12" r=".7" fill="currentColor"/>',
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, className, strokeWidth = 1.6 }: { name: IconName; className?: string; strokeWidth?: number }) {
  return (
    <svg
      className={`i-${name}${className ? " " + className : ""}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{ __html: PATHS[name] }}
    />
  );
}

// A square with a zigzag edge, as if cut with pinking shears.
const PINKED = "M6 6" + "l2-2.5 2 2.5".repeat(7) + "l2.5 2-2.5 2".repeat(7) + "l-2 2.5-2-2.5".repeat(7) + "l-2.5-2 2.5-2".repeat(7) + "z";

/** The Check Pink mark: a swatch of pink check, cut with pinking shears. */
export function Mark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="cp-swatch">
          <path d={PINKED} />
        </clipPath>
      </defs>
      <g clipPath="url(#cp-swatch)">
        <path fill="#fbd0e0" d="M0 0h40v40H0z" />
        <path fill="#ee5c97" fillOpacity={0.6} d="M6 0h7v40H6zM20 0h7v40h-7z" />
        <path fill="#ee5c97" fillOpacity={0.6} d="M0 6h40v7H0zM0 20h40v7H0z" />
      </g>
    </svg>
  );
}

/** Wordmark: the last word of the brand name is set in italic pink. */
export function Wordmark() {
  const words = brand.name.toLowerCase().split(" ");
  const last = words.pop();
  return (
    <>
      {words.length > 0 && words.join(" ") + " "}
      <em>{last}</em>
    </>
  );
}
