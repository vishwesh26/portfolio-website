"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CurlyArrow, Scribble } from "@/components/ui/Doodles";
import { Reveal } from "@/components/ui/Reveal";
import { printables, type Printable } from "@/lib/content";
import { cx, pillInteractive } from "@/lib/styles";

type Printed = { id: number; item: Printable };

/**
 * Delight easter egg: a retro CRT with a PRINT button. Each press "prints" a random
 * photo or line that slides out of the printer slot with a spring.
 */
export function RetroPrinter() {
  const [printed, setPrinted] = useState<Printed | null>(null);
  const [printing, setPrinting] = useState(false);
  const lastIndex = useRef(-1);
  const count = useRef(0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((t) => window.clearTimeout(t));
  }, []);

  const print = () => {
    if (printing) return;
    let index = Math.floor(Math.random() * printables.length);
    if (index === lastIndex.current) index = (index + 1) % printables.length;
    lastIndex.current = index;

    setPrinting(true);
    setPrinted(null); // eject the previous print
    timers.current.push(
      window.setTimeout(() => {
        count.current += 1;
        setPrinted({ id: count.current, item: printables[index] });
      }, 420),
      window.setTimeout(() => setPrinting(false), 1300),
    );
  };

  const status = printing
    ? "printing… ▓▓▓▓▓░░░"
    : printed
      ? `printed #${printed.id} ✓ ${printed.item.kind === "photo" ? "memory.jpg" : "note.txt"}`
      : "ready — press PRINT";

  return (
    <div className="mt-28 grid items-start gap-12 md:grid-cols-[1fr_1.05fr] md:gap-8">
      <Reveal className="md:pt-16">
        <p className="flex items-end gap-2 font-hand text-3xl text-accent">
          psst — press the button
          <CurlyArrow className="-mb-8 hidden h-14 w-16 -rotate-12 text-accent/80 md:block" delay={0.4} />
        </p>
        <h3 className="mt-3 text-2xl font-bold tracking-tight">
          The <Scribble kind="zigzag">memory printer</Scribble>
        </h3>
        <p className="mt-3 max-w-md leading-relaxed text-muted">
          An old CRT hooked up to a dot-matrix printer. Every press prints a random photo from my travels or a line from
          how I work. Completely useless. Absolutely essential.
        </p>
      </Reveal>

      <Reveal delay={0.08}>
        <div className="relative mx-auto w-full max-w-[400px]">
          {/* Monitor */}
          <div className="relative z-10 rounded-[28px] bg-[#e9e4d8] p-4 pb-3 shadow-photo ring-1 ring-black/5">
            <div className="rounded-[20px] bg-[#2a2a2a] p-3 shadow-[inset_0_2px_6px_rgb(0_0_0/0.5)]">
              <div className="scanlines relative aspect-[4/3] overflow-hidden rounded-[14px] bg-[#170c05] p-4 font-mono text-[12.5px] leading-relaxed text-[#ffb15c] shadow-[inset_0_0_48px_rgb(255_140_60/0.16)] [&_.text-accent\/60]:text-[#ffb15c]/60 [&_.text-accent\/35]:text-[#ffb15c]/35">
                <p className="text-accent/60">vishwesh@crt:~$ ./print --random</p>
                <p className="mt-1" aria-live="polite">
                  {status}
                </p>
                <p className="mt-1">
                  <span className="text-accent/60">$</span> <span className="animate-blink">▍</span>
                </p>
                <p className="absolute bottom-3 right-4 text-[10px] uppercase tracking-[0.3em] text-accent/35">vs-84</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between px-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-black/40">Vish·Tron</span>
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className={cx(
                    "size-2 rounded-full transition-colors",
                    printing ? "animate-blink bg-accent" : "bg-emerald-500/70",
                  )}
                />
                <button
                  type="button"
                  onClick={print}
                  disabled={printing}
                  aria-label="Print a random photo or quote"
                  className={cx(
                    pillInteractive,
                    "bg-ink px-4 py-1.5 font-mono text-xs font-semibold tracking-[0.2em] text-white shadow-[0_3px_0_#000] hover:shadow-[0_5px_0_#000] active:shadow-[0_1px_0_#000]",
                  )}
                >
                  PRINT
                </button>
              </div>
            </div>
          </div>

          {/* Neck + printer base with paper slot */}
          <div aria-hidden="true" className="mx-auto h-4 w-24 bg-[#d9d3c4]" />
          <div className="relative z-10 mx-auto w-[88%] rounded-[16px] bg-[#e9e4d8] px-5 pb-3 pt-3 shadow-float ring-1 ring-black/5">
            <div aria-hidden="true" className="h-2 rounded-full bg-[#1f1f1f] shadow-[inset_0_1px_2px_rgb(0_0_0/0.6)]" />
          </div>

          {/* Paper output */}
          <div className="relative mx-auto -mt-2 h-[300px] w-[72%] overflow-hidden">
            <AnimatePresence>
              {printed ? (
                <motion.figure
                  key={printed.id}
                  initial={{ y: "-105%" }}
                  animate={{ y: 0 }}
                  exit={{ y: 30, opacity: 0, transition: { duration: 0.22 } }}
                  transition={{ type: "spring", stiffness: 70, damping: 14, mass: 0.9 }}
                  className="absolute inset-x-0 top-0 rounded-b-[12px] border-t-2 border-dashed border-black/10 bg-white p-3 shadow-lift"
                >
                  <PrintContent item={printed.item} />
                </motion.figure>
              ) : (
                !printing && (
                  <motion.p
                    key="hint"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="pt-5 text-center font-script text-2xl text-muted"
                  >
                    ↑ press print
                  </motion.p>
                )
              )}
            </AnimatePresence>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function PrintContent({ item }: { item: Printable }) {
  if (item.kind === "photo") {
    return (
      <>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[4px] bg-neutral-200">
          <Image src={item.src} alt={item.alt} fill sizes="280px" className="object-cover" />
        </div>
        <figcaption className="pb-1 pt-2 text-center font-script text-xl leading-none text-ink/80">{item.caption}</figcaption>
      </>
    );
  }
  return (
    <blockquote className="px-2 py-6 text-center">
      <p className="font-script text-[1.65rem] leading-snug text-ink">“{item.text}”</p>
      <footer className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted">— {item.source}</footer>
    </blockquote>
  );
}
