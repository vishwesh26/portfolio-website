import { HandNote, Scribble } from "@/components/ui/Doodles";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Typography";
import { ContactForm } from "./ContactForm";

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-white py-28 md:py-36">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <Eyebrow>Contact</Eyebrow>
          <h2
            id="contact-title"
            className="mt-4 text-[clamp(2.4rem,6.5vw,4.25rem)] font-extrabold leading-[1.02] tracking-[-0.035em]"
          >
            Let’s build something <Scribble kind="underline">remarkable</Scribble>.
          </h2>
          <HandNote rotate={-3} className="mt-5 text-2xl text-accent">
            I reply faster than my code compiles ⚡
          </HandNote>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Have a project in mind? I’d love to hear about it. Drop me a message and let’s make something great together.
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
