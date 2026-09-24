"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

/** SSR-safe media query hook (returns `serverFallback` during SSR + hydration). */
export function useMediaQuery(query: string, serverFallback = false): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverFallback,
  );
}

/** True only for desktop-class devices with a precise, hover-capable pointer. */
export function useFinePointer(): boolean {
  return useMediaQuery("(hover: hover) and (pointer: fine) and (min-width: 768px)");
}

/**
 * Scroll-spy: returns the id of the section currently crossing a thin band
 * in the upper-middle of the viewport (or null when none do).
 */
export function useScrollSpy(ids: readonly string[], rootMargin = "-38% 0px -58% 0px"): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const visible = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) visible.set(entry.target.id, entry.isIntersecting);
        setActive(ids.find((id) => visible.get(id)) ?? null);
      },
      { rootMargin, threshold: 0 },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids, rootMargin]);

  return active;
}

/**
 * Watches every `[data-nav-theme="dark"]` element with an IntersectionObserver whose
 * root is shrunk to a 2px band at the navbar's vertical centre. When any dark
 * element sits under the navbar, returns true.
 */
export function useDarkBehindNav(probeY = 42): boolean {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    const hits = new Set<Element>();

    const setup = () => {
      observer?.disconnect();
      hits.clear();
      const viewport = window.innerHeight;
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) hits.add(entry.target);
            else hits.delete(entry.target);
          }
          setDark(hits.size > 0);
        },
        { rootMargin: `-${probeY}px 0px -${Math.max(0, viewport - probeY - 2)}px 0px`, threshold: 0 },
      );
      document.querySelectorAll('[data-nav-theme="dark"]').forEach((el) => observer?.observe(el));
    };

    setup();
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(setup);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      observer?.disconnect();
    };
  }, [probeY]);

  return dark;
}
