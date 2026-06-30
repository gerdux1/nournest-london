import type { Metadata } from "next";
import Link from "next/link";
import { LOCATIONS } from "@/lib/listings";
import { JsonLd, breadcrumb } from "@/lib/schema";
import { Planner } from "./Planner";

export const metadata: Metadata = {
  title: "London Trip Planner · Build Your Personalised Itinerary",
  description:
    "Plan your perfect London stay in under a minute. Tell us who's travelling and what you love, and NourNest builds a personalised, day-by-day London itinerary — tailored to families, couples, business and group trips across Shoreditch, Hackney, Islington and Borough & Pimlico.",
  alternates: { canonical: "https://nournestapartments.com/london-planner" },
};

const FAQ = [
  {
    q: "What is the NourNest London planner?",
    a: "It's a free tool that builds you a personalised, day-by-day London itinerary based on who you're travelling with, how long you're staying, the neighbourhood you're in and what you love to do. You answer a few quick questions and we email you a tailored plan.",
  },
  {
    q: "Which is the best area of London to stay in for families?",
    a: "For families we usually point to Borough & Pimlico — riverside walks, Tate Modern, Borough Market and quieter Regency streets, ten minutes from Waterloo. The planner tailors picks to your children's ages and a gentler pace.",
  },
  {
    q: "Where should I stay in London for a business trip?",
    a: "Old Street & Shoreditch puts you minutes from the City with great client-dinner options on the doorstep, while Islington & Angel offers fast links to King's Cross. The planner builds a walkable plan around your base.",
  },
  {
    q: "Is the London planner free?",
    a: "Yes. The planner is completely free — we just ask for an email so we can send you your full itinerary and the occasional London tip. You can unsubscribe at any time.",
  },
];

export default function LondonPlannerPage() {
  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", url: "https://nournestapartments.com" },
          { name: "London Planner", url: "https://nournestapartments.com/london-planner" },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "NourNest London Trip Planner",
          url: "https://nournestapartments.com/london-planner",
          applicationCategory: "TravelApplication",
          operatingSystem: "Web",
          offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
          provider: { "@type": "Organization", name: "NourNest", url: "https://nournestapartments.com" },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />

      {/* Immersive hero */}
      <section className="relative flex min-h-[72vh] items-end overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/locations/borough-pimlico.jpg"
          alt="London at dusk"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#21372F]/85 via-[#21372F]/45 to-[#FFFBF2]" />
        <div className="relative mx-auto w-full max-w-7xl px-6 pb-32 pt-28">
          <p className="text-sm uppercase tracking-[0.3em] text-[#FFDE59]">London planner</p>
          <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-[1.05] text-white sm:text-6xl lg:text-7xl">
            Your perfect London stay, planned in a minute.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/90">
            Tell us who&rsquo;s travelling and what you love. We&rsquo;ll build a personalised, day-by-day
            itinerary around the neighbourhoods we know best — with tube tips from your front door.
          </p>
          <div className="mt-7 flex flex-wrap gap-2.5">
            {["Free", "Under a minute", "🚇 Tube tips from your base", "🏠 Built around our flats"].map((t) => (
              <span key={t} className="rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* The planner — floating over the hero */}
      <section className="relative z-10 mx-auto -mt-24 max-w-3xl px-6 pb-20">
        <div className="rounded-3xl shadow-[0_40px_90px_-30px_rgba(33,55,47,0.45)]">
          <Planner />
        </div>
      </section>

      {/* By neighbourhood — the SEO cluster */}
      <section className="mx-auto max-w-7xl px-6 pb-14">
        <h2 className="font-serif text-3xl text-[#385B4F]">London by neighbourhood</h2>
        <p className="mt-3 max-w-2xl text-[#555555] leading-relaxed">
          Your plan is built around one of our London neighbourhoods. Explore each area — where to eat,
          what to see, and the apartments we manage there.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {LOCATIONS.map((loc) => (
            <Link
              key={loc.slug}
              href={`/locations/${loc.slug}`}
              className="group block overflow-hidden rounded-3xl border border-[#EAECE2] bg-white transition hover:shadow-xl"
            >
              <div className="relative h-48 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={loc.heroImage} alt={loc.label} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                <h3 className="absolute bottom-3 left-5 font-serif text-2xl text-white">{loc.label}</h3>
              </div>
              <div className="p-6">
                <p className="text-[#555555] leading-relaxed">{loc.description}</p>
                <span className="mt-4 inline-block text-sm font-medium text-[#BF936A]">Explore {loc.shortLabel} →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Tailored by who you travel with — long-tail copy */}
      <section className="mx-auto max-w-7xl px-6 pb-14">
        <h2 className="font-serif text-3xl text-[#385B4F]">Tailored to how you travel</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            { t: "Families with children", b: "Step-free routes, buggy-friendly cafés, parks and an early dinner built into a gentler day." },
            { t: "Couples & weekends", b: "A long lazy breakfast, a standout dinner and an evening worth remembering — the city at its most romantic." },
            { t: "Business & groups", b: "Walkable from your base, with impressive client-dinner options and the City close at hand." },
          ].map((c) => (
            <div key={c.t} className="rounded-3xl border border-[#EAECE2] bg-white p-6">
              <h3 className="font-serif text-xl text-[#385B4F]">{c.t}</h3>
              <p className="mt-2 text-[#555555] leading-relaxed">{c.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 pb-24">
        <h2 className="font-serif text-3xl text-[#385B4F]">London planner — FAQ</h2>
        <div className="mt-8 space-y-6">
          {FAQ.map((f) => (
            <div key={f.q} className="border-b border-[#EAECE2] pb-6">
              <h3 className="font-medium text-lg text-[#385B4F]">{f.q}</h3>
              <p className="mt-2 text-[#555555] leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
