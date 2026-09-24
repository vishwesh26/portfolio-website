import type { Metadata, Viewport } from "next";
import { Caveat, Geist, Geist_Mono, Gochi_Hand } from "next/font/google";
import type { ReactNode } from "react";
import { MotionProvider } from "@/components/MotionProvider";
import { profile } from "@/lib/content";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });
// Two handwriting faces: Caveat for flowing script/captions, Gochi Hand for scrawled margin notes.
const caveat = Caveat({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-caveat", display: "swap" });
const gochi = Gochi_Hand({ subsets: ["latin"], weight: "400", variable: "--font-gochi", display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vishweshshinde.vercel.app";
const description =
  "Vishwesh Shinde — full-stack developer & UI/UX designer from Pune, India. Builder of LeetVision, PustakEdits and VAANI. Third-year E&TC engineering student crafting smooth, purposeful digital experiences.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} — Full-Stack Developer & UI/UX Designer`,
    template: `%s · ${profile.name}`,
  },
  description,
  keywords: ["Vishwesh Shinde", "portfolio", "full-stack developer", "UI/UX designer", "Next.js", "React", "Pune"],
  authors: [{ name: profile.name, url: profile.githubUrl }],
  openGraph: {
    type: "website",
    url: siteUrl,
    title: `${profile.name} — Full-Stack Developer & UI/UX Designer`,
    description,
    siteName: profile.name,
    images: [{ url: profile.portrait.src, width: profile.portrait.width, height: profile.portrait.height, alt: profile.portrait.alt }],
  },
  twitter: {
    card: "summary",
    creator: "@vishwesh_shinde",
    title: `${profile.name} — Portfolio`,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} ${caveat.variable} ${gochi.variable}`}
    >
      <body className="bg-white font-sans text-ink antialiased">
        <a
          href="#main"
          className="sr-only rounded-full bg-ink px-4 py-2 text-sm font-medium text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]"
        >
          Skip to content
        </a>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
