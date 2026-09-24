import Image from "next/image";
import type { ReactNode } from "react";
import { LockIcon } from "@/components/ui/icons";
import type { Project, TerminalLine } from "@/lib/content";
import { cx } from "@/lib/styles";

const LINE_TONE: Record<TerminalLine["kind"], string> = {
  cmd: "text-white",
  out: "text-white/75",
  dim: "text-white/45",
  accent: "text-[#9be39b]",
};

function TrafficLights({ muted = false }: { muted?: boolean }) {
  const dot = "size-2 rounded-full sm:size-2.5";
  return (
    <span className="flex shrink-0 gap-1.5">
      <span className={cx(dot, muted ? "bg-white/20" : "bg-[#ff5f57]")} />
      <span className={cx(dot, muted ? "bg-white/20" : "bg-[#febc2e]")} />
      <span className={cx(dot, muted ? "bg-white/20" : "bg-[#28c840]")} />
    </span>
  );
}

export function BrowserFrame({ url, compact = false, children }: { url: string; compact?: boolean; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[12px] bg-white shadow-lift ring-1 ring-black/[0.08]">
      <div className={cx("flex items-center gap-2 border-b border-black/[0.06] bg-[#f5f5f5]", compact ? "px-2.5 py-1.5" : "px-3 py-2")}>
        <TrafficLights />
        {!compact && (
          <>
            <span className="mx-auto flex min-w-0 max-w-[64%] items-center gap-1 rounded-full bg-white px-3 py-0.5 font-mono text-[9px] text-muted ring-1 ring-black/[0.05] sm:text-[10.5px]">
              <LockIcon className="size-2.5 shrink-0" />
              <span className="truncate">{url}</span>
            </span>
            <span className="w-[38px] shrink-0" />
          </>
        )}
      </div>
      {children}
    </div>
  );
}

export function TerminalFrame({ title, lines }: { title: string; lines: TerminalLine[] }) {
  return (
    <div className="overflow-hidden rounded-[12px] bg-[#0d0d0d] shadow-lift ring-1 ring-white/10">
      <div className="flex items-center gap-2 border-b border-white/[0.07] px-3 py-2">
        <TrafficLights muted />
        <span className="ml-1 truncate font-mono text-[9px] text-white/45 sm:text-[10px]">{title}</span>
      </div>
      <pre className="overflow-hidden px-3 py-2.5 font-mono text-[8.5px] leading-[1.65] sm:text-[10.5px]">
        <code>
          {lines.map((line, i) => (
            <span key={i} className={cx("block overflow-hidden text-ellipsis whitespace-pre", LINE_TONE[line.kind])}>
              {line.kind === "cmd" && <span className="text-accent">$ </span>}
              {line.text}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

function PipelineScreen({ steps, title }: { steps: string[]; title: string }) {
  return (
    <div
      role="img"
      aria-label={`${title} pipeline: ${steps.join(" → ")}`}
      className="flex aspect-[2/1] flex-col justify-center gap-3 overflow-hidden bg-[#0b0b0f] px-4 py-4 sm:px-6"
    >
      <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/40 sm:text-[10px]">adaptive RAG pipeline</p>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
        {steps.map((step, i) => (
          <li key={step} className="flex items-center gap-1.5">
            <span
              className={cx(
                "rounded-full border px-2 py-0.5 font-mono text-[8.5px] sm:px-2.5 sm:py-1 sm:text-[10.5px]",
                i === steps.length - 1 ? "border-accent/60 bg-accent/10 text-accent" : "border-white/15 bg-white/[0.04] text-white/80",
              )}
            >
              {step}
            </span>
            {i < steps.length - 1 && <span className="text-[10px] text-white/30">→</span>}
          </li>
        ))}
      </ol>
      <p className="font-mono text-[8.5px] text-white/35 sm:text-[10px]">latency budget &lt;200ms · fits in 512MB RAM</p>
    </div>
  );
}

function VoiceCard() {
  const bars = [40, 72, 100, 55, 86, 34, 66, 92, 48, 70];
  return (
    <div className="overflow-hidden rounded-[12px] bg-white p-3 shadow-lift ring-1 ring-black/[0.08] sm:p-4">
      <div className="flex items-center gap-2.5">
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-ink text-[13px] text-white">🎙</span>
        <span className="flex h-6 items-end gap-[3px]">
          {bars.map((h, i) => (
            <span key={i} className="w-[3px] rounded-full bg-ink/70" style={{ height: `${h}%` }} />
          ))}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1">
        {["English", "हिन्दी", "मराठी", "Hinglish"].map((lang) => (
          <span key={lang} className="rounded-full bg-chip px-2 py-0.5 text-[9px] font-medium text-ink/80 sm:text-[10.5px]">
            {lang}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * 2–3 overlapping, fanned frames per project: a browser window with the real
 * screenshot, a zoomed "detail" window peeking from behind, and a terminal with
 * real artifacts from the repo. Frames idle-float and fan out further on hover.
 */
export function MockupCluster({ project }: { project: Project }) {
  const { cover } = project;

  return (
    <div className="group relative mx-auto aspect-[4/3] w-full max-w-[560px] select-none">
      {/* Back frame, top-right */}
      <div aria-hidden="true" className="absolute right-0 top-0 w-[44%] animate-float [animation-delay:-2s]">
        <div className="rotate-[6deg] transition-[rotate,translate] duration-500 ease-out-soft group-hover:-translate-y-2 group-hover:translate-x-2 group-hover:rotate-[9deg]">
          {cover ? (
            <BrowserFrame url={project.domain} compact>
              <div className="relative aspect-[4/3] overflow-hidden bg-neutral-900">
                <Image
                  src={cover.src}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 250px, 44vw"
                  className="object-cover"
                  style={{ objectPosition: cover.crop, transform: "scale(1.7)", transformOrigin: cover.crop }}
                />
              </div>
            </BrowserFrame>
          ) : (
            <VoiceCard />
          )}
        </div>
      </div>

      {/* Main frame */}
      <div className="absolute left-[3%] top-[12%] z-10 w-[86%] animate-float">
        <div className="-rotate-2 transition-[rotate,translate] duration-500 ease-out-soft group-hover:-translate-y-1 group-hover:-rotate-3">
          <BrowserFrame url={project.domain}>
            {cover ? (
              <Image
                src={cover.src}
                alt={cover.alt}
                width={cover.width}
                height={cover.height}
                sizes="(min-width: 768px) 480px, 86vw"
                className="block h-auto w-full"
              />
            ) : (
              <PipelineScreen steps={project.pipeline ?? []} title={project.title} />
            )}
          </BrowserFrame>
        </div>
      </div>

      {/* Terminal frame, bottom-left */}
      <div aria-hidden="true" className="absolute bottom-0 left-0 z-20 w-[58%] animate-float [animation-delay:-4s]">
        <div className="-rotate-[4deg] transition-[rotate,translate] duration-500 ease-out-soft group-hover:-translate-x-2 group-hover:translate-y-1 group-hover:-rotate-[7deg]">
          <TerminalFrame title={project.terminal.title} lines={project.terminal.lines} />
        </div>
      </div>
    </div>
  );
}
