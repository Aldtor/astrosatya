import { createFileRoute } from "@tanstack/react-router";
import { SectionHeading, PlanCard } from "@/routes/index";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — AstroSatya" },
      { name: "description", content: "Simple, generous pricing for your cosmic journey. Free forever for basics, Premium and Pro for deeper guidance." },
      { property: "og:title", content: "Pricing — AstroSatya" },
      { property: "og:description", content: "Simple, generous, soulful pricing." },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <main className="bg-ivory">
      <section className="bg-gradient-sky py-20">
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <span className="ornament-divider mx-auto max-w-[220px] text-xs uppercase tracking-[0.3em] text-bronze">Membership</span>
          <h1 className="mt-6 font-display text-5xl leading-tight text-balance sm:text-6xl">Choose your path</h1>
          <p className="mt-5 text-warmbrown/85 leading-relaxed">
            Begin free. Upgrade when your soul asks for more.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            <PlanCard
              name="Free"
              price="₹0"
              tagline="Begin your journey"
              features={["Basic kundli", "Daily horoscope", "Compatibility teaser", "Save 1 chart"]}
              cta="Start free"
              to="/login"
            />
            <PlanCard
              name="Premium"
              featured
              price="₹399"
              period="/month"
              tagline="The complete sanctuary"
              features={[
                "Full kundli with Dasha & dosha",
                "Personalised daily horoscope",
                "Unlimited matchmaking",
                "Unlimited saved reports",
                "Yearly forecast PDF",
              ]}
              cta="Begin Premium"
              to="/dashboard"
            />
            <PlanCard
              name="Pro"
              price="₹899"
              period="/month"
              tagline="With astrologer guidance"
              features={[
                "Everything in Premium",
                "Monthly astrologer consult",
                "Priority support",
                "Remedy & ritual library",
                "Family chart bundle",
              ]}
              cta="Go Pro"
              to="/dashboard"
            />
          </div>

          <p className="mt-8 text-center text-sm text-warmbrown/70">
            Cancel anytime. All prices include taxes. Annual billing saves 20%.
          </p>
        </div>
      </section>

      <section className="bg-cream/40 py-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <SectionHeading eyebrow="Pricing FAQ" title="Common questions" />
          <Accordion type="single" collapsible className="mt-12">
            {[
              ["Can I switch plans later?", "Yes. Upgrade or downgrade anytime; we prorate the difference gracefully."],
              ["Is there a free trial of Premium?", "We offer 7 days of Premium when you create your first kundli."],
              ["What payment methods do you accept?", "UPI, all major cards, and net banking across India and globally."],
              ["Do you offer refunds?", "Yes — full refund within 14 days, no questions asked."],
            ].map(([q, a]) => (
              <AccordionItem key={q} value={q} className="border-border">
                <AccordionTrigger className="text-left font-display text-lg hover:no-underline">{q}</AccordionTrigger>
                <AccordionContent className="text-warmbrown/85 leading-relaxed">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </main>
  );
}