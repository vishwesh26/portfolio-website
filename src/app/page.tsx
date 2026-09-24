import { About } from "@/components/about/About";
import { Contact } from "@/components/contact/Contact";
import { EasterEgg } from "@/components/easter/EasterEgg";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/hero/Hero";
import { Navbar } from "@/components/nav/Navbar";
import { Showcase } from "@/components/showcase/Showcase";
import { StoryScroll } from "@/components/story/StoryScroll";
import { Work } from "@/components/work/Work";
import { profile, socials } from "@/lib/content";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: "Full-Stack Developer & UI/UX Designer",
  address: { "@type": "PostalAddress", addressLocality: profile.city, addressCountry: "IN" },
  sameAs: socials.filter((social) => social.external).map((social) => social.href),
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <StoryScroll />
        <Work />
        <Showcase />
        <EasterEgg />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
