import { createFileRoute } from "@tanstack/react-router";
import { SectionHeading } from "@/routes/index";
import { Sparkles, Heart, Shield, Sun } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About AstroSatya — Our Vedic Astrology Story & Values" },
      { name: "description", content: "Why AstroSatya exists: classical Jyotish methodology paired with calm, modern design — authentic, private, and crafted with reverence." },
      { property: "og:title", content: "About AstroSatya — Our Vedic Astrology Story & Values" },
      { property: "og:description", content: "Classical Jyotish methodology paired with calm, modern design — authentic, private, and crafted with reverence." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://astrosatyaa.vercel.app/about" },
      { property: "og:site_name", content: "AstroSatya" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "About AstroSatya" },
      { name: "twitter:description", content: "Classical Jyotish methodology paired with calm, modern design." },
    ],
    links: [
      { rel: "canonical", href: "https://astrosatyaa.vercel.app/about" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://astrosatyaa.vercel.app/" },
            { "@type": "ListItem", position: 2, name: "About", item: "https://astrosatyaa.vercel.app/about" },
          ],
        }),
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="bg-ivory">
      <section className="bg-gradient-sky py-24">
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <span className="ornament-divider mx-auto max-w-[220px] text-xs uppercase tracking-[0.3em] text-bronze">Our story</span>
          <h1 className="mt-6 font-display text-5xl leading-[1.05] text-balance sm:text-6xl">
            Ancient wisdom, <em className="not-italic text-[oklch(0.55_0.13_55)]">gently</em> modern.
          </h1>
          <p className="mt-6 text-warmbrown/85 text-lg leading-relaxed">
            AstroSatya was born from a quiet desire — to give Vedic astrology the calm,
            beautiful home it deserves in our daily lives. No noise. No fear. Just truth.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl">Why AstroSatya</h2>
              <p className="mt-4 text-warmbrown/85 leading-relaxed">
                For thousands of years, Jyotish has helped humans understand themselves and the
                cosmos. We honour that lineage by pairing classical methodology with thoughtful
                design — so a kundli feels less like a printout and more like a keepsake.
              </p>
            </div>
            <div>
              <h2 className="font-display text-3xl">What guides us</h2>
              <p className="mt-4 text-warmbrown/85 leading-relaxed">
                Calm over noise. Accuracy over astrologuesswork. Reverence over spectacle.
                Each feature is shaped to feel like a small sanctuary in your day.
              </p>
            </div>
          </div>

          <div className="mt-20">
            <SectionHeading eyebrow="Our values" title="Built with intention" />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Sparkles, t: "Authenticity", d: "Classical Vedic methods, transparently applied." },
                { icon: Heart, t: "Warmth", d: "Guidance that nurtures, never frightens." },
                { icon: Shield, t: "Privacy", d: "Your birth data is sacred. Encrypted, never shared." },
                { icon: Sun, t: "Beauty", d: "Every detail crafted with reverence." },
              ].map((v) => (
                <div key={v.t} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-gold shadow-gold">
                    <v.icon className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <h3 className="mt-4 font-display text-xl">{v.t}</h3>
                  <p className="mt-2 text-sm text-warmbrown/85 leading-relaxed">{v.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}