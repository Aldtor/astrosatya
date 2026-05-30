import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sparkles, ArrowRight, Check, Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  LotusIcon, SuryaIcon, MilanIcon, DashaIcon, RakshaIcon, GranthIcon,
  MandalaIcon, ZodiacGlyph,
} from "@/components/site/SacredIcons";
import zodiacWheel from "@/assets/zodiac-wheel.png";
import heroBg from "@/assets/hero-bg.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AstroSatya — Discover Your Cosmic Truth" },
      { name: "description", content: "Premium Vedic astrology platform. Free kundli, daily horoscope, matchmaking, and spiritual guidance designed for modern life." },
      { property: "og:title", content: "AstroSatya — Discover Your Cosmic Truth" },
      { property: "og:description", content: "Ancient Vedic wisdom, thoughtfully designed for modern life." },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            { "@type": "Question", name: "Is the kundli generation free?", acceptedAnswer: { "@type": "Answer", text: "Yes — kundli generation is completely free for everyone, with detailed planetary positions, Dasha analysis, and dosha insights." } },
            { "@type": "Question", name: "Which astrology tradition do you follow?", acceptedAnswer: { "@type": "Answer", text: "Vedic (Jyotish) — sidereal zodiac with Lahiri ayanamsa, using classical North Indian chart conventions." } },
            { "@type": "Question", name: "Is my birth data private?", acceptedAnswer: { "@type": "Answer", text: "Always. Your details are encrypted and never shared. You may delete your data at any time." } },
            { "@type": "Question", name: "Can I talk to a real astrologer?", acceptedAnswer: { "@type": "Answer", text: "Yes — we offer personal consultations with vetted Vedic astrologers through our contact page." } },
          ],
        }),
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <HowItWorks />
      <HoroscopePreview />
      <KundliPreview />
      <Testimonials />
      <FAQ />
    </main>
  );
}

/* ---------------- Hero ---------------- */
function Hero() {
  return (
    <section className="relative overflow-hidden paper-grain">
      <div
        className="absolute inset-0 -z-10 bg-gradient-sky"
        style={{
          backgroundImage: `linear-gradient(180deg, oklch(0.97 0.018 85 / 0.85), oklch(0.94 0.05 75 / 0.6)), url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Soft floating golden particles */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {[...Array(14)].map((_, i) => (
          <span
            key={i}
            className="absolute block rounded-full bg-[oklch(0.82_0.12_70)] opacity-40 animate-floaty"
            style={{
              left: `${(i * 73) % 100}%`,
              top: `${(i * 41) % 100}%`,
              width: `${4 + (i % 4) * 2}px`,
              height: `${4 + (i % 4) * 2}px`,
              animationDelay: `${i * 0.6}s`,
              animationDuration: `${6 + (i % 5)}s`,
              filter: "blur(1px)",
            }}
          />
        ))}
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 md:py-28 lg:grid-cols-2 lg:py-32">
        <div className="animate-rise">
          <span className="ornament-divider mb-6 max-w-xs text-xs uppercase tracking-[0.3em] text-bronze">
            Vedic · Since the stars
          </span>
          <h1 className="font-display text-5xl leading-[1.05] tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Discover Your <em className="not-italic ink-underline text-[oklch(0.55_0.13_55)]">Cosmic</em> Truth
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-warmbrown">
            Ancient Vedic wisdom thoughtfully designed for modern life. Explore your
            kundli, daily guidance, compatibility, and spiritual insights — in one
            calm, beautiful space.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-gradient-gold text-primary-foreground shadow-gold hover:opacity-95 hover:-translate-y-0.5 transition">
              <Link to="/kundli">
                Generate Kundli <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-bronze/40 text-warmbrown hover:bg-cream">
              <Link to="/horoscope">Explore Horoscope</Link>
            </Button>
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[520px]">
          <div className="absolute inset-0 animate-slow-spin">
            <img
              src={zodiacWheel}
              alt="Ornate zodiac wheel"
              width={1024}
              height={1024}
              className="h-full w-full object-contain"
            />
          </div>
          {/* Inner glow */}
          <div className="absolute inset-[18%] rounded-full bg-[radial-gradient(closest-side,oklch(0.92_0.1_75/0.5),transparent)] animate-shimmer" />
          <div className="absolute inset-[40%] rounded-full border border-bronze/30" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <Sparkles className="mx-auto h-5 w-5 text-saffron" />
            <p className="mt-1 font-display text-sm text-warmbrown">Aaj ka Tara</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Features ---------------- */
const FEATURES = [
  { icon: LotusIcon,  title: "Kundli Generator", desc: "Precise Vedic birth chart with detailed planetary positions and houses." },
  { icon: SuryaIcon,  title: "Daily Horoscope", desc: "Personalised guidance for love, career, health and well-being." },
  { icon: MilanIcon,  title: "Matchmaking",     desc: "36-guna Ashtakoot compatibility — emotional, spiritual and karmic." },
  { icon: DashaIcon,  title: "Dasha Timeline",  desc: "Your Vimshottari Dasha periods, beautifully visualised across years." },
  { icon: RakshaIcon, title: "Dosha Analysis",  desc: "Mangal, Kaal Sarp & Sade Sati insights with calm remedies." },
  { icon: GranthIcon, title: "Saved Reports",   desc: "Your charts, predictions and journals — gently archived." },
];

function Features() {
  return (
    <section className="bg-cream/40 py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow="Features" title="Everything for your cosmic journey" subtitle="A complete spiritual toolkit, designed with the calm of a sanctuary." />
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-7 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift paper-grain"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="relative grid h-14 w-14 place-items-center rounded-2xl border border-bronze/30 bg-ivory text-bronze">
                <f.icon size={30} />
                <span className="absolute -right-1 -top-1 h-2 w-2 rotate-45 bg-gradient-gold" aria-hidden />
              </div>
              <h3 className="mt-6 font-display text-2xl text-charcoal">{f.title}</h3>
              <p className="mt-2 text-warmbrown/85 leading-relaxed">{f.desc}</p>
              <ArrowRight className="absolute right-6 top-7 h-5 w-5 text-gold opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- How It Works ---------------- */
const STEPS = [
  { n: "01", title: "Enter Birth Details", desc: "Share your date, time and place of birth." },
  { n: "02", title: "Generate Kundli", desc: "We craft your Vedic chart in seconds." },
  { n: "03", title: "Explore Predictions", desc: "Career, love, health, finance and beyond." },
  { n: "04", title: "Track Daily Guidance", desc: "Receive gentle insights, every morning." },
];

function HowItWorks() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow="How it works" title="A path as gentle as starlight" />
        <div className="relative mt-16 grid gap-6 md:grid-cols-4">
          <div className="pointer-events-none absolute left-0 right-0 top-12 hidden h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent md:block" />
          {STEPS.map((s) => (
            <div key={s.n} className="relative rounded-2xl border border-border bg-card p-7 text-center shadow-soft">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-gold/40 bg-ivory font-display text-gold">
                {s.n}
              </div>
              <h3 className="mt-5 font-display text-xl">{s.title}</h3>
              <p className="mt-2 text-sm text-warmbrown/80 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------- Horoscope Preview --------------- */
const SIGNS = [
  ["Aries", "♈"], ["Taurus", "♉"], ["Gemini", "♊"], ["Cancer", "♋"],
  ["Leo", "♌"], ["Virgo", "♍"], ["Libra", "♎"], ["Scorpio", "♏"],
  ["Sagittarius", "♐"], ["Capricorn", "♑"], ["Aquarius", "♒"], ["Pisces", "♓"],
] as const;

function HoroscopePreview() {
  return (
    <section className="bg-cream/40 py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow="Today's reading" title="A whisper from the cosmos" />
        <div className="mt-12 grid gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {SIGNS.map(([name]) => (
            <Link
              key={name}
              to="/horoscope"
              className="group flex flex-col items-center rounded-2xl border border-border bg-card p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-lift"
            >
              <span className="text-bronze transition-transform group-hover:scale-110">
                <ZodiacGlyph sign={name} size={34} />
              </span>
              <span className="mt-2 text-sm text-warmbrown">{name}</span>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button asChild variant="outline" className="border-bronze/40 text-warmbrown hover:bg-cream">
            <Link to="/horoscope">Read today's horoscope <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

/* --------------- Kundli Preview --------------- */
function KundliPreview() {
  return (
    <section className="py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
        <div className="order-2 lg:order-1">
          <span className="ornament-divider mb-6 max-w-[180px] text-xs uppercase tracking-[0.3em] text-bronze">Janma Kundli</span>
          <h2 className="font-display text-4xl leading-tight text-balance sm:text-5xl">
            Your birth chart, painted with intention.
          </h2>
          <p className="mt-5 max-w-lg text-warmbrown/85 leading-relaxed">
            Generated with classical Vedic methodology — North Indian style, planetary
            degrees, nakshatras, and Vimshottari Dasha periods. Beautiful enough to keep,
            insightful enough to live by.
          </p>
          <ul className="mt-7 space-y-3">
            {["North & South Indian charts", "Detailed planetary degrees", "Vimshottari Dasha with timeline", "Dosha & remedy guidance"].map((l) => (
              <li key={l} className="flex items-start gap-3 text-warmbrown">
                <span className="mt-1 grid h-5 w-5 place-items-center rounded-full bg-gradient-gold">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </span>
                {l}
              </li>
            ))}
          </ul>
          <Button asChild className="mt-8 bg-gradient-gold text-primary-foreground shadow-gold hover:opacity-95">
            <Link to="/kundli">Generate my Kundli <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="order-1 lg:order-2">
          <NorthIndianChart />
        </div>
      </div>
    </section>
  );
}

export function NorthIndianChart() {
  // 12 houses, diamond layout (North Indian)
  const houseLabels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  return (
    <div className="mx-auto aspect-square w-full max-w-[460px] rounded-3xl border border-border bg-card p-6 shadow-lift">
      <svg viewBox="0 0 400 400" className="h-full w-full">
        <defs>
          <linearGradient id="goldLine" x1="0" x2="1">
            <stop offset="0%" stopColor="oklch(0.78 0.12 75)" />
            <stop offset="100%" stopColor="oklch(0.62 0.1 55)" />
          </linearGradient>
        </defs>
        <g fill="none" stroke="url(#goldLine)" strokeWidth="1.4">
          <rect x="20" y="20" width="360" height="360" rx="6" />
          <line x1="20" y1="20" x2="380" y2="380" />
          <line x1="380" y1="20" x2="20" y2="380" />
          <line x1="20" y1="200" x2="200" y2="20" />
          <line x1="200" y1="20" x2="380" y2="200" />
          <line x1="380" y1="200" x2="200" y2="380" />
          <line x1="200" y1="380" x2="20" y2="200" />
        </g>
        {/* House numbers */}
        {[
          [200, 110], [110, 60], [60, 110], [110, 200],
          [60, 290], [110, 340], [200, 290], [290, 340],
          [340, 290], [290, 200], [340, 110], [290, 60],
        ].map(([x, y], i) => (
          <text key={i} x={x} y={y} textAnchor="middle" className="fill-[oklch(0.55_0.06_55)] font-display" fontSize="14">
            {houseLabels[i]}
          </text>
        ))}
        {/* Planet glyphs */}
        <text x="200" y="135" textAnchor="middle" fontSize="16" className="fill-saffron font-display">Su</text>
        <text x="110" y="220" textAnchor="middle" fontSize="16" className="fill-saffron font-display">Mo</text>
        <text x="290" y="220" textAnchor="middle" fontSize="16" className="fill-saffron font-display">Ve</text>
        <text x="200" y="310" textAnchor="middle" fontSize="16" className="fill-saffron font-display">Ju</text>
      </svg>
    </div>
  );
}

/* --------------- Testimonials --------------- */
import aanyaPic from "@/assets/testimonial-aanya.jpg";
import vikramPic from "@/assets/testimonial-vikram.jpg";
import miraPic from "@/assets/testimonial-mira.jpg";

const TESTIMONIALS = [
  { name: "Aanya R.", role: "Bengaluru", avatar: aanyaPic, text: "AstroSatya feels less like an app and more like a quiet morning ritual. The daily guidance has gently changed my routines." },
  { name: "Vikram S.", role: "Mumbai", avatar: vikramPic, text: "The kundli is exquisitely presented. I've used many sites — this is the first one I'd actually save and return to." },
  { name: "Mira K.", role: "Pune", avatar: miraPic, text: "Matchmaking gave us a thoughtful, modern reading without losing the wisdom. We loved every page." },
];

function Testimonials() {
  return (
    <section className="bg-cream/40 py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow="Whispers" title="Loved by seekers across the world" />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="rounded-2xl border border-border bg-card p-7 shadow-soft">
              <div className="flex gap-1 text-saffron">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
              </div>
              <blockquote className="mt-4 font-display text-lg leading-snug text-charcoal">
                "{t.text}"
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 text-sm text-warmbrown">
                <img
                  src={t.avatar}
                  alt={t.name}
                  loading="lazy"
                  className="h-12 w-12 rounded-full object-cover ring-1 ring-bronze/30 shadow-soft"
                />
                <span>
                  <span className="block font-medium text-charcoal">{t.name}</span>
                  <span className="text-xs text-warmbrown/80">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}


/* --------------- FAQ --------------- */
const FAQS = [
  ["Is the kundli generation free?", "Yes — kundli generation is completely free for everyone, with detailed planetary positions, Dasha analysis, and dosha insights."],
  ["Which astrology tradition do you follow?", "Vedic (Jyotish) — sidereal zodiac with Lahiri ayanamsa, using classical North Indian chart conventions."],
  ["Is my birth data private?", "Always. Your details are encrypted and never shared. You may delete your data at any time."],
  ["Can I talk to a real astrologer?", "Yes — we offer personal consultations with vetted Vedic astrologers through our contact page."],
];

function FAQ() {
  return (
    <section className="bg-cream/40 py-24">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <SectionHeading eyebrow="Questions" title="Thoughtfully answered" />
        <Accordion type="single" collapsible className="mt-12">
          {FAQS.map(([q, a]) => (
            <AccordionItem key={q} value={q} className="border-border">
              <AccordionTrigger className="text-left font-display text-lg text-charcoal hover:no-underline">
                {q}
              </AccordionTrigger>
              <AccordionContent className="text-warmbrown/85 leading-relaxed">
                {a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

/* --------------- Shared --------------- */
export function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <MandalaIcon size={36} className="mx-auto mb-4 text-bronze/60" />
      <span className="ornament-divider mx-auto max-w-[220px] text-xs uppercase tracking-[0.3em] text-bronze">{eyebrow}</span>
      <h2 className="mt-6 font-display text-4xl leading-tight text-balance sm:text-5xl">{title}</h2>
      {subtitle && <p className="mt-4 text-warmbrown/85 leading-relaxed">{subtitle}</p>}
    </div>
  );
}