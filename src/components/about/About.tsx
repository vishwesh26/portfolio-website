"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { HandNote, QuickArrow, Scribble } from "@/components/ui/Doodles";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow, RichText } from "@/components/ui/Typography";

const STICKER_TILT = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "rotate-0"];
import { aboutStory, aboutTldr, skills, timeline } from "@/lib/content";
import { cx } from "@/lib/styles";
import { PolaroidStack } from "./PolaroidStack";
import { RetroPrinter } from "./RetroPrinter";

const TABS = [
  { id: "story", label: "My story" },
  { id: "tldr", label: "Quick bits" },
  { id: "timeline", label: "Path so far" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const STORY_LABELS = ["The start", "Alongside the code", "Connecting the dots"];

export function About() {
  const [tab, setTab] = useState<TabId>("story");
  const baseId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = TABS.findIndex((t) => t.id === tab);
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % TABS.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + TABS.length) % TABS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = TABS.length - 1;
    else return;
    event.preventDefault();
    setTab(TABS[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="about" aria-labelledby="about-title" className="relative bg-white py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <Reveal className="relative">
            <Eyebrow>About me</Eyebrow>
            <h2
              id="about-title"
              className="mt-4 text-[clamp(2.25rem,5vw,3.25rem)] font-bold leading-[1.1] tracking-[-0.03em]"
            >
              Crafting digital <Scribble kind="underline">experiences</Scribble>
            </h2>
            <HandNote rotate={-3} className="mt-3 text-xl text-muted md:absolute md:-right-44 md:top-2 md:mt-0">
              (the long &amp; short of it)
            </HandNote>
          </Reveal>

          <Reveal delay={0.06}>
            <div role="tablist" aria-label="About me" onKeyDown={onKeyDown} className="inline-flex rounded-full bg-chip p-1">
              {TABS.map((t, i) => {
                const selected = t.id === tab;
                return (
                  <button
                    key={t.id}
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`${baseId}-tab-${t.id}`}
                    aria-selected={selected}
                    aria-controls={`${baseId}-panel`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setTab(t.id)}
                    className={cx(
                      "relative rounded-full px-5 py-2 text-sm font-medium transition-[color,scale] duration-200 active:scale-95",
                      selected ? "text-ink" : "text-muted hover:text-ink",
                    )}
                  >
                    {selected && (
                      <motion.span
                        layoutId="about-tab-pill"
                        aria-hidden="true"
                        className="absolute inset-0 rounded-full bg-white shadow-[0_1px_3px_rgb(0_0_0/0.1),0_6px_14px_-6px_rgb(0_0_0/0.12)]"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span className="relative z-10">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-12">
          <div
            id={`${baseId}-panel`}
            role="tabpanel"
            aria-labelledby={`${baseId}-tab-${tab}`}
            tabIndex={0}
            className="min-h-[300px] rounded-[16px] focus-visible:outline-offset-8"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                {tab === "story" && <StoryPanel />}
                {tab === "tldr" && <TldrPanel />}
                {tab === "timeline" && <TimelinePanel />}
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>

        <Reveal className="mt-14">
          <p className="flex items-center gap-2 font-hand text-2xl text-ink/80">
            what’s in my toolbox
            <QuickArrow className="mt-2 h-5 w-10 rotate-[25deg] text-accent" />
          </p>
          <ul className="mt-4 flex flex-wrap gap-2.5" aria-label="Skills and tools">
            {skills.map((skill, i) => (
              <li
                key={skill}
                className={cx(
                  "rounded-full border-[1.5px] border-dashed border-ink/25 bg-white px-3.5 py-1.5 text-sm font-medium text-ink/85 shadow-[2px_2px_0_rgb(17_17_17/0.08)] transition-[rotate,border-color] duration-200 hover:rotate-0 hover:border-accent",
                  STICKER_TILT[i % STICKER_TILT.length],
                )}
              >
                {skill}
              </li>
            ))}
          </ul>
        </Reveal>

        <PolaroidStack />
        <RetroPrinter />
      </div>
    </section>
  );
}

function StoryPanel() {
  return (
    <div className="grid gap-8 md:grid-cols-3 md:gap-10">
      {aboutStory.map((paragraph, i) => (
        <div key={i}>
          <p className="font-mono text-xs uppercase tracking-wider text-muted">
            0{i + 1} — {STORY_LABELS[i]}
          </p>
          <p className="mt-3 text-[17px] leading-relaxed text-muted">
            <RichText text={paragraph} />
          </p>
        </div>
      ))}
    </div>
  );
}

function TldrPanel() {
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {aboutTldr.map((point) => (
        <li
          key={point.text}
          className="flex gap-4 rounded-[16px] border border-black/[0.06] bg-white p-5 shadow-float"
        >
          <span aria-hidden="true" className="text-2xl leading-none">
            {point.emoji}
          </span>
          <p className="text-[16px] leading-relaxed text-muted">
            <RichText text={point.text} />
          </p>
        </li>
      ))}
    </ul>
  );
}

function TimelinePanel() {
  return (
    <ol className="relative ml-1.5 grid max-w-4xl border-l border-black/10 md:grid-cols-1">
      {timeline.map((entry) => (
        <li key={`${entry.date}-${entry.title}`} className="relative pb-7 pl-8 last:pb-0">
          <span
            aria-hidden="true"
            className={cx(
              "absolute -left-[7.5px] top-1 size-3.5 rounded-full border-2 border-white",
              entry.current ? "bg-accent ring-4 ring-accent/25" : "bg-ink",
            )}
          />
          <p className="font-mono text-xs uppercase tracking-wider text-muted">{entry.date}</p>
          <h3 className="mt-1 text-lg font-semibold tracking-tight">{entry.title}</h3>
          <p className="mt-1 max-w-2xl text-muted">{entry.body}</p>
        </li>
      ))}
    </ol>
  );
}
