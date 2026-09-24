"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useFinePointer } from "@/lib/hooks";

/**
 * "you" cursor — a hand-drawn arrow with a scrawled label that follows the visitor's
 * real mouse (spring-smoothed) while it's over the parent section. Hidden on touch.
 */
export function VisitorPresence() {
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const layerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const springX = useSpring(x, { stiffness: 380, damping: 32, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 380, damping: 32, mass: 0.6 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!fine) return;
    const host = layerRef.current?.parentElement;
    if (!host) return;

    let last: { x: number; y: number } | null = null;
    const place = () => {
      if (!last) return;
      const rect = host.getBoundingClientRect();
      x.set(last.x - rect.left + 14);
      y.set(last.y - rect.top + 14);
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      last = { x: event.clientX, y: event.clientY };
      place();
      setVisible(true);
    };
    const onLeave = () => setVisible(false);

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", place, { passive: true });
    return () => {
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", place);
    };
  }, [fine, x, y]);

  if (!fine) return null;

  return (
    <div ref={layerRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
      <motion.div
        className="absolute left-0 top-0 flex items-start"
        style={{ x: reduce ? x : springX, y: reduce ? y : springY }}
        initial={false}
        animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.85 }}
        transition={{ duration: 0.18 }}
      >
        {/* hand-drawn "arrow" pointing back at the real cursor */}
        <svg width="22" height="22" viewBox="0 0 22 22" className="-rotate-6 text-ink">
          <path d="M3 3 L10 19 L12.5 12 L19 9.5 Z" fill="#fff" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
        <span className="ml-0.5 mt-3 -rotate-6 font-hand text-xl leading-none text-ink">you</span>
      </motion.div>
    </div>
  );
}

/* Loop (px, in a 460×560 box centred on the photo) that the pencil keeps sketching. */
const SKETCH_PATH =
  "M40 150 C 18 60, 130 16, 240 20 C 372 26, 452 70, 444 214 C 438 344, 452 468, 356 526 C 254 584, 108 556, 46 470 C 6 414, 22 300, 30 214 C 34 168, 70 126, 128 120";

/**
 * The owner's "presence": a pencil (labelled with the owner's name) that endlessly
 * sketches a loose loop around the hero photo. Pure CSS (offset-path + dash offset),
 * so it costs nothing on the main thread. Desktop + fine pointer only; off under reduced motion.
 */
export function SketchingPencil({ name }: { name: string }) {
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  if (!fine || reduce) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 z-20 hidden h-[560px] w-[460px] -translate-x-1/2 -translate-y-1/2 lg:block"
    >
      <svg viewBox="0 0 460 560" className="absolute inset-0 size-full overflow-visible text-accent">
        <path
          d={SKETCH_PATH}
          pathLength={1}
          className="sketch-stroke"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="1"
        />
      </svg>
      <div className="sketch-pencil absolute left-0 top-0 flex items-start" style={{ offsetPath: `path("${SKETCH_PATH}")` }}>
        <svg width="32" height="32" viewBox="0 0 32 32" className="drop-shadow-sm">
          {/* pencil body, tip at (3,29) */}
          <path d="M22 4 L28 10 L10 28 L3 29 L4 22 Z" fill="#ffd166" stroke="#111" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M4 22 L10 28" stroke="#111" strokeWidth="1.6" />
          <path d="M3 29 L4.8 24.6 L7.4 27.2 Z" fill="#111" />
          <path d="M22 4 L28 10 L30 8 C 31 7, 31 5.5, 30 4.5 L27.5 2 C 26.5 1, 25 1, 24 2 Z" fill="#ff6a3d" stroke="#111" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
        <span className="-ml-1 -mt-4 whitespace-nowrap rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-night shadow-float">
          {name} is doodling…
        </span>
      </div>
    </div>
  );
}
