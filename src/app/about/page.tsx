import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About NourNest",
  description:
    "NourNest Ltd is an independent London serviced apartment operator. Welcoming, warm, home away from home. Fully equipped apartments across seven Central London neighbourhoods.",
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-24">
      <p className="text-sm uppercase tracking-widest text-stone-500">About</p>
      <h1 className="mt-3 font-serif text-5xl sm:text-6xl text-stone-900">London, lived in properly.</h1>

      <div className="mt-10 space-y-6 text-lg text-stone-700 leading-relaxed">
        <p>
          NourNest is an independent operator of fully equipped serviced apartments across Central
          London. We started because hotels feel impersonal, holiday lets are inconsistent, and
          renting takes weeks of admin you don&rsquo;t have time for.
        </p>
        <p>
          Every apartment is set up so you can arrive, drop your bags, and start living from the
          moment you walk in. Fitted kitchen, fast Wi-Fi, smart TV, fresh linens, full toiletries,
          and all bills already paid. Smart locks let you check in whenever you land. Fortnightly
          housekeeping is included; additional cleans are available on request.
        </p>
        <p>
          We&rsquo;re a small team of real people. When something needs sorting, you can WhatsApp
          us. No call centres, no ticket numbers, no chasing.
        </p>
      </div>

      <h2 className="mt-20 font-serif text-3xl text-stone-900">What we believe</h2>
      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        {[
          { t: "Space matters", b: "A real kitchen, a proper desk, and a sofa to sprawl on aren't luxuries. They're the difference between surviving a long trip and enjoying one." },
          { t: "Bills should be simple", b: "One rate. Electricity, water, heating, Wi-Fi, council tax, all in. No surprise charges on departure." },
          { t: "Support means people", b: "Our guest team have names, faces, and WhatsApp. Every message gets a real human reply, usually within 15 minutes." },
          { t: "Direct is better", b: "Our direct rates are always at least 10% lower than the same apartment listed on Booking.com or Airbnb, because we don't pay commission, we pass the saving back to you." },
        ].map((v) => (
          <div key={v.t}>
            <h3 className="font-serif text-xl text-stone-900">{v.t}</h3>
            <p className="mt-2 text-stone-700">{v.b}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-20 font-serif text-3xl text-stone-900">Company information</h2>
      <dl className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2 text-sm text-stone-700">
        <div>
          <dt className="font-medium text-stone-900">Legal entity</dt>
          <dd>NourNest Ltd</dd>
        </div>
        <div>
          <dt className="font-medium text-stone-900">Companies House</dt>
          <dd>
            <a
              href="https://find-and-update.company-information.service.gov.uk/company/16629708"
              className="underline underline-offset-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              16629708
            </a>
          </dd>
        </div>
        <div>
          <dt className="font-medium text-stone-900">Registered office</dt>
          <dd>154 Warwick Road, London W14 8PS</dd>
        </div>
        <div>
          <dt className="font-medium text-stone-900">Contact</dt>
          <dd>hello@nournestapartments.com</dd>
        </div>
      </dl>

      <div className="mt-16">
        <Link
          href="/apartments"
          className="inline-flex rounded-full bg-stone-900 px-7 py-3 text-sm font-medium text-white hover:bg-stone-700 transition"
        >
          Explore our apartments
        </Link>
      </div>
    </article>
  );
}
