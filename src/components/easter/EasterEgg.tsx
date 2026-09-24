import { CurlyArrow, HandNote, Scribble } from "@/components/ui/Doodles";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Typography";
import { TiltTerminal } from "./TiltTerminal";

export function EasterEgg() {
  return (
    <section id="fun" aria-labelledby="egg-title" className="paper-dots-trans overflow-hidden py-28 md:py-36">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 md:grid-cols-[0.85fr_1.15fr]">
        <Reveal className="relative">
          <Eyebrow>Easter egg</Eyebrow>
          <h2 id="egg-title" className="mt-4 text-[clamp(2rem,4.5vw,3rem)] font-bold leading-[1.12] tracking-[-0.03em]">
            You found the <Scribble kind="circle">fun</Scribble> part.
          </h2>
          <div className="pointer-events-none absolute -bottom-20 right-0 hidden items-start gap-1 md:flex">
            <HandNote rotate={-6} className="mt-6 text-2xl text-accent">
              try me!
            </HandNote>
            <CurlyArrow className="h-14 w-16 -rotate-[30deg] text-accent/80" delay={0.6} />
          </div>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
            Tilt it with your mouse, then hit run. Programming jokes, quotes I keep coming back to, and real commit
            messages pulled straight from my repos — unedited, no shame.
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <TiltTerminal />
        </Reveal>
      </div>
    </section>
  );
}
