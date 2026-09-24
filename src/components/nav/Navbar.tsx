"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { CloseIcon, MenuIcon, SocialIcon } from "@/components/ui/icons";
import { navLinks, profile, socials } from "@/lib/content";
import { useDarkBehindNav, useScrollSpy } from "@/lib/hooks";
import { btnPrimary, cx, pillInteractive } from "@/lib/styles";
import { LiveClock } from "./LiveClock";
import { TimeToast } from "./TimeToast";
import { WeatherChip } from "./WeatherChip";

const SECTION_IDS = navLinks.map((link) => link.id);

/**
 * Floating pill navbar: live clock + weather, scroll-spy with a shared-layout
 * active pill, and a light/dark theme that follows the section underneath it.
 */
export function Navbar() {
  const active = useScrollSpy(SECTION_IDS);
  const dark = useDarkBehindNav();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
        <nav
          aria-label="Primary"
          className={cx(
            "pointer-events-auto flex w-full max-w-md items-center justify-between gap-1 rounded-full border py-1.5 pl-3 pr-1.5 backdrop-blur-[12px]",
            "transition-[background-color,border-color,color,box-shadow] duration-500 ease-out-soft",
            "md:w-auto md:max-w-none md:justify-start md:pl-1.5",
            dark
              ? "border-white/10 bg-[#0a0a0a]/65 text-white shadow-[0_10px_30px_-12px_rgb(0_0_0/0.6)]"
              : "border-black/[0.06] bg-white/75 text-ink shadow-float",
          )}
        >
          <a
            href="#hero"
            aria-label={`${profile.name} — back to top`}
            className={cx(pillInteractive, "gap-0 px-3 py-0.5 font-script text-[1.6rem] font-bold leading-none")}
          >
            {profile.firstName.toLowerCase()}
            <span className="text-accent">.</span>
          </a>

          {/* Desktop-only cluster (one responsive wrapper avoids display-utility conflicts). */}
          <div className="hidden items-center md:flex">
          

          <ul className="flex items-center">
            {navLinks.map((link) => {
              const isActive = active === link.id;
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    aria-current={isActive ? "location" : undefined}
                    className={cx(
                      "relative block rounded-full px-3.5 py-1.5 text-sm font-medium",
                      "transition-[color,translate,scale] duration-200 hover:-translate-y-px active:scale-95",
                      isActive ? undefined : dark ? "text-white/65 hover:text-white" : "text-ink/60 hover:text-ink",
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-pill"
                        aria-hidden="true"
                        className={cx("absolute inset-0 rounded-full", dark ? "bg-white/15" : "bg-black/[0.07]")}
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          <a
            href="#contact"
            className={cx(
              pillInteractive,
              "ml-1 px-4 py-2 text-sm",
              dark
                ? "bg-white text-ink hover:shadow-[0_10px_24px_-8px_rgb(255_255_255/0.35)]"
                : "bg-ink text-white hover:shadow-[0_10px_24px_-8px_rgb(0_0_0/0.45)]",
            )}
          >
            Get in Touch
          </a>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label="Open menu"
            className={cx(pillInteractive, "size-10 md:hidden", dark ? "bg-white/10" : "bg-black/[0.05]")}
          >
            <MenuIcon className="size-5" />
          </button>
        </nav>
      </header>

      <TimeToast dark={dark} />

      <AnimatePresence>{menuOpen && <MobileMenu active={active} onClose={closeMenu} />}</AnimatePresence>
    </>
  );
}

function MobileMenu({ active, onClose }: { active: string | null; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const mql = window.matchMedia("(min-width: 768px)");
    const onBreakpoint = (event: MediaQueryListEvent) => {
      if (event.matches) onClose();
    };
    window.addEventListener("keydown", onKey);
    mql.addEventListener("change", onBreakpoint);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      mql.removeEventListener("change", onBreakpoint);
    };
  }, [onClose]);

  return (
    <motion.div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-white px-6 pb-10 pt-6 md:hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-script text-3xl font-bold leading-none">
          {profile.firstName.toLowerCase()}
          <span className="text-accent">.</span>
        </span>
        <div className="flex items-center gap-3 rounded-full bg-chip px-3.5 py-1.5">
          <LiveClock />
          <WeatherChip />
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className={cx(pillInteractive, "size-10 bg-chip")}
        >
          <CloseIcon className="size-5" />
        </button>
      </div>

      <motion.ul
        className="mt-14 flex flex-col gap-1"
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } }}
      >
        {navLinks.map((link, index) => (
          <motion.li key={link.id} variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
            <a
              href={`#${link.id}`}
              onClick={onClose}
              aria-current={active === link.id ? "location" : undefined}
              className="flex items-center gap-4 rounded-full py-2 text-5xl font-extrabold tracking-tight transition-[scale] active:scale-[0.98]"
            >
              <span className="font-mono text-xs font-medium text-muted">0{index + 1}</span>
              <span>{link.label}</span>
              {active === link.id && <span aria-hidden="true" className="size-2.5 rounded-full bg-accent" />}
            </a>
          </motion.li>
        ))}
      </motion.ul>

      <div className="mt-auto flex flex-col gap-6 pt-12">
        <a href="#contact" onClick={onClose} className={cx(btnPrimary, "w-full py-3.5 text-base")}>
          Get in Touch
        </a>
        <ul className="flex flex-wrap gap-2">
          {socials
            .filter((social) => social.external)
            .map((social) => (
              <li key={social.key}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cx(pillInteractive, "bg-chip px-3.5 py-2 text-sm")}
                >
                  <SocialIcon name={social.key} className="size-4" />
                  {social.label}
                </a>
              </li>
            ))}
        </ul>
      </div>
    </motion.div>
  );
}
