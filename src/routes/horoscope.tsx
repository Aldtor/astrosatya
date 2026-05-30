import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Sun, Moon, Heart, Briefcase, Sparkles } from "lucide-react";
import { SectionHeading } from "@/routes/index";
import { cn } from "@/lib/utils";
import { computeDaily } from "@/lib/horoscope-engine";

const SIGNS = [
  { name: "Aries", glyph: "♈", dates: "Mar 21 – Apr 19" },
  { name: "Taurus", glyph: "♉", dates: "Apr 20 – May 20" },
  { name: "Gemini", glyph: "♊", dates: "May 21 – Jun 20" },
  { name: "Cancer", glyph: "♋", dates: "Jun 21 – Jul 22" },
  { name: "Leo", glyph: "♌", dates: "Jul 23 – Aug 22" },
  { name: "Virgo", glyph: "♍", dates: "Aug 23 – Sep 22" },
  { name: "Libra", glyph: "♎", dates: "Sep 23 – Oct 22" },
  { name: "Scorpio", glyph: "♏", dates: "Oct 23 – Nov 21" },
  { name: "Sagittarius", glyph: "♐", dates: "Nov 22 – Dec 21" },
  { name: "Capricorn", glyph: "♑", dates: "Dec 22 – Jan 19" },
  { name: "Aquarius", glyph: "♒", dates: "Jan 20 – Feb 18" },
  { name: "Pisces", glyph: "♓", dates: "Feb 19 – Mar 20" },
];

export const Route = createFileRoute("/horoscope")({
  head: () => ({
    meta: [
      { title: "Daily Horoscope Today — Free Vedic Reading for All 12 Signs" },
      { name: "description", content: "Today's free Vedic horoscope for Aries, Taurus, Gemini and every sign — with lucky color, lucky number, compatible sign, mood, love, career, health and spiritual guidance." },
      { property: "og:title", content: "Daily Horoscope Today — Free Vedic Reading for All 12 Signs" },
      { property: "og:description", content: "Free daily Vedic horoscope with lucky color, lucky number, compatible sign and guidance for love, career, health and spirit." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://astrosatya.lovable.app/horoscope" },
      { property: "og:site_name", content: "AstroSatya" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Daily Horoscope Today — Free Vedic Reading" },
      { name: "twitter:description", content: "Lucky color, number, compatible sign and guidance for love, career, health and spirit — every day." },
    ],
    links: [
      { rel: "canonical", href: "https://astrosatya.lovable.app/horoscope" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "AstroSatya Daily Horoscope",
          description: "Personalised Vedic daily horoscope for all 12 zodiac signs with lucky color, number, and compatible sign.",
          applicationCategory: "LifestyleApplication",
          operatingSystem: "Web",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://astrosatya.lovable.app/" },
            { "@type": "ListItem", position: 2, name: "Daily Horoscope", item: "https://astrosatya.lovable.app/horoscope" },
          ],
        }),
      },
    ],
  }),
  component: HoroscopePage,
});

function HoroscopePage() {
  const [sel, setSel] = useState(0);
  const [dateStr, setDateStr] = useState(() => new Date().toISOString().slice(0,10));
  const daily = useMemo(() => computeDaily(new Date(dateStr + "T06:00:00")), [dateStr]);
  const reading = daily.signs[sel];
  const sign = SIGNS[sel];
  return (
    <main className="bg-ivory">
      <section className="bg-gradient-sky py-20">
        <div className="mx-auto max-w-5xl px-5 text-center sm:px-8">
          <span className="ornament-divider mx-auto max-w-[260px] text-xs uppercase tracking-[0.3em] text-bronze">Vedic transits today</span>
          <h1 className="mt-6 font-display text-5xl leading-tight text-balance sm:text-6xl">Daily Horoscope</h1>
          <p className="mt-5 mx-auto max-w-xl text-warmbrown/85 leading-relaxed">
            Computed from today's sidereal positions — the Moon is in <span className="font-medium text-bronze">{daily.moonRashi.split(" ")[0]}</span>, transiting <span className="font-medium text-bronze">{daily.moonNakshatra}</span>.
          </p>
          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-border bg-card px-4 py-2 shadow-soft">
            <label htmlFor="dt" className="text-xs uppercase tracking-wider text-warmbrown/70">Reading for</label>
            <input id="dt" type="date" value={dateStr} onChange={(e) => setDateStr(e.target.value)}
              className="bg-transparent text-sm text-charcoal outline-none" />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12">
            {SIGNS.map((s, i) => (
              <button
                key={s.name}
                onClick={() => setSel(i)}
                className={cn(
                  "rounded-2xl border p-4 text-center transition",
                  sel === i
                    ? "border-gold/70 bg-gradient-to-b from-card to-cream shadow-gold -translate-y-0.5"
                    : "border-border bg-card hover:-translate-y-0.5 shadow-soft",
                )}
              >
                <div className="font-display text-2xl text-saffron">{s.glyph}</div>
                <div className="mt-1 text-xs text-warmbrown">{s.name}</div>
              </button>
            ))}
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-border bg-card p-8 shadow-soft lg:col-span-2">
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-gold font-display text-3xl text-primary-foreground shadow-gold">
                  {sign.glyph}
                </div>
                <div>
                  <h2 className="font-display text-3xl">{sign.name}</h2>
                  <p className="text-sm text-warmbrown/80">{sign.dates}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-bronze">Day score</p>
                  <p className="font-display text-3xl text-charcoal">{reading.score}<span className="text-base text-warmbrown/60">/10</span></p>
                </div>
              </div>
              <div className="ornament-divider my-7" />
              <p className="font-display text-2xl leading-relaxed text-charcoal text-balance">"{reading.headline}"</p>
              <p className="mt-5 text-warmbrown/85 leading-relaxed">{reading.detail}</p>
            </div>

            <div className="space-y-5">
              <Tile icon={Sun} label="Lucky Color" value={reading.luckyColor} />
              <Tile icon={Sparkles} label="Lucky Number" value={String(reading.luckyNumber)} />
              <Tile icon={Heart} label="Compatible Sign" value={reading.compatible} />
              <Tile icon={Moon} label="Mood" value={reading.mood} />
            </div>
          </div>

          <SectionHeading eyebrow="More guidance" title="By area of life" subtitle="Tap into specific themes of your day." />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Heart, title: "Love", text: reading.love },
              { icon: Briefcase, title: "Career", text: reading.career },
              { icon: Sparkles, title: "Health", text: reading.health },
              { icon: Moon, title: "Spiritual", text: reading.spiritual },
            ].map((t) => (
              <div key={t.title} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-gold shadow-gold">
                  <t.icon className="h-4 w-4 text-primary-foreground" />
                </div>
                <h3 className="mt-4 font-display text-xl">{t.title}</h3>
                <p className="mt-2 text-sm text-warmbrown/85 leading-relaxed">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function Tile({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-gold shadow-gold">
        <Icon className="h-4 w-4 text-primary-foreground" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider text-warmbrown/70">{label}</p>
        <p className="font-display text-lg text-charcoal">{value}</p>
      </div>
    </div>
  );
}