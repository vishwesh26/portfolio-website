"use client";

import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useRef, useState, type PointerEvent } from "react";
import { RefreshIcon } from "@/components/ui/icons";
import { fortunes, type Fortune } from "@/lib/content";
import { clamp, cx, pillInteractive } from "@/lib/styles";

const MAX_TILT = 8; // degrees

function labelFor(fortune: Fortune) {
  switch (fortune.kind) {
    case "commit":
      return `real commit · ${fortune.source}`;
    case "joke":
      return "programming joke";
    case "quote":
      return "a quote I keep coming back to";
  }
}

function pickNext(current: number) {
  if (fortunes.length < 2) return current;
  const next = Math.floor(Math.random() * fortunes.length);
  return next === current ? (next + 1) % fortunes.length : next;
}

/**
 * Retro terminal card that tilts toward the cursor (perspective + spring-smoothed
 * rotateX/rotateY clamped to ±8°). "Run again" prints a random fortune.
 */
export function TiltTerminal() {
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 160, damping: 18, mass: 0.5 });
  const springY = useSpring(rotateY, { stiffness: 160, damping: 18, mass: 0.5 });
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(20);
  const glare = useMotionTemplate`radial-gradient(420px circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.09), transparent 60%)`;

  const [index, setIndex] = useState(0);
  const [runs, setRuns] = useState(0);

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduce || event.pointerType !== "mouse" || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    rotateY.set(clamp((px - 0.5) * 2 * MAX_TILT, -MAX_TILT, MAX_TILT));
    rotateX.set(clamp((0.5 - py) * 2 * MAX_TILT, -MAX_TILT, MAX_TILT));
    glareX.set(px * 100);
    glareY.set(py * 100);
  };

  const onPointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const runAgain = () => {
    setIndex(pickNext(index));
    setRuns((r) => r + 1);
  };

  const fortune = fortunes[index];

  return (
    <div className="mx-auto w-full max-w-[560px] [perspective:1200px]">
      <motion.div
        ref={cardRef}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        style={reduce ? undefined : { rotateX: springX, rotateY: springY }}
        className="relative overflow-hidden rounded-[16px] bg-[#0c0c0c] text-white shadow-[0_40px_80px_-30px_rgb(0_0_0/0.55)] ring-1 ring-black/10"
      >
        <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: glare }} />

        <div className="relative flex items-center gap-2 border-b border-white/[0.07] px-4 py-3">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
          <span className="mx-auto truncate font-mono text-xs text-white/45">vishwesh@portfolio: ~/fortune</span>
          <span className="font-mono text-[10px] text-white/30">zsh</span>
        </div>

        <div className="relative p-5 font-mono text-[13px] leading-relaxed sm:p-6">
          <p className="text-white/60">
            <span className="text-accent">➜</span> <span className="text-white/40">~/fortune</span> ./fortune.sh --random
          </p>

          <div className="min-h-[178px]" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${index}-${runs}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className="mt-4"
              >
                <p className="text-white/35"># {labelFor(fortune)}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-white sm:text-base">
                  {fortune.kind === "commit" ? (
                    <>
                      <span className="text-[#febc2e]">git commit -m</span> “{fortune.text}”
                    </>
                  ) : (
                    fortune.text
                  )}
                </p>
                {fortune.kind === "quote" && <p className="mt-2 text-white/45">— {fortune.source}</p>}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={runAgain}
              className={cx(
                pillInteractive,
                "bg-white px-4 py-2 font-sans text-[13px] font-semibold text-night hover:shadow-[0_10px_24px_-8px_rgb(255_255_255/0.35)]",
              )}
            >
              <RefreshIcon className="size-3.5" /> Run again
            </button>
            <span className="text-[11px] text-white/35">
              runs: {runs} · {fortunes.length} fortunes loaded
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
