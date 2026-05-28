import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { searchPlaces, type Place } from "@/lib/places";
import { cn } from "@/lib/utils";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  id?: string;
}

export function PlaceAutocomplete({ value, onChange, placeholder = "Start typing a city…", required, id }: Props) {
  const [open, setOpen] = useState(false);
  const [hits, setHits] = useState<Place[]>([]);
  const [active, setActive] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHits(searchPlaces(value, 8));
    setActive(0);
  }, [value]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const pick = (p: Place) => {
    onChange(p.name);
    setOpen(false);
  };

  return (
    <div ref={wrap} className="relative">
      <div className="relative">
        <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-warmbrown/60" />
        <Input
          id={id}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={(e) => { onChange(e.target.value); setOpen(true); }}
          onFocus={() => value && setOpen(true)}
          onKeyDown={(e) => {
            if (!open || !hits.length) return;
            if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => (a + 1) % hits.length); }
            else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => (a - 1 + hits.length) % hits.length); }
            else if (e.key === "Enter") { e.preventDefault(); pick(hits[active]); }
            else if (e.key === "Escape") setOpen(false);
          }}
          autoComplete="off"
          className="pl-9"
        />
      </div>
      {open && hits.length > 0 && (
        <ul className="absolute z-30 mt-1 max-h-72 w-full overflow-auto rounded-xl border border-border bg-popover p-1 shadow-lift">
          {hits.map((p, i) => (
            <li key={p.name + i}>
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); pick(p); }}
                onMouseEnter={() => setActive(i)}
                className={cn(
                  "flex w-full items-start gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  i === active ? "bg-cream text-charcoal" : "text-warmbrown hover:bg-cream/60",
                )}
              >
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-bronze" />
                <span>{p.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}