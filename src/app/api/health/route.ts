import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Lazy import: a missing DATABASE_URL surfaces here at runtime instead of failing the build.
    const { db } = await import("@/db");
    await db.execute(sql`select 1`);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
