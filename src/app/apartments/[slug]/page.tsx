import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LISTINGS, getListing } from "@/lib/listings";
import { JsonLd, breadcrumb, listingSchema } from "@/lib/schema";

export async function generateStaticParams() {
  return LISTINGS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const listing = getListing(slug);
  if (!listing) return { title: "Apartment not found" };
  return {
    title: listing.title,
    description: listing.shortDescription,
    openGraph: {
      title: `${listing.title} · NourNest`,
      description: listing.shortDescription,
      images: [listing.heroImage],
      url: `https://nournestapartments.com/apartments/${listing.slug}`,
      type: "website",
    },
  };
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = getListing(slug);
  if (!listing) return notFound();

  return (
    <>
      <JsonLd
        data={[
          breadcrumb([
            { name: "Home", url: "https://nournestapartments.com" },
            { name: "Apartments", url: "https://nournestapartments.com/apartments" },
            {
              name: listing.title,
              url: `https://nournestapartments.com/apartments/${listing.slug}`,
            },
          ]),
          listingSchema(listing),
        ]}
      />

      <article className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-sm uppercase tracking-widest text-stone-500">{listing.areaLabel}</p>
        <h1 className="mt-3 font-serif text-5xl sm:text-6xl text-stone-900">{listing.title}</h1>

        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm text-stone-700">
          {listing.bedrooms > 0 ? (
            <span>{listing.bedrooms} bedroom{listing.bedrooms > 1 ? "s" : ""}</span>
          ) : (
            <span>Studio</span>
          )}
          <span>{listing.bathrooms} bathroom{listing.bathrooms > 1 ? "s" : ""}</span>
          <span>Sleeps {listing.maxGuests}</span>
          {listing.sizeSqm > 0 && <span>{listing.sizeSqm} sqm</span>}
          <span className="font-medium text-stone-900">Best direct rate available</span>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={listing.heroImage}
          alt={`${listing.title} interior`}
          className="mt-10 aspect-[16/9] w-full rounded-2xl object-cover"
        />

        {listing.gallery.length > 1 && (
          <div className="mt-4 grid grid-cols-3 gap-4">
            {listing.gallery.slice(0, 3).map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={src}
                alt={`${listing.title} ${i + 1}`}
                className="aspect-[4/3] w-full rounded-xl object-cover"
              />
            ))}
          </div>
        )}

        <div className="mt-12 grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="font-serif text-3xl text-stone-900">About this apartment</h2>
            <p className="mt-5 text-stone-700 leading-relaxed">{listing.longDescription}</p>

            <h2 className="mt-12 font-serif text-3xl text-stone-900">What&rsquo;s included</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 text-stone-700">
              {listing.amenities.map((a) => (
                <li key={a} className="flex items-start gap-2">
                  <span className="mt-1 text-stone-900">✓</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="rounded-2xl border border-stone-200 p-6 h-fit bg-stone-50">
            <p className="text-sm text-stone-600">Direct rate</p>
            <p className="mt-1 font-serif text-2xl text-stone-900">
              Save 10% or more vs Booking.com &amp; Airbnb
            </p>
            <p className="mt-3 text-sm text-stone-700">
              Our direct rate is always at least 10% lower than the same apartment on Booking.com or
              Airbnb, because we don&rsquo;t pay platform commission. Email us for your exact quote
              based on your dates and stay length.
            </p>
            <p className="mt-2 text-xs text-stone-500">
              All bills included. No commission, no OTA fees.
            </p>
            {listing.bookingUrl ? (
              <>
                <a
                  href={listing.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex w-full justify-center rounded-full bg-stone-900 px-6 py-3 text-sm font-medium text-white hover:bg-stone-700 transition"
                >
                  Check availability &amp; book →
                </a>
                <Link
                  href={`/contact?listing=${listing.slug}`}
                  className="mt-3 inline-flex w-full justify-center rounded-full border border-stone-900 px-6 py-3 text-sm font-medium text-stone-900 hover:bg-stone-100 transition"
                >
                  Or enquire directly
                </Link>
                <p className="mt-3 text-xs text-stone-500 text-center">
                  Booking secured via Stripe. Direct rate, no OTA fees.
                </p>
              </>
            ) : (
              <>
                <Link
                  href={`/contact?listing=${listing.slug}`}
                  className="mt-6 inline-flex w-full justify-center rounded-full bg-stone-900 px-6 py-3 text-sm font-medium text-white hover:bg-stone-700 transition"
                >
                  Enquire about this apartment
                </Link>
                <p className="mt-3 text-xs text-stone-500 text-center">
                  We&rsquo;ll come back with availability and your direct rate.
                </p>
              </>
            )}
            <Link
              href="/apartments"
              className="mt-4 inline-flex w-full justify-center text-sm text-stone-700 hover:text-stone-900 underline underline-offset-4"
            >
              View all apartments
            </Link>
          </aside>
        </div>
      </article>
    </>
  );
}
