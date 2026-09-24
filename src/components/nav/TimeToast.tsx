"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CloseIcon } from "@/components/ui/icons";
import { cx } from "@/lib/styles";

function messageFor(hour: number): { emoji: string; text: string } {
  if (hour >= 22 || hour < 5) return { emoji: "🦉", text: "Up past midnight? Best bugs get fixed at this hour." };
  if (hour < 12) return { emoji: "☕", text: "Morning! The coffee’s on me — scroll around." };
  if (hour < 17) return { emoji: "✏️", text: "Afternoon! Grab a pencil, this site’s a sketchbook." };
  return { emoji: "🌆", text: "Evening! Perfect time for a slow scroll." };
}

/** A small, dismissible, time-of-day-aware toast pill shown under the navbar on load. */
export function TimeToast({ dark }: { dark: boolean }) {
  const [message, setMessage] = useState<{ emoji: string; text: string } | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMessage(messageFor(new Date().getHours()));
    const show = window.setTimeout(() => setOpen(true), 1100);
    const hide = window.setTimeout(() => setOpen(false), 10000);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-[84px] z-40 flex justify-center px-4" role="status" aria-live="polite">
      <AnimatePresence>
        {open && message && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className={cx(
              "pointer-events-auto flex max-w-full items-center gap-2.5 rounded-full border py-1.5 pl-3.5 pr-1.5 text-[13px] font-medium backdrop-blur-[12px] transition-colors duration-500",
              dark ? "border-white/10 bg-[#0a0a0a]/70 text-white" : "border-black/[0.06] bg-white/85 text-ink shadow-float",
            )}
          >
            <span aria-hidden="true">{message.emoji}</span>
            <span className="truncate">{message.text}</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Dismiss message"
              className={cx(
                "grid size-7 shrink-0 place-items-center rounded-full transition-[background-color,scale] active:scale-90",
                dark ? "hover:bg-white/10" : "hover:bg-black/[0.06]",
              )}
            >
              <CloseIcon className="size-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
