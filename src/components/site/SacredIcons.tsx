import type { ReactElement, SVGProps } from "react";

/**
 * Hand-drawn, line-art sacred iconography for AstroSatya.
 * Stroke-based, slightly imperfect, temple-inspired — designed
 * to feel etched rather than generated.
 */

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (p: IconProps) => ({
  width: p.size ?? 28,
  height: p.size ?? 28,
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...p,
});

/* Lotus — Kundli / chart */
export const LotusIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M24 38c-8 0-14-5-14-12 4 1 7 3 9 6" />
    <path d="M24 38c8 0 14-5 14-12-4 1-7 3-9 6" />
    <path d="M24 38c-5-2-8-7-8-13 0-4 2-8 5-11 1 4 2 9 3 13" />
    <path d="M24 38c5-2 8-7 8-13 0-4-2-8-5-11-1 4-2 9-3 13" />
    <path d="M24 38V20c0-5 1-9 0-12-1 3 0 7 0 12v18" />
    <path d="M14 32c4 2 6 4 10 6 4-2 6-4 10-6" opacity=".5" />
  </svg>
);

/* Sun / Surya — Horoscope */
export const SuryaIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="24" cy="24" r="7" />
    <circle cx="24" cy="24" r="3.5" opacity=".5" />
    {Array.from({ length: 12 }).map((_, i) => {
      const a = (i * Math.PI * 2) / 12;
      const x1 = 24 + Math.cos(a) * 11;
      const y1 = 24 + Math.sin(a) * 11;
      const x2 = 24 + Math.cos(a) * (i % 2 ? 16 : 14);
      const y2 = 24 + Math.sin(a) * (i % 2 ? 16 : 14);
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
    })}
  </svg>
);

/* Two intertwined hearts — Matchmaking */
export const MilanIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M18 33c-6-4-9-8-9-13a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5-3 9-9 13z" />
    <path d="M30 39c-6-4-9-8-9-13a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5-3 9-9 13z" opacity=".75" />
  </svg>
);

/* Hourglass + spiral — Dasha timeline */
export const DashaIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M14 8h20M14 40h20" />
    <path d="M14 8c0 8 20 8 20 16s-20 8-20 16" />
    <path d="M34 8c0 8-20 8-20 16s20 8 20 16" />
    <circle cx="24" cy="24" r="2" />
  </svg>
);

/* Shield with eye — Dosha protection */
export const RakshaIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M24 6l14 5v11c0 9-6 16-14 20-8-4-14-11-14-20V11l14-5z" />
    <path d="M16 24c2-3 5-5 8-5s6 2 8 5c-2 3-5 5-8 5s-6-2-8-5z" />
    <circle cx="24" cy="24" r="2" fill="currentColor" />
  </svg>
);

/* Open palm-leaf manuscript — Saved reports */
export const GranthIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M8 12c5-2 11-2 16 2 5-4 11-4 16-2v24c-5-2-11-2-16 2-5-4-11-4-16-2V12z" />
    <path d="M24 14v24" />
    <path d="M12 18h7M12 23h7M12 28h7" opacity=".6" />
    <path d="M29 18h7M29 23h7M29 28h7" opacity=".6" />
  </svg>
);

/* Mandala ornament — decorative divider */
export const MandalaIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="24" cy="24" r="3" />
    <circle cx="24" cy="24" r="9" opacity=".5" />
    <circle cx="24" cy="24" r="16" opacity=".25" />
    {Array.from({ length: 8 }).map((_, i) => {
      const a = (i * Math.PI * 2) / 8;
      return (
        <path
          key={i}
          d={`M24 24 q ${Math.cos(a) * 6} ${Math.sin(a) * 6}, ${Math.cos(a) * 16} ${Math.sin(a) * 16}`}
          opacity=".6"
        />
      );
    })}
  </svg>
);

/* Diya / oil lamp — used in headers */
export const DiyaIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M10 30c3 5 8 8 14 8s11-3 14-8H10z" />
    <path d="M24 30v-4" />
    <path d="M24 22c0-4 2-5 2-8 0-2-1-3-2-4-1 1-2 2-2 4 0 3 2 4 2 8z" />
  </svg>
);

/* Hand-drawn zodiac glyphs (replaces unicode ♈ for consistency) */
export const ZodiacGlyph = ({
  sign,
  ...p
}: IconProps & { sign: string }) => {
  const paths: Record<string, ReactElement> = {
    Aries: <path d="M14 30c0-8 4-12 10-12s10 4 10 12M14 30c0-4-2-6-4-7M34 30c0-4 2-6 4-7" />,
    Taurus: <><circle cx="24" cy="30" r="6" /><path d="M14 16c2 4 6 6 10 6s8-2 10-6" /></>,
    Gemini: <><path d="M14 12h20M14 36h20" /><path d="M18 12v24M30 12v24" /></>,
    Cancer: <><circle cx="17" cy="20" r="4" /><circle cx="31" cy="28" r="4" /><path d="M12 20c0-6 5-10 12-10M36 28c0 6-5 10-12 10" /></>,
    Leo: <><circle cx="18" cy="20" r="5" /><path d="M22 22c2 4 6 8 10 8s6-3 6-6-3-5-6-3" /></>,
    Virgo: <><path d="M12 36V18c0-3 2-5 4-5s4 2 4 5v18M20 36V18c0-3 2-5 4-5s4 2 4 5v18" /><path d="M28 36V20c0-2 2-4 4-4s4 2 4 4c0 8-2 14-8 16" /></>,
    Libra: <><path d="M10 36h28" /><path d="M10 30h28" /><path d="M16 30c0-5 3-9 8-9s8 4 8 9" /></>,
    Scorpio: <><path d="M10 18v14c0 2 2 4 4 4s4-2 4-4V18M18 18v14c0 2 2 4 4 4s4-2 4-4V18M26 18v14c0 2 2 4 4 4l8-6" /><path d="M34 30l4 4-2-6" /></>,
    Sagittarius: <><path d="M12 36L36 12" /><path d="M28 12h8v8" /><path d="M18 24l6 6" /></>,
    Capricorn: <><path d="M10 18v14c0 2 2 4 4 4s4-2 4-4V18M18 18v14c0 2 2 4 4 4s4-2 4-4V18" /><circle cx="32" cy="30" r="4" /></>,
    Aquarius: <><path d="M10 22l5-4 5 4 5-4 5 4 5-4" /><path d="M10 30l5-4 5 4 5-4 5 4 5-4" /></>,
    Pisces: <><path d="M14 14c4 4 6 6 6 10s-2 6-6 10M34 14c-4 4-6 6-6 10s2 6 6 10" /><path d="M14 24h20" /></>,
  };
  return <svg {...base(p)}>{paths[sign]}</svg>;
};
