"use client";

import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { ArrowUpRightIcon, GitHubIcon } from "@/components/ui/icons";
import { DoodleStar, HandNote, Scribble, Tape } from "@/components/ui/Doodles";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Typography";
import { gallery, labItems, languageColors, profile } from "@/lib/content";
import { cx, pillInteractive } from "@/lib/styles";

/** Dark showcase: side-project "lab" cards + a masonry gallery of Vishwesh's photography. */
export function Showcase() {
  const ref = useRef<HTMLElement>(null);

  // Smooth scroll-driven transitions:
  // 1. Entry: As the top of Showcase travels from 85% to 25% of the viewport,
  //    entryProgress smoothly eases background from pure white (#ffffff) to night black (#0a0a0a).
  // 2. Exit: As the bottom of Showcase travels from 85% to 25% of the viewport,
  //    exitProgress smoothly eases background from night black (#0a0a0a) back to white (#ffffff).
  const { scrollYProgress: entryProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "start 25%"],
  });

  const { scrollYProgress: exitProgress } = useScroll({
    target: ref,
    offset: ["end 85%", "end 25%"],
  });

  const background = useTransform([entryProgress, exitProgress], ([entry, exit]: number[]) => {
    // If exit has begun (> 0), smoothly transition from night (#0a0a0a) back to daylight white (#ffffff)
    if (exit > 0) {
      const eased = (1 - Math.cos(exit * Math.PI)) / 2;
      const g = Math.round(10 + (255 - 10) * eased);
      return `rgb(${g}, ${g}, ${g})`;
    }
    // Otherwise, transition from daylight white (#ffffff) to night (#0a0a0a) as we enter
    const eased = (1 - Math.cos(entry * Math.PI)) / 2;
    const g = Math.round(255 - (255 - 10) * eased);
    return `rgb(${g}, ${g}, ${g})`;
  });

  // Synchronize document.body so the whole browser viewport transitions together seamlessly without split-screen seams
  useMotionValueEvent(background, "change", (latest) => {
    if (typeof document !== "undefined") {
      document.body.style.backgroundColor = latest;
    }
  });

  useEffect(() => {
    return () => {
      if (typeof document !== "undefined") {
        document.body.style.backgroundColor = "";
      }
    };
  }, []);

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
        style={{ backgroundColor: background }}
      />
      <motion.section
        ref={ref}
        id="lab"
        data-nav-theme="dark"
        aria-labelledby="lab-title"
        style={{ backgroundColor: background }}
        className="relative py-28 text-white md:py-36"
      >
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <Eyebrow dark>The lab</Eyebrow>
          <h2
            id="lab-title"
            className="mt-4 max-w-3xl text-[clamp(2.25rem,5vw,3.25rem)] font-bold leading-[1.1] tracking-[-0.03em]"
          >
            Side quests &amp; <Scribble kind="underline">weekend</Scribble> experiments
          </h2>
          <div className="mt-5 flex flex-wrap items-end gap-x-4 gap-y-2">
            <p className="max-w-2xl text-lg leading-relaxed text-night-muted">
              Little builds that started as “what if…?” and somehow made it to a live URL.
            </p>
            <HandNote rotate={-5} className="text-xl text-accent">
              no tutorials were harmed
            </HandNote>
          </div>
        </Reveal>

        <ul className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {labItems.map((item, i) => (
            <Reveal as="li" key={item.repo} delay={(i % 3) * 0.06}>
              <div className="flex h-full flex-col rounded-[16px] border border-white/10 bg-white/[0.03] p-5 transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.06]">
                <div className="flex items-center justify-between gap-3 font-mono text-[11px] text-white/45">
                  <span className="truncate">~/{item.repo}</span>
                  <span>{item.year}</span>
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">{item.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-night-muted">{item.description}</p>
                <div className="mt-6 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-2.5 py-1 font-mono text-[11px] text-white/70">
                    <span aria-hidden="true" className="size-2 rounded-full" style={{ backgroundColor: languageColors[item.language] }} />
                    {item.language}
                  </span>
                  <a
                    href={item.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cx(pillInteractive, "ml-auto gap-1 bg-white px-3 py-1 text-xs font-semibold text-night")}
                  >
                    Live <ArrowUpRightIcon className="size-3" />
                    <span className="sr-only"> — {item.title} (opens in a new tab)</span>
                  </a>
                  <a
                    href={item.code}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cx(pillInteractive, "border border-white/15 px-3 py-1 text-xs text-white hover:bg-white/10")}
                  >
                    Code<span className="sr-only"> for {item.title} (opens in a new tab)</span>
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
          <Reveal as="li" delay={0.12}>
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full min-h-[200px] flex-col justify-between rounded-[16px] border border-dashed border-white/15 p-5 transition-colors duration-300 hover:border-white/30 hover:bg-white/[0.04]"
            >
              <GitHubIcon className="size-6 text-white/70" />
              <span>
                <span className="block text-lg font-semibold">{profile.publicRepos} public repos and counting</span>
                <span className="mt-1 inline-flex items-center gap-1 text-sm text-night-muted transition-colors group-hover:text-white">
                  github.com/vishwesh26 <ArrowUpRightIcon className="size-3.5" />
                </span>
              </span>
            </a>
          </Reveal>
        </ul>

        <div className="mt-28">
          <Reveal className="relative">
            <p className="flex items-center gap-3 text-3xl font-bold tracking-tight text-white">
              Off the <Scribble kind="circle">keyboard</Scribble>
              <DoodleStar className="size-8 text-accent" delay={0.8} />
            </p>
            <p className="mt-4 max-w-2xl leading-relaxed text-night-muted">
              When I’m not building projects, I’m usually traveling, reading books, capturing moments through
              photography, or surviving treks that were definitely labeled “easy” online.
            </p>
          </Reveal>

          <div className="mt-10 columns-2 gap-3 md:columns-3">
            {gallery.map((photo, i) => (
              <Reveal
                as="figure"
                key={photo.src}
                delay={(i % 3) * 0.06}
                className="group relative mb-3 break-inside-avoid overflow-hidden rounded-[12px] bg-white/5"
              >
                {i % 3 === 1 && <Tape tone={i % 2 ? "yellow" : "orange"} className="left-1/2 top-1 z-10 -translate-x-1/2 -rotate-2 opacity-90" />}
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  sizes="(min-width: 1152px) 370px, (min-width: 768px) 32vw, 48vw"
                  className="block h-auto w-full transition-transform duration-700 ease-out-soft group-hover:scale-[1.03]"
                />
                <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-3 pt-12 font-hand text-xl text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {photo.caption}
                </figcaption>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
      </motion.section>
    </>
  );
}
