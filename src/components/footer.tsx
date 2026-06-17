import Link from "next/link";
import { LOCATIONS } from "@/lib/listings";

export function Footer() {
  return (
    <footer className="border-t border-[#EAECE2] bg-[#F3FADC]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div>
            <p className="font-serif text-2xl text-[#385B4F]">NourNest Apartments</p>
            <p className="mt-3 text-sm text-[#555555]">
              Curated, fully equipped serviced apartments across Central London. Welcoming, warm, and personalised.
              Your home away from home.
            </p>
            <p className="mt-4 text-xs text-[#555555]/80">
              NourNest Ltd · Company No. 16629708 · 154 Warwick Road, London W14 8PS
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-[#385B4F]">London neighbourhoods</p>
            <ul className="mt-3 space-y-2 text-sm text-[#555555]">
              {LOCATIONS.map((l) => (
                <li key={l.slug}>
                  <Link href={`/locations/${l.slug}`} className="hover:text-[#385B4F]">
                    {l.shortLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium text-[#385B4F]">Stays</p>
            <ul className="mt-3 space-y-2 text-sm text-[#555555]">
              <li><Link href="/apartments" className="hover:text-[#385B4F]">All apartments</Link></li>
              <li><Link href="/guides" className="hover:text-[#385B4F]">London guides</Link></li>
              <li><Link href="/apartments-vs-hotels" className="hover:text-[#385B4F]">Apartments vs hotels</Link></li>
              <li><Link href="/faq" className="hover:text-[#385B4F]">FAQ</Link></li>
              <li><Link href="/management" className="hover:text-[#385B4F]">Property management</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium text-[#385B4F]">Contact</p>
            <ul className="mt-3 space-y-2 text-sm text-[#555555]">
              <li><a href="mailto:hello@nournestapartments.com" className="hover:text-[#385B4F]">hello@nournestapartments.com</a></li>
              <li><Link href="/about" className="hover:text-[#385B4F]">About NourNest</Link></li>
              <li><Link href="/contact" className="hover:text-[#385B4F]">Enquire</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-[#EAECE2] pt-6 flex flex-col sm:flex-row justify-between gap-2 text-xs text-[#555555]/80">
          <p>&copy; {new Date().getFullYear()} NourNest Ltd. All rights reserved.</p>
          <p>Welcoming serviced apartments. Fully equipped. All bills included.</p>
        </div>
      </div>
    </footer>
  );
}
