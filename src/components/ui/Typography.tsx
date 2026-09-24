import { Fragment, type ReactNode } from "react";
import { cx } from "@/lib/styles";
import { Squiggle } from "./Doodles";

/** Small uppercase, letter-spaced section label, led by a hand-drawn marker squiggle. */
export function Eyebrow({ children, dark = false, className }: { children: ReactNode; dark?: boolean; className?: string }) {
  return (
    <p
      className={cx(
        "flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.28em]",
        dark ? "text-night-muted" : "text-muted",
        className,
      )}
    >
      <Squiggle className="h-2.5 w-9 shrink-0 text-accent" />
      {children}
    </p>
  );
}

/** Renders `**bold**` segments as emphasized ink text. */
export function RichText({ text, strongClassName = "font-semibold text-ink" }: { text: string; strongClassName?: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className={strongClassName}>
            {part}
          </strong>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
