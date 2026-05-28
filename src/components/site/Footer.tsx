import { Link } from "@tanstack/react-router";
import logo from "@/assets/astrosatya-logo.png";

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
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="AstroSatya" className="h-10 w-auto" width={1024} height={1024} />
              <span className="font-display text-xl tracking-tight text-[oklch(0.95_0.02_82)]">
                Astro<span className="text-saffron" style={{ fontFamily: '"Hind", "Noto Sans Devanagari", sans-serif', fontWeight: 600 }}>सत्य</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[oklch(0.78_0.025_75)]">
              Ancient Vedic wisdom, thoughtfully designed for modern life. Discover your cosmic truth.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-8 md:grid-cols-2">
            <FooterCol title="Explore" links={[["Kundli", "/kundli"], ["Horoscope", "/horoscope"], ["Matchmaking", "/matchmaking"]]} />
            <FooterCol title="Company" links={[["About", "/about"], ["Contact", "/contact"], ["Privacy", "#"]]} />
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-[oklch(0.7_0.02_75)] sm:flex-row">
          <p>© {new Date().getFullYear()} AstroSatya.</p>
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