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
        <p className="text-sm uppercase tracking-widest text-[#BF936A]">{listing.areaLabel}</p>
        <h1 className="mt-3 font-serif text-5xl sm:text-6xl text-[#385B4F]">{listing.title}</h1>

        {/* Visual property summary chips · audit feedback */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-[#555555]">
          <div className="flex items-center gap-2 rounded-xl border border-[#385B4F]/20 bg-[#FFFBF2] px-4 py-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#385B4F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 18v-6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v6" /><path d="M3 21v-3h18v3" />
            </svg>
            <span>{listing.bedrooms > 0 ? `${listing.bedrooms} bedroom${listing.bedrooms > 1 ? "s" : ""}` : "Studio"}</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-[#385B4F]/20 bg-[#FFFBF2] px-4 py-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#385B4F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 6 6.5 3.5a2 2 0 0 1 2.8-2.8L11.8 3" /><path d="M3 12h18v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3z" /><path d="M7 19v2M17 19v2" />
            </svg>
            <span>{listing.bathrooms} bathroom{listing.bathrooms > 1 ? "s" : ""}</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-[#385B4F]/20 bg-[#FFFBF2] px-4 py-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#385B4F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
            <span>Sleeps {listing.maxGuests}</span>
          </div>
          {listing.sizeSqm > 0 ? (
            <div className="flex items-center gap-2 rounded-xl border border-[#385B4F]/20 bg-[#FFFBF2] px-4 py-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#385B4F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" /><path d="m9 3 6 6M3 9l6 6M15 9l6 6M9 15l6 6" />
              </svg>
              <span>{listing.sizeSqm} sqm</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-xl border border-[#385B4F]/20 bg-[#FFFBF2] px-4 py-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#385B4F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="8" cy="12" r="1.5" /><path d="M14 9h4M14 12h4M14 15h2" />
              </svg>
              <span>Self check-in</span>
            </div>
          )}
        </div>

        {/* Quick-scan feature row · icons for key inclusions */}
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#555555]">
          <span className="inline-flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#385B4F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 13a10 10 0 0 1 14 0" /><path d="M8.5 16.5a5 5 0 0 1 7 0" /><circle cx="12" cy="20" r="1" />
            </svg>
            Fast Wi-Fi
          </span>
          <span className="inline-flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#385B4F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 11h18M5 11V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6M5 11l-1 10h16l-1-10" />
            </svg>
            Fitted kitchen
          </span>
          <span className="inline-flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#385B4F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" />
            </svg>
            Washer-dryer
          </span>
          <span className="inline-flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#385B4F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Self check-in
          </span>
          <span className="inline-flex items-center gap-1.5 font-medium text-[#385B4F]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#385B4F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            All bills included
          </span>
          <span className="font-medium text-[#385B4F]">· Best direct rate available</span>
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
            <h2 className="font-serif text-3xl text-[#385B4F]">About this apartment</h2>
            <p className="mt-5 text-[#555555] leading-relaxed">{listing.longDescription}</p>

            <h2 className="mt-12 font-serif text-3xl text-[#385B4F]">What&rsquo;s included</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 text-[#555555]">
              {listing.amenities.map((a) => (
                <li key={a} className="flex items-start gap-2">
                  <span className="mt-1 text-[#385B4F]">✓</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="rounded-2xl border border-[#EAECE2] p-6 h-fit bg-[#F3FADC]">
            <p className="text-sm text-[#555555]">Direct rate</p>
            <p className="mt-1 font-serif text-2xl text-[#385B4F]">
              Save 10% or more vs Booking.com &amp; Airbnb
            </p>
            <p className="mt-3 text-sm text-[#555555]">
              Our direct rate is always at least 10% lower than the same apartment on Booking.com or
              Airbnb, because we don&rsquo;t pay platform commission. Email us for your exact quote
              based on your dates and stay length.
            </p>
            <p className="mt-2 text-xs text-[#555555]/80">
              All bills included. No commission, no OTA fees.
            </p>
            {listing.bookingUrl ? (
              <>
                <a
                  href={listing.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex w-full justify-center rounded-full bg-[#FFDE59] px-6 py-3 text-sm font-medium text-[#385B4F] hover:bg-[#f5d240] transition"
                >
                  Check availability &amp; book →
                </a>
                <Link
                  href={`/contact?listing=${listing.slug}`}
                  className="mt-3 inline-flex w-full justify-center rounded-full border border-[#385B4F] px-6 py-3 text-sm font-medium text-[#385B4F] hover:bg-[#385B4F] hover:text-[#FFFBF2] transition"
                >
                  Or enquire directly
                </Link>
                <p className="mt-3 text-xs text-[#555555]/80 text-center">
                  Booking secured via Stripe. Direct rate, no OTA fees.
                </p>
              </>
            ) : (
              <>
                <Link
                  href={`/contact?listing=${listing.slug}`}
                  className="mt-6 inline-flex w-full justify-center rounded-full bg-[#FFDE59] px-6 py-3 text-sm font-medium text-[#385B4F] hover:bg-[#f5d240] transition"
                >
                  Enquire about this apartment
                </Link>
                <p className="mt-3 text-xs text-[#555555]/80 text-center">
                  We&rsquo;ll come back with availability and your direct rate.
                </p>
              </>
            )}
            <Link
              href="/apartments"
              className="mt-4 inline-flex w-full justify-center text-sm text-[#555555] hover:text-[#385B4F] underline underline-offset-4"
            >
              View all apartments
            </Link>
          </aside>
        </div>
      </article>
    </>
  );
}
