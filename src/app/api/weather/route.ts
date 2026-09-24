import { profile } from "@/lib/content";

export const dynamic = "force-dynamic";

type OpenMeteoResponse = {
  current?: { temperature_2m?: number; weather_code?: number; is_day?: number };
};

const { latitude, longitude } = profile.coords;
const OPEN_METEO_URL =
  `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
  `&current=temperature_2m,weather_code,is_day&timezone=${encodeURIComponent(profile.timeZone)}`;

/**
 * Proxies the free, key-less Open-Meteo API for Vishwesh's location (Pune).
 * Upstream responses are cached for 15 minutes.
 */
export async function GET() {
  try {
    const res = await fetch(OPEN_METEO_URL, {
      next: { revalidate: 900 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`Open-Meteo responded ${res.status}`);

    const data = (await res.json()) as OpenMeteoResponse;
    const current = data.current;
    if (typeof current?.temperature_2m !== "number") throw new Error("Malformed weather payload");

    return Response.json(
      {
        ok: true,
        temperature: Math.round(current.temperature_2m),
        code: current.weather_code ?? 0,
        isDay: current.is_day !== 0,
        location: profile.city,
      },
      { headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800" } },
    );
  } catch {
    return Response.json({ ok: false }, { headers: { "Cache-Control": "no-store" } });
  }
}
