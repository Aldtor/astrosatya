import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Download, FileText, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionHeading, NorthIndianChart } from "@/routes/index";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { jsPDF } from "jspdf";

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
  const handleDownload = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const W = doc.internal.pageSize.getWidth();
    let y = 70;

    doc.setFillColor(250, 246, 238);
    doc.rect(0, 0, W, 110, "F");
    doc.setTextColor(150, 110, 40);
    doc.setFont("times", "italic");
    doc.setFontSize(11);
    doc.text("ASTROSATYA  ·  JANMA KUNDLI", W / 2, 45, { align: "center" });
    doc.setTextColor(40, 30, 20);
    doc.setFont("times", "normal");
    doc.setFontSize(26);
    doc.text("Your Vedic Birth Chart", W / 2, 80, { align: "center" });
    y = 150;

    const section = (title: string) => {
      doc.setFont("times", "bold");
      doc.setFontSize(14);
      doc.setTextColor(60, 40, 20);
      doc.text(title, 50, y);
      y += 8;
      doc.setDrawColor(200, 170, 100);
      doc.line(50, y, W - 50, y);
      y += 20;
      doc.setFont("times", "normal");
      doc.setFontSize(11);
      doc.setTextColor(50, 40, 30);
    };

    section("Planetary Positions");
    const planets: [string, string, string][] = [
      ["Sun (Surya)", "Aries", "12° 34'"],
      ["Moon (Chandra)", "Cancer", "08° 11'"],
      ["Mars (Mangal)", "Scorpio", "21° 45'"],
      ["Mercury (Budh)", "Pisces", "03° 19'"],
      ["Jupiter (Guru)", "Sagittarius", "17° 02'"],
      ["Venus (Shukra)", "Taurus", "26° 50'"],
      ["Saturn (Shani)", "Capricorn", "14° 27'"],
    ];
    planets.forEach(([p, s, d]) => {
      doc.text(p, 60, y);
      doc.text(s, 280, y);
      doc.text(d, 460, y);
      y += 18;
    });
    y += 16;

    section("Current Mahadasha");
    doc.text("Jupiter  ·  2021 — 2037", 60, y); y += 16;
    doc.text("A period of wisdom, expansion, and gentle prosperity.", 60, y); y += 28;

    section("Life Predictions");
    const preds: [string, string][] = [
      ["Career", "A year of meaningful recognition. Trust your intuition before bold moves."],
      ["Love", "Venus blesses your sign — relationships deepen with honest conversation."],
      ["Finance", "Steady growth. Avoid speculation; favour long-term sattvic investments."],
      ["Health", "Care for your throat and digestion. Gentle pranayama suits you well."],
      ["Personality", "You carry a quiet strength others find calming. Honour your solitude."],
    ];
    preds.forEach(([t, x]) => {
      doc.setFont("times", "bold");
      doc.text(t, 60, y);
      doc.setFont("times", "normal");
      const lines = doc.splitTextToSize(x, W - 180);
      doc.text(lines, 160, y);
      y += lines.length * 14 + 10;
    });

    doc.setFontSize(9);
    doc.setTextColor(150, 120, 80);
    doc.text("Crafted with intention by AstroSatya", W / 2, 800, { align: "center" });

    doc.save("AstroSatya-Kundli.pdf");
  };

  return (
    <section className="border-t border-border/60 bg-cream/40 py-20 animate-rise">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <SectionHeading eyebrow="Your reading is ready" title="Your kundli has been prepared" />
        <div className="mt-14 grid gap-8 md:grid-cols-[1fr_1.1fr] items-center">
          <NorthIndianChart />
          <div className="rounded-3xl border border-border bg-card p-8 shadow-lift sm:p-10 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-gold shadow-gold">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="mt-5 font-display text-2xl leading-tight">Your complete Vedic reading</h3>
            <p className="mt-3 text-sm text-warmbrown/85 leading-relaxed">
              Planetary positions, Mahadasha periods, and personalised life predictions —
              all crafted into a beautifully formatted PDF report for you to keep.
            </p>
            <Button
              onClick={handleDownload}
              size="lg"
              className="mt-7 w-full bg-gradient-gold text-primary-foreground shadow-gold hover:opacity-95"
            >
              <Download className="mr-2 h-4 w-4" /> Download Full PDF Report
            </Button>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-warmbrown/70">
              <Lock className="h-3 w-3" /> Private & encrypted · 12+ pages
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}