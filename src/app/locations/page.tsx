import type { Metadata } from "next";
import Link from "next/link";
import { LOCATIONS } from "@/lib/listings";
import { JsonLd, breadcrumb } from "@/lib/schema";

export const metadata: Metadata = {
  title: "London Neighbourhoods · Where to Stay",
  description:
    "Explore London by neighbourhood with NourNest — from Old Street & Shoreditch to Hackney, Islington & Angel, and Borough & Pimlico. Find the area that fits your stay.",
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
        <p className="text-sm uppercase tracking-widest text-[#BF936A]">London neighbourhoods</p>
        <h1 className="mt-3 font-serif text-5xl sm:text-6xl text-[#385B4F]">Find your London.</h1>
        <p className="mt-6 max-w-2xl text-lg text-[#555555] leading-relaxed">
          Each NourNest neighbourhood was chosen because we&rsquo;d happily stay there ourselves —
          markets and canals in the east, dining and theatre in the north, riverside culture in the
          south. Explore the area, then settle into an apartment that puts it all on your doorstep.
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
              <div className="absolute inset-0 bg-gradient-to-t from-[#385B4F]/90 via-[#385B4F]/30 to-transparent" />
              <div className="relative flex h-full flex-col justify-end p-7 text-[#FFFBF2]">
                <p className="text-xs uppercase tracking-widest text-[#FFDE59]">
                  ~{loc.propertyCountApprox} {loc.propertyCountApprox === 1 ? "apartment" : "apartments"}
                </p>
                <h2 className="mt-2 font-serif text-3xl">{loc.label}</h2>
                <p className="mt-2 text-sm text-[#F3FADC] line-clamp-3">{loc.description}</p>
                <p className="mt-4 text-sm font-medium underline underline-offset-4 decoration-[#FFDE59]">
                  Explore {loc.shortLabel} &rarr;
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
