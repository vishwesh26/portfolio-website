"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import { cx } from "@/lib/styles";

/* ------------------------------------------------------------------ */
/*  Shared: a stroke that "draws itself" when scrolled into view       */
/* ------------------------------------------------------------------ */

type DrawProps = {
  d: string;
  delay?: number;
  duration?: number;
  strokeWidth?: number;
  /** Animate on mount instead of on scroll-into-view. */
  immediate?: boolean;
};

function DrawPath({ d, delay = 0, duration = 0.8, strokeWidth = 3, immediate = false }: DrawProps) {
  const reduce = useReducedMotion();
  const common = {
    d,
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (reduce) return <path {...common} />;

  const target = { pathLength: 1, opacity: 1 };
  const transition = {
    pathLength: { duration, delay, ease: [0.65, 0, 0.35, 1] as const },
    opacity: { duration: 0.01, delay },
  };
  return immediate ? (
    <motion.path {...common} initial={{ pathLength: 0, opacity: 0 }} animate={target} transition={transition} />
  ) : (
    <motion.path
      {...common}
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={target}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={transition}
    />
  );
}

type DoodleProps = {
  className?: string;
  style?: CSSProperties;
  delay?: number;
  immediate?: boolean;
};

/* ------------------------------------------------------------------ */
/*  Standalone doodles                                                 */
/* ------------------------------------------------------------------ */

/** Loopy hand-drawn arrow. Points down-right by default — rotate/flip with classes. */
export function CurlyArrow({ className, style, delay = 0, immediate }: DoodleProps) {
  return (
    <svg viewBox="0 0 120 90" aria-hidden="true" className={cx("overflow-visible", className)} style={style}>
      <DrawPath
        immediate={immediate}
        delay={delay}
        duration={0.9}
        d="M8 14 C 38 4, 70 16, 63 37 C 57 54, 35 49, 43 34 C 53 17, 92 28, 103 70"
      />
      <DrawPath immediate={immediate} delay={delay + 0.8} duration={0.3} d="M88 62 L103 72 L108 54" />
    </svg>
  );
}

/** Short, slightly wobbly straight arrow. Points right by default. */
export function QuickArrow({ className, style, delay = 0, immediate }: DoodleProps) {
  return (
    <svg viewBox="0 0 80 30" aria-hidden="true" className={cx("overflow-visible", className)} style={style}>
      <DrawPath immediate={immediate} delay={delay} duration={0.5} d="M4 18 C 22 12, 44 20, 72 13" />
      <DrawPath immediate={immediate} delay={delay + 0.45} duration={0.25} d="M60 5 L73 13 L62 23" />
    </svg>
  );
}

export function DoodleStar({ className, style, delay = 0, immediate }: DoodleProps) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={cx("overflow-visible", className)} style={style}>
      <DrawPath
        immediate={immediate}
        delay={delay}
        duration={0.7}
        strokeWidth={2.5}
        d="M20 4 L24.5 15.5 L37 16.5 L27.5 24.5 L31 37 L20 30 L9 37 L12.5 24.5 L3 16.5 L15.5 15.5 Z"
      />
    </svg>
  );
}

export function DoodleSparkle({ className, style, delay = 0, immediate }: DoodleProps) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={cx("overflow-visible", className)} style={style}>
      <DrawPath immediate={immediate} delay={delay} duration={0.25} strokeWidth={2.5} d="M20 3 L20 14" />
      <DrawPath immediate={immediate} delay={delay + 0.12} duration={0.25} strokeWidth={2.5} d="M33 12 L25 19" />
      <DrawPath immediate={immediate} delay={delay + 0.24} duration={0.25} strokeWidth={2.5} d="M7 12 L15 19" />
    </svg>
  );
}

export function Squiggle({ className, style, delay = 0, immediate }: DoodleProps) {
  return (
    <svg viewBox="0 0 120 16" aria-hidden="true" className={cx("overflow-visible", className)} style={style}>
      <DrawPath
        immediate={immediate}
        delay={delay}
        duration={0.9}
        strokeWidth={2.5}
        d="M2 8 Q 10 0, 18 8 T 34 8 T 50 8 T 66 8 T 82 8 T 98 8 T 114 8"
      />
    </svg>
  );
}

/** A small hand-drawn curly-brace / code bracket doodle "{ }". */
export function DoodleBraces({ className, style, delay = 0, immediate }: DoodleProps) {
  return (
    <svg viewBox="0 0 60 40" aria-hidden="true" className={cx("overflow-visible", className)} style={style}>
      <DrawPath immediate={immediate} delay={delay} duration={0.5} strokeWidth={2.5} d="M18 4 C 10 4, 12 16, 10 18 C 8 20, 4 20, 4 20 C 4 20, 8 20, 10 22 C 12 24, 10 36, 18 36" />
      <DrawPath immediate={immediate} delay={delay + 0.3} duration={0.5} strokeWidth={2.5} d="M42 4 C 50 4, 48 16, 50 18 C 52 20, 56 20, 56 20 C 56 20, 52 20, 50 22 C 48 24, 50 36, 42 36" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Word decorations                                                   */
/* ------------------------------------------------------------------ */

type ScribbleKind = "underline" | "circle" | "strike" | "zigzag";

const SCRIBBLES: Record<ScribbleKind, { viewBox: string; className: string; paths: string[] }> = {
  underline: {
    viewBox: "0 0 200 22",
    className: "left-[-3%] w-[106%] -bottom-[0.22em] h-[0.42em]",
    paths: ["M3 13 C 40 6, 92 5, 140 8 S 190 13, 197 7", "M24 18 C 72 13, 128 13, 182 16"],
  },
  circle: {
    viewBox: "0 0 200 80",
    className: "left-[-11%] top-[-20%] w-[122%] h-[140%]",
    paths: [
      "M152 9 C 110 1, 42 4, 17 22 C -4 38, 12 67, 72 74 C 132 80, 197 66, 196 39 C 195 15, 150 5, 96 8 C 72 9, 52 13, 42 17",
    ],
  },
  strike: {
    viewBox: "0 0 200 20",
    className: "left-[-4%] w-[108%] top-[38%] h-[0.4em]",
    paths: ["M4 12 C 50 6, 120 14, 196 7"],
  },
  zigzag: {
    viewBox: "0 0 200 20",
    className: "left-0 w-full -bottom-[0.3em] h-[0.4em]",
    paths: ["M2 14 L14 5 L26 14 L38 5 L50 14 L62 5 L74 14 L86 5 L98 14 L110 5 L122 14 L134 5 L146 14 L158 5 L170 14 L182 5 L196 13"],
  },
};

/** Wraps a word with a hand-drawn scribble (underline, loose circle, strike or zigzag). */
export function Scribble({
  children,
  kind = "underline",
  className,
  markClassName = "text-accent",
  delay = 0.2,
  immediate,
}: {
  children: ReactNode;
  kind?: ScribbleKind;
  className?: string;
  markClassName?: string;
  delay?: number;
  immediate?: boolean;
}) {
  const shape = SCRIBBLES[kind];
  return (
    <span className={cx("relative inline-block whitespace-nowrap", className)}>
      <span className="relative z-10">{children}</span>
      <svg
        viewBox={shape.viewBox}
        preserveAspectRatio="none"
        aria-hidden="true"
        className={cx("pointer-events-none absolute overflow-visible", shape.className, markClassName)}
      >
        {shape.paths.map((d, i) => (
          <DrawPath key={i} d={d} immediate={immediate} delay={delay + i * 0.35} duration={kind === "circle" ? 1 : 0.6} strokeWidth={kind === "circle" ? 2.5 : 3} />
        ))}
      </svg>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Scrapbook bits                                                     */
/* ------------------------------------------------------------------ */

const TAPE_TONES = {
  yellow: "bg-[#ffe58a]/75",
  orange: "bg-[#ff9a6b]/60",
  blue: "bg-[#bcd7ff]/70",
  white: "bg-white/70",
} as const;

/** A strip of washi tape with torn ends. Position it with `className`. */
export function Tape({ className, tone = "yellow" }: { className?: string; tone?: keyof typeof TAPE_TONES }) {
  return (
    <span
      aria-hidden="true"
      className={cx("pointer-events-none absolute block h-6 w-24 shadow-[0_1px_2px_rgb(0_0_0/0.08)] backdrop-blur-[1px]", TAPE_TONES[tone], className)}
      style={{
        clipPath:
          "polygon(0% 8%, 4% 0%, 8% 10%, 12% 2%, 88% 0%, 92% 9%, 96% 1%, 100% 10%, 100% 92%, 96% 100%, 92% 90%, 88% 99%, 12% 100%, 8% 91%, 4% 100%, 0% 90%)",
      }}
    />
  );
}

/** A scrawled margin note in the handwriting font. */
export function HandNote({
  children,
  className,
  rotate = -4,
  delay = 0.3,
}: {
  children: ReactNode;
  className?: string;
  rotate?: number;
  delay?: number;
}) {
  return (
    <motion.span
      aria-hidden="true"
      className={cx("pointer-events-none block font-hand leading-tight", className)}
      style={{ rotate }}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.span>
  );
}
