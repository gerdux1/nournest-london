import Link from "next/link";
import { LISTINGS, LOCATIONS } from "@/lib/listings";
import { JsonLd, breadcrumb } from "@/lib/schema";

// "What We Offer" amenity tiles — sourced from Elaine's Canva Home draft
const OFFERINGS = [
  {
    title: "Kitchen & Dining",
    items: ["Fully equipped kitchen", "Spacious dining areas", "Modern appliances", "Complimentary coffee and tea"],
  },
  {
    title: "Comfort & Relaxation",
    items: ["Spacious bedrooms and bathrooms", "Washing machine and dryer", "High-quality bedding", "Blackout curtains"],
  },
  {
    title: "Convenience & Accessibility",
    items: ["Self check-in", "Guidebook for assistance", "Luggage drop-off available", "Free parking on selected properties"],
  },
  {
    title: "Work Productively",
    items: ["Dedicated workspaces", "High-speed internet", "Ample lighting"],
  },
  {
    title: "Entertainment & Connectivity",
    items: ["Free Wi-Fi throughout", "Smart TV", "Streaming services", "Board games"],
  },
  {
    title: "Essentials",
    items: ["Fresh towels and linens", "Shampoo, soap, conditioner", "Hairdryer", "Iron and ironing board"],
  },
];

const DIRECT_BENEFITS = [
  {
    title: "Best Rates",
    body: "Book directly for the best rates and enjoy a guaranteed discount of 10% or more on every stay.",
  },
  {
    title: "No Booking Fees",
    body: "Avoid hidden fees and unexpected charges when you book directly with us.",
  },
  {
    title: "Welcome Gift on Arrival",
    body: "Receive a complimentary welcome gift to help you settle in and start your stay off right.",
  },
];

export default function Home() {
  return (
    <>
      <JsonLd data={breadcrumb([{ name: "Home", url: "https://nournestapartments.com" }])} />

      {/* Hero */}
      <section className="relative isolate min-h-[85vh] overflow-hidden bg-[#FFFBF2]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=2000&q=80"
          alt="London at sunset"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFFBF2] via-[#FFFBF2]/70 to-[#FFFBF2]" />
        <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col justify-center px-6 py-24 text-center">
          <p className="font-serif text-base sm:text-lg italic text-[#BF936A] tracking-wide">
            Your Gateway to London&rsquo;s Finest Stays
          </p>
          <h1 className="mt-4 font-serif text-5xl sm:text-7xl lg:text-8xl text-[#385B4F] leading-[1.05]">
            NourNest Apartments
          </h1>
          <p className="mt-8 mx-auto max-w-2xl text-lg sm:text-xl text-[#555555]">
            Your cosy sanctuary in the heart of vibrant London. Curated serviced apartments
            for short or medium-term stays, where every stay feels like coming home.
          </p>
          <div className="mt-12 flex justify-center gap-4 flex-wrap">
            <Link
              href="/apartments"
              className="inline-flex items-center rounded-full bg-[#385B4F] px-8 py-3 text-sm font-medium text-[#FFFBF2] hover:bg-[#5a8074] transition"
            >
              Book your stay
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full border border-[#385B4F] px-8 py-3 text-sm font-medium text-[#385B4F] hover:bg-[#385B4F] hover:text-[#FFFBF2] transition"
            >
              Enquire
            </Link>
          </div>
        </div>
      </section>

      {/* Welcome */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="font-serif text-4xl sm:text-5xl text-[#385B4F]">
          Welcome to NourNest Serviced Apartments
        </h2>
        <p className="mt-4 font-serif italic text-lg text-[#BF936A]">
          Your cosy sanctuary in the heart of vibrant London
        </p>
        <p className="mt-10 text-lg text-[#555555] leading-relaxed">
          Whether you&rsquo;re visiting London for a short getaway or a medium-term stay, we have
          accommodations to suit every budget, from comfortable options to luxurious family homes.
          Our spacious, modern apartments are centrally located and equipped with essential
          amenities and top-notch security. With easy access to the best dining and shopping,
          every moment of your stay is a delight. Enjoy fair pricing and seamless, tailored stays
          at NourNest Apartments.
        </p>
        <p className="mt-6 font-serif italic text-[#385B4F]">We can&rsquo;t wait to welcome you.</p>
        <div className="mt-10">
          <Link
            href="/apartments"
            className="inline-flex rounded-full bg-[#385B4F] px-7 py-3 text-sm font-medium text-[#FFFBF2] hover:bg-[#5a8074] transition"
          >
            Book your stay
          </Link>
        </div>
      </section>

      {/* Discover Your Perfect Stay */}
      <section className="bg-[#F3FADC] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-14">
            <h2 className="font-serif text-4xl sm:text-5xl text-[#385B4F]">
              Discover your perfect stay in London
            </h2>
            <p className="mt-4 font-serif italic text-lg text-[#BF936A]">
              Choose your ideal serviced accommodation, and leave the details to us
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {LISTINGS.slice(0, 6).map((l) => (
              <Link
                key={l.slug}
                href={`/apartments/${l.slug}`}
                className="group rounded-2xl overflow-hidden bg-[#FFFBF2] border border-[#EAECE2] hover:shadow-xl transition"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={l.heroImage}
                  alt={`${l.title} interior`}
                  className="aspect-[4/3] w-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="p-6">
                  <p className="text-xs uppercase tracking-widest text-[#BF936A]">{l.areaLabel}</p>
                  <h3 className="mt-2 font-serif text-2xl text-[#385B4F] group-hover:underline underline-offset-4">
                    {l.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#555555]">{l.shortDescription}</p>
                  <div className="mt-4 flex justify-between items-center text-sm text-[#555555]">
                    <span>
                      {l.bedrooms > 0 ? `${l.bedrooms} bed` : "Studio"} · {l.bathrooms} bath
                      {l.sizeSqm > 0 ? ` · ${l.sizeSqm} sqm` : ""}
                    </span>
                    <span className="font-medium text-[#385B4F]">Save 10% or more →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/apartments" className="text-sm font-medium text-[#385B4F] underline underline-offset-4">
              View all apartments →
            </Link>
          </div>
        </div>
      </section>

      {/* Discover London */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="font-serif text-4xl sm:text-5xl text-[#385B4F]">
          Discover London with NourNest Apartments
        </h2>
        <p className="mt-4 font-serif italic text-lg text-[#BF936A]">
          Your perfect base in the heart of London
        </p>
        <p className="mt-10 text-lg text-[#555555] leading-relaxed">
          NourNest Apartments offers a variety of locations, from bustling high-demand areas like
          Mayfair, Kensington, and Covent Garden to serene residential neighbourhoods in Notting
          Hill, Hampstead, and Chelsea. Enjoy easy access to London&rsquo;s top attractions, cultural
          activities, and essential amenities. Whether you&rsquo;re visiting family, planning a getaway,
          or seeking adventure, our properties provide the perfect base for your stay.
        </p>
        <div className="mt-10">
          <Link
            href="/locations"
            className="inline-flex rounded-full border border-[#385B4F] px-7 py-3 text-sm font-medium text-[#385B4F] hover:bg-[#385B4F] hover:text-[#FFFBF2] transition"
          >
            Explore our neighbourhoods
          </Link>
        </div>
      </section>

      {/* What We Offer */}
      <section className="bg-[#EAECE2] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl sm:text-5xl text-[#385B4F]">What we offer</h2>
            <p className="mt-4 font-serif italic text-lg text-[#BF936A]">
              Discover our premium amenities and services for a seamless stay
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {OFFERINGS.map((o) => (
              <div key={o.title} className="rounded-2xl bg-[#FFFBF2] p-8">
                <h3 className="font-serif text-2xl text-[#385B4F]">{o.title}</h3>
                <ul className="mt-5 space-y-2 text-[#555555]">
                  {o.items.map((it) => (
                    <li key={it} className="flex items-start gap-2">
                      <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[#BF936A]" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Book Direct */}
      <section className="bg-[#385B4F] text-[#FFFBF2] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl sm:text-5xl">Book direct</h2>
            <p className="mt-4 font-serif italic text-lg text-[#FFDE59]">
              Unlock exclusive benefits with NourNest Apartments
            </p>
          </div>
          <div className="grid gap-10 md:grid-cols-3 text-center">
            {DIRECT_BENEFITS.map((b) => (
              <div key={b.title}>
                <h3 className="font-serif text-3xl text-[#FFDE59]">{b.title}</h3>
                <p className="mt-4 text-[#F3FADC] leading-relaxed">{b.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-14 text-center">
            <Link
              href="/contact"
              className="inline-flex rounded-full bg-[#FFDE59] px-8 py-3 text-sm font-medium text-[#385B4F] hover:bg-[#BF936A] hover:text-[#FFFBF2] transition"
            >
              Book your stay now
            </Link>
          </div>
        </div>
      </section>

      {/* Locations grid */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center mb-14">
          <h2 className="font-serif text-4xl sm:text-5xl text-[#385B4F]">London neighbourhoods</h2>
          <p className="mt-4 font-serif italic text-lg text-[#BF936A]">
            Curated London apartments across seven neighbourhoods
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
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
                <p className="text-xs uppercase tracking-widest text-[#F3FADC]">
                  ~{loc.propertyCountApprox} apartments
                </p>
                <h3 className="mt-2 font-serif text-3xl">{loc.label}</h3>
                <p className="mt-2 text-sm text-[#F3FADC] line-clamp-3">{loc.description}</p>
                <p className="mt-4 text-sm font-medium underline underline-offset-4">
                  Explore {loc.shortLabel} →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="font-serif text-4xl sm:text-5xl text-[#385B4F]">
          Ready to feel at home in London?
        </h2>
        <p className="mt-6 font-serif italic text-lg text-[#BF936A]">
          We can&rsquo;t wait to welcome you.
        </p>
        <div className="mt-10 flex justify-center gap-4 flex-wrap">
          <Link
            href="/apartments"
            className="inline-flex rounded-full bg-[#385B4F] px-8 py-3 text-sm font-medium text-[#FFFBF2] hover:bg-[#5a8074] transition"
          >
            Browse apartments
          </Link>
          <Link
            href="/contact"
            className="inline-flex rounded-full border border-[#385B4F] px-8 py-3 text-sm font-medium text-[#385B4F] hover:bg-[#385B4F] hover:text-[#FFFBF2] transition"
          >
            Enquire now
          </Link>
        </div>
      </section>
    </>
  );
}
