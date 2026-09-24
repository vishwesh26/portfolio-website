/** Tiny className joiner (no runtime deps). */
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Global pill rule: every interactive element is fully rounded, lifts on hover
 * and presses down on tap.
 */
export const pillInteractive =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap select-none " +
  "transition-[translate,scale,box-shadow,background-color,color,border-color] duration-200 ease-out-soft " +
  "hover:-translate-y-0.5 active:translate-y-0 active:scale-95 " +
  "disabled:pointer-events-none disabled:opacity-60";

export const btnPrimary = cx(
  pillInteractive,
  "bg-ink px-5 py-2.5 text-[15px] text-white shadow-[0_1px_2px_rgb(0_0_0/0.1)] hover:shadow-[0_10px_24px_-8px_rgb(0_0_0/0.45)]",
);

export const btnSecondary = cx(
  pillInteractive,
  "bg-chip px-5 py-2.5 text-[15px] text-ink hover:bg-[#e9e9e9] hover:shadow-[0_10px_24px_-10px_rgb(0_0_0/0.25)]",
);

export const badgeTone = {
  achievement: "bg-achieve text-achieve-ink",
  featured: "bg-featured text-featured-ink",
} as const;

/** Deterministic PRNG so "random" layouts match between server and client renders. */
export function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
