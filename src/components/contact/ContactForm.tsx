"use client";

import { useState, type FormEvent } from "react";
import { ArrowRightIcon, CheckCircleIcon } from "@/components/ui/icons";
import { contactReasons } from "@/lib/content";
import { btnPrimary, cx } from "@/lib/styles";

type Status =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success" }
  | { state: "error"; message: string };

const fieldBase =
  "w-full border border-black/10 bg-white px-5 text-[15px] text-ink placeholder:text-black/35 outline-none " +
  "transition-[border-color,box-shadow] duration-200 focus:border-ink/60 focus:ring-4 focus:ring-accent/25";
const inputClass = cx(fieldBase, "rounded-full py-3");
const labelText = "mb-2 block pl-1 text-sm font-medium text-ink/80";

/** "Say hi" form — messages are stored in Postgres via /api/contact. */
export function ContactForm() {
  const [status, setStatus] = useState<Status>({ state: "idle" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      contact: String(formData.get("contact") ?? "").trim(),
      reason: String(formData.get("reason") ?? ""),
      message: String(formData.get("message") ?? "").trim(),
      company: String(formData.get("company") ?? ""),
    };

    if (!payload.name || !payload.contact || !payload.reason || !payload.message) {
      setStatus({ state: "error", message: "Please fill in all fields." });
      return;
    }

    setStatus({ state: "submitting" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Failed to send message.");
      form.reset();
      setStatus({ state: "success" });
    } catch (error) {
      setStatus({ state: "error", message: error instanceof Error ? error.message : "Failed to send message." });
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-label="Contact form"
      className="mt-12 rounded-[28px] border border-black/[0.06] bg-mist p-5 text-left shadow-float sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className={labelText}>Your name</span>
          <input name="name" type="text" required maxLength={120} autoComplete="name" placeholder="John Doe" className={inputClass} />
        </label>
        <label className="block">
          <span className={labelText}>Email or phone</span>
          <input
            name="contact"
            type="text"
            required
            maxLength={200}
            autoComplete="email"
            placeholder="email@example.com or phone number"
            className={inputClass}
          />
        </label>
      </div>

      <label className="mt-5 block">
        <span className={labelText}>Reason for message</span>
        <span className="relative block">
          <select name="reason" required defaultValue="" className={cx(inputClass, "cursor-pointer appearance-none pr-12")}>
            <option value="" disabled>
              Select a reason
            </option>
            {contactReasons.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </select>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="pointer-events-none absolute right-5 top-1/2 size-4 -translate-y-1/2 text-muted"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </label>

      <label className="mt-5 block">
        <span className={labelText}>Message</span>
        <textarea
          name="message"
          required
          rows={5}
          maxLength={5000}
          placeholder="Tell me more about your ideas…"
          className={cx(fieldBase, "min-h-32 resize-y rounded-[24px] py-4")}
        />
      </label>

      {/* Honeypot for bots — hidden from people and assistive tech. */}
      <div aria-hidden="true" className="hidden">
        <label>
          Company
          <input name="company" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="submit" disabled={status.state === "submitting"} className={cx(btnPrimary, "px-6 py-3")}>
          {status.state === "submitting" ? "Sending…" : "Send message"}
          <ArrowRightIcon className="size-4" />
        </button>
        <p role="status" aria-live="polite" className="text-sm">
          {status.state === "success" && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-featured px-3.5 py-1.5 font-medium text-featured-ink">
              <CheckCircleIcon className="size-4" /> Message sent — I’ll get back to you soon.
            </span>
          )}
          {status.state === "error" && (
            <span className="inline-flex rounded-full bg-red-50 px-3.5 py-1.5 font-medium text-red-700">{status.message}</span>
          )}
        </p>
      </div>
    </form>
  );
}
