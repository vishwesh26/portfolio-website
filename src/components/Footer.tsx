import { Squiggle } from "@/components/ui/Doodles";
import { MapPinIcon, SocialIcon } from "@/components/ui/icons";
import { profile, socials } from "@/lib/content";
import { cx, pillInteractive } from "@/lib/styles";
import { VisitorCounter } from "./footer/VisitorCounter";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-black/[0.06] bg-white px-6 py-16">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-7 text-center">
        <div className="flex flex-col items-center">
          <p className="font-script text-5xl font-bold leading-none text-ink">
            {profile.firstName}
            <span className="text-accent">.</span>
          </p>
          <Squiggle className="mt-1 h-3 w-28 text-accent" />
          <p className="mt-3 font-hand text-xl text-muted">say hi anywhere ↓</p>
        </div>

        <ul className="flex flex-wrap justify-center gap-2.5" aria-label="Social links">
          {socials.map((social) => (
            <li key={social.key}>
              <a
                href={social.href}
                {...(social.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                aria-label={
                  social.external ? `${social.label} (opens in a new tab)` : `${social.label} — send me a message`
                }
                className={cx(
                  pillInteractive,
                  "bg-chip px-4 py-2 text-sm text-ink hover:bg-ink hover:text-white hover:shadow-lift",
                )}
              >
                <SocialIcon name={social.key} className="size-4" />
                {social.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="pt-1">
          <VisitorCounter />
        </div>

        <p className="flex items-center gap-1.5 text-sm text-muted">
          <MapPinIcon className="size-4" />
          Based in {profile.location} · {profile.tzLabel} ({profile.utcOffset})
        </p>
        <p className="text-xs text-muted">
          Made with ❤️ &amp; lots of coffee · © {year} {profile.name}
        </p>
      </div>
    </footer>
  );
}
