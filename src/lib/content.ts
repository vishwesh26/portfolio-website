/**
 * All portfolio content lives here.
 * Sourced from https://vishweshshinde.vercel.app, github.com/vishwesh26 (repos, READMEs,
 * commit history) and the live project sites. Edit this file to update the site.
 */

export type ImageAsset = { src: string; width: number; height: number; alt: string };
export type Photo = ImageAsset & { caption: string };

export const profile = {
  name: "Vishwesh Shinde",
  firstName: "Vishwesh",
  initials: "VS",
  role: "Full-stack developer & UI/UX designer",
  city: "Pune",
  location: "Pune, India",
  timeZone: "Asia/Kolkata",
  tzLabel: "IST",
  utcOffset: "UTC+5:30",
  coords: { latitude: 18.5204, longitude: 73.8567 },
  resumeUrl:
    "https://drive.google.com/file/d/1Bv6TUvsncV5IU8rJ0sUHNXsljO4327Xd/view?usp=sharing",
  githubUrl: "https://github.com/vishwesh26",
  publicRepos: 16,
  portrait: {
    src: "/images/photos/about_me.jpg",
    width: 768,
    height: 1024,
    alt: "Vishwesh Shinde smiling with his arms crossed, wearing a plaid shirt over a white tee",
  },
  bio: [
    "I’m Vishwesh Shinde, a third-year Electronics and Telecommunication Engineering student from Pune. Alongside academics, I’ve been building hands-on experience through freelance projects and self-driven creative work, shaping my approach towards technology, design, and digital experiences.",
    "I work across web development, UI design, AI-based projects, and cinematic visual experiences, constantly exploring new ways to blend creativity with technology.",
    "I focus on building modern, interactive, and visually engaging experiences that feel smooth, purposeful, and impactful.",
  ],
} as const;

export type SocialKey = "github" | "linkedin" | "x" | "instagram" | "email";
export type Social = { key: SocialKey; label: string; href: string; external: boolean };

export const socials: Social[] = [
  { key: "github", label: "GitHub", href: "https://github.com/vishwesh26", external: true },
  { key: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/vishweshshinde", external: true },
  { key: "x", label: "X / Twitter", href: "https://www.x.com/vishwesh_shinde", external: true },
  { key: "instagram", label: "Instagram", href: "https://www.instagram.com/vishwesh_shinde", external: true },
  // No public email address on the original site — the Email pill opens the contact form.
  { key: "email", label: "Email", href: "#contact", external: false },
];

export const navLinks = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "lab", label: "Lab" },
  { id: "contact", label: "Contact" },
] as const;

export const greetings = ["Hello,", "Namaste,", "Hey,", "Ciao,"] as const;

export const skills = [
  "JavaScript",
  "TypeScript",
  "C++",
  "React",
  "Next.js",
  "Node.js",
  "Express",
  "Tailwind CSS",
  "MongoDB",
  "MySQL",
  "PostgreSQL",
  "Prisma",
  "Docker",
  "Git",
  "GitHub",
  "Postman",
  "Vercel",
] as const;

export type Skill = (typeof skills)[number];

/* ------------------------------------------------------------------ */
/*  About                                                              */
/* ------------------------------------------------------------------ */

/** `**text**` renders as bold ink text. */
export const aboutStory: string[] = [
  "I’m Vishwesh — a third-year **Electronics & Telecommunication Engineering** student from Pune. My first public projects went live in **2024**: a site that builds **college preference lists for JEE & CET** aspirants, and a Spotify clone.",
  "Alongside academics, I’ve been building hands-on experience through **freelance projects** and self-driven creative work — across web development, **UI design**, AI-based projects and cinematic visual experiences.",
  "Today it all comes together in products like **LeetVision** and **PustakEdits**: modern, interactive experiences that feel smooth, purposeful and impactful — constantly exploring new ways to blend creativity with technology.",
];

export const aboutTldr: { emoji: string; text: string }[] = [
  { emoji: "🎓", text: "3rd-year **E&TC Engineering** student based in **Pune, India**." },
  { emoji: "🛠️", text: "Full-stack developer + **UI/UX designer** — React, Next.js, TypeScript, Node.js, Python." },
  { emoji: "🚀", text: "Shipped **LeetVision**, **PustakEdits**, **VAANI** and the **DCPEMS** school website." },
  { emoji: "📷", text: "Off-screen: traveling, books, photography and treks labeled “easy” online." },
];

export type TimelineEntry = { date: string; title: string; body: string; current?: boolean };

export const timeline: TimelineEntry[] = [
  {
    date: "Jul 2024",
    title: "First public projects",
    body: "A college-preference-list generator for JEE & CET aspirants, plus a Spotify-style web player clone.",
  },
  {
    date: "Dec 2025",
    title: "Stark Lab",
    body: "An Iron Man–inspired 3D assembly scene — my playground for 3D on the web.",
  },
  {
    date: "Jan 2026",
    title: "Started building LeetVision",
    body: "A DSA visualizer with interview roadmaps and a Chrome extension for 4 coding platforms.",
  },
  {
    date: "Apr 2026",
    title: "Launched PustakEdits",
    body: "A free, in-browser PDF text editor that grew into a suite of 30+ PDF tools.",
  },
  {
    date: "Jun 2026",
    title: "DCPEMS school website",
    body: "Designed and built the official website for Dr. Cyrus Poonawalla English Medium School.",
  },
  {
    date: "Aug 2026",
    title: "HH Goa 2026 · VAANI",
    body: "A voice-first multilingual RAG engine, built for the shortlisting round (Task 2).",
  },
  {
    date: "Now",
    title: "Studying, freelancing & shipping",
    body: "Third year of E&TC Engineering in Pune — open to freelance projects and collaborations.",
    current: true,
  },
];

/* ------------------------------------------------------------------ */
/*  Photos (Vishwesh's own photography from the "Beyond work" section) */
/* ------------------------------------------------------------------ */

const photo = {
  easyTrek: {
    src: "/images/photos/easy_trek.jpg",
    width: 768,
    height: 1024,
    alt: "Vishwesh resting on the grass on a mountain ridge with the Himalayas in the background",
  },
  armsWideOpen: {
    src: "/images/photos/arms_wide_open.png",
    width: 384,
    height: 216,
    alt: "Vishwesh standing in a green meadow with his arms spread wide, looking up at the sky",
  },
  puppy: {
    src: "/images/photos/puppy.png",
    width: 384,
    height: 831,
    alt: "A cute brown puppy sitting on the sand by the water",
  },
  boat: {
    src: "/images/photos/boat_canoe.jpg",
    width: 768,
    height: 1024,
    alt: "Vishwesh smiling while sitting in a blue boat in backwaters surrounded by palm trees",
  },
  jeep: {
    src: "/images/photos/beyond_v2_3.webp",
    width: 385,
    height: 513,
    alt: "A red open-top jeep parked on a cobblestone street at night",
  },
  mural: {
    src: "/images/photos/beyond_v2_4.webp",
    width: 641,
    height: 854,
    alt: "A colourful Kathakali mural painted on a wall above wooden panelling",
  },
  palms: {
    src: "/images/photos/beyond_v2_5.webp",
    width: 385,
    height: 513,
    alt: "A dirt road lined with tall coconut palms under a cloudy sky",
  },
  river: {
    src: "/images/photos/beyond_v2_6.webp",
    width: 385,
    height: 513,
    alt: "A calm river winding between large granite boulders",
  },
  temple: {
    src: "/images/photos/beyond_v2_7.webp",
    width: 641,
    height: 1139,
    alt: "A towering, ornately carved temple gopuram rising above an old stone wall",
  },
  lake: {
    src: "/images/photos/beyond_v2_9.webp",
    width: 641,
    height: 361,
    alt: "A lake at sunset with golden light over dark wooded hills",
  },
  aboutMe: {
    src: "/images/photos/about_me.jpg",
    width: 768,
    height: 1024,
    alt: "Vishwesh Shinde smiling with arms crossed against a mountain view",
  },
} satisfies Record<string, ImageAsset>;

export const aboutPolaroids: Photo[] = [
  { ...photo.easyTrek, caption: "“easy” trek, they said" },
  { ...photo.armsWideOpen, caption: "arms wide open" },
  { ...photo.puppy, caption: "made a friend" },
  { ...photo.boat, caption: "backwaters, drifting" },
];

export const gallery: Photo[] = [
  { ...photo.easyTrek, caption: "“easy” trek, they said" },
  { ...photo.lake, caption: "golden hour" },
  { ...photo.temple, caption: "old stones" },
  { ...photo.armsWideOpen, caption: "arms wide open" },
  { ...photo.puppy, caption: "made a friend" },
  { ...photo.river, caption: "boulder country" },
  { ...photo.jeep, caption: "red jeep, good light" },
  { ...photo.palms, caption: "the long way round" },
  { ...photo.mural, caption: "wall art" },
  { ...photo.boat, caption: "backwaters, drifting" },
  { ...photo.aboutMe, caption: "somewhere in the hills" },
];

/* The retro monitor prints one of these at random. Quotes are from Vishwesh's "How I work" section. */
export type Printable =
  | ({ kind: "photo" } & Photo)
  | { kind: "quote"; text: string; source: string };

export const printables: Printable[] = [
  { kind: "photo", ...photo.jeep, caption: "red jeep, good light" },
  { kind: "quote", text: "Every interaction is intentional, every pixel justified.", source: "step 02 · design" },
  { kind: "photo", ...photo.palms, caption: "the long way round" },
  { kind: "quote", text: "Deep-dive into the problem before writing a single line of code.", source: "step 01 · discover" },
  { kind: "photo", ...photo.river, caption: "boulder country" },
  { kind: "quote", text: "Launch with confidence — then iterate fast.", source: "step 04 · ship" },
  { kind: "quote", text: "Clean, scalable code — with obsessive attention to the details.", source: "step 03 · build" },
  { kind: "quote", text: "Coffee consumed: ∞", source: "a very real stat" },
];

/* ------------------------------------------------------------------ */
/*  Work                                                              */
/* ------------------------------------------------------------------ */

export type TerminalLine = { kind: "cmd" | "out" | "dim" | "accent"; text: string };
export type Badge = { label: string; tone: "achievement" | "featured" };

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  dates: string;
  description: string;
  stack: string[];
  domain: string;
  live: string;
  repo: string;
  logo: { src: string } | { monogram: string };
  cover?: ImageAsset & { crop: string };
  pipeline?: string[];
  badges: Badge[];
  outcomes?: string[];
  underTheHood?: string;
  terminal: { title: string; lines: TerminalLine[] };
};

export const projects: Project[] = [
  {
    slug: "leetvision",
    title: "LeetVision",
    tagline: "Code interviews, explained — visually.",
    dates: "Jan 2026 — Present",
    description:
      "A LeetCode helper and visualizer for mastering data structures & algorithms: step-by-step visual solutions, structured interview roadmaps and company-wise problem sets. A companion Chrome extension surfaces instant DSA insights and related problems right where you practice.",
    stack: ["React", "Vite", "Express", "MongoDB", "Gemini API", "D3", "Three.js", "Chrome MV3"],
    domain: "leet-vision.com",
    live: "https://leet-vision.com",
    repo: "https://github.com/vishwesh26/leet-vision",
    logo: { src: "/images/logos/leetvision.svg" },
    cover: {
      src: "/images/photos/leet-vision.png",
      width: 1881,
      height: 907,
      alt: "LeetVision homepage: “Get access to hundreds of coding solutions available” on a dark background",
      crop: "50% 50%",
    },
    badges: [
      { label: "Featured project", tone: "featured" },
      { label: "Chrome extension shipped", tone: "achievement" },
    ],
    terminal: {
      title: "leet-vision/extension/manifest.json",
      lines: [
        { kind: "out", text: "{" },
        { kind: "out", text: '  "manifest_version": 3,' },
        { kind: "accent", text: '  "name": "LeetVision - Universal Problem Intelligence",' },
        { kind: "out", text: '  "host_permissions": [' },
        { kind: "dim", text: '    "https://leetcode.com/*",' },
        { kind: "dim", text: '    "https://www.hackerrank.com/*",' },
        { kind: "dim", text: '    "https://www.geeksforgeeks.org/*",' },
        { kind: "dim", text: '    "https://www.codechef.com/*"' },
        { kind: "out", text: "  ]" },
        { kind: "out", text: "}" },
      ],
    },
  },
  {
    slug: "pustakedits",
    title: "PustakEdits",
    tagline: "Edit the actual text inside a PDF — right in your browser.",
    dates: "Apr 2026 — Present",
    description:
      "A 100% free, browser-based PDF text editor with zero watermarks. Instead of painting white boxes over old text, it rewrites the real text layer while preserving the original fonts and formatting — and it has grown into a full suite of PDF tools.",
    stack: ["Next.js", "TypeScript", "Tailwind", "Zustand", "PDF.js", "FastAPI", "PyMuPDF", "Supabase"],
    domain: "pustakedits.tech",
    live: "https://pustakedits.tech",
    repo: "https://github.com/vishwesh26/pdf-editor",
    logo: { monogram: "PE" },
    cover: {
      src: "/images/photos/pustakedits.png",
      width: 1900,
      height: 908,
      alt: "PustakEdits homepage: “Edit existing PDF text instantly in your browser”",
      crop: "50% 50%",
    },
    badges: [
      { label: "30+ PDF tools", tone: "achievement" },
      { label: "Free · no watermarks", tone: "featured" },
    ],
    outcomes: [
      "Shipped 30+ PDF tools in a single suite",
      "True object-level edits — output stays selectable & searchable",
      "Bot-protected sign-ups & uploads with Cloudflare Turnstile + email OTP",
    ],
    underTheHood:
      "Most web PDF editors just overlay white rectangles and new text. PustakEdits extracts text blocks and coordinates, renders transparent editable layers over a PDF.js canvas, then uses PyMuPDF on the backend to redact the original span and insert the new text at the exact same spot with matching font properties.",
    terminal: {
      title: "~/pdf-editor",
      lines: [
        { kind: "cmd", text: "git log --format=%s -4" },
        { kind: "out", text: "feat: show all 30+ tools on homepage, streamline navbar…" },
        { kind: "out", text: "perf: accelerate PDF processing engines, add email OTP…" },
        { kind: "out", text: "fix(turnstile): enable auto-retry, retry interval…" },
        { kind: "out", text: "fix(cors): add pustakedits.tech and regex support…" },
        { kind: "cmd", text: "uvicorn main:app --reload" },
        { kind: "accent", text: "INFO: Uvicorn running on http://127.0.0.1:8000" },
      ],
    },
  },
  {
    slug: "vaani",
    title: "VAANI",
    tagline: "A voice-first, multilingual RAG engine for Indian languages.",
    dates: "Aug 2026",
    description:
      "Built for the HH Goa 2026 shortlisting round: a voice-enabled retrieval-augmented generation engine that understands English, Hindi, Marathi and code-mixed speech like Hinglish — and answers in the user’s spoken language, grounded strictly in the dataset.",
    stack: ["FastAPI", "Qdrant", "BM25", "Sarvam AI", "Gemini", "React", "Vite", "Tailwind"],
    domain: "kineticai-hhgoa.vercel.app",
    live: "https://kineticai-hhgoa.vercel.app",
    repo: "https://github.com/vishwesh26/hhgoa-2",
    logo: { monogram: "VA" },
    pipeline: ["Voice", "Sarvam STT", "Query understanding", "Qdrant ‖ BM25", "RRF fusion", "Grounded answer"],
    badges: [
      { label: "Sub-200ms latency budget", tone: "achievement" },
      { label: "HH Goa 2026 · Task 2", tone: "featured" },
    ],
    outcomes: [
      "Enforced a sub-200ms latency budget, verified with a benchmark harness",
      "Fits in 512MB RAM after switching to a 60MB ONNX embedding model",
      "Freed 2.1GB by pruning legacy Qdrant collections",
    ],
    terminal: {
      title: "~/hhgoa-2 — perf commits",
      lines: [
        { kind: "cmd", text: "git log --format=%s | grep ^perf" },
        { kind: "out", text: "perf(embed): switch to 60MB all-MiniLM-L6-v2 ONNX model…" },
        { kind: "out", text: "perf(memory): lazy-load vector & BM25 searchers on demand…" },
        { kind: "out", text: "perf(render): pre-download FastEmbed model during build…" },
        { kind: "out", text: "perf(memory): remove legacy Qdrant collections (2.1GB)…" },
        { kind: "dim", text: "…" },
      ],
    },
  },
  {
    slug: "dcpems",
    title: "DCPEMS School Website",
    tagline: "The official website for Dr. Cyrus Poonawalla English Medium School.",
    dates: "Jun 2026",
    description:
      "A fast, responsive React site for a school in Pune district, covering admissions, academics, activities, the gallery and mandatory disclosures — live today on the school’s own domain.",
    stack: ["React 19", "Vite", "Tailwind CSS", "Framer Motion", "React Router", "React Hook Form"],
    domain: "dcpems.com",
    live: "https://dcpems.com",
    repo: "https://github.com/vishwesh26/school-dcpems",
    logo: { monogram: "DC" },
    cover: {
      src: "/images/photos/dcpems_school.jpg",
      width: 1920,
      height: 1080,
      alt: "DCPEMS school website homepage showing the school building with admissions and contact cards",
      crop: "50% 50%",
    },
    badges: [
      { label: "Live in production", tone: "featured" },
      { label: "On its own domain", tone: "achievement" },
    ],
    terminal: {
      title: "school-dcpems/package.json",
      lines: [
        { kind: "out", text: '"dependencies": {' },
        { kind: "dim", text: '  "framer-motion": "^12.23.26",' },
        { kind: "dim", text: '  "react": "^19.2.0",' },
        { kind: "dim", text: '  "react-hook-form": "^7.69.0",' },
        { kind: "dim", text: '  "react-router-dom": "^7.11.0",' },
        { kind: "dim", text: "  …" },
        { kind: "out", text: "}," },
        { kind: "accent", text: '"devDependencies": { "vite": "^7.2.4", … }' },
      ],
    },
  },
];

/* ------------------------------------------------------------------ */
/*  Lab — other real experiments from GitHub                          */
/* ------------------------------------------------------------------ */

export type Language = "TypeScript" | "JavaScript" | "HTML" | "Python";

export const languageColors: Record<Language, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  HTML: "#e34c26",
  Python: "#3572a5",
};

export type LabItem = {
  title: string;
  repo: string;
  year: string;
  description: string;
  language: Language;
  live: string;
  code: string;
};

export const labItems: LabItem[] = [
  {
    title: "OBS Web Stream Deck",
    repo: "strem-deck",
    year: "2026",
    description:
      "A hardware-grade, customizable Stream Deck for OBS Studio that runs in the browser — OBS v5 integration, true square buttons and a QR scanner for pairing.",
    language: "TypeScript",
    live: "https://strem-deck.vercel.app",
    code: "https://github.com/vishwesh26/strem-deck",
  },
  {
    title: "Multiplayer Texas Hold’em",
    repo: "poker-game",
    year: "2026",
    description: "Real-time online poker built with Next.js and Socket.IO — now with AI bots at the table.",
    language: "TypeScript",
    live: "https://poker-khelenge.vercel.app",
    code: "https://github.com/vishwesh26/poker-game",
  },
  {
    title: "Stark Lab",
    repo: "Iron_man_lab",
    year: "2025",
    description: "An Iron Man–inspired 3D assembly scene, built to play with 3D in the browser.",
    language: "HTML",
    live: "https://vishwesh26.github.io/Iron_man_lab/",
    code: "https://github.com/vishwesh26/Iron_man_lab",
  },
  {
    title: "College Preference List",
    repo: "vishwesh26.github.io",
    year: "2024",
    description: "Generates a college preference list for JEE and CET aspirants.",
    language: "JavaScript",
    live: "https://vishwesh26.github.io/",
    code: "https://github.com/vishwesh26/vishwesh26.github.io",
  },
  {
    title: "Spotify Clone",
    repo: "spotify-clone",
    year: "2024",
    description: "A Spotify-style web player clone — one of my very first projects.",
    language: "JavaScript",
    live: "https://vishwesh26.github.io/spotify-clone/",
    code: "https://github.com/vishwesh26/spotify-clone",
  },
];

/* ------------------------------------------------------------------ */
/*  Easter egg — fortunes for the tilt terminal                        */
/* ------------------------------------------------------------------ */

export type Fortune =
  | { kind: "commit"; text: string; source: string }
  | { kind: "joke"; text: string }
  | { kind: "quote"; text: string; source: string };

/** Commit messages are real, unedited, from github.com/vishwesh26. */
export const fortunes: Fortune[] = [
  { kind: "commit", text: "fix: all game issues resolved", source: "poker-game" },
  { kind: "commit", text: "fix: all game issues resolved and new features", source: "poker-game · the very next commit" },
  { kind: "joke", text: "Why do programmers prefer dark mode? Because light attracts bugs." },
  { kind: "commit", text: "fix: ignore eslint and ts errors during vercel build", source: "poker-game" },
  { kind: "commit", text: "fix: resolve all ESLint build errors for Vercel deployment", source: "poker-game · character development" },
  { kind: "quote", text: "There are only two hard things in Computer Science: cache invalidation and naming things.", source: "Phil Karlton" },
  { kind: "joke", text: "A SQL query walks into a bar, walks up to two tables and asks: “Can I join you?”" },
  { kind: "commit", text: "fix(startup): remove background warmup to keep RAM under 50MB and prevent OOM kill loop on Render", source: "hhgoa-2" },
  { kind: "quote", text: "Simplicity is prerequisite for reliability.", source: "Edsger W. Dijkstra" },
  { kind: "joke", text: "99 little bugs in the code. Take one down, patch it around… 127 little bugs in the code." },
  { kind: "commit", text: "chore: re-trigger vercel deployment", source: "pdf-editor" },
  { kind: "quote", text: "First, solve the problem. Then, write the code.", source: "John Johnson" },
  { kind: "joke", text: "“It works on my machine.” “Great — then we’ll ship your machine.”" },
  { kind: "commit", text: "update", source: "poker-game · a masterpiece of brevity" },
  { kind: "quote", text: "Talk is cheap. Show me the code.", source: "Linus Torvalds" },
  { kind: "joke", text: "There are 10 types of people: those who understand binary and those who don’t." },
  { kind: "quote", text: "Programs must be written for people to read, and only incidentally for machines to execute.", source: "Harold Abelson" },
];

/* ------------------------------------------------------------------ */
/*  Contact                                                            */
/* ------------------------------------------------------------------ */

export const contactReasons = [
  "Freelance Project",
  "Collaboration",
  "Job Opportunity",
  "Just saying hello",
  "Other",
] as const;

export type ContactReason = (typeof contactReasons)[number];
