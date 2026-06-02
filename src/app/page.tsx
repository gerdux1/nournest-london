import Link from "next/link";
import { LISTINGS, LOCATIONS } from "@/lib/listings";
import { JsonLd, breadcrumb } from "@/lib/schema";

const USPS = [
  {
    title: "Fully equipped from day one",
    body:
      "Every apartment comes with a fitted kitchen, fast Wi-Fi, smart TV, fresh linens, and toiletries. Move in and start living straight away.",
  },
  {
    title: "London neighbourhoods",
    body:
      "From Regent's Park and Marylebone to Shoreditch, Kensington, and Little Venice. Positioned for easy commutes and weekend exploration.",
  },
  {
    title: "Long-stay friendly",
    body:
      "Book for three nights or three months. Our pricing steps down for stays of one week or more, with no penalty for extending.",
  },
  {
    title: "Personal guest support",
    body:
      "Our team are real people who respond quickly and actually solve problems. No call centres. No ticket numbers.",
  },
  {
    title: "All bills included",
    body:
      "Electricity, water, heating, Wi-Fi, council tax. All in the price. One simple rate with no surprise charges.",
  },
  {
    title: "Self check-in",
    body:
      "Arrive on your schedule. Smart lock and keyless entry mean you can check in any time, day or night.",
  },
];

export default function Home() {
  return (
    <>
      <JsonLd data={breadcrumb([{ name: "Home", url: "https://nournestapartments.com" }])} />

      <section className="relative isolate min-h-[85vh] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=2000&q=80"
          alt="Tower Bridge, London at sunset"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/40 via-stone-900/30 to-stone-900/70" />
        <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col justify-end px-6 pb-24 pt-32 text-white">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-widest text-stone-200">London serviced apartments</p>
            <h1 className="mt-4 font-serif text-5xl sm:text-7xl lg:text-8xl leading-[1.02]">
              Your home away from home in London.
            </h1>
            <p className="mt-8 max-w-xl text-lg text-stone-100">
              Fully equipped apartments with everything you need, whether you are here for a week, a
              month, or longer. More space than a hotel. More freedom than a rental.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/apartments"
                className="inline-flex items-center rounded-full bg-white px-7 py-3 text-sm font-medium text-stone-900 hover:bg-stone-100 transition"
              >
                Browse apartments
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full border border-white px-7 py-3 text-sm font-medium text-white hover:bg-white hover:text-stone-900 transition"
              >
                Enquire now
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-sm uppercase tracking-widest text-stone-500">Why guests choose NourNest</p>
        <h2 className="mt-3 font-serif text-4xl sm:text-5xl text-stone-900">
          Where every stay feels like coming home.
        </h2>
        <div className="mt-14 grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          {USPS.map((u) => (
            <div key={u.title}>
              <h3 className="font-serif text-2xl text-stone-900">{u.title}</h3>
              <p className="mt-3 text-stone-600 leading-relaxed">{u.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-stone-100 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm uppercase tracking-widest text-stone-500">Featured apartments</p>
              <h2 className="mt-3 font-serif text-4xl sm:text-5xl text-stone-900">A space for every stay.</h2>
            </div>
            <Link href="/apartments" className="text-sm font-medium text-stone-900 underline underline-offset-4">
              View all apartments →
            </Link>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {LISTINGS.slice(0, 6).map((l) => (
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
                  <h3 className="mt-2 font-serif text-2xl text-stone-900 group-hover:underline underline-offset-4">
                    {l.title}
                  </h3>
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
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-sm uppercase tracking-widest text-stone-500">London neighbourhoods</p>
        <h2 className="mt-3 font-serif text-4xl sm:text-5xl text-stone-900">Curated London apartments across seven neighbourhoods.</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
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
                <h3 className="mt-2 font-serif text-3xl">{loc.label}</h3>
                <p className="mt-2 text-sm text-stone-100 line-clamp-3">{loc.description}</p>
                <p className="mt-4 text-sm font-medium underline underline-offset-4">
                  Explore {loc.shortLabel} →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-stone-900 text-stone-100 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm uppercase tracking-widest text-stone-400">Serviced apartments vs hotels</p>
          <h2 className="mt-3 font-serif text-4xl sm:text-5xl">More room. Lower cost. Real kitchens.</h2>
          <div className="mt-12 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-stone-700 text-sm uppercase tracking-widest text-stone-400">
                  <th className="py-4 pr-6">Feature</th>
                  <th className="py-4 pr-6">NourNest apartment</th>
                  <th className="py-4">Typical hotel</th>
                </tr>
              </thead>
              <tbody className="text-stone-100">
                {[
                  ["Average living space", "45–80 sqm", "20–30 sqm"],
                  ["Private kitchen", "Yes, fully equipped", "No"],
                  ["In-unit laundry", "Yes", "No"],
                  ["Cost for one-week-plus stay", "15–20% less", "Standard rate"],
                  ["Guest support", "Named team members", "Reception desk"],
                  ["Family suitability", "Excellent, multi-bedroom", "Limited"],
                  ["Direct rate vs Booking.com / Airbnb", "Always 10% lower (no commission)", "Same rate, plus fees"],
                ].map(([f, s, h]) => (
                  <tr key={f} className="border-b border-stone-800 last:border-0">
                    <td className="py-4 pr-6 text-stone-300">{f}</td>
                    <td className="py-4 pr-6">{s}</td>
                    <td className="py-4 text-stone-400">{h}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-12">
            <Link
              href="/apartments-vs-hotels"
              className="inline-flex items-center text-sm font-medium text-stone-100 underline underline-offset-4"
            >
              See the full comparison →
            </Link>
          </div>
        </div>
      </section>

      {/* Trust signals + reviews */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-3 text-center">
          <div>
            <p className="font-serif text-5xl text-stone-900">4.9</p>
            <p className="mt-2 text-sm text-stone-600">Guest review average</p>
          </div>
          <div>
            <p className="font-serif text-5xl text-stone-900">40+</p>
            <p className="mt-2 text-sm text-stone-600">Central London apartments</p>
          </div>
          <div>
            <p className="font-serif text-5xl text-stone-900">15 min</p>
            <p className="mt-2 text-sm text-stone-600">Average response time, 24/7</p>
          </div>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-2">
          {[
            {
              quote:
                "NourNest's apartment near Regent's Park made my three-month relocation smooth and comfortable. Felt like home from day one. The team replied to every WhatsApp within minutes.",
              author: "Marie L.",
              context: "3-month relocation, Kensington",
            },
            {
              quote:
                "We've used NourNest for two project deployments now. Same operator, same team, single monthly invoice. Saves us hours every cycle compared to chasing hotel block-bookings.",
              author: "James R.",
              context: "Corporate, Old Street",
            },
          ].map((t) => (
            <blockquote key={t.author} className="rounded-2xl border border-stone-200 bg-white p-8">
              <p className="font-serif text-xl text-stone-900 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-6 text-sm text-stone-600">
                <span className="font-medium text-stone-900">{t.author}</span> · {t.context}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-32 text-center">
        <h2 className="font-serif text-4xl sm:text-5xl text-stone-900">Ready to book your London stay?</h2>
        <p className="mt-6 text-stone-700">
          Whether you are visiting for work, relocating your family, or simply need a comfortable base in
          London, NourNest has an apartment that fits.
        </p>
        <div className="mt-10 flex justify-center gap-4 flex-wrap">
          <Link
            href="/apartments"
            className="inline-flex rounded-full bg-stone-900 px-8 py-3 text-sm font-medium text-white hover:bg-stone-700 transition"
          >
            Browse apartments
          </Link>
          <Link
            href="/contact"
            className="inline-flex rounded-full border border-stone-900 px-8 py-3 text-sm font-medium text-stone-900 hover:bg-stone-900 hover:text-white transition"
          >
            Enquire now
          </Link>
        </div>
      </section>
    </>
  );
}
