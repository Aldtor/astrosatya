import { createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutGrid, Sparkles, Sun, Heart, BookOpen, Settings, ArrowRight, Bell, LogOut,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger,
  SidebarHeader, SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — AstroSatya" },
      { name: "description", content: "Your personal cosmic dashboard — kundlis, horoscopes, dasha and saved reports." },
    ],
  }),
  component: DashboardPage,
});

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { to: "/kundli", label: "My Kundlis", icon: Sparkles },
  { to: "/horoscope", label: "Horoscope", icon: Sun },
  { to: "/matchmaking", label: "Matchmaking", icon: Heart },
  { to: "/dashboard", label: "Saved Reports", icon: BookOpen },
  { to: "/dashboard", label: "Settings", icon: Settings },
] as const;

function DashboardPage() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-ivory">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/60 bg-background/85 px-5 backdrop-blur-md sm:px-8">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <div>
                <p className="text-xs uppercase tracking-wider text-warmbrown/70">Welcome back</p>
                <p className="font-display text-lg leading-none">Aanya</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon"><Bell className="h-4 w-4" /></Button>
              <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
                <Link to="/">Back to site</Link>
              </Button>
            </div>
          </header>

          <main className="flex-1 p-5 sm:p-8">
            <div className="mx-auto max-w-7xl">
              <h1 className="font-display text-4xl">Your cosmic sanctuary</h1>
              <p className="mt-2 text-warmbrown/80">A quiet view of your charts, guidance and saved insights.</p>

              <div className="mt-10 grid auto-rows-min gap-5 md:grid-cols-6">
                {/* Today's horoscope (large) */}
                <div className="md:col-span-4 rounded-3xl border border-border bg-gradient-to-br from-card via-cream/60 to-sand/60 p-7 shadow-soft">
                  <p className="text-xs uppercase tracking-wider text-bronze">Today · Cancer</p>
                  <h2 className="mt-3 font-display text-3xl leading-snug text-balance">
                    "A small kindness shared in the morning returns to you, beautifully, by evening."
                  </h2>
                  <div className="mt-6 flex flex-wrap gap-2 text-sm">
                    <span className="rounded-full border border-gold/40 bg-card px-3 py-1 text-warmbrown">Lucky color · Saffron</span>
                    <span className="rounded-full border border-gold/40 bg-card px-3 py-1 text-warmbrown">Number · 7</span>
                    <span className="rounded-full border border-gold/40 bg-card px-3 py-1 text-warmbrown">Match · Pisces</span>
                  </div>
                  <Button asChild className="mt-7 bg-gradient-gold text-primary-foreground shadow-gold hover:opacity-95">
                    <Link to="/horoscope">Read full horoscope <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </div>

                {/* Current Dasha */}
                <div className="md:col-span-2 rounded-3xl border border-border bg-card p-7 shadow-soft">
                  <p className="text-xs uppercase tracking-wider text-bronze">Current Mahadasha</p>
                  <p className="mt-2 font-display text-3xl">Jupiter</p>
                  <p className="text-sm text-warmbrown/80">2021 — 2037</p>
                  <div className="mt-6">
                    <div className="flex items-center justify-between text-xs text-warmbrown/70">
                      <span>Progress</span><span>32%</span>
                    </div>
                    <Progress value={32} className="mt-2 h-2 bg-sand [&>*]:bg-gradient-gold" />
                  </div>
                  <p className="mt-5 text-sm text-warmbrown/85">
                    A long, gentle period of wisdom and expansion. Pratyantar: Venus.
                  </p>
                </div>

                {/* Zodiac summary */}
                <div className="md:col-span-2 rounded-3xl border border-border bg-card p-7 shadow-soft">
                  <p className="text-xs uppercase tracking-wider text-bronze">Zodiac Summary</p>
                  <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                    <ZTile label="Sun" v="Aries" g="♈" />
                    <ZTile label="Moon" v="Cancer" g="♋" />
                    <ZTile label="Asc" v="Libra" g="♎" />
                  </div>
                </div>

                {/* Saved reports */}
                <div className="md:col-span-4 rounded-3xl border border-border bg-card p-7 shadow-soft">
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-wider text-bronze">Saved reports</p>
                    <Link to="/kundli" className="text-sm text-saffron hover:underline">View all</Link>
                  </div>
                  <ul className="mt-5 divide-y divide-border">
                    {[
                      ["My Kundli", "Generated · 12 Aug 2024"],
                      ["Compatibility · Aanya & Rohan", "Matched · 04 Sep 2024"],
                      ["Yearly Forecast 2025", "Saved · 22 Dec 2024"],
                    ].map(([t, d]) => (
                      <li key={t} className="flex items-center justify-between py-4">
                        <div>
                          <p className="font-medium text-charcoal">{t}</p>
                          <p className="text-sm text-warmbrown/75">{d}</p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-warmbrown hover:bg-cream">Open</Button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function ZTile({ label, v, g }: { label: string; v: string; g: string }) {
  return (
    <div className="rounded-2xl border border-border bg-ivory p-4">
      <p className="text-[10px] uppercase tracking-wider text-warmbrown/70">{label}</p>
      <p className="mt-1 font-display text-2xl text-saffron">{g}</p>
      <p className="text-xs text-warmbrown">{v}</p>
    </div>
  );
}

function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2 px-2 py-1">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-gold shadow-gold">
            <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
          </span>
          <span className="font-display text-lg">AstroSatya</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigate</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((n) => (
                <SidebarMenuItem key={n.label}>
                  <SidebarMenuButton asChild isActive={pathname === n.to}>
                    <Link to={n.to} className={cn("flex items-center gap-2")}>
                      <n.icon className="h-4 w-4" />
                      <span>{n.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/" className="flex items-center gap-2 text-warmbrown">
                <LogOut className="h-4 w-4" /> <span>Sign out</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}