import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LOCATIONS, listingsByArea, getLocation, type AreaSlug } from "@/lib/listings";
import { JsonLd, breadcrumb } from "@/lib/schema";

export async function generateStaticParams() {
  return LOCATIONS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const loc = getLocation(slug as AreaSlug);
  if (!loc) return { title: "Location not found" };
  return {
    title: `${loc.label} apartments`,
    description: loc.description,
    openGraph: {
      title: `${loc.label} apartments · NourNest`,
      description: loc.description,
      images: [loc.heroImage],
      url: `https://nournestapartments.com/locations/${loc.slug}`,
    },
  };
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const loc = getLocation(slug as AreaSlug);
  if (!loc) return notFound();
  const listings = listingsByArea(loc.slug);

  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", url: "https://nournestapartments.com" },
          { name: "Locations", url: "https://nournestapartments.com/locations" },
          { name: loc.label, url: `https://nournestapartments.com/locations/${loc.slug}` },
        ])}
      />

      {/* Neighbourhood hero */}
      <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={loc.heroImage}
          alt={loc.label}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/75 via-stone-900/25 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-14 text-white">
          <p className="text-sm uppercase tracking-widest text-stone-200">
            London neighbourhood · ~{loc.propertyCountApprox} apartments
          </p>
          <h1 className="mt-3 font-serif text-5xl sm:text-7xl leading-[1.05]">{loc.label}</h1>
          <p className="mt-4 max-w-2xl text-stone-100 text-lg">{loc.description}</p>
        </div>
      </section>

      {/* Why stay here */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <h2 className="font-serif text-3xl sm:text-4xl text-stone-900">Why stay in {loc.shortLabel}</h2>
        <p className="mt-6 text-lg text-stone-700 leading-relaxed">{loc.whyStayHere}</p>
      </section>

      {/* Nearby + transport */}
      <section className="bg-stone-100 py-20">
        <div className="mx-auto max-w-7xl px-6 grid gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm uppercase tracking-widest text-stone-500">Nearby</p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl text-stone-900">
              What&rsquo;s around the corner
            </h2>
            <ul className="mt-8 space-y-4">
              {loc.nearbyHighlights.map((h) => (
                <li key={h} className="flex items-start gap-3 text-stone-700">
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-stone-900" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm uppercase tracking-widest text-stone-500">Transport</p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl text-stone-900">
              Getting around
            </h2>
            <ul className="mt-8 space-y-4">
              {loc.transport.map((t) => (
                <li key={t} className="flex items-start gap-3 text-stone-700">
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-stone-900" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Apartments here */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="font-serif text-3xl sm:text-4xl text-stone-900">
          NourNest apartments in {loc.label}
        </h2>
        {listings.length === 0 ? (
          <p className="mt-6 text-stone-600">
            We&rsquo;re onboarding apartments here.{" "}
            <Link href="/contact" className="underline underline-offset-4">Enquire</Link>{" "}
            to be notified when they launch.
          </p>
        ) : (
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {listings.map((l) => (
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
                  <h3 className="font-serif text-2xl text-stone-900 group-hover:underline underline-offset-4">
                    {l.title}
                  </h3>
                  <p className="mt-2 text-sm text-stone-600">{l.shortDescription}</p>
                  <div className="mt-4 flex justify-between items-center text-sm text-stone-700">
                    <span>
                      {l.bedrooms > 0 ? `${l.bedrooms} bed` : "Studio"} · {l.bathrooms} bath{l.sizeSqm > 0 ? ` · ${l.sizeSqm} sqm` : ""}
                    </span>
                    <span className="font-medium text-stone-900">Save 10% or more →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
