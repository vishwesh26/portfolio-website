import { sql } from "drizzle-orm";
import { contactMessages } from "@/db/schema";
import { contactReasons } from "@/lib/content";
import { sendContactEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

type Db = (typeof import("@/db"))["db"];

/**
 * DB client is loaded lazily and optionally. If DATABASE_URL is not set,
 * email delivery via nodemailer still succeeds seamlessly.
 */
async function getDb(): Promise<Db | null> {
  if (!process.env.DATABASE_URL) return null;
  try {
    const mod = await import("@/db");
    return mod.db;
  } catch (err) {
    console.warn("[contact] DB module could not be loaded:", err);
    return null;
  }
}

let tableReady: Promise<unknown> | null = null;

/** Safety net for fresh databases where `drizzle-kit push` hasn't run yet. */
function ensureTable(db: Db) {
  tableReady ??= db
    .execute(
      sql`CREATE TABLE IF NOT EXISTS contact_messages (
        id serial PRIMARY KEY,
        name varchar(120) NOT NULL,
        contact varchar(200) NOT NULL,
        reason varchar(60) NOT NULL,
        message text NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      )`,
    )
    .catch((error: unknown) => {
      tableReady = null;
      throw error;
    });
  return tableReady;
}

const asTrimmed = (value: unknown) => (typeof value === "string" ? value.trim() : "");

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot: real people never fill this hidden field.
  if (asTrimmed(body.company)) return Response.json({ ok: true }, { status: 201 });

  const name = asTrimmed(body.name);
  const contact = asTrimmed(body.contact);
  const reason = asTrimmed(body.reason);
  const message = asTrimmed(body.message);

  if (!name || !contact || !reason || !message) {
    return Response.json({ error: "Please fill in all fields." }, { status: 400 });
  }
  if (name.length > 120 || contact.length > 200 || message.length > 5000) {
    return Response.json({ error: "One of the fields is a little too long." }, { status: 400 });
  }
  if (!(contactReasons as readonly string[]).includes(reason)) {
    return Response.json({ error: "Please pick a reason for your message." }, { status: 400 });
  }
  if (message.length < 10) {
    return Response.json({ error: "Tell me a bit more — at least a sentence." }, { status: 400 });
  }

  // 1. Send details to Vishwesh's email via nodemailer
  try {
    await sendContactEmail({ name, contact, reason, message });
  } catch (emailError) {
    console.error("[contact] Failed to send email via nodemailer:", emailError);
    return Response.json(
      { error: "Couldn’t send your message right now. Please try again or reach out directly." },
      { status: 500 },
    );
  }

  // 2. Optionally store in Postgres as a secondary backup if configured
  try {
    const db = await getDb();
    if (db) {
      await ensureTable(db);
      await db.insert(contactMessages).values({ name, contact, reason, message });
    }
  } catch (dbError) {
    console.warn("[contact] Warning: Could not save to DB backup, but email was sent successfully:", dbError);
  }

  return Response.json({ ok: true }, { status: 201 });
}
