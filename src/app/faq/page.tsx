import type { Metadata } from "next";
import { JsonLd, faqSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to the questions guests ask most often about NourNest serviced apartments in London.",
};

const FAQ = [
  {
    question: "How long can I stay?",
    answer:
      "Minimum stay is three nights. Maximum is open-ended. Many guests stay for three to six months, and a few have stayed for over a year. Pricing steps down for stays of one week or more.",
  },
  {
    question: "What's included in the price?",
    answer:
      "Every booking includes electricity, water, heating, Wi-Fi, council tax, fresh linens, full toiletries, and housekeeping on request. Mid-stay cleans are included on long stays.",
  },
  {
    question: "How does check-in work?",
    answer:
      "Self check-in. Most apartments use a smart lock — you receive your access code the day before arrival and can check in any hour. The rest use in-person key handover at a time that works for you. Either way, no reception-desk wait.",
  },
  {
    question: "Are pets allowed?",
    answer:
      "Some of our apartments accept well-behaved dogs by prior arrangement. Get in touch and we'll let you know which units in your preferred area are pet-friendly.",
  },
  {
    question: "Can I extend my stay?",
    answer:
      "Yes, provided the apartment is available. Just message your guest support contact and we'll roll the dates forward without penalty.",
  },
  {
    question: "Do you accept corporate bookings on PO terms?",
    answer:
      "Yes. We work with HR and mobility teams across London with monthly invoicing and consolidated statements. See the Corporate page or get in touch directly.",
  },
  {
    question: "Are children welcome?",
    answer:
      "Of course. Our two-bed and three-bed apartments in Regent's Park & Marylebone and Kensington are set up with family stays in mind. Travel cot, high chair, and stair gates are available on request.",
  },
  {
    question: "Where are your apartments located?",
    answer:
      "NourNest operates across seven Central London neighbourhoods: Regent's Park & Marylebone (our biggest concentration), Old Street & Shoreditch, Kensington & Hammersmith, Fitzrovia & Mayfair, Barbican & Farringdon, Borough & Pimlico, and Little Venice & Maida Vale.",
  },
  {
    question: "Who is NourNest?",
    answer:
      "NourNest is the trading name of NourNest Ltd, an independent London serviced apartment operator. Part of an independent multi-entity London accommodation group.",
  },
];

export default function FAQPage() {
  return (
    <>
      <JsonLd data={faqSchema(FAQ)} />
      <section className="mx-auto max-w-3xl px-6 py-24">
        <p className="text-sm uppercase tracking-widest text-stone-500">FAQ</p>
        <h1 className="mt-3 font-serif text-5xl text-stone-900">Frequently asked questions.</h1>

        <dl className="mt-12 space-y-10">
          {FAQ.map((q) => (
            <div key={q.question}>
              <dt className="font-serif text-2xl text-stone-900">{q.question}</dt>
              <dd className="mt-3 text-stone-700 leading-relaxed">{q.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
