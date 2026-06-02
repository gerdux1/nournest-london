import type { Metadata } from "next";
import Link from "next/link";
import { LOCATIONS } from "@/lib/listings";
import { JsonLd, breadcrumb } from "@/lib/schema";

export const metadata: Metadata = {
  title: "London Neighbourhoods",
  description:
    "NourNest operates serviced apartments across seven Central London neighbourhoods, from Regent's Park and Marylebone to Old Street and Shoreditch.",
};

export default function LocationsIndexPage() {
  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", url: "https://nournestapartments.com" },
          { name: "Locations", url: "https://nournestapartments.com/locations" },
        ])}
      />

      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-sm uppercase tracking-widest text-stone-500">London neighbourhoods</p>
        <h1 className="mt-3 font-serif text-5xl sm:text-6xl text-stone-900">Where we live.</h1>
        <p className="mt-6 max-w-2xl text-stone-700">
          NourNest operates apartments across seven neighbourhoods in Central London, each chosen
          because we&rsquo;d happily live there ourselves. Pick the location that fits your stay.
        </p>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {LOCATIONS.map((loc) => (
            <Link
              key={loc.slug}
              href={`/locations/${loc.slug}`}
              className="group relative overflow-hidden rounded-2xl h-96"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={loc.heroImage}
                alt={loc.label}
                className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/85 via-stone-900/30 to-transparent" />
              <div className="relative flex h-full flex-col justify-end p-7 text-white">
                <p className="text-xs uppercase tracking-widest text-stone-200">
                  ~{loc.propertyCountApprox} apartments
                </p>
                <h2 className="mt-2 font-serif text-3xl">{loc.label}</h2>
                <p className="mt-2 text-sm text-stone-100 line-clamp-3">{loc.description}</p>
                <p className="mt-4 text-sm font-medium underline underline-offset-4">
                  Explore {loc.shortLabel} →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
