import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { SectionHeading } from "@/routes/index";

export const Route = createFileRoute("/matchmaking")({
  head: () => ({
    meta: [
      { title: "Vedic Matchmaking — AstroSatya" },
      { name: "description", content: "Discover Ashtakoot compatibility — emotional, marriage and spiritual harmony, beautifully presented." },
      { property: "og:title", content: "Vedic Matchmaking — AstroSatya" },
      { property: "og:description", content: "36-guna compatibility, designed with reverence." },
    ],
  }),
  component: MatchPage,
});

function MatchPage() {
  const [show, setShow] = useState(false);
  return (
    <main className="bg-ivory">
      <section className="bg-gradient-sky py-20">
        <div className="mx-auto max-w-5xl px-5 text-center sm:px-8">
          <span className="ornament-divider mx-auto max-w-[220px] text-xs uppercase tracking-[0.3em] text-bronze">Guna Milan</span>
          <h1 className="mt-6 font-display text-5xl leading-tight text-balance sm:text-6xl">Discover your harmony</h1>
          <p className="mt-5 mx-auto max-w-xl text-warmbrown/85 leading-relaxed">
            Compare two birth charts using classical Ashtakoot principles. 36 gunas, beautifully read.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <form
            onSubmit={(e) => { e.preventDefault(); setShow(true); setTimeout(() => window.scrollTo({ top: window.innerHeight * 0.9, behavior: "smooth" }), 80); }}
            className="grid gap-8 md:grid-cols-2"
          >
            <PartnerForm title="Partner One" />
            <PartnerForm title="Partner Two" />
            <div className="md:col-span-2 text-center">
              <Button type="submit" size="lg" className="bg-gradient-gold text-primary-foreground shadow-gold hover:opacity-95">
                <Heart className="mr-2 h-4 w-4" /> Check Compatibility
              </Button>
            </div>
          </form>
        </div>
      </section>

      {show && <Result />}
    </main>
  );
}

function PartnerForm({ title }: { title: string }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
      <h3 className="font-display text-2xl">{title}</h3>
      <div className="mt-6 grid gap-5">
        <Field label="Name"><Input required placeholder="Name" /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Date of Birth"><Input required type="date" /></Field>
          <Field label="Time"><Input required type="time" /></Field>
        </div>
        <Field label="Place of Birth"><Input required placeholder="City, Country" /></Field>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-2 block text-xs uppercase tracking-wider text-warmbrown/80">{label}</Label>
      {children}
    </div>
  );
}

function Result() {
  const score = 29; // out of 36
  const pct = Math.round((score / 36) * 100);
  const circumference = 2 * Math.PI * 80;
  const offset = circumference * (1 - pct / 100);

  return (
    <section className="border-t border-border/60 bg-cream/40 py-20 animate-rise">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading eyebrow="Your reading" title="A graceful match" />

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-3">
          <div className="relative mx-auto aspect-square w-full max-w-[280px]">
            <svg viewBox="0 0 200 200" className="-rotate-90">
              <circle cx="100" cy="100" r="80" stroke="oklch(0.88 0.025 75)" strokeWidth="14" fill="none" />
              <circle
                cx="100" cy="100" r="80"
                stroke="url(#g)" strokeWidth="14" fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference} strokeDashoffset={offset}
                style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
              />
              <defs>
                <linearGradient id="g" x1="0" x2="1">
                  <stop offset="0%" stopColor="oklch(0.78 0.12 75)" />
                  <stop offset="100%" stopColor="oklch(0.62 0.13 55)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 grid place-items-center text-center">
              <div>
                <Sparkles className="mx-auto h-5 w-5 text-saffron" />
                <p className="mt-2 font-display text-5xl text-charcoal">{score}<span className="text-2xl text-warmbrown/60">/36</span></p>
                <p className="mt-1 text-xs uppercase tracking-wider text-bronze">Guna Score</p>
              </div>
            </div>
          </div>

          <div className="space-y-5 lg:col-span-2">
            {[
              ["Emotional Compatibility", 88],
              ["Marriage Harmony", 82],
              ["Mental Connection", 90],
              ["Spiritual Alignment", 76],
              ["Long-term Stability", 79],
            ].map(([label, v]) => (
              <div key={label as string}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-charcoal">{label}</span>
                  <span className="font-display text-saffron">{v}%</span>
                </div>
                <Progress value={v as number} className="mt-2 h-2 bg-sand [&>*]:bg-gradient-gold" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
            <h3 className="font-display text-2xl">Strengths</h3>
            <ul className="mt-5 space-y-3 text-warmbrown">
              <li>· A natural emotional rhythm — you understand each other's silence.</li>
              <li>· Shared values around family, ritual, and home.</li>
              <li>· Jupiter's blessing supports growth as a couple.</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
            <h3 className="font-display text-2xl">Gentle challenges</h3>
            <ul className="mt-5 space-y-3 text-warmbrown">
              <li>· Different paces in decision-making — patience is the remedy.</li>
              <li>· Honour each other's solitude; do not interpret it as distance.</li>
              <li>· Plan finances together early to avoid friction.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}