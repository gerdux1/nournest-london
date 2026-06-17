import type { Metadata } from "next";
import Link from "next/link";
import { PORTFOLIO, type PortfolioFlat } from "@/lib/portfolio";
import { JsonLd, breadcrumb } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Apartments",
  description:
    "Browse the full collection of NourNest serviced apartments across London — fully equipped, all bills included, and bookable direct. From studios to spacious family homes.",
};

function specLine(l: PortfolioFlat) {
  const beds = l.beds > 0 ? `${l.beds} bed` : "Studio";
  const guests = l.maxGuests > 0 ? ` · sleeps ${l.maxGuests}` : "";
  return `${beds} · ${l.baths} bath${guests}`;
}

function Card({ l }: { l: PortfolioFlat }) {
  const inner = (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={l.image}
        alt={`${l.name} interior`}
        loading="lazy"
        className="aspect-[4/3] w-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
      />
      <div className="p-6">
        <p className="text-xs uppercase tracking-widest text-[#BF936A]">{l.area}</p>
        <h2 className="mt-2 font-serif text-2xl text-[#385B4F] group-hover:underline underline-offset-4 decoration-[#BF936A]">
          {l.name}
        </h2>
        <div className="mt-3 flex items-center justify-between text-sm text-[#555555]">
          <span>{specLine(l)}</span>
          <span className="font-medium text-[#385B4F]">Book now &rarr;</span>
        </div>
      </div>
    </>
  );

  const cls =
    "group rounded-2xl overflow-hidden bg-white border border-[#EAECE2] hover:shadow-lg transition";

  // Curated flats keep their richer internal detail page; the rest book direct on BOOM.
  return l.internalSlug ? (
    <Link href={`/apartments/${l.internalSlug}`} className={cls}>
      {inner}
    </Link>
  ) : (
    <a href={l.bookingUrl} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  );
}

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
        <p className="text-sm uppercase tracking-widest text-[#BF936A]">Our spaces</p>
        <h1 className="mt-3 font-serif text-5xl sm:text-6xl text-[#385B4F]">All NourNest apartments.</h1>
        <p className="mt-6 max-w-2xl text-[#555555]">
          Our full collection across London &mdash; studios to family homes, every one fully equipped
          with bills included. Book direct with NourNest and you deal with us, start to finish.
        </p>

        <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {PORTFOLIO.map((l) => (
            <Card key={l.bookingNumber} l={l} />
          ))}
        </div>
      </section>
    </>
  );
}
