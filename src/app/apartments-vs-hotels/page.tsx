import type { Metadata } from "next";
import { JsonLd, faqSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Serviced apartments vs hotels",
  description:
    "How NourNest's serviced apartments compare to typical London hotels on space, cost, kitchen, laundry, and family suitability.",
};

const ROWS: [string, string, string][] = [
  ["Average living space", "45–80 sqm", "20–30 sqm"],
  ["Private kitchen", "Yes, fully equipped", "No"],
  ["In-unit laundry", "Yes", "No"],
  ["Cost for one-week-plus stay", "15–20% less", "Standard rate"],
  ["Guest support", "Named team members", "Reception desk"],
  ["Family suitability", "Excellent, multi-bedroom", "Limited"],
  ["All bills included", "Yes", "Yes"],
  ["Self check-in", "Yes — smart lock on most, key handover on the rest", "Limited"],
  ["Direct rate vs Booking.com / Airbnb", "Always 10% lower (no commission)", "Identical, plus fees"],
];

const FAQ = [
  {
    question: "Are NourNest apartments cheaper than a London hotel?",
    answer:
      "For stays of one week or more, NourNest apartments are typically 15–20% cheaper than equivalent-quality London hotels, before factoring in food savings from having a full kitchen and on-site laundry.",
  },
  {
    question: "What's included in the price of a NourNest apartment?",
    answer:
      "Every NourNest booking includes electricity, water, heating, Wi-Fi, council tax, fresh linens, full toiletries, and housekeeping on request. Long stays get a fortnightly mid-stay clean. There are no surprise fees on top of the nightly rate.",
  },
  {
    question: "Are NourNest direct rates lower than Booking.com and Airbnb?",
    answer:
      "Yes. Our direct rates are always at least 10% lower than the same apartment listed on Booking.com or Airbnb, because we don't pay platform commission, we pass the saving back to you.",
  },
  {
    question: "Do NourNest apartments come with a kitchen?",
    answer:
      "Yes. Every NourNest apartment has a fully equipped kitchen with induction hob, full-size fridge, dishwasher, oven, microwave, kettle, toaster, and cookware. Most include a coffee machine.",
  },
];

export default function ApartmentsVsHotelsPage() {
  return (
    <>
      <JsonLd data={faqSchema(FAQ)} />
      <section className="mx-auto max-w-4xl px-6 py-24">
        <p className="text-sm uppercase tracking-widest text-[#BF936A]">Comparison</p>
        <h1 className="mt-3 font-serif text-5xl text-[#385B4F]">Serviced apartments vs hotels.</h1>
        <p className="mt-6 text-[#555555]">
          A simple side-by-side on the parts that matter for week-plus stays in London.
        </p>

        <div className="mt-12 overflow-x-auto rounded-2xl border border-[#EAECE2]">
          <table className="w-full text-left">
            <thead className="bg-[#F3FADC] text-sm uppercase tracking-widest text-[#385B4F]">
              <tr>
                <th className="py-4 px-6">Feature</th>
                <th className="py-4 px-6">NourNest apartment</th>
                <th className="py-4 px-6">Typical hotel</th>
              </tr>
            </thead>
            <tbody className="text-[#555555]">
              {ROWS.map(([f, s, h]) => (
                <tr key={f} className="border-t border-[#EAECE2]">
                  <td className="py-4 px-6 text-[#555555]">{f}</td>
                  <td className="py-4 px-6 font-medium text-[#385B4F]">{s}</td>
                  <td className="py-4 px-6 text-[#555555]/80">{h}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mt-20 font-serif text-3xl text-[#385B4F]">Quick questions</h2>
        <dl className="mt-8 space-y-8">
          {FAQ.map((q) => (
            <div key={q.question}>
              <dt className="font-medium text-[#385B4F]">{q.question}</dt>
              <dd className="mt-2 text-[#555555]">{q.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
