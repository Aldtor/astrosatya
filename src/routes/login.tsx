import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — AstroSatya" },
      { name: "description", content: "Sign in to access your kundli, saved reports and personalised horoscope." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-gradient-dark lg:block">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold animate-slow-spin" />
          <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold" />
          <div className="absolute left-1/2 top-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold" />
        </div>
        <div className="relative grid h-full place-items-center p-12 text-center text-[oklch(0.92_0.05_75)]">
          <div>
            <Sparkles className="mx-auto h-7 w-7 text-[oklch(0.85_0.12_70)]" />
            <h2 className="mt-6 font-display text-5xl leading-tight text-[oklch(0.97_0.018_85)]">
              Welcome to your sanctuary
            </h2>
            <p className="mt-6 mx-auto max-w-md text-[oklch(0.82_0.025_75)]">
              Your kundli, daily guidance and saved readings — held with care, waiting for you.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center bg-ivory px-6 py-12">
        <div className="w-full max-w-sm">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-gold shadow-gold">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </span>
            <span className="font-display text-xl">AstroSatya</span>
          </Link>

          <h1 className="mt-10 font-display text-4xl">
            {mode === "login" ? "Welcome back" : "Begin your journey"}
          </h1>
          <p className="mt-2 text-warmbrown/85">
            {mode === "login" ? "Sign in to continue." : "Create an account in seconds."}
          </p>

          <form className="mt-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
            {mode === "signup" && (
              <div>
                <Label className="mb-2 block text-xs uppercase tracking-wider text-warmbrown/80">Name</Label>
                <Input placeholder="Your name" />
              </div>
            )}
            <div>
              <Label className="mb-2 block text-xs uppercase tracking-wider text-warmbrown/80">Email</Label>
              <Input type="email" placeholder="you@email.com" />
            </div>
            <div>
              <Label className="mb-2 block text-xs uppercase tracking-wider text-warmbrown/80">Password</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <Button asChild size="lg" className="w-full bg-gradient-gold text-primary-foreground shadow-gold hover:opacity-95">
              <Link to="/dashboard">{mode === "login" ? "Sign in" : "Create account"}</Link>
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-warmbrown/80">
            {mode === "login" ? "New to AstroSatya?" : "Already have an account?"}{" "}
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="font-medium text-saffron hover:underline"
            >
              {mode === "login" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}