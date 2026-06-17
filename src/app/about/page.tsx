import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About NourNest",
  description:
    "NourNest Ltd is an independent London serviced apartment operator. Warm, welcoming, quietly premium. Fully equipped apartments across four Central London neighbourhoods.",
};

const BELIEFS = [
  { t: "Space to settle", b: "A real kitchen, a proper desk, and a sofa to sprawl on aren't luxuries — they're the difference between surviving a long trip and enjoying one." },
  { t: "Bills should be simple", b: "One rate. Electricity, water, heating, Wi-Fi, council tax — all in. No surprise charges on departure." },
  { t: "Support means people", b: "Our guest team have names, faces, and WhatsApp. Every message gets a real human reply, usually within 15 minutes." },
  { t: "Direct is better", b: "Book with us and you deal with us — no middle-man, no commission baked into your rate, and a warm welcome on arrival." },
];

function Check() {
  return (
    <span className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#385B4F]/10">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#385B4F" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </span>
  );
}

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-24">
      <p className="text-sm uppercase tracking-widest text-[#BF936A]">About</p>
      <h1 className="mt-3 font-serif text-5xl sm:text-6xl text-[#385B4F]">London, lived in properly.</h1>

      <div className="mt-10 space-y-6 text-lg text-[#555555] leading-relaxed">
        <p>
          NourNest is an independent operator of fully equipped serviced apartments across Central
          London. We started because hotels feel impersonal, holiday lets are inconsistent, and
          renting takes weeks of admin you don&rsquo;t have time for.
        </p>
        <p>
          Every apartment is set up so you can arrive, drop your bags, and start living from the
          moment you walk in. Fitted kitchen, fast Wi-Fi, smart TV, fresh linens, full toiletries,
          and all bills already paid. Self check-in lets you arrive whenever you land — most apartments use a smart lock, the rest use in-person key handover. Mid-stay
          housekeeping is included; additional cleans are available on request.
        </p>
        <p>
          We&rsquo;re a small team of real people. When something needs sorting, you can WhatsApp
          us. No call centres, no ticket numbers, no chasing.
        </p>
      </div>

      <div className="mt-16 h-px w-full bg-[#BF936A]/30" />

      <h2 className="mt-16 font-serif text-3xl text-[#385B4F]">What we believe</h2>
      <div className="mt-8 grid gap-x-8 gap-y-8 sm:grid-cols-2">
        {BELIEFS.map((v) => (
          <div key={v.t} className="flex gap-3">
            <Check />
            <div>
              <h3 className="font-serif text-xl text-[#385B4F]">{v.t}</h3>
              <p className="mt-2 text-[#555555]">{v.b}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 h-px w-full bg-[#BF936A]/30" />

      <h2 className="mt-16 font-serif text-3xl text-[#385B4F]">Company information</h2>
      <dl className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2 text-sm text-[#555555]">
        <div>
          <dt className="font-medium text-[#385B4F]">Legal entity</dt>
          <dd>NourNest Ltd</dd>
        </div>
        <div>
          <dt className="font-medium text-[#385B4F]">Companies House</dt>
          <dd>
            <a
              href="https://find-and-update.company-information.service.gov.uk/company/16629708"
              className="underline underline-offset-4 hover:text-[#385B4F]"
              target="_blank"
              rel="noopener noreferrer"
            >
              16629708
            </a>
          </dd>
        </div>
        <div>
          <dt className="font-medium text-[#385B4F]">Registered office</dt>
          <dd>154 Warwick Road, London W14 8PS</dd>
        </div>
        <div>
          <dt className="font-medium text-[#385B4F]">Contact</dt>
          <dd>hello@nournestapartments.com</dd>
        </div>
      </dl>

      <div className="mt-16">
        <Link
          href="/apartments"
          className="inline-flex rounded-full bg-[#FFDE59] px-8 py-3 text-sm font-semibold text-[#385B4F] hover:bg-[#f5d240] transition"
        >
          Explore our apartments
        </Link>
      </div>
    </article>
  );
}
