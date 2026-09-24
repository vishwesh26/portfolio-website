"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li" | "figure";
};

/** Fade + slide-up the first time content scrolls into view. */
export function Reveal({ children, className, delay = 0, y = 16, as = "div" }: RevealProps) {
  const Component = as === "li" ? motion.li : as === "figure" ? motion.figure : motion.div;
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </Component>
  );
}
