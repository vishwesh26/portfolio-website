"use client";

import { useEffect, useState } from "react";
import { cx } from "@/lib/styles";

type WeatherData = { temperature: number; code: number; isDay: boolean; location: string };
type WeatherKind = "clear" | "partly" | "cloudy" | "fog" | "drizzle" | "rain" | "snow" | "storm";

/** Maps WMO weather codes (used by Open-Meteo) to a label + icon kind. */
function describe(code: number): { label: string; kind: WeatherKind } {
  if (code === 0) return { label: "Clear sky", kind: "clear" };
  if (code === 1 || code === 2) return { label: "Partly cloudy", kind: "partly" };
  if (code === 3) return { label: "Overcast", kind: "cloudy" };
  if (code === 45 || code === 48) return { label: "Foggy", kind: "fog" };
  if (code >= 51 && code <= 57) return { label: "Drizzle", kind: "drizzle" };
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return { label: "Rain", kind: "rain" };
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return { label: "Snow", kind: "snow" };
  if (code >= 95) return { label: "Thunderstorm", kind: "storm" };
  return { label: "Cloudy", kind: "cloudy" };
}

const CLOUD = "M7.5 15.5h9.25a4.25 4.25 0 0 0 .6-8.46A5.75 5.75 0 0 0 6.2 8.2a3.65 3.65 0 0 0 1.3 7.3Z";

function WeatherIcon({ kind, isDay }: { kind: WeatherKind; isDay: boolean }) {
  const props = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    width: 14,
    height: 14,
    "aria-hidden": true,
  };

  if (kind === "clear") {
    return isDay ? (
      <svg {...props} className="text-amber-500">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
      </svg>
    ) : (
      <svg {...props}>
        <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
      </svg>
    );
  }
  if (kind === "partly") {
    return (
      <svg {...props}>
        <path d="M9 2.5v1.2M3.7 4.7l.9.9M2.5 10h1.2" className={isDay ? "text-amber-500" : undefined} />
        <path d="M5.6 11A3.8 3.8 0 0 1 12.4 7" className={isDay ? "text-amber-500" : undefined} />
        <path d="M8.5 20h8.25a3.75 3.75 0 0 0 .55-7.46 5 5 0 0 0-9.6 1.4A3.1 3.1 0 0 0 8.5 20Z" />
      </svg>
    );
  }
  return (
    <svg {...props}>
      <path d={CLOUD} />
      {kind === "fog" && <path d="M5 19h14M8 22h8" />}
      {(kind === "rain" || kind === "drizzle") && <path d="M9 18.5 8 21M13 18.5 12 21M17 18.5 16 21" />}
      {kind === "snow" && <path d="M8.5 19.5h.01M12 21h.01M15.5 19.5h.01" />}
      {kind === "storm" && <path d="m12.5 16.5-2 3.5h3l-2 3" />}
    </svg>
  );
}

/** Live weather for Vishwesh's city via /api/weather (Open-Meteo proxy). */
export function WeatherChip({ className }: { className?: string }) {
  const [data, setData] = useState<WeatherData | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/weather");
        const json = (await res.json()) as { ok: boolean } & Partial<WeatherData>;
        if (cancelled) return;
        if (json.ok && typeof json.temperature === "number") {
          setData({
            temperature: json.temperature,
            code: json.code ?? 0,
            isDay: json.isDay ?? true,
            location: json.location ?? "",
          });
        } else if (!data) {
          setFailed(true);
        }
      } catch {
        if (!cancelled) setFailed(true);
      }
    };
    void load();
    const id = window.setInterval(load, 15 * 60 * 1000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (failed && !data) return null;
  const info = data ? describe(data.code) : null;

  return (
    <span
      className={cx("inline-flex items-center gap-1 whitespace-nowrap text-[12.5px] font-medium tabular-nums", className)}
      title={data && info ? `${info.label} in ${data.location}` : "Loading weather"}
    >
      {data && info ? (
        <>
          <WeatherIcon kind={info.kind} isDay={data.isDay} />
          <span aria-hidden="true">{data.temperature}°C</span>
          <span className="sr-only">
            Weather in {data.location}: {data.temperature}°C, {info.label}
          </span>
        </>
      ) : (
        <span aria-hidden="true" className="h-3 w-11 animate-pulse rounded-full bg-current/15" />
      )}
    </span>
  );
}
