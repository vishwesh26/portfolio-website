import Image from "next/image";
import { CheckCircleIcon, GitHubIcon, SparkleIcon, TrophyIcon, WrenchIcon } from "@/components/ui/icons";
import { CurlyArrow, HandNote, Scribble, Tape } from "@/components/ui/Doodles";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Typography";
import { projects, type Project } from "@/lib/content";
import { badgeTone, cx } from "@/lib/styles";
import { MockupCluster } from "./MockupCluster";

/** Scrawled margin notes next to each project's mockups. */
const MARGIN_NOTES: Record<string, string> = {
  leetvision: "my current obsession",
  pustakedits: "30+ tools & counting!",
  vaani: "speaks Hinglish too",
  dcpems: "live on dcpems.com",
};

export function Work() {
  return (
    <section id="work" aria-labelledby="work-title" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <Eyebrow>Work</Eyebrow>
          <h2
            id="work-title"
            className="mt-4 max-w-3xl text-[clamp(2.25rem,5vw,3.25rem)] font-bold leading-[1.05] tracking-[-0.03em]"
          >
            Projects that <Scribble kind="circle">define</Scribble> me
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            A few things I’ve designed, built and shipped end to end — from DSA visualizers to PDF engines and voice AI.
          </p>
        </Reveal>

        <div className="mt-20 flex flex-col gap-28 md:gap-40">
          {projects.map((project, index) => (
            <ProjectArticle key={project.slug} project={project} flip={index % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectLogo({ project }: { project: Project }) {
  return (
    <span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-[12px] bg-white shadow-float ring-1 ring-black/[0.08]">
      {"src" in project.logo ? (
        <Image src={project.logo.src} alt="" width={44} height={44} className="size-full object-contain p-1" />
      ) : (
        <span className="grid size-full place-items-center bg-ink font-mono text-xs font-bold text-white">
          {project.logo.monogram}
        </span>
      )}
    </span>
  );
}

function ProjectArticle({ project, flip }: { project: Project; flip: boolean }) {
  const note = MARGIN_NOTES[project.slug];
  return (
    <article aria-labelledby={`${project.slug}-title`} className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
      <Reveal className={cx("relative", flip && "md:order-2")}>
        <MockupCluster project={project} />
        {note && (
          <div
            className={cx(
              "pointer-events-none absolute -top-12 z-30 flex items-end gap-1",
              flip ? "right-0 flex-row-reverse md:-right-4" : "left-0 md:-left-6",
            )}
          >
            <HandNote rotate={flip ? 5 : -6} className="text-xl text-accent">
              {note}
            </HandNote>
            <CurlyArrow className={cx("-mb-8 h-10 w-12 text-accent/80", flip ? "-scale-x-100 rotate-[-10deg]" : "rotate-[10deg]")} delay={0.5} />
          </div>
        )}
      </Reveal>

      <Reveal delay={0.08} className={cx(flip && "md:order-1")}>
        <div className="flex items-center gap-3.5">
          <ProjectLogo project={project} />
          <div>
            <h3 id={`${project.slug}-title`} className="text-2xl font-bold tracking-tight">
              <Scribble kind="underline" delay={0.4}>
                {project.title}
              </Scribble>
            </h3>
            <p className="mt-0.5 font-mono text-xs uppercase tracking-wider text-muted">{project.dates}</p>
          </div>
        </div>

        <p className="mt-6 text-lg font-medium leading-snug text-ink">{project.tagline}</p>
        <p className="mt-3 leading-relaxed text-muted">{project.description}</p>

        {project.badges.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Highlights">
            {project.badges.map((badge) => (
              <li
                key={badge.label}
                className={cx("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold", badgeTone[badge.tone])}
              >
                {badge.tone === "achievement" ? <TrophyIcon className="size-3.5" /> : <SparkleIcon className="size-3.5" />}
                {badge.label}
              </li>
            ))}
          </ul>
        )}

        {project.outcomes && (
          <ul className="mt-6 space-y-2.5" aria-label="Outcomes">
            {project.outcomes.map((outcome) => (
              <li key={outcome} className="flex items-start gap-2.5 text-[15px] leading-snug text-ink">
                <CheckCircleIcon className="mt-px size-[18px] shrink-0" />
                {outcome}
              </li>
            ))}
          </ul>
        )}

        {project.underTheHood && (
          <div className="relative mt-8 -rotate-[0.8deg] rounded-[12px] bg-[#fff6d6] p-5 shadow-[0_1px_2px_rgb(0_0_0/0.06),0_14px_28px_-18px_rgb(0_0_0/0.35)]">
            <Tape tone="white" className="-top-3 left-1/2 -translate-x-1/2 rotate-2" />
            <p className="flex items-center gap-2 font-hand text-xl text-ink">
              <WrenchIcon className="size-4" />
              how it actually works
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-ink/70">{project.underTheHood}</p>
          </div>
        )}

        <ul className="mt-6 flex flex-wrap gap-1.5" aria-label={`${project.title} tech stack`}>
          {project.stack.map((tech) => (
            <li key={tech} className="rounded-full bg-chip px-2.5 py-1 font-mono text-[11px] text-ink/70">
              {tech}
            </li>
          ))}
        </ul>

        <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3 text-[15px] font-semibold">
          <a href={project.live} target="_blank" rel="noopener noreferrer" className="link-underline inline-flex items-center gap-1">
            View Live <span aria-hidden="true">→</span>
            <span className="sr-only"> — {project.title} (opens in a new tab)</span>
          </a>
          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline inline-flex items-center gap-1.5 text-ink/80"
          >
            <GitHubIcon className="size-4" /> View Repo <span aria-hidden="true">→</span>
            <span className="sr-only"> — {project.title} source code (opens in a new tab)</span>
          </a>
        </div>
      </Reveal>
    </article>
  );
}
