import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Corporate stays",
  description:
    "NourNest for business. Long-stay rates, monthly invoicing, single point of contact for relocation, project teams, and executive travel.",
};

export default function CorporatePage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <p className="text-sm uppercase tracking-widest text-stone-500">NourNest for business</p>
      <h1 className="mt-3 font-serif text-5xl text-stone-900">Built for relocations, projects, and executive teams.</h1>

      <div className="mt-10 space-y-6 text-stone-700 leading-relaxed">
        <p>
          We work with HR teams, mobility managers, and procurement leads who need consistent
          serviced apartments across Central London without hotel rack-rate pricing.
        </p>
        <ul className="space-y-3 list-disc pl-5">
          <li>Long-stay rates with monthly billing on agreed PO terms.</li>
          <li>Single point of contact across all bookings, with no shifting CSMs.</li>
          <li>Apartments grouped by team where possible for project deployments.</li>
          <li>Receipts and statements compatible with most expense systems.</li>
          <li>Family-friendly inventory in Kensington for relocations with dependants.</li>
        </ul>
      </div>

      <div className="mt-12">
        <Link
          href="/contact"
          className="inline-flex rounded-full bg-stone-900 px-7 py-3 text-sm font-medium text-white hover:bg-stone-700 transition"
        >
          Speak to our corporate team
        </Link>
      </div>
    </section>
  );
}
