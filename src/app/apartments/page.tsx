import type { Metadata } from "next";
import Link from "next/link";
import { LISTINGS } from "@/lib/listings";
import { JsonLd, breadcrumb } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Apartments",
  description:
    "Browse all NourNest serviced apartments in Canary Wharf, Kensington, and the City of London. Fully equipped, all bills included, flexible stays.",
};

export default function ApartmentsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", url: "https://nournestapartments.com" },
          { name: "Apartments", url: "https://nournestapartments.com/apartments" },
        ])}
      />
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-sm uppercase tracking-widest text-stone-500">Our spaces</p>
        <h1 className="mt-3 font-serif text-5xl sm:text-6xl text-stone-900">All NourNest apartments.</h1>
        <p className="mt-6 max-w-2xl text-stone-700">
          Step inside our stylish apartments nestled in London&rsquo;s vibrant neighbourhoods. Every
          space is fully equipped, every bill is included, and every booking is supported by named team
          members, not call centres.
        </p>

        <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {LISTINGS.map((l) => (
            <Link
              key={l.slug}
              href={`/apartments/${l.slug}`}
              className="group rounded-2xl overflow-hidden bg-white border border-stone-200 hover:shadow-lg transition"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={l.heroImage}
                alt={`${l.title} interior`}
                className="aspect-[4/3] w-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="p-6">
                <p className="text-xs uppercase tracking-widest text-stone-500">{l.areaLabel}</p>
                <h2 className="mt-2 font-serif text-2xl text-stone-900 group-hover:underline underline-offset-4">
                  {l.title}
                </h2>
                <p className="mt-2 text-sm text-stone-600">{l.shortDescription}</p>
                <div className="mt-4 flex justify-between text-sm text-stone-700">
                  <span>
                    {l.bedrooms > 0 ? `${l.bedrooms} bed` : "Studio"} · {l.bathrooms} bath{l.sizeSqm > 0 ? ` · ${l.sizeSqm} sqm` : ""}
                  </span>
                  <span className="font-medium text-stone-900">Save 10% or more →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
