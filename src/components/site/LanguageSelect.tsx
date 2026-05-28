import { useEffect, useRef, useState } from "react";
import { Languages, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { LANGUAGES, findLanguage } from "@/lib/languages";
import { cn } from "@/lib/utils";

interface Props {
  value: string;                 // language code
  onChange: (code: string) => void;
  id?: string;
}

export function LanguageSelect({ value, onChange, id }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrap = useRef<HTMLDivElement>(null);

  const norm = (s: string) => s.toLowerCase();
  const q = norm(query);
  const list = q
    ? LANGUAGES.filter((l) => norm(l.english).includes(q) || l.native.toLowerCase().includes(q) || norm(l.code).includes(q))
    : LANGUAGES;

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const current = findLanguage(value);

  return (
    <div ref={wrap} className="relative">
      <button
        id={id}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-10 w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 text-sm transition-colors hover:bg-cream/40"
      >
        <span className="flex items-center gap-2">
          <Languages className="h-4 w-4 text-bronze" />
          <span className="font-medium text-charcoal">{current.english}</span>
          <span className="text-warmbrown/70">· {current.native}</span>
        </span>
        <span className="text-xs text-warmbrown/60">change</span>
      </button>

      {open && (
        <div className="absolute z-30 mt-1 w-full overflow-hidden rounded-xl border border-border bg-popover shadow-lift">
          <div className="border-b border-border/60 p-2">
            <Input
              autoFocus
              placeholder="Type a language (e.g. Hindi, हिन्दी, தமிழ்)…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-9"
            />
          </div>
          <ul className="max-h-72 overflow-auto p-1">
            {list.length === 0 && (
              <li className="px-3 py-2 text-sm text-warmbrown/70">No matches</li>
            )}
            {list.map((l) => {
              const sel = l.code === value;
              return (
                <li key={l.code}>
                  <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); onChange(l.code); setOpen(false); setQuery(""); }}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm",
                      sel ? "bg-cream text-charcoal" : "text-warmbrown hover:bg-cream/60",
                    )}
                  >
                    <span className="flex flex-col">
                      <span className="font-medium text-charcoal">{l.english}</span>
                      <span className="text-xs text-warmbrown/70">{l.native} · {l.greeting}</span>
                    </span>
                    {sel && <Check className="h-4 w-4 text-saffron" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}