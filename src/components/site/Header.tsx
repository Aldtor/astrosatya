import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

const nav = [
  { to: "/kundli", label: "Kundli" },
  { to: "/horoscope", label: "Horoscope" },
  { to: "/matchmaking", label: "Matchmaking" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link to="/" className="flex items-center gap-3 group">
          <img src={logo} alt="AstroSatya Logo" className="h-10 w-auto" width={1024} height={1024} />
          <span className="text-lg font-semibold text-foreground tracking-tight">AstroSatya</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={cn(
                "text-sm transition-colors hover:text-foreground",
                pathname === n.to ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button asChild size="sm" className="bg-gradient-gold text-primary-foreground shadow-gold hover:opacity-95">
            <Link to="/kundli">Generate Kundli</Link>
          </Button>
        </div>

        <button
          aria-label="Open menu"
          className="md:hidden rounded-md p-2 text-foreground"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/60 bg-background animate-rise">
          <div className="flex flex-col gap-1 px-5 py-4">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {n.label}
              </Link>
            ))}
            <div className="mt-2 px-3">
              <Button asChild className="w-full bg-gradient-gold text-primary-foreground">
                <Link to="/kundli" onClick={() => setOpen(false)}>Generate Kundli</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}