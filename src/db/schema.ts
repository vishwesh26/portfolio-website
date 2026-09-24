import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

/** Messages submitted through the portfolio's "Say hi" contact form. */
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  contact: varchar("contact", { length: 200 }).notNull(),
  reason: varchar("reason", { length: 60 }).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type ContactMessage = typeof contactMessages.$inferSelect;
export type NewContactMessage = typeof contactMessages.$inferInsert;
