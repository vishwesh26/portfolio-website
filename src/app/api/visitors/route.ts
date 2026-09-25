import { sql } from "drizzle-orm";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

/** Base count requested: starts at 104 */
const BASE_COUNT = 104;
let inMemoryCount = BASE_COUNT;

// Local persistence in .data/ for development resilience
const dataDir = path.join(process.cwd(), ".data");
const dataFile = path.join(dataDir, "visitors.json");

function getLocalCount(): number {
  try {
    if (fs.existsSync(dataFile)) {
      const raw = fs.readFileSync(dataFile, "utf8");
      const parsed = JSON.parse(raw);
      if (typeof parsed.count === "number" && parsed.count >= BASE_COUNT) {
        inMemoryCount = parsed.count;
        return inMemoryCount;
      }
    }
  } catch {
    // Ignore read errors
  }
  return inMemoryCount;
}

function setLocalCount(count: number) {
  inMemoryCount = Math.max(BASE_COUNT, count);
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(dataFile, JSON.stringify({ count: inMemoryCount }), "utf8");
  } catch {
    // Ignore write errors (e.g. read-only serverless environment)
  }
}

type Db = (typeof import("@/db"))["db"];

async function getDb(): Promise<Db | null> {
  if (!process.env.DATABASE_URL) return null;
  try {
    const mod = await import("@/db");
    return mod.db;
  } catch {
    return null;
  }
}

let tableReady: Promise<unknown> | null = null;
function ensureStatsTable(db: Db) {
  tableReady ??= db
    .execute(
      sql`CREATE TABLE IF NOT EXISTS site_stats (
        key varchar(32) PRIMARY KEY,
        count integer NOT NULL DEFAULT ${BASE_COUNT},
        updated_at timestamptz NOT NULL DEFAULT now()
      )`,
    )
    .catch((err: unknown) => {
      tableReady = null;
      throw err;
    });
  return tableReady;
}

export async function GET() {
  try {
    const db = await getDb();
    if (db) {
      await ensureStatsTable(db);
      const res = await db.execute(sql`SELECT count FROM site_stats WHERE key = 'visitors'`);
      const row = res.rows[0] as { count?: number } | undefined;
      if (row && typeof row.count === "number") {
        return Response.json({ count: Math.max(BASE_COUNT, row.count) });
      } else {
        await db.execute(
          sql`INSERT INTO site_stats (key, count, updated_at) VALUES ('visitors', ${BASE_COUNT}, now()) ON CONFLICT (key) DO NOTHING`,
        );
        return Response.json({ count: BASE_COUNT });
      }
    }
  } catch (err) {
    console.warn("[visitors] DB read fallback to memory:", err);
  }

  return Response.json({ count: getLocalCount() });
}

export async function POST() {
  try {
    const db = await getDb();
    if (db) {
      await ensureStatsTable(db);
      const res = await db.execute(
        sql`INSERT INTO site_stats (key, count, updated_at)
            VALUES ('visitors', ${BASE_COUNT + 1}, now())
            ON CONFLICT (key) DO UPDATE
            SET count = GREATEST(site_stats.count + 1, ${BASE_COUNT + 1}), updated_at = now()
            RETURNING count`,
      );
      const row = res.rows[0] as { count?: number } | undefined;
      if (row && typeof row.count === "number") {
        return Response.json({ count: Math.max(BASE_COUNT + 1, row.count) });
      }
    }
  } catch (err) {
    console.warn("[visitors] DB increment fallback to memory:", err);
  }

  const current = getLocalCount();
  const next = current + 1;
  setLocalCount(next);
  return Response.json({ count: next });
}
