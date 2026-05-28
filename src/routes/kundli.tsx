import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, ArrowRight, Briefcase, Heart, Coins, Activity, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionHeading, NorthIndianChart } from "@/routes/index";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/kundli")({
  head: () => ({
    meta: [
      { title: "Free Kundli Generator — AstroSatya" },
      { name: "description", content: "Generate your precise Vedic birth chart with planetary positions, Dasha periods and detailed predictions, free." },
      { property: "og:title", content: "Free Vedic Kundli Generator" },
      { property: "og:description", content: "Your birth chart, painted with intention." },
    ],
  }),
  component: KundliPage,
});

function KundliPage() {
  const [generated, setGenerated] = useState(false);
  return (
    <main className="bg-ivory">
      <section className="border-b border-border/60 bg-gradient-sky py-20">
        <div className="mx-auto max-w-5xl px-5 text-center sm:px-8">
          <span className="ornament-divider mx-auto max-w-[220px] text-xs uppercase tracking-[0.3em] text-bronze">Janma Kundli</span>
          <h1 className="mt-6 font-display text-5xl leading-tight text-balance sm:text-6xl">Your Vedic birth chart</h1>
          <p className="mt-5 mx-auto max-w-xl text-warmbrown/85 leading-relaxed">
            Share a few details and we'll craft your kundli with classical Vedic precision and modern clarity.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <form
            onSubmit={(e) => { e.preventDefault(); setGenerated(true); window.scrollTo({ top: window.innerHeight * 0.7, behavior: "smooth" }); }}
            className="rounded-3xl border border-border bg-card p-8 shadow-lift sm:p-10"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Full Name"><Input required placeholder="Aanya Sharma" /></Field>
              <Field label="Gender">
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Date of Birth"><Input required type="date" /></Field>
              <Field label="Time of Birth"><Input required type="time" /></Field>
              <Field label="Place of Birth" className="sm:col-span-2">
                <Input required placeholder="Varanasi, India" />
              </Field>
            </div>
            <Button type="submit" size="lg" className="mt-8 w-full bg-gradient-gold text-primary-foreground shadow-gold hover:opacity-95">
              <Sparkles className="mr-2 h-4 w-4" /> Generate My Kundli
            </Button>
            <p className="mt-4 text-center text-xs text-warmbrown/70">
              Your details are private, encrypted and used only for your reading.
            </p>
          </form>
        </div>
      </section>

      {generated && <KundliResult />}
    </main>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <Label className="mb-2 block text-xs uppercase tracking-wider text-warmbrown/80">{label}</Label>
      {children}
    </div>
  );
}

function KundliResult() {
  return (
    <section className="border-t border-border/60 bg-cream/40 py-20 animate-rise">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow="Your reading" title="The cosmos at your birth" />
        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <NorthIndianChart />
          <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
            <h3 className="font-display text-2xl">Planetary positions</h3>
            <div className="mt-6 divide-y divide-border">
              {[
                ["Sun (Surya)", "Aries", "12° 34'"],
                ["Moon (Chandra)", "Cancer", "08° 11'"],
                ["Mars (Mangal)", "Scorpio", "21° 45'"],
                ["Mercury (Budh)", "Pisces", "03° 19'"],
                ["Jupiter (Guru)", "Sagittarius", "17° 02'"],
                ["Venus (Shukra)", "Taurus", "26° 50'"],
                ["Saturn (Shani)", "Capricorn", "14° 27'"],
              ].map(([p, s, d]) => (
                <div key={p} className="flex items-center justify-between py-3 text-sm">
                  <span className="font-medium text-charcoal">{p}</span>
                  <span className="text-warmbrown">{s}</span>
                  <span className="font-display text-saffron">{d}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-2xl bg-gradient-to-br from-cream to-sand p-6">
              <p className="text-xs uppercase tracking-wider text-bronze">Current Mahadasha</p>
              <p className="mt-1 font-display text-2xl">Jupiter · 2021 — 2037</p>
              <p className="mt-2 text-sm text-warmbrown/85">A period of wisdom, expansion, and gentle prosperity.</p>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { icon: Briefcase, title: "Career", text: "A year of meaningful recognition. Trust your intuition before bold moves." },
            { icon: Heart, title: "Love", text: "Venus blesses your sign — relationships deepen with honest conversation." },
            { icon: Coins, title: "Finance", text: "Steady growth. Avoid speculation; favour long-term sattvic investments." },
            { icon: Activity, title: "Health", text: "Care for your throat and digestion. Gentle pranayama suits you well." },
            { icon: User, title: "Personality", text: "You carry a quiet strength others find calming. Honour your solitude." },
          ].map((s) => (
            <div key={s.title} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-gold shadow-gold">
                <s.icon className="h-4 w-4 text-primary-foreground" />
              </div>
              <h4 className="mt-4 font-display text-xl">{s.title}</h4>
              <p className="mt-2 text-sm text-warmbrown/85 leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Button asChild className="bg-gradient-gold text-primary-foreground shadow-gold hover:opacity-95">
            <a href="#">Download full PDF report <ArrowRight className="ml-2 h-4 w-4" /></a>
          </Button>
        </div>
      </div>
    </section>
  );
}