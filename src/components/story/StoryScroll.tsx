"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { Scribble } from "@/components/ui/Doodles";
import { RocketSketch, Starfield, WireframeSketch } from "./Scenery";

/* Copy is built on Vishwesh's own "How I work" process: Discover → Design → Build → Ship. */
const COPY = {
  s1Eyebrow: "01 — discover",
  s1Lead: "First, I",
  s1Word: "wander",
  s1Tail: "around the problem.",
  s1Script: "before a single line of code.",
  s1Sub: "User goals, edge cases, what already exists — I dig into the problem space until the shape of the solution starts to show.",
  s2Eyebrow: "02 — design",
  s2Title: "Then I sketch it out.",
  s2Script: "every pixel, justified.",
  s2Sub: "Rough doodles become wireframes, wireframes become polished prototypes. Every interaction is there on purpose.",
  s3Eyebrow: "03 — build & ship",
  s3Script: "(then iterate, fast)",
  s3Sub: "Clean, scalable code with obsessive attention to performance and micro-interactions — launched with confidence, then improved on real feedback.",
};

/**
 * Scroll story:
 * Starts at pure white (#ffffff) seamlessly continuous with the About section above it.
 * As you scroll into the track, the viewport smoothly, imperceptibly darkens into the
 * star-lit night sky (#0a0a0a), then transitions through dusk (#5a5a5a), and back to white (#ffffff).
 * Pure uniform background color interpolation on scroll — zero static gradient stripes.
 */
export function StoryScroll() {
  return (
    <section aria-label="How I work">
      <ScrubbedStory />
      <StackedStory />
    </section>
  );
}

/** Piecewise-linear mapper with clamping. */
function piecewise(input: number[], output: number[]) {
  const last = input.length - 1;
  return (v: number) => {
    if (v <= input[0]) return output[0];
    if (v >= input[last]) return output[last];
    let i = 1;
    while (v > input[i]) i++;
    const t = (v - input[i - 1]) / (input[i] - input[i - 1]);
    return output[i - 1] + (output[i] - output[i - 1]) * t;
  };
}

/**
 * Eased gray level: starts at 255 (pure white, matching About above it 100%),
 * smoothly darkens to 10 (#0a0a0a) as you scroll into the sticky track,
 * shifts to 90 (#5a5a5a) for stage 2 wireframe, and returns to 255 (#ffffff) for stage 3.
 */
const grayLevel = piecewise(
  [0, 0.04, 0.08, 0.12, 0.16, 0.36, 0.44, 0.52, 0.64, 0.72, 0.80, 1],
  [255, 250, 205, 65, 10, 10, 50, 90, 90, 175, 255, 255]
);

const MAP = {
  background: (v: number) => {
    const g = Math.round(grayLevel(v));
    return `rgb(${g}, ${g}, ${g})`;
  },
  // Stars fade in as the sky reaches dark, and fade out when entering dusk
  stars: piecewise([0, 0.09, 0.16, 0.34, 0.42, 1], [0, 0, 1, 1, 0, 0]),
  // Stage 1 fades in once the background is dark
  s1Opacity: piecewise([0, 0.11, 0.17, 0.32, 0.38, 1], [0, 0, 1, 1, 0, 0]),
  s1Scale: piecewise([0.11, 0.17, 0.32, 0.38], [0.95, 1, 1, 0.92]),
  s1Y: piecewise([0.11, 0.17, 0.32, 0.38], [24, 0, 0, -32]),
  s1Circle: piecewise([0.16, 0.25], [0, 1]),
  // Stage 2
  grid: piecewise([0.38, 0.46, 0.62, 0.70], [0, 1, 1, 0]),
  s2Opacity: piecewise([0.40, 0.47, 0.60, 0.66], [0, 1, 1, 0]),
  s2Y: piecewise([0.40, 0.47, 0.60, 0.66], [40, 0, 0, -28]),
  s2Scale: piecewise([0.40, 0.47, 0.60, 0.66], [0.96, 1, 1, 0.94]),
  wireframe: piecewise([0.42, 0.62], [0, 1]),
  // Stage 3
  s3Opacity: piecewise([0.68, 0.78], [0, 1]),
  s3Y: piecewise([0.68, 0.78], [28, 0]),
  rocketDraw: piecewise([0.66, 0.88], [0, 1]),
  rocketLift: piecewise([0.88, 1], [0, -26]),
};

const ONE = () => 1;
const ZERO = () => 0;

/** "wander" with a loose marker circle whose drawing follows scroll progress. */
function ScrollCircledWord({ children, draw }: { children: string; draw: MotionValue<number> }) {
  return (
    <span className="relative inline-block whitespace-nowrap">
      <span className="relative z-10">{children}</span>
      <svg
        viewBox="0 0 200 80"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="pointer-events-none absolute left-[-9%] top-[-14%] h-[128%] w-[118%] overflow-visible text-accent"
      >
        <motion.path
          d="M152 9 C 110 1, 42 4, 17 22 C -4 38, 12 67, 72 74 C 132 80, 197 66, 196 39 C 195 15, 150 5, 96 8 C 72 9, 52 13, 42 17"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          style={{ pathLength: draw, opacity: useTransform(draw, (v) => (v > 0.001 ? 1 : 0)) }}
        />
      </svg>
    </span>
  );
}

function ScrubbedStory() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const background = useTransform(scrollYProgress, MAP.background);
  const starsOpacity = useTransform(scrollYProgress, MAP.stars);
  const gridOpacity = useTransform(scrollYProgress, MAP.grid);

  // Reduced motion keeps the colour/opacity crossfades and drawings, drops scale & parallax.
  const s1Opacity = useTransform(scrollYProgress, MAP.s1Opacity);
  const s1Scale = useTransform(scrollYProgress, reduce ? ONE : MAP.s1Scale);
  const s1Y = useTransform(scrollYProgress, reduce ? ZERO : MAP.s1Y);
  const s1Circle = useTransform(scrollYProgress, MAP.s1Circle);

  const s2Opacity = useTransform(scrollYProgress, MAP.s2Opacity);
  const s2Y = useTransform(scrollYProgress, reduce ? ZERO : MAP.s2Y);
  const s2Scale = useTransform(scrollYProgress, reduce ? ONE : MAP.s2Scale);
  const wireframe = useTransform(scrollYProgress, MAP.wireframe);

  const s3Opacity = useTransform(scrollYProgress, MAP.s3Opacity);
  const s3Y = useTransform(scrollYProgress, reduce ? ZERO : MAP.s3Y);
  const rocketDraw = useTransform(scrollYProgress, MAP.rocketDraw);
  const rocketLift = useTransform(scrollYProgress, reduce ? ZERO : MAP.rocketLift);

  return (
    <div ref={ref} className="relative hidden h-[350vh] md:block">
      {/* Nav theme marker: dark while stages 1–2 sit under the navbar */}
      <div
        aria-hidden="true"
        data-nav-theme="dark"
        className="pointer-events-none absolute inset-x-0"
        style={{ top: "10%", height: "54%" }}
      />

      <motion.div style={{ backgroundColor: background }} className="sticky top-0 h-screen overflow-hidden">
        <motion.div style={{ opacity: starsOpacity }} className="absolute inset-0">
          <Starfield />
        </motion.div>

        {/* Stage 2 backdrop: dot-grid paper + a wireframe that sketches itself */}
        <motion.div style={{ opacity: gridOpacity }} className="paper-dots-dark absolute inset-0" aria-hidden="true">
          <WireframeSketch draw={wireframe} className="absolute left-1/2 top-1/2 w-[min(78vw,980px)] -translate-x-1/2 -translate-y-1/2 text-white/[0.11]" />
        </motion.div>

        <div className="absolute inset-x-0 bottom-0">
          <RocketSketch draw={rocketDraw} lift={rocketLift} className="block h-[36vh] w-full" />
        </div>

        <div className="relative z-10 grid h-full place-items-center px-6 text-center">
          <motion.div style={{ opacity: s1Opacity, scale: s1Scale, y: s1Y }} className="col-start-1 row-start-1 max-w-4xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/45">{COPY.s1Eyebrow}</p>
            <h2 className="mt-6 text-[clamp(3rem,6.6vw,5.75rem)] font-extrabold leading-[1.02] tracking-[-0.04em] text-white">
              {COPY.s1Lead} <ScrollCircledWord draw={s1Circle}>{COPY.s1Word}</ScrollCircledWord>
              <br />
              {COPY.s1Tail}
            </h2>
            <p className="mt-6 -rotate-2 font-hand text-[clamp(1.6rem,2.6vw,2.2rem)] leading-none text-accent">{COPY.s1Script}</p>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-night-muted">{COPY.s1Sub}</p>
          </motion.div>

          <motion.div style={{ opacity: s2Opacity, y: s2Y, scale: s2Scale }} className="col-start-1 row-start-1 max-w-4xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/60">{COPY.s2Eyebrow}</p>
            <h2 className="mt-6 text-[clamp(3rem,6.4vw,5.5rem)] font-extrabold leading-[1.02] tracking-[-0.04em] text-white">
              {COPY.s2Title}
            </h2>
            <p className="mt-5 rotate-1 font-script text-[clamp(2.25rem,4vw,3.25rem)] font-bold leading-none text-white">
              {COPY.s2Script}
            </p>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/80">{COPY.s2Sub}</p>
          </motion.div>

          <motion.div style={{ opacity: s3Opacity, y: s3Y }} className="col-start-1 row-start-1 mb-[30vh] max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">{COPY.s3Eyebrow}</p>
            <h2 className="mt-6 text-[clamp(2.4rem,5vw,4.25rem)] font-extrabold leading-[1.05] tracking-[-0.035em] text-ink">
              Build it. <span className="marker">Ship it.</span> Listen. Repeat.
            </h2>
            <p className="mt-4 -rotate-2 font-hand text-3xl text-accent">{COPY.s3Script}</p>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">{COPY.s3Sub}</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

function StackedStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "start 35%"] });
  const bg = useTransform(scrollYProgress, [0, 1], ["rgb(255, 255, 255)", "rgb(10, 10, 10)"]);

  const fade = {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.4 },
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  };

  return (
    <div className="md:hidden">
      <motion.div
        ref={containerRef}
        data-nav-theme="dark"
        style={{ backgroundColor: bg }}
        className="relative overflow-hidden px-6 py-32 text-center"
      >
        <Starfield />
        <motion.div {...fade} className="relative">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/45">{COPY.s1Eyebrow}</p>
          <h2 className="mt-5 text-[2.6rem] font-extrabold leading-[1.05] tracking-[-0.035em] text-white">
            {COPY.s1Lead}{" "}
            <Scribble kind="circle" delay={0.5}>
              {COPY.s1Word}
            </Scribble>{" "}
            {COPY.s1Tail}
          </h2>
          <p className="mt-5 -rotate-2 font-hand text-2xl text-accent">{COPY.s1Script}</p>
          <p className="mx-auto mt-5 max-w-md leading-relaxed text-night-muted">{COPY.s1Sub}</p>
        </motion.div>
      </motion.div>

      <div data-nav-theme="dark" className="paper-dots-dark relative overflow-hidden bg-dusk px-6 py-28 text-center">
        <WireframeSketch className="absolute left-1/2 top-1/2 w-[140%] -translate-x-1/2 -translate-y-1/2 text-white/[0.12]" />
        <motion.div {...fade} className="relative">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/60">{COPY.s2Eyebrow}</p>
          <h2 className="mt-5 text-[2.5rem] font-extrabold leading-[1.05] tracking-[-0.035em] text-white">{COPY.s2Title}</h2>
          <p className="mt-4 font-script text-4xl font-bold leading-none text-white">{COPY.s2Script}</p>
          <p className="mx-auto mt-5 max-w-md leading-relaxed text-white/85">{COPY.s2Sub}</p>
        </motion.div>
      </div>

      <div className="relative bg-white pt-24 text-center">
        <motion.div {...fade} className="px-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">{COPY.s3Eyebrow}</p>
          <h2 className="mt-5 text-[2.2rem] font-extrabold leading-[1.08] tracking-[-0.03em]">
            Build it. <span className="marker">Ship it.</span> Listen. Repeat.
          </h2>
          <p className="mt-3 -rotate-2 font-hand text-2xl text-accent">{COPY.s3Script}</p>
          <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted">{COPY.s3Sub}</p>
        </motion.div>
        <RocketSketch className="mt-8 block h-44 w-full" />
      </div>
    </div>
  );
}
