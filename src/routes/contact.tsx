import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageCircle, MapPin } from "lucide-react";
import { useId } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact AstroSatya — Talk to a Vedic Astrologer" },
      { name: "description", content: "Email hello@astrosatya.com or message us Mon–Sat, 9:00–19:00 IST. Studios in Varanasi and Bengaluru — we reply mindfully to every note." },
      { property: "og:title", content: "Contact AstroSatya — Talk to a Vedic Astrologer" },
      { property: "og:description", content: "Email, message, or visit our studios in Varanasi and Bengaluru — we respond with the calm we bring to every reading." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://astrosatya.lovable.app/contact" },
      { property: "og:site_name", content: "AstroSatya" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Contact AstroSatya" },
      { name: "twitter:description", content: "Email hello@astrosatya.com or message us Mon–Sat, 9:00–19:00 IST." },
    ],
    links: [
      { rel: "canonical", href: "https://astrosatya.lovable.app/contact" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://astrosatya.lovable.app/" },
            { "@type": "ListItem", position: 2, name: "Contact", item: "https://astrosatya.lovable.app/contact" },
          ],
        }),
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <main className="bg-ivory">
      <section className="bg-gradient-sky py-24">
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <span className="ornament-divider mx-auto max-w-[220px] text-xs uppercase tracking-[0.3em] text-bronze">Namaste</span>
          <h1 className="mt-6 font-display text-5xl leading-tight text-balance sm:text-6xl">We'd love to hear from you</h1>
          <p className="mt-5 text-warmbrown/85 leading-relaxed">
            Questions, feedback, partnerships — write to us and we'll respond mindfully.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-5">
            <div className="lg:col-span-2 space-y-5">
              {[
                { icon: Mail, t: "Email", d: "hello@astrosatya.com" },
                { icon: MessageCircle, t: "Support", d: "Mon – Sat · 9:00 – 19:00 IST" },
                { icon: MapPin, t: "Studio", d: "Varanasi · Bengaluru · Online" },
              ].map((c) => (
                <div key={c.t} className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-gold shadow-gold">
                    <c.icon className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-warmbrown/70">{c.t}</p>
                    <p className="font-display text-lg text-charcoal">{c.d}</p>
                  </div>
                </div>
              ))}
            </div>

            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}

function ContactForm() {
  const nameId = useId();
  const emailId = useId();
  const subjectId = useId();
  const messageId = useId();
  return (
    <form
              onSubmit={(e) => e.preventDefault()}
              className="rounded-3xl border border-border bg-card p-8 shadow-lift lg:col-span-3"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor={nameId} className="mb-2 block text-xs uppercase tracking-wider text-warmbrown/80">Name</Label>
                  <Input id={nameId} placeholder="Your name" />
                </div>
                <div>
                  <Label htmlFor={emailId} className="mb-2 block text-xs uppercase tracking-wider text-warmbrown/80">Email</Label>
                  <Input id={emailId} type="email" placeholder="you@email.com" />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor={subjectId} className="mb-2 block text-xs uppercase tracking-wider text-warmbrown/80">Subject</Label>
                  <Input id={subjectId} placeholder="How can we help?" />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor={messageId} className="mb-2 block text-xs uppercase tracking-wider text-warmbrown/80">Message</Label>
                  <Textarea id={messageId} rows={5} placeholder="Tell us a little more…" />
                </div>
              </div>
              <Button type="submit" size="lg" className="mt-7 w-full bg-gradient-gold text-primary-foreground shadow-gold hover:opacity-95">
                Send message
              </Button>
    </form>
  );
}