"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CurlyArrow, DoodleSparkle, DoodleStar, HandNote, QuickArrow, Scribble, Squiggle, Tape } from "@/components/ui/Doodles";
import { DownloadIcon } from "@/components/ui/icons";
import { greetings, profile, projects } from "@/lib/content";
import { btnPrimary, btnSecondary } from "@/lib/styles";
import { SketchingPencil, VisitorPresence } from "./PresenceCursors";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

function logoFor(slug: string) {
  const project = projects.find((p) => p.slug === slug);
  if (!project) return null;
  return { logo: project.logo, href: project.live, title: project.title };
}

/** A project name link with a small rounded-square logo in front of it. */
function LogoLink({ slug, label }: { slug: string; label?: string }) {
  const info = logoFor(slug);
  if (!info) return null;
  return (
    <a href={info.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-baseline gap-1.5 font-semibold text-ink">
      <span className="relative top-[3px] grid size-5 shrink-0 place-items-center overflow-hidden rounded-[6px] bg-white ring-1 ring-black/10">
        {"src" in info.logo ? (
          <Image src={info.logo.src} alt="" width={20} height={20} className="size-full object-contain" />
        ) : (
          <span className="grid size-full place-items-center bg-ink font-mono text-[8px] font-bold text-white">{info.logo.monogram}</span>
        )}
      </span>
      <span className="link-underline">{label ?? info.title}</span>
    </a>
  );
}

/** Picks a random greeting after mount (so SSR markup stays deterministic). */
function useRandomGreeting() {
  const [greeting, setGreeting] = useState<string | null>(null);
  useEffect(() => {
    setGreeting(greetings[Math.floor(Math.random() * greetings.length)]);
  }, []);
  return greeting;
}

export function Hero() {
  const greeting = useRandomGreeting();

  return (
    <section id="hero" aria-labelledby="hero-title" className="paper-dots relative overflow-hidden">
      <VisitorPresence />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto grid min-h-[100svh] max-w-6xl items-center gap-16 px-6 pb-20 pt-32 md:grid-cols-[1.12fr_0.88fr] md:gap-10 md:pt-28"
      >
        <div>
          {/* Handwritten greeting + arrow swooping down to the name */}
          <motion.div variants={item} className="relative flex items-end gap-2">
            <p className="-rotate-3 font-script text-[2.1rem] font-bold leading-none text-accent">
              {greeting ? greeting.replace(",", "!").toLowerCase() : <span className="invisible">hello!</span>}
            </p>
            <CurlyArrow immediate delay={0.9} className="-mb-6 h-12 w-16 rotate-[8deg] text-accent/80" />
          </motion.div>

          <motion.h1
            variants={item}
            id="hero-title"
            className="relative mt-5 text-[clamp(2.4rem,9.4vw,4.1rem)] font-extrabold leading-[1.05] tracking-[-0.035em] md:text-[clamp(2.75rem,5.6vw,4.1rem)]"
          >
            I’m{" "}
            <Scribble kind="circle" immediate delay={1.1} className="ml-3 px-1">
              {profile.firstName}
            </Scribble>
            <DoodleSparkle immediate delay={1.9} className="ml-1 inline-block size-8 -translate-y-6 text-accent" />
            <span className="sr-only"> — {profile.role}</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-5 max-w-xl text-[clamp(1.3rem,2.4vw,1.6rem)] font-medium leading-snug tracking-[-0.01em] text-ink/85"
          >
            I design &amp; build web things that feel <span className="marker">smooth</span>,{" "}
            <span className="marker">purposeful</span> and a little bit playful.
          </motion.p>

          <motion.p variants={item} className="mt-5 max-w-xl text-[17px] leading-relaxed text-muted">
            Full-stack dev &amp; UI/UX designer, and a third-year E&amp;TC student in Pune. Right now I’m building{" "}
            <LogoLink slug="leetvision" />; before that I shipped <LogoLink slug="pustakedits" /> and{" "}
            <LogoLink slug="vaani" />.
          </motion.p>

          <motion.div variants={item} className="relative mt-9 flex flex-wrap items-center gap-3">
            <a href="#contact" className={btnSecondary}>
              Say hello <span aria-hidden="true">✌️</span>
            </a>
            <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className={btnPrimary}>
              Resume <DownloadIcon className="size-4" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            <span className="hidden items-center gap-1 sm:flex">
              <QuickArrow immediate delay={1.6} className="h-6 w-12 rotate-180 text-ink/50" />
              <HandNote rotate={-5} delay={1.8} className="text-lg text-ink/60">
                don’t be shy
              </HandNote>
            </span>
          </motion.div>

          <motion.p variants={item} className="mt-10 flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.18em] text-muted">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            {profile.location} · open to collaborations
          </motion.p>
        </div>

        {/* Taped photo with margin scribbles */}
        <motion.div variants={item} className="relative mx-auto w-[min(74vw,310px)] md:w-full md:max-w-[350px]">
          <HandNote rotate={-8} delay={1.4} className="absolute -left-4 -top-14 z-30 text-2xl text-ink/75 md:-left-16">
            that’s me!
          </HandNote>
          <CurlyArrow immediate delay={1.5} className="absolute -top-8 left-10 z-30 h-12 w-14 rotate-[20deg] text-ink/60 md:left-2" />

          <figure className="group relative rotate-[2.5deg] rounded-[10px] bg-white p-2.5 shadow-photo ring-1 ring-black/[0.05] transition-[rotate,translate] duration-500 ease-out-soft hover:-translate-y-1 hover:rotate-[1deg]">
            <Tape className="-left-5 -top-2 z-10 -rotate-[28deg]" tone="yellow" />
            <Tape className="-right-6 -top-1 z-10 rotate-[32deg]" tone="orange" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[6px] bg-neutral-900">
              <Image
                src={profile.portrait.src}
                alt={profile.portrait.alt}
                fill
                preload
                sizes="(min-width: 768px) 340px, 72vw"
                className="object-cover object-[50%_16%]"
              />
            </div>
            <figcaption className="flex items-center justify-between px-1 pb-0.5 pt-2.5">
              <span className="font-hand text-lg leading-none text-ink/80">pune, somewhere between classes</span>
              <Squiggle className="h-3 w-10 text-accent" delay={1.2} />
            </figcaption>
          </figure>

          <HandNote rotate={6} delay={1.7} className="absolute -bottom-12 right-0 z-30 text-xl text-ink/70 md:-right-10">
            fuelled by ☕ × ∞
          </HandNote>
          <DoodleStar immediate delay={2} className="absolute -right-3 top-1/3 z-30 size-8 text-accent md:-right-12" />

          <SketchingPencil name={profile.firstName} />
        </motion.div>
      </motion.div>
    </section>
  );
}
