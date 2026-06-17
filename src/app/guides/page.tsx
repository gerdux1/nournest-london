import type { Metadata } from "next";
import Link from "next/link";
import { LOCATIONS } from "@/lib/listings";
import { JsonLd, breadcrumb } from "@/lib/schema";

export const metadata: Metadata = {
  title: "London Guides · Things to See & Do",
  description:
    "NourNest's guide to London by neighbourhood — markets, food, culture and the best of each area, from someone who lives a few doors down. Old Street & Shoreditch, Hackney, Islington & Angel, Borough & Pimlico.",
};

const THEMES = [
  {
    t: "Eat & drink",
    b: "Borough Market for breakfast, Broadway Market on a Saturday, Brick Lane after dark, and Upper Street when you want to be looked after. Every NourNest area is food-led.",
  },
  {
    t: "Markets & green space",
    b: "Columbia Road flowers on a Sunday, Spitalfields antiques, Victoria Park and the Regent's Canal towpath — slow London, a short walk from your door.",
  },
  {
    t: "Culture & theatre",
    b: "Tate Modern and the Globe on the South Bank, the Almeida and Sadler's Wells in Islington, Whitechapel Gallery and the street art of Shoreditch.",
  },
  {
    t: "Getting around",
    b: "All four neighbourhoods sit minutes from the City, with fast links from Liverpool Street, King's Cross and London Bridge — the rest of London, and the trains out of it, are easy.",
  },
];

function Tick() {
  return (
    <svg className="mt-1 shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#385B4F" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export default function GuidesIndexPage() {
  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", url: "https://nournestapartments.com" },
          { name: "London Guides", url: "https://nournestapartments.com/guides" },
        ])}
      />

      {/* Intro */}
      <section className="mx-auto max-w-7xl px-6 pt-24 pb-12">
        <p className="text-sm uppercase tracking-widest text-[#BF936A]">London guides</p>
        <h1 className="mt-3 font-serif text-5xl sm:text-6xl text-[#385B4F]">London, from your doorstep.</h1>
        <p className="mt-6 max-w-2xl text-lg text-[#555555] leading-relaxed">
          We don&rsquo;t just hand you keys. Each NourNest neighbourhood comes with a little
          local knowledge — where to eat, what to see, and how to spend a free morning — written
          by people who live a few doors down.
        </p>
      </section>

      {/* By neighbourhood */}
      <section className="mx-auto max-w-7xl px-6 pb-8">
        <h2 className="font-serif text-3xl text-[#385B4F]">Guides by neighbourhood</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {LOCATIONS.map((loc) => (
            <Link
              key={loc.slug}
              href={`/locations/${loc.slug}`}
              className="group block overflow-hidden rounded-3xl border border-[#EAECE2] bg-white transition hover:shadow-xl"
            >
              <div className="relative h-56 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={loc.heroImage}
                  alt={loc.label}
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#385B4F]/70 to-transparent" />
                <h3 className="absolute bottom-4 left-6 font-serif text-3xl text-[#FFFBF2]">{loc.label}</h3>
              </div>
              <div className="p-6">
                <p className="text-[#555555] leading-relaxed">{loc.description}</p>
                <ul className="mt-5 space-y-2 text-sm text-[#555555]">
                  {loc.nearbyHighlights.slice(0, 3).map((h) => (
                    <li key={h} className="flex gap-2">
                      <Tick />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-sm font-medium text-[#385B4F] underline underline-offset-4 decoration-[#BF936A] group-hover:decoration-[#385B4F]">
                  Read the {loc.shortLabel} guide &rarr;
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* By interest */}
      <section className="bg-[#F3FADC] py-20 sm:py-24 mt-12">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="font-serif text-3xl text-[#385B4F]">By interest</h2>
          <p className="mt-3 font-serif italic text-lg text-[#BF936A]">However you like to spend a day in London.</p>
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {THEMES.map((th) => (
              <div key={th.t} className="rounded-3xl bg-white border border-[#EAECE2] p-7">
                <h3 className="font-serif text-2xl text-[#385B4F]">{th.t}</h3>
                <p className="mt-3 text-[#555555] leading-relaxed">{th.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#385B4F] py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-6 text-center text-[#FFFBF2]">
          <h2 className="font-serif text-4xl sm:text-5xl">Pick a neighbourhood, then a home in it.</h2>
          <p className="mt-5 text-lg text-[#F3FADC]">Every apartment puts the best of its area within a short walk.</p>
          <div className="mt-8">
            <Link
              href="/apartments"
              className="inline-flex items-center rounded-full bg-[#FFDE59] px-8 py-3 text-sm font-semibold text-[#385B4F] hover:bg-[#f5d240] transition"
            >
              Browse apartments
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
