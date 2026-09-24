"use client";

import { useEffect, useMemo, useState } from "react";
import { profile } from "@/lib/content";
import { cx } from "@/lib/styles";

type LiveClockProps = {
  timeZone?: string;
  label?: string;
  city?: string;
  className?: string;
};

/** Live "HH:MM TZ" clock for a given IANA time zone. Ticks every second (blinking colon). */
export function LiveClock({
  timeZone = profile.timeZone,
  label = profile.tzLabel,
  city = profile.city,
  className,
}: LiveClockProps) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    let interval: number | undefined;
    // Align ticks to the start of each second.
    const timeout = window.setTimeout(() => {
      tick();
      interval = window.setInterval(tick, 1000);
    }, 1000 - (Date.now() % 1000));
    return () => {
      window.clearTimeout(timeout);
      if (interval) window.clearInterval(interval);
    };
  }, []);

  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat("en-GB", {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
      }),
    [timeZone],
  );

  let hours = "--";
  let minutes = "--";
  let seconds = 0;
  if (now) {
    for (const part of formatter.formatToParts(now)) {
      if (part.type === "hour") hours = part.value;
      else if (part.type === "minute") minutes = part.value;
      else if (part.type === "second") seconds = Number(part.value);
    }
  }

  return (
    <span
      className={cx("inline-flex items-center gap-1.5 whitespace-nowrap font-mono text-[12.5px] tabular-nums", className)}
      title={`Local time in ${city}`}
    >
      <span className="sr-only">
        Local time in {city}: {hours}:{minutes} {label}
      </span>
      <time aria-hidden="true" dateTime={now ? now.toISOString() : undefined}>
        {hours}
        <span className={cx("transition-opacity duration-300", seconds % 2 === 1 && "opacity-25")}>:</span>
        {minutes}
      </time>
      <span aria-hidden="true" className="opacity-55">
        {label}
      </span>
    </span>
  );
}
