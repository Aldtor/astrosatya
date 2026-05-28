import { Link } from "@tanstack/react-router";
import { Instagram, Twitter, Youtube, Facebook } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import logo from "@/assets/astro-logo.png";

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-gradient-dark text-[oklch(0.92_0.018_82)]">
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]">
        <div className="absolute -top-32 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full border border-[oklch(0.78_0.12_75)]" />
        <div className="absolute -top-20 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full border border-[oklch(0.78_0.12_75)]" />
        <div className="absolute -top-10 left-1/2 h-[220px] w-[220px] -translate-x-1/2 rounded-full border border-[oklch(0.78_0.12_75)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="AstroSatya" className="h-10 w-auto" width={1024} height={1024} />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[oklch(0.78_0.025_75)]">
              Ancient Vedic wisdom, thoughtfully designed for modern life. Discover your cosmic truth.
            </p>
            <div className="mt-6 flex gap-3">
              {[Instagram, Twitter, Youtube, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/10 transition-colors hover:border-[oklch(0.78_0.12_75)] hover:text-[oklch(0.85_0.12_75)]"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-5 md:grid-cols-3">
            <FooterCol title="Explore" links={[["Kundli", "/kundli"], ["Horoscope", "/horoscope"], ["Matchmaking", "/matchmaking"]]} />
            <FooterCol title="Account" links={[["Dashboard", "/dashboard"], ["Pricing", "/pricing"], ["Sign in", "/login"]]} />
            <FooterCol title="Company" links={[["About", "/about"], ["Contact", "/contact"], ["Privacy", "#"]]} />
          </div>

          <div className="md:col-span-3">
            <h4 className="font-display text-lg text-[oklch(0.97_0.018_85)]">Weekly cosmic letter</h4>
            <p className="mt-2 text-sm text-[oklch(0.78_0.025_75)]">
              Gentle guidance delivered every Sunday.
            </p>
            <form className="mt-4 flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <Input
                type="email"
                placeholder="you@stars.com"
                className="border-white/15 bg-white/5 text-[oklch(0.97_0.018_85)] placeholder:text-[oklch(0.65_0.02_75)]"
              />
              <Button type="submit" className="bg-gradient-gold text-[oklch(0.18_0_0)] hover:opacity-95">
                Join
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-[oklch(0.7_0.02_75)] sm:flex-row">
          <p>© {new Date().getFullYear()} AstroSatya. Crafted with reverence.</p>
          <p>Discover Your Cosmic Truth</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h5 className="text-sm font-medium uppercase tracking-wider text-[oklch(0.85_0.05_75)]">{title}</h5>
      <ul className="mt-4 space-y-2 text-sm">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link to={href as any} className="text-[oklch(0.82_0.025_75)] transition-colors hover:text-[oklch(0.92_0.1_75)]">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}