import Link from "next/link";
import { LISTINGS, LOCATIONS } from "@/lib/listings";
import { JsonLd, breadcrumb, faqSchema } from "@/lib/schema";

// Common pre-booking questions, answered warmly. Renders as visible accordion AND FAQPage JSON-LD.
const HOMEPAGE_FAQS = [
  {
    question: "How long can I stay?",
    answer:
      "Three nights minimum, no maximum. We host weekly stays, month-long visits, and longer relocations — long-stay pricing kicks in automatically once you cross one week.",
  },
  {
    question: "What is included in the price?",
    answer:
      "Everything you'd expect from home: electricity, water, heating, fast Wi-Fi, council tax, fresh linens and towels, a fully fitted kitchen, smart TV with streaming, and self check-in (smart lock on most apartments, in-person key handover on the rest). Housekeeping on request; mid-stay clean included on long stays. No surprise charges on the way out.",
  },
  {
    question: "How does check-in work?",
    answer:
      "Self check-in. Most apartments use a smart lock — we send your access code by email before you arrive so you can settle in at any hour. A few apartments use in-person key handover at a time that works for you. Either way: no front desk, no waiting around.",
  },
  {
    question: "Are families and groups welcome?",
    answer:
      "Yes, very welcome. Our Shoreditch Flat 5 has four bedrooms and sleeps up to ten guests, perfect for families and groups. Cots and high chairs available on request when you book.",
  },
  {
    question: "Why book direct instead of Booking.com or Airbnb?",
    answer:
      "Our direct rate is always at least 10% lower than the same apartment on Booking.com or Airbnb, because we don't pay platform commission. You also get a real person on email throughout your stay — never a platform support queue.",
  },
  {
    question: "Can I extend my stay?",
    answer:
      "Yes, subject to availability. Just email us at any point during your stay and we'll check the calendar. Long-stay pricing applies automatically once you cross one week.",
  },
] as const;

// "What We Offer" amenity tiles — sourced from Elaine's Canva Home draft
const OFFERINGS = [
  {
    title: "Kitchen & Dining",
    body: "Fully equipped kitchen, spacious dining areas, modern appliances, complimentary coffee and tea.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 11h18M5 11V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6M5 11l-1 10h16l-1-10" />
        <path d="M9 7h.01M12 7h.01M15 7h.01" />
      </svg>
    ),
  },
  {
    title: "Comfort & Relaxation",
    body: "Spacious bedrooms and bathrooms, washing machine, dryer, high-quality bedding, blackout curtains.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 18v-6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v6" />
        <path d="M3 21v-3h18v3" />
        <path d="M6 9V7a2 2 0 0 1 2-2h2v4M14 9V5h2a2 2 0 0 1 2 2v2" />
      </svg>
    ),
  },
  {
    title: "Convenience & Accessibility",
    body: "Free parking on premises, luggage drop-off, guidebook for assistance, self check-in.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 21V8l8-5 8 5v13" />
        <path d="M9 21v-7h6v7" />
        <path d="M2 21h20" />
      </svg>
    ),
  },
  {
    title: "Work Productively",
    body: "Dedicated workspaces, high-speed internet, ample lighting.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="4" width="18" height="12" rx="1.5" />
        <path d="M8 20h8M12 16v4" />
      </svg>
    ),
  },
  {
    title: "Entertainment & Connectivity",
    body: "Free Wi-Fi, smart TV, streaming services, board games.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 13a10 10 0 0 1 14 0" />
        <path d="M8.5 16.5a5 5 0 0 1 7 0" />
        <circle cx="12" cy="20" r="1" />
      </svg>
    ),
  },
  {
    title: "Essentials",
    body: "Towels, shampoo, soap, conditioner, linens, hairdryer, iron and ironing board.",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 3h12l-1 18H7L6 3z" />
        <path d="M9 8h6M9 13h6" />
      </svg>
    ),
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
    body: "A complimentary welcome gift to help you settle in and start your stay off right.",
  },
];

// Featured 3 listings as in Elaine's Canva — picks descriptive 3-bed / 2-bed / 4-bed mix
const FEATURED_SLUGS_PRIORITY = ["shoreditch-flat-5", "old-st-flat-1", "old-st-flat-2"];
const featured = (() => {
  const picked: typeof LISTINGS = [];
  for (const key of FEATURED_SLUGS_PRIORITY) {
    const m = LISTINGS.find(
      (l) => l.slug.includes(key) || l.title.toLowerCase().includes(key.replace("-", " "))
    );
    if (m && !picked.find((p) => p.slug === m.slug)) picked.push(m);
    if (picked.length === 3) break;
  }
  while (picked.length < 3 && LISTINGS[picked.length]) picked.push(LISTINGS[picked.length]);
  return picked;
})();

export default function Home() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumb([{ name: "Home", url: "https://nournestapartments.com" }]),
          faqSchema([...HOMEPAGE_FAQS]),
        ]}
      />

      {/* HERO — full-bleed London photo + white text + tan search bar (Elaine signature) */}
      <section className="relative isolate min-h-[640px] sm:min-h-[700px] lg:min-h-[760px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=2400&q=85"
          alt="London at sunset · Tower Bridge"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/55" />

        <div className="relative mx-auto flex min-h-[640px] sm:min-h-[700px] lg:min-h-[760px] max-w-7xl flex-col justify-center px-6 py-20 lg:py-28">
          <h1 className="font-serif text-5xl sm:text-7xl lg:text-[6rem] leading-[1.02] text-[#FFFBF2] drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)]">
            NourNest Apartments
          </h1>
          <p className="mt-5 font-serif italic text-xl sm:text-2xl lg:text-3xl text-[#FFFBF2]/95 drop-shadow-[0_2px_18px_rgba(0,0,0,0.5)]">
            Your gateway to London&rsquo;s finest stays
          </p>

          {/* Tan search bar widget — visual signature from Elaine's design */}
          <div className="mt-12 max-w-5xl rounded-[28px] bg-[#BF936A]/90 backdrop-blur-sm p-3 sm:p-4 shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr_auto] gap-2 sm:gap-3">
              <div className="rounded-full bg-[#FFFBF2] px-5 py-3 flex items-center gap-2 text-sm text-[#555555]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="text-[#555555]/80">Where to go?</span>
              </div>
              <div className="rounded-full bg-[#FFFBF2] px-5 py-3 flex items-center gap-2 text-sm text-[#555555]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                <span className="text-[#555555]/80">Arrive</span>
              </div>
              <div className="rounded-full bg-[#FFFBF2] px-5 py-3 flex items-center gap-2 text-sm text-[#555555]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                <span className="text-[#555555]/80">Depart</span>
              </div>
              <div className="rounded-full bg-[#FFFBF2] px-5 py-3 flex items-center gap-2 text-sm text-[#555555]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
                <span className="text-[#555555]/80">Guests</span>
              </div>
              <Link
                href="/apartments"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FFDE59] px-6 py-3 text-sm font-semibold text-[#385B4F] hover:bg-[#f5d240] transition"
              >
                <span>Search</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
                </svg>
              </Link>
            </div>
          </div>

          <p className="mt-8 max-w-2xl text-sm sm:text-base text-[#FFFBF2]/90">
            Curated, fully equipped serviced apartments across Central London.
            Warm welcome, housekeeping on request, all bills included.
          </p>
        </div>
      </section>

      {/* WELCOME — text left, arched interior photo right */}
      <section className="bg-[#FFFBF2] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 grid gap-12 lg:gap-16 lg:grid-cols-2 items-center">
          <div>
            <h2 className="font-serif text-4xl sm:text-5xl text-[#385B4F] leading-tight">
              Welcome to NourNest<br />Serviced Apartments
            </h2>
            <p className="mt-5 font-serif italic text-lg sm:text-xl text-[#BF936A]">
              Your cosy sanctuary in the heart of vibrant London
            </p>
            <p className="mt-8 text-base sm:text-lg text-[#555555] leading-relaxed">
              Whether you&rsquo;re visiting London for a short getaway or a medium-term stay, we have
              apartments to suit every traveller, from comfortable studios to spacious family homes.
              Our central, modern apartments come fully equipped with essential amenities,
              housekeeping on request, and a warm welcome on arrival. Every detail is taken care of, so you
              can settle in and feel right at home.
            </p>
            <p className="mt-5 font-serif italic text-[#385B4F]">
              We can&rsquo;t wait to welcome you.
            </p>
            <div className="mt-8">
              <Link
                href="/apartments"
                className="inline-flex items-center rounded-full bg-[#FFDE59] px-7 py-3 text-sm font-semibold text-[#385B4F] hover:bg-[#f5d240] transition"
              >
                Book your stay
              </Link>
            </div>
          </div>

          {/* Arched cutout interior photo */}
          <div className="relative">
            <div
              className="aspect-[4/5] overflow-hidden bg-[#EAECE2]"
              style={{ borderRadius: "50% 50% 12px 12px / 35% 35% 6px 6px" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featured[0]?.heroImage || LISTINGS[0]?.heroImage}
                alt="NourNest apartment interior"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* DISCOVER YOUR PERFECT STAY — lozenge cards (Elaine signature) */}
      <section className="bg-[#FFFBF2] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-14">
            <h2 className="font-serif text-4xl sm:text-5xl text-[#385B4F]">
              Discover your perfect stay in London
            </h2>
            <p className="mt-4 font-serif italic text-lg text-[#BF936A]">
              Choose your ideal serviced accommodation, and leave the details to us
            </p>
          </div>
          <div className="grid gap-8 sm:gap-10 md:grid-cols-3">
            {featured.map((l) => (
              <Link
                key={l.slug}
                href={`/apartments/${l.slug}`}
                className="group block"
              >
                {/* Lozenge: rounded TOP corners only — Elaine card shape */}
                <div
                  className="aspect-[4/5] overflow-hidden bg-[#EAECE2] shadow-sm group-hover:shadow-xl transition"
                  style={{ borderRadius: "180px 180px 18px 18px" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={l.heroImage}
                    alt={`${l.title} interior`}
                    className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                </div>
                <div className="mt-5 px-2">
                  <h3 className="font-serif text-2xl text-[#385B4F] leading-snug group-hover:underline underline-offset-4 decoration-[#BF936A]">
                    {l.title}
                  </h3>
                  <p className="mt-2 text-sm font-serif italic text-[#BF936A]">
                    {l.areaLabel}, London
                  </p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-[#555555]">
                    <span className="inline-flex items-center gap-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                      </svg>
                      {l.maxGuests} guest{l.maxGuests > 1 ? "s" : ""}
                    </span>
                    <span>{l.bedrooms > 0 ? `${l.bedrooms} bed` : "Studio"}</span>
                    <span>{l.bathrooms} bath</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-14 text-center">
            <Link
              href="/apartments"
              className="inline-flex items-center rounded-full bg-[#FFDE59] px-8 py-3 text-sm font-semibold text-[#385B4F] hover:bg-[#f5d240] transition"
            >
              View all apartments
            </Link>
          </div>
        </div>
      </section>

      {/* DISCOVER LONDON — full-bleed dark green, image left, text right */}
      <section className="bg-[#385B4F] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 grid gap-12 lg:gap-16 lg:grid-cols-2 items-center">
          {/* Arched cutout image left */}
          <div className="relative order-2 lg:order-1">
            <div
              className="aspect-[5/4] overflow-hidden bg-[#5a8074]"
              style={{ borderRadius: "50% 50% 12px 12px / 35% 35% 6px 6px" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featured[1]?.heroImage || LISTINGS[1]?.heroImage}
                alt="London neighbourhood living"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="order-1 lg:order-2 text-[#FFFBF2]">
            <h2 className="font-serif text-4xl sm:text-5xl leading-tight">
              Discover London with<br />NourNest Apartments
            </h2>
            <p className="mt-5 font-serif italic text-lg sm:text-xl text-[#FFDE59]">
              Your perfect base in the heart of London
            </p>
            <p className="mt-8 text-base sm:text-lg text-[#F3FADC] leading-relaxed">
              NourNest Apartments offers a variety of locations, from bustling high-demand areas
              like Mayfair, Kensington and Covent Garden to serene residential neighbourhoods in
              Notting Hill, Hampstead and Chelsea. Enjoy easy access to London&rsquo;s top
              attractions, cultural activities and essential amenities. Whether you&rsquo;re visiting
              family, planning a getaway or seeking adventure, our properties provide the perfect
              base for your stay.
            </p>
            <div className="mt-8">
              <Link
                href="/locations"
                className="inline-flex items-center rounded-full bg-[#BF936A] px-8 py-3 text-sm font-semibold text-[#FFFBF2] hover:bg-[#a87d57] transition"
              >
                Book your unforgettable stay
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE OFFER — 6 tiles on TAN/SAND background with line icons (Elaine signature) */}
      <section className="bg-[#FFFBF2] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl sm:text-5xl text-[#385B4F]">What we offer</h2>
            <p className="mt-4 font-serif italic text-lg text-[#BF936A]">
              Discover our premium amenities and services for a seamless stay
            </p>
          </div>

          <div
            className="bg-[#BF936A] p-8 sm:p-12 lg:p-16"
            style={{ borderRadius: "32px 32px 120px 120px / 32px 32px 80px 80px" }}
          >
            <div className="grid gap-10 sm:gap-12 sm:grid-cols-2 lg:grid-cols-3">
              {OFFERINGS.map((o) => (
                <div key={o.title} className="text-center text-[#FFFBF2]">
                  <div className="mx-auto inline-flex text-[#FFDE59]">{o.icon}</div>
                  <h3 className="mt-5 font-serif text-xl sm:text-2xl text-[#FFFBF2]">{o.title}</h3>
                  <p className="mt-3 text-sm text-[#FFFBF2]/90 leading-relaxed">{o.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BOOK DIRECT */}
      <section className="bg-[#F3FADC] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-14">
            <h2 className="font-serif text-4xl sm:text-5xl text-[#385B4F]">Book direct, stay better</h2>
            <p className="mt-4 font-serif italic text-lg text-[#BF936A]">
              Unlock exclusive benefits when you book directly with NourNest
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3 text-center">
            {DIRECT_BENEFITS.map((b) => (
              <div key={b.title} className="rounded-2xl bg-[#FFFBF2] p-8 border border-[#EAECE2]">
                <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#FFDE59] text-[#385B4F]">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="mt-5 font-serif text-2xl text-[#385B4F]">{b.title}</h3>
                <p className="mt-3 text-sm text-[#555555] leading-relaxed">{b.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full bg-[#385B4F] px-8 py-3 text-sm font-semibold text-[#FFFBF2] hover:bg-[#5a8074] transition"
            >
              Book your stay now
            </Link>
          </div>
        </div>
      </section>

      {/* LOCATIONS GRID */}
      <section className="bg-[#FFFBF2] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-14">
            <h2 className="font-serif text-4xl sm:text-5xl text-[#385B4F]">London neighbourhoods</h2>
            <p className="mt-4 font-serif italic text-lg text-[#BF936A]">
              Curated apartments across seven beloved London areas
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {LOCATIONS.map((loc) => (
              <Link
                key={loc.slug}
                href={`/locations/${loc.slug}`}
                className="group relative overflow-hidden rounded-3xl h-80"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={loc.heroImage}
                  alt={loc.label}
                  className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#385B4F]/90 via-[#385B4F]/20 to-transparent" />
                <div className="relative flex h-full flex-col justify-end p-6 text-[#FFFBF2]">
                  <p className="text-xs uppercase tracking-widest text-[#F3FADC]">
                    ~{loc.propertyCountApprox} apartments
                  </p>
                  <h3 className="mt-2 font-serif text-2xl">{loc.label}</h3>
                  <p className="mt-3 text-sm font-medium underline underline-offset-4 decoration-[#FFDE59]">
                    Explore {loc.shortLabel}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Homepage FAQ — answers common pre-booking questions above the fold (audit feedback) */}
      <section className="bg-[#FFFBF2] py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl sm:text-5xl text-[#385B4F]">Quick answers, before you enquire</h2>
            <p className="mt-4 font-serif italic text-lg text-[#BF936A]">
              The questions guests ask us most often
            </p>
          </div>
          <div className="divide-y divide-[#385B4F]/15 rounded-3xl border border-[#385B4F]/15 bg-[#F3FADC]/40">
            {HOMEPAGE_FAQS.map((f, i) => (
              <details key={i} className="group p-6 sm:p-7">
                <summary className="flex cursor-pointer items-start justify-between gap-6 list-none">
                  <span className="font-serif text-lg sm:text-xl text-[#385B4F]">{f.question}</span>
                  <span
                    className="mt-1 inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#FFDE59] text-[#385B4F] transition group-open:rotate-45"
                    aria-hidden="true"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 text-stone-700 leading-relaxed">{f.answer}</p>
              </details>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-stone-600">
            More on the{" "}
            <Link href="/faq" className="font-medium text-[#385B4F] underline underline-offset-4 decoration-[#BF936A]">
              full FAQ page
            </Link>
            , or{" "}
            <Link href="/contact" className="font-medium text-[#385B4F] underline underline-offset-4 decoration-[#BF936A]">
              email the NourNest team
            </Link>
            .
          </p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative bg-[#385B4F] py-20 sm:py-28 text-center text-[#FFFBF2]">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-serif text-4xl sm:text-5xl">Ready to feel at home in London?</h2>
          <p className="mt-5 font-serif italic text-lg text-[#FFDE59]">
            We can&rsquo;t wait to welcome you.
          </p>
          <div className="mt-10 flex justify-center gap-4 flex-wrap">
            <Link
              href="/apartments"
              className="inline-flex items-center rounded-full bg-[#FFDE59] px-8 py-3 text-sm font-semibold text-[#385B4F] hover:bg-[#f5d240] transition"
            >
              Browse apartments
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full border border-[#FFFBF2] px-8 py-3 text-sm font-semibold text-[#FFFBF2] hover:bg-[#FFFBF2] hover:text-[#385B4F] transition"
            >
              Enquire
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
