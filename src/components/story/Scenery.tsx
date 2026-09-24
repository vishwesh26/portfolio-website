"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { cx, seeded } from "@/lib/styles";

type Star = { x: string; y: string; size: number; opacity: number; twinkle: boolean; delay: string };

// Deterministic star layout (same on server and client).
const STARS: Star[] = (() => {
  const rand = seeded(42);
  return Array.from({ length: 110 }, () => ({
    x: (rand() * 100).toFixed(3),
    y: (rand() * 100).toFixed(3),
    size: rand() < 0.14 ? 2 : 1,
    opacity: Number((0.3 + rand() * 0.7).toFixed(2)),
    twinkle: rand() < 0.3,
    delay: (rand() * 4).toFixed(2),
  }));
})();

type StarfieldProps = {
  className?: string;
  /** How many of the (deterministic) stars to render. */
  count?: number;
  /** Render the two looping shooting-star streaks. */
  shooting?: boolean;
};

/** Tiny white stars + (optionally) two looping CSS shooting-star streaks. */
export function Starfield({ className, count = STARS.length, shooting = true }: StarfieldProps) {
  return (
    <div aria-hidden="true" className={cx("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {STARS.slice(0, count).map((star, i) => (
        <span
          key={i}
          className={cx("absolute rounded-full bg-white", star.twinkle && "animate-twinkle")}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
      {shooting && (
        <>
          <span className="shooting-star" style={{ top: "10%", left: "80%", animationDelay: "1.2s" }} />
          <span className="shooting-star" style={{ top: "26%", left: "98%", animationDelay: "4.6s", animationDuration: "9s" }} />
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hand-drawn strokes that can be scroll-driven                       */
/* ------------------------------------------------------------------ */

const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** A path whose drawn length follows `draw` (0 → 1). Static & fully drawn if `draw` is omitted. */
function SketchPath({
  d,
  draw,
  from = 0,
  to = 1,
  width = 3,
  className,
}: {
  d: string;
  draw?: MotionValue<number>;
  from?: number;
  to?: number;
  width?: number;
  className?: string;
}) {
  if (!draw) return <path d={d} strokeWidth={width} className={className} {...STROKE} />;
  return <DrivenPath d={d} draw={draw} from={from} to={to} width={width} className={className} />;
}

function DrivenPath({
  d,
  draw,
  from,
  to,
  width,
  className,
}: {
  d: string;
  draw: MotionValue<number>;
  from: number;
  to: number;
  width: number;
  className?: string;
}) {
  // Each stroke draws during its own slice [from, to] of the overall progress.
  const pathLength = useTransform(draw, (v) => Math.min(1, Math.max(0, (v - from) / (to - from))));
  const opacity = useTransform(pathLength, (v) => (v > 0.001 ? 1 : 0));
  return <motion.path d={d} strokeWidth={width} className={className} style={{ pathLength, opacity }} {...STROKE} />;
}

/* ------------------------------------------------------------------ */
/*  Stage 2: a wireframe sketched on paper                             */
/* ------------------------------------------------------------------ */

const WIREFRAME: Array<{ d: string; from: number; to: number; width?: number }> = [
  { d: "M22 32 C 200 28, 400 30, 578 26 C 582 140, 580 250, 584 358 C 400 354, 200 360, 16 356 C 20 250, 18 140, 22 32 Z", from: 0, to: 0.3 },
  { d: "M20 72 C 200 70, 400 68, 580 66", from: 0.25, to: 0.35 },
  { d: "M44 50 a4 4 0 1 0 0.1 0 M62 50 a4 4 0 1 0 0.1 0 M80 50 a4 4 0 1 0 0.1 0", from: 0.3, to: 0.38, width: 2.5 },
  { d: "M60 112 C 150 110, 250 110, 330 108 L 332 202 C 240 204, 140 200, 58 202 Z", from: 0.35, to: 0.5 },
  { d: "M62 114 L 328 198 M 328 112 L 62 198", from: 0.48, to: 0.56, width: 2 },
  { d: "M380 120 C 430 118, 490 120, 540 117", from: 0.52, to: 0.58 },
  { d: "M380 150 C 420 151, 480 149, 520 150", from: 0.56, to: 0.62 },
  { d: "M380 178 C 410 179, 460 177, 500 178", from: 0.6, to: 0.66 },
  { d: "M392 212 C 420 208, 458 208, 470 216 C 480 226, 470 240, 440 240 C 410 241, 382 238, 380 226 C 379 218, 384 213, 392 212", from: 0.64, to: 0.74 },
  { d: "M60 262 L 210 260 L 212 330 L 58 332 Z", from: 0.72, to: 0.82 },
  { d: "M226 262 L 376 260 L 378 330 L 224 332 Z", from: 0.78, to: 0.88 },
  { d: "M392 262 L 542 260 L 544 330 L 390 332 Z", from: 0.84, to: 0.94 },
  { d: "M548 96 C 566 88, 578 104, 568 116 C 560 126, 548 116, 556 108", from: 0.92, to: 1, width: 2.5 },
];

export function WireframeSketch({ draw, className }: { draw?: MotionValue<number>; className?: string }) {
  return (
    <svg viewBox="0 0 600 380" aria-hidden="true" className={cx("overflow-visible", className)}>
      {WIREFRAME.map((s, i) => (
        <SketchPath key={i} d={s.d} draw={draw} from={s.from} to={s.to} width={s.width ?? 3} />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Stage 3: a line-art rocket on the launch pad                       */
/* ------------------------------------------------------------------ */

const ROCKET_SCENE: Array<{ d: string; from: number; to: number; width?: number; tone?: string }> = [
  { d: "M0 332 C 220 324, 420 338, 720 330 S 1220 322, 1440 334", from: 0, to: 0.3, width: 2.5 },
  { d: "M180 262 c 8 -22, 42 -24, 52 -6 c 14 -14, 44 -6, 42 16 c 18 4, 16 28, -6 28 l -92 0 c -22 0, -24 -32, 4 -38 z", from: 0.1, to: 0.35, width: 2.5 },
  { d: "M1160 214 c 6 -16, 32 -18, 40 -4 c 11 -10, 34 -4, 32 12 c 14 3, 12 22, -5 22 l -70 0 c -17 0, -18 -24, 3 -30 z", from: 0.15, to: 0.4, width: 2.5 },
  { d: "M676 330 L 690 312 L 750 312 L 764 330", from: 0.25, to: 0.4 },
  { d: "M720 168 C 746 194, 754 240, 748 300 L 692 300 C 686 240, 694 194, 720 168 Z", from: 0.35, to: 0.6, width: 3.5 },
  { d: "M720 212 a13 13 0 1 0 0.1 0", from: 0.55, to: 0.65, tone: "text-accent" },
  { d: "M693 266 L 670 306 L 694 299 M 747 266 L 770 306 L 746 299", from: 0.6, to: 0.72 },
  { d: "M704 303 C 708 321, 716 328, 720 346 C 724 328, 732 321, 736 303", from: 0.7, to: 0.82, tone: "text-accent" },
  { d: "M770 150 C 900 60, 1080 34, 1300 16", from: 0.8, to: 1, width: 2, tone: "text-accent" },
  { d: "M1318 6 L 1332 12 L 1320 22", from: 0.95, to: 1, width: 2, tone: "text-accent" },
  { d: "M420 120 L 420 140 M 410 130 L 430 130", from: 0.4, to: 0.5, width: 2 },
  { d: "M1000 250 L 1000 266 M 992 258 L 1008 258", from: 0.5, to: 0.6, width: 2 },
];

/** Minimal rocket on a launch pad with clouds and a dotted launch trajectory. */
export function RocketSketch({
  draw,
  lift,
  className,
}: {
  draw?: MotionValue<number>;
  lift?: MotionValue<number>;
  className?: string;
}) {
  const rocketParts = new Set([4, 5, 6, 7]);
  return (
    <svg
      viewBox="0 0 1440 360"
      preserveAspectRatio="xMidYMax slice"
      className={cx("overflow-visible text-ink/70", className)}
      role="img"
      aria-label="Hand-drawn sketch of a small rocket on a launch pad, ready to ship"
    >
      {ROCKET_SCENE.map((s, i) =>
        rocketParts.has(i) ? null : (
          <SketchPath key={i} d={s.d} draw={draw} from={s.from} to={s.to} width={s.width ?? 3} className={s.tone} />
        ),
      )}
      <motion.g style={lift ? { y: lift } : undefined}>
        {ROCKET_SCENE.map((s, i) =>
          rocketParts.has(i) ? (
            <SketchPath key={i} d={s.d} draw={draw} from={s.from} to={s.to} width={s.width ?? 3} className={s.tone} />
          ) : null,
        )}
      </motion.g>
    </svg>
  );
}
