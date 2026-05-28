import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format, parse, isValid } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  value: string; // ISO yyyy-MM-dd
  onChange: (v: string) => void;
  required?: boolean;
}

export function DateOfBirthPicker({ value, onChange, required }: Props) {
  const [open, setOpen] = useState(false);
  const selected = value ? parse(value, "yyyy-MM-dd", new Date()) : undefined;
  const display = selected && isValid(selected) ? format(selected, "d MMMM yyyy") : "Pick your date of birth";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "h-10 w-full justify-between border-input bg-background px-3 font-normal",
            !value && "text-warmbrown/60",
          )}
        >
          <span>{display}</span>
          <CalendarIcon className="h-4 w-4 text-bronze" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(d) => {
            if (d) {
              onChange(format(d, "yyyy-MM-dd"));
              setOpen(false);
            }
          }}
          captionLayout="dropdown"
          fromYear={1925}
          toYear={new Date().getFullYear()}
          defaultMonth={selected ?? new Date(1995, 0, 1)}
          disabled={(d) => d > new Date() || d < new Date("1925-01-01")}
          initialFocus
          className={cn("p-3 pointer-events-auto")}
        />
      </PopoverContent>
      {required && <input tabIndex={-1} aria-hidden className="sr-only" required value={value} onChange={() => {}} />}
    </Popover>
  );
}