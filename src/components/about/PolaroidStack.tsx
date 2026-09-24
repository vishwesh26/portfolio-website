"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { DoodleStar, HandNote, Tape } from "@/components/ui/Doodles";
import { aboutPolaroids } from "@/lib/content";
import { cx, seeded } from "@/lib/styles";

// Seeded "random" tilts in [-6deg, 6deg] — random-looking, but identical on server & client.
const rand = seeded(23);
const ROTATIONS = aboutPolaroids.map(() => Number((rand() * 12 - 6).toFixed(2)));
// Staggered stacking order + vertical offsets so the strip feels hand-placed.
const Z_CLASSES = ["z-[2]", "z-[4]", "z-[1]", "z-[3]"];
const OFFSETS = ["md:translate-y-3", "md:-translate-y-4", "md:translate-y-6", "md:-translate-y-1"];
const TAPES = [
  { tone: "yellow", className: "left-1/2 -top-3 -translate-x-1/2 -rotate-3" },
  { tone: "blue", className: "-left-5 -top-1 -rotate-[35deg]" },
  { tone: "orange", className: "left-1/2 -top-3 -translate-x-1/2 rotate-6" },
  { tone: "white", className: "-right-5 -top-1 rotate-[35deg]" },
] as const;
const FOCUS: Record<string, string> = {
  "/images/photos/easy_trek.jpg": "50% 50%",
  "/images/photos/arms_wide_open.png": "50% 45%",
  "/images/photos/puppy.png": "50% 32%",
  "/images/photos/boat_canoe.jpg": "50% 32%",
};

/** A scrapbook strip of taped photos with pen captions. */
export function PolaroidStack() {
  return (
    <div className="relative mt-28">
      <HandNote rotate={-4} className="mb-8 text-2xl text-ink/75 md:mb-4">
        a few pages from my camera roll
      </HandNote>
      <DoodleStar className="absolute -top-2 right-4 size-9 text-accent md:right-16" />

      <ul
        aria-label="A few personal photos"
        className="grid grid-cols-2 gap-x-6 gap-y-12 sm:gap-x-10 md:flex md:justify-center md:gap-0"
      >
        {aboutPolaroids.map((photo, i) => {
          const tape = TAPES[i % TAPES.length];
          return (
            <motion.li
              key={photo.src}
              className={cx("relative hover:z-20 md:-mx-3 md:w-60", Z_CLASSES[i % Z_CLASSES.length], OFFSETS[i % OFFSETS.length])}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
            >
              <motion.figure
                initial={{ rotate: ROTATIONS[i] }}
                animate={{ rotate: ROTATIONS[i] }}
                whileHover={{ y: -12, rotate: ROTATIONS[i] * -0.4, scale: 1.04 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="cursor-default"
              >
                <div className="relative rounded-[8px] bg-white p-1.5 shadow-photo ring-1 ring-black/[0.05]">
                  <Tape tone={tape.tone} className={cx("z-10", tape.className)} />
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[5px] bg-neutral-200">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(min-width: 768px) 240px, 45vw"
                      className="object-cover"
                      style={{ objectPosition: FOCUS[photo.src] ?? "50% 50%" }}
                    />
                  </div>
                </div>
                <figcaption className="mt-3 text-center font-hand text-lg leading-none text-ink/75">{photo.caption}</figcaption>
              </motion.figure>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
