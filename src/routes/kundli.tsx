import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Download, FileText, Lock, Star, Heart, Briefcase, Coins, Activity, Home, BookOpen, Plane, Flame, CalendarRange, Gem } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionHeading, NorthIndianChart } from "@/routes/index";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { jsPDF } from "jspdf";
import { compute, narrate, type BirthInput, type ComputedKundli, type Narrative } from "@/lib/kundli-engine";
import { PlaceAutocomplete } from "@/components/site/PlaceAutocomplete";
import { LanguageSelect } from "@/components/site/LanguageSelect";
import { DateOfBirthPicker } from "@/components/site/DateOfBirthPicker";
import { findLanguage } from "@/lib/languages";
import { localizePlanetEssences, SUPPORTED_NARRATION_LANGS } from "@/lib/kundli-i18n";

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
  const [result, setResult] = useState<{ k: ComputedKundli; n: Narrative; planetEssences: string[] } | null>(null);
  const [form, setForm] = useState<BirthInput>({ name: "", gender: "", date: "", time: "", place: "", language: "en" });

  const set = <K extends keyof BirthInput>(k: K, v: string) => setForm((f) => ({ ...f, [k]: v }));

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
            onSubmit={(e) => {
              e.preventDefault();
              const k = compute(form);
              const langCode = form.language || "en";
              const n = narrate(k, langCode);
              const planetEssences = localizePlanetEssences(k.planets, langCode);
              setResult({ k, n, planetEssences });
              setTimeout(() => window.scrollTo({ top: window.innerHeight * 0.85, behavior: "smooth" }), 80);
            }}
            className="rounded-3xl border border-border bg-card p-8 shadow-lift sm:p-10"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Full Name"><Input required value={form.name} onChange={(e) => set("name", e.target.value)} /></Field>
              <Field label="Gender">
                <Select value={form.gender} onValueChange={(v) => set("gender", v)}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Date of Birth"><DateOfBirthPicker required value={form.date} onChange={(v) => set("date", v)} /></Field>
              <Field label="Time of Birth"><Input required type="time" value={form.time} onChange={(e) => set("time", e.target.value)} /></Field>
              <Field label="Place of Birth" className="sm:col-span-2">
                <PlaceAutocomplete required value={form.place} onChange={(v) => set("place", v)} placeholder="" />
              </Field>
              <Field label="Reading Language" className="sm:col-span-2">
                <LanguageSelect value={form.language || "en"} onChange={(v) => set("language", v)} />
                <p className="mt-2 text-xs text-warmbrown/70">
                  100% offline. Full reading available in: {SUPPORTED_NARRATION_LANGS.join(", ")}. Other languages show greeting in your script with English reading.
                </p>
              </Field>
            </div>
            <Button type="submit" size="lg" className="mt-8 w-full bg-gradient-gold text-primary-foreground shadow-gold hover:opacity-95">
              <Sparkles className="mr-2 h-4 w-4" /> Generate My Kundli
            </Button>
            <p className="mt-4 text-center text-xs text-warmbrown/70">
              No sign-up needed. Your details stay in your browser and are used only for this reading.
            </p>
          </form>
        </div>
      </section>

      {result && <KundliResult k={result.k} n={result.n} planetEssences={result.planetEssences} />}
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

function KundliResult({ k, n, planetEssences }: { k: ComputedKundli; n: Narrative; planetEssences: string[] }) {
  const lang = findLanguage(k.input.language || "en");
  const handleDownload = () => buildPdf(k, n);

  return (
    <section className="border-t border-border/60 bg-cream/40 py-20 animate-rise">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow={`${lang.greeting}, ${k.input.name || "Seeker"}`}
          title="Your kundli has been prepared"
        />
        <p className="mt-4 text-center text-sm text-warmbrown/80">
          Reading prepared in <span className="font-medium text-charcoal">{lang.english}</span>
          {lang.code !== "en" && <> · <span className="font-display">{lang.native}</span></>}
        </p>

        {/* Chart + at-a-glance */}
        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.1fr] items-start">
          <NorthIndianChart />
          <div className="rounded-3xl border border-border bg-card p-8 shadow-lift sm:p-10">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-gold shadow-gold">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="mt-5 font-display text-2xl leading-tight">Your soul's blueprint</h3>
            <p className="mt-3 text-sm leading-relaxed text-warmbrown/85">{n.overview}</p>
            <dl className="mt-6 grid grid-cols-2 gap-x-5 gap-y-3 text-sm">
              <Meta label="Lagna" value={k.lagna.signName.split(" ")[0]} />
              <Meta label="Moon Sign" value={k.moonSign.split(" ")[0]} />
              <Meta label="Sun Sign" value={k.sunSign.split(" ")[0]} />
              <Meta label="Nakshatra" value={`${k.nakshatra.name} · ${k.nakshatra.pada}`} />
              <Meta label="Current Dasha" value={`${k.currentDasha.lord} (${Math.floor(k.currentDasha.from)}–${Math.floor(k.currentDasha.to)})`} />
              <Meta label="Yogas" value={`${k.yogas.length} active`} />
            </dl>
            <p className="mt-6 rounded-xl bg-cream/60 p-4 font-display text-base italic text-charcoal">
              {lang.blessing}
            </p>
            <Button onClick={handleDownload} size="lg" className="mt-7 w-full bg-gradient-gold text-primary-foreground shadow-gold hover:opacity-95">
              <Download className="mr-2 h-4 w-4" /> Download as PDF (optional)
            </Button>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-warmbrown/70">
              <Lock className="h-3 w-3" /> Everything is shown on this page · PDF is for keeping
            </p>
          </div>
        </div>

        {/* Planetary positions table */}
        <div className="mt-16 rounded-3xl border border-border bg-card p-8 shadow-soft">
          <h3 className="font-display text-2xl">Planetary positions · Graha Sthiti</h3>
          <p className="mt-2 text-sm text-warmbrown/80">Where each graha sits in your chart, the nakshatra it touches, and a one-line reading of its mood.</p>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-cream/60 text-xs uppercase tracking-wider text-warmbrown/80">
                <tr>
                  <th className="px-4 py-3 text-left">Planet</th>
                  <th className="px-4 py-3 text-left">Rashi</th>
                  <th className="px-4 py-3 text-left">Degree</th>
                  <th className="px-3 py-3 text-center">House</th>
                  <th className="px-4 py-3 text-left">Nakshatra · Pada</th>
                  <th className="px-4 py-3 text-left">Lord</th>
                  <th className="px-4 py-3 text-left">Dignity</th>
                </tr>
              </thead>
              <tbody>
                {k.planets.map((p, i) => (
                  <tr key={p.name} className="border-t border-border/60 align-top">
                    <td className="px-4 py-3">
                      <div className="font-medium text-charcoal">{p.name} <span className="text-warmbrown/60">({p.sanskrit})</span></div>
                      <div className="mt-1 text-xs italic text-warmbrown/75 max-w-[18rem]">{planetEssences[i] ?? p.essence}</div>
                    </td>
                    <td className="px-4 py-3 text-warmbrown">{p.signName.split(" ")[0]}</td>
                    <td className="px-4 py-3 font-mono text-warmbrown">{p.deg}</td>
                    <td className="px-3 py-3 text-center font-display text-saffron">{p.house}</td>
                    <td className="px-4 py-3 text-warmbrown">{p.nakshatra} · {p.pada}</td>
                    <td className="px-4 py-3 text-warmbrown">{p.nakLord}</td>
                    <td className="px-4 py-3">
                      <span className={
                        "rounded-full px-2 py-0.5 text-[11px] font-medium " +
                        (p.dignity === "Exalted" ? "bg-emerald-100 text-emerald-800" :
                         p.dignity === "Debilitated" ? "bg-rose-100 text-rose-800" :
                         p.dignity === "Own sign" ? "bg-saffron/15 text-saffron" :
                         p.dignity === "Shadow" ? "bg-zinc-200 text-zinc-700" :
                         "bg-cream text-warmbrown")
                      }>{p.dignity}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Life-area bullets */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <BulletCard icon={<Star />}    eyebrow="Swabhava" title="Your personality"        items={n.personality} />
          <BulletCard icon={<Briefcase />} eyebrow="Karma"   title="Career & calling"        items={n.career} />
          <BulletCard icon={<Coins />}     eyebrow="Dhana"   title="Wealth & abundance"      items={n.finance} />
          <BulletCard icon={<Heart />}     eyebrow="Prema"   title="Love"                    items={n.love} />
          <BulletCard icon={<Heart />}     eyebrow="Vivaha"  title="Marriage"                items={n.marriage} />
          <BulletCard icon={<Activity />}  eyebrow="Arogya"  title="Health & vitality"       items={n.health} />
          <BulletCard icon={<Home />}      eyebrow="Kutumba" title="Family & home"           items={n.family} />
          <BulletCard icon={<BookOpen />}  eyebrow="Vidya"   title="Learning & intellect"    items={n.education} />
          <BulletCard icon={<Plane />}     eyebrow="Yatra"   title="Travel & journeys"       items={n.travel} />
          <BulletCard icon={<Flame />}     eyebrow="Moksha"  title="Spiritual path"          items={n.spiritual} />
          <BulletCard icon={<CalendarRange />} eyebrow="Varshaphala" title="The year ahead"  items={n.yearAhead} />
          <BulletCard icon={<Sparkles />}  eyebrow="Upaya"   title="Remedies & practices"    items={k.remedies} />
        </div>

        {/* Vimshottari Dasha */}
        <div className="mt-16 rounded-3xl border border-border bg-card p-8 shadow-soft">
          <h3 className="font-display text-2xl">Vimshottari Mahadasha · 120-year cycle</h3>
          <p className="mt-3 max-w-3xl text-sm text-warmbrown/85">{n.dashaNow}</p>
          <div className="mt-6 overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-cream/60 text-xs uppercase tracking-wider text-warmbrown/80">
                <tr>
                  <th className="px-4 py-3 text-left">Lord</th>
                  <th className="px-4 py-3 text-left">From</th>
                  <th className="px-4 py-3 text-left">To</th>
                  <th className="px-4 py-3 text-right">Years</th>
                </tr>
              </thead>
              <tbody>
                {k.mahadashas.map((d) => {
                  const current = d.lord === k.currentDasha.lord;
                  return (
                    <tr key={d.lord + d.from} className={"border-t border-border/60 " + (current ? "bg-cream/40" : "")}>
                      <td className="px-4 py-3 font-medium text-charcoal">
                        {d.lord}{current && <span className="ml-2 rounded-full bg-saffron/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-saffron">Current</span>}
                      </td>
                      <td className="px-4 py-3 text-warmbrown">{Math.floor(d.from)}</td>
                      <td className="px-4 py-3 text-warmbrown">{Math.floor(d.to)}</td>
                      <td className="px-4 py-3 text-right font-display text-saffron">{Math.round(d.to - d.from)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Yogas + Doshas */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
            <h3 className="font-display text-2xl">Yogas in your chart</h3>
            <ul className="mt-5 space-y-3 text-sm text-warmbrown">
              {k.yogas.map((y, i) => <li key={i} className="leading-relaxed">· {y}</li>)}
            </ul>
          </div>
          <div className="rounded-3xl border border-border bg-card p-8 shadow-soft">
            <h3 className="font-display text-2xl">Doshas — gentle considerations</h3>
            <ul className="mt-5 space-y-4 text-sm text-warmbrown">
              {k.doshas.map((d, i) => (
                <li key={i}>
                  <p className="font-display text-base text-charcoal">{d.name} — {d.present ? "present" : "not present"}</p>
                  <p className="mt-1 leading-relaxed">{d.note}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Lucky + gemstone + mantra */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <LuckyCard icon={<Gem />} title="Gemstone" body={n.gemstone} />
          <LuckyCard icon={<Flame />} title="Mantra (108 reps at dawn)" body={n.mantra} />
          <LuckyCard
            icon={<Sparkles />}
            title="Lucky elements"
            body={`Colours: ${n.luckyColors}\nDays: ${n.luckyDays}\nNumbers: ${n.luckyNumbers}`}
          />
        </div>

        {/* PDF download (bottom) */}
        <div className="mt-16 rounded-3xl border border-border bg-gradient-sky p-10 text-center shadow-soft">
          <h3 className="font-display text-3xl">Want to keep this reading?</h3>
          <p className="mx-auto mt-3 max-w-xl text-sm text-warmbrown/85">
            Everything you've read here is already shown above. If you'd like a beautifully typeset copy to revisit, download it as a free PDF — no email required.
          </p>
          <Button onClick={handleDownload} size="lg" className="mt-6 bg-gradient-gold text-primary-foreground shadow-gold hover:opacity-95">
            <Download className="mr-2 h-4 w-4" /> Download Full PDF Report
          </Button>
        </div>
      </div>
    </section>
  );
}

function BulletCard({ icon, eyebrow, title, items }: { icon: React.ReactNode; eyebrow: string; title: string; items: string[] }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-7 shadow-soft">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-cream text-bronze">{icon}</div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-bronze">{eyebrow}</p>
          <h4 className="font-display text-xl leading-tight text-charcoal">{title}</h4>
        </div>
      </div>
      <ul className="mt-5 space-y-2.5 text-sm leading-relaxed text-warmbrown">
        {items.map((it, i) => <li key={i}>· {it}</li>)}
      </ul>
    </div>
  );
}

function LuckyCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-7 shadow-soft">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-gold text-primary-foreground shadow-gold">{icon}</div>
      <h4 className="mt-4 font-display text-xl text-charcoal">{title}</h4>
      <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-warmbrown">{body}</p>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-[0.18em] text-bronze">{label}</dt>
      <dd className="mt-0.5 font-display text-base text-charcoal">{value}</dd>
    </div>
  );
}

/* ===================== PDF BUILDER ===================== */
function buildPdf(k: ComputedKundli, n: Narrative) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 56;
  let y = 0;
  let page = 1;

  const footer = () => {
    doc.setFont("times", "italic");
    doc.setFontSize(9);
    doc.setTextColor(150, 120, 80);
    doc.text(`AstroSatya · ${k.input.name || "Seeker"}`, M, H - 28);
    doc.text(`${page}`, W - M, H - 28, { align: "right" });
  };
  const newPage = () => {
    footer();
    doc.addPage();
    page += 1;
    y = M + 10;
  };
  const ensure = (h: number) => { if (y + h > H - 60) newPage(); };

  const heading = (t: string, eyebrow?: string) => {
    ensure(80);
    if (eyebrow) {
      doc.setFont("times", "italic"); doc.setFontSize(10); doc.setTextColor(150, 110, 40);
      doc.text(eyebrow.toUpperCase(), M, y);
      y += 14;
    }
    doc.setFont("times", "bold"); doc.setFontSize(20); doc.setTextColor(40, 30, 20);
    doc.text(t, M, y);
    y += 10;
    doc.setDrawColor(200, 170, 100); doc.setLineWidth(0.6);
    doc.line(M, y, M + 60, y);
    y += 22;
    doc.setFont("times", "normal"); doc.setFontSize(11); doc.setTextColor(55, 45, 35);
  };
  const para = (text: string) => {
    const lines = doc.splitTextToSize(text, W - M * 2);
    ensure(lines.length * 15 + 6);
    doc.text(lines, M, y);
    y += lines.length * 15 + 8;
  };
  const bullets = (items: string[]) => items.forEach((it) => {
    const lines = doc.splitTextToSize(it, W - M * 2 - 14);
    ensure(lines.length * 15 + 4);
    doc.text("•", M, y);
    doc.text(lines, M + 14, y);
    y += lines.length * 15 + 4;
  });

  // ----- Cover -----
  doc.setFillColor(250, 246, 238); doc.rect(0, 0, W, H, "F");
  doc.setDrawColor(200, 170, 100);
  doc.setLineWidth(0.8); doc.rect(28, 28, W - 56, H - 56);
  doc.setLineWidth(0.3); doc.rect(36, 36, W - 72, H - 72);

  doc.setFont("times", "italic"); doc.setFontSize(11); doc.setTextColor(150, 110, 40);
  doc.text("ASTROSATYA  ·  JANMA KUNDLI", W / 2, 130, { align: "center" });

  doc.setFont("times", "normal"); doc.setFontSize(36); doc.setTextColor(40, 30, 20);
  doc.text("Your Vedic", W / 2, 230, { align: "center" });
  doc.text("Birth Chart", W / 2, 278, { align: "center" });

  doc.setDrawColor(200, 170, 100);
  doc.line(W / 2 - 40, 308, W / 2 + 40, 308);

  doc.setFontSize(14); doc.setTextColor(80, 60, 40);
  doc.text(k.input.name || "Seeker", W / 2, 350, { align: "center" });
  doc.setFontSize(11); doc.setTextColor(120, 95, 60);
  doc.text(`${k.input.date}  ·  ${k.input.time}  ·  ${k.input.place || "—"}`, W / 2, 372, { align: "center" });

  const lang = findLanguage(k.input.language || "en");
  doc.setFontSize(10); doc.setTextColor(150, 110, 40);
  doc.text(`Reading language: ${lang.english}`, W / 2, 394, { align: "center" });

  doc.setFontSize(10); doc.setTextColor(150, 120, 80);
  doc.text("An eighteen-page personalised reading, prepared with reverence.", W / 2, H - 110, { align: "center" });
  doc.text("AstroSatya  ·  ancient wisdom, gently modern", W / 2, H - 90, { align: "center" });

  newPage();

  // ----- Overview -----
  heading("The reading at a glance", "Overview");
  if (lang.code !== "en") {
    doc.setFont("times", "italic"); doc.setFontSize(11); doc.setTextColor(150, 100, 30);
    para(`Prepared with a ${lang.english} greeting and blessing — shown on the website. (PDF text remains in English for typographic clarity.)`);
    doc.setFont("times", "normal"); doc.setFontSize(11); doc.setTextColor(55, 45, 35);
  }
  para(n.overview);
  para("This report distills your chart into a journey across personality, relationships, work, " +
    "wealth, health, family, learning, travel and spiritual life. Read it slowly. Return to it across seasons.");

  // Quick stats box
  ensure(160);
  doc.setDrawColor(200, 170, 100); doc.setFillColor(252, 247, 235);
  doc.roundedRect(M, y, W - M * 2, 130, 6, 6, "FD");
  const cellY = y + 28; const colW = (W - M * 2) / 3;
  const cells: [string, string][] = [
    ["Ascendant (Lagna)", `${k.lagna.signName}  ${k.lagna.deg}`],
    ["Moon Sign (Rashi)", k.moonSign],
    ["Sun Sign", k.sunSign],
    ["Nakshatra", `${k.nakshatra.name} · Pada ${k.nakshatra.pada}`],
    ["Nakshatra Lord", k.nakshatra.lord],
    ["Current Mahadasha", `${k.currentDasha.lord} (${Math.floor(k.currentDasha.from)}–${Math.floor(k.currentDasha.to)})`],
  ];
  cells.forEach((c, i) => {
    const cx = M + 18 + (i % 3) * colW;
    const cy = cellY + Math.floor(i / 3) * 56;
    doc.setFont("times", "italic"); doc.setFontSize(9); doc.setTextColor(150, 110, 40);
    doc.text(c[0].toUpperCase(), cx, cy);
    doc.setFont("times", "normal"); doc.setFontSize(12); doc.setTextColor(40, 30, 20);
    doc.text(c[1], cx, cy + 16);
  });
  y += 150;

  // ----- Planetary Positions -----
  heading("Planetary positions", "Graha Sthiti");
  doc.setFont("times", "bold"); doc.setFontSize(10); doc.setTextColor(120, 95, 60);
  doc.text("PLANET", M, y); doc.text("RASHI", M + 180, y); doc.text("DEGREE", M + 340, y); doc.text("HOUSE", M + 450, y);
  y += 8; doc.setDrawColor(200, 170, 100); doc.line(M, y, W - M, y); y += 14;
  doc.setFont("times", "normal"); doc.setFontSize(11); doc.setTextColor(50, 40, 30);
  k.planets.forEach((p) => {
    ensure(20);
    doc.text(`${p.name} (${p.sanskrit})`, M, y);
    doc.text(p.signName.split(" ")[0], M + 180, y);
    doc.text(p.deg, M + 340, y);
    doc.text(`${p.house}`, M + 450, y);
    y += 18;
  });
  y += 6;

  // ----- Personality -----
  heading("Your personality", "Swabhava");
  bullets(n.personality);

  // ----- Career & Finance -----
  heading("Career & calling", "Karma");
  bullets(n.career);
  heading("Wealth & abundance", "Dhana");
  bullets(n.finance);

  // ----- Love & marriage -----
  heading("Love", "Prema");
  bullets(n.love);
  heading("Marriage", "Vivaha");
  bullets(n.marriage);

  // ----- Health, Family -----
  heading("Health & vitality", "Arogya");
  bullets(n.health);
  heading("Family & home", "Kutumba");
  bullets(n.family);

  // ----- Education & travel -----
  heading("Learning & intellect", "Vidya");
  bullets(n.education);
  heading("Travel & journeys", "Yatra");
  bullets(n.travel);

  // ----- Spirituality -----
  heading("Spiritual path", "Moksha");
  bullets(n.spiritual);

  // ----- Mahadasha table -----
  heading("Vimshottari Mahadasha", "120-year planetary cycle");
  para("The Vimshottari system maps your life into nine planetary chapters, each colouring a span of years " +
    "with its particular flavour. Your current dasha is highlighted below.");
  doc.setFont("times", "bold"); doc.setFontSize(10); doc.setTextColor(120, 95, 60);
  doc.text("LORD", M, y); doc.text("FROM", M + 200, y); doc.text("TO", M + 310, y); doc.text("YEARS", M + 420, y);
  y += 8; doc.line(M, y, W - M, y); y += 14;
  doc.setFont("times", "normal"); doc.setFontSize(11); doc.setTextColor(50, 40, 30);
  k.mahadashas.forEach((d) => {
    ensure(20);
    const current = d.lord === k.currentDasha.lord;
    if (current) { doc.setFont("times", "bold"); doc.setTextColor(150, 100, 30); }
    doc.text(`${d.lord}${current ? "  ◆" : ""}`, M, y);
    doc.text(`${Math.floor(d.from)}`, M + 200, y);
    doc.text(`${Math.floor(d.to)}`, M + 310, y);
    doc.text(`${Math.round(d.to - d.from)}`, M + 420, y);
    if (current) { doc.setFont("times", "normal"); doc.setTextColor(50, 40, 30); }
    y += 18;
  });
  y += 6;
  para(n.dashaNow);

  // ----- Yogas & Doshas -----
  heading("Yogas in your chart", "Auspicious combinations");
  bullets(k.yogas);

  heading("Doshas — gentle considerations", "Karmic patterns");
  k.doshas.forEach((d) => {
    ensure(40);
    doc.setFont("times", "bold"); doc.setFontSize(12); doc.setTextColor(40, 30, 20);
    doc.text(`${d.name}  —  ${d.present ? "present" : "not present"}`, M, y);
    y += 16;
    doc.setFont("times", "normal"); doc.setFontSize(11); doc.setTextColor(55, 45, 35);
    const lines = doc.splitTextToSize(d.note, W - M * 2);
    doc.text(lines, M, y);
    y += lines.length * 14 + 8;
  });

  // ----- Year ahead -----
  heading("The year ahead", "Varshaphala");
  bullets(n.yearAhead);

  // ----- Remedies & lucky -----
  heading("Remedies & sacred practices", "Upaya");
  bullets(k.remedies);

  heading("Your gemstone & mantra", "Ratna & Mantra");
  para(`Recommended gemstone: ${n.gemstone}`);
  para(`Recommended mantra (108 repetitions, daily at dawn): ${n.mantra}`);

  heading("Lucky elements", "Shubha");
  para(`Colours: ${n.luckyColors}`);
  para(`Days: ${n.luckyDays}`);
  para(`Numbers: ${n.luckyNumbers}`);

  // ----- Closing -----
  heading("A closing note", "Antim Vachan");
  para("A kundli is a map, not a destiny. The planets describe terrain — you remain the traveller. " +
    "Read this reading not as a forecast to be obeyed, but as a mirror to be consulted in stillness. " +
    "May your path be filled with quiet courage, sweet relationships and steady remembrance of the divine.");

  footer();
  doc.save(`AstroSatya-Kundli-${(k.input.name || "Seeker").replace(/\s+/g, "-")}.pdf`);
}