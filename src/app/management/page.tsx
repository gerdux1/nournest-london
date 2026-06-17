import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd, breadcrumb } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Property Management for Landlords",
  description:
    "NourNest looks after London flats for landlords and owners — listings, guests, housekeeping, maintenance and monthly statements, handled by a small named team. A simple management fee, agreed up front.",
};

const HANDLES = [
  {
    t: "Listings & channels",
    b: "We photograph, write up and list your flat across the major booking channels and our own direct site — then keep the calendars in sync so you never double-book.",
  },
  {
    t: "Guest communication",
    b: "Every enquiry, booking and in-stay message answered by a real person, usually within fifteen minutes. Warm, careful, and always in your flat's best interest.",
  },
  {
    t: "Housekeeping & turnovers",
    b: "Professional cleans and fresh linen between every stay, with mid-stay housekeeping on longer bookings. Your flat is always guest-ready.",
  },
  {
    t: "Maintenance coordination",
    b: "We spot the small things before they become big ones and coordinate trusted trades when something needs fixing — keeping you in the loop, not in the queue.",
  },
  {
    t: "Pricing",
    b: "We set and adjust nightly rates by season and demand, so your flat earns well without sitting empty.",
  },
  {
    t: "Compliance basics",
    b: "We help keep the everyday essentials in order — gas and electrical safety, smoke alarms, and the paperwork guests and platforms expect.",
  },
  {
    t: "Monthly statements",
    b: "A clear statement each month showing what your flat earned, what was spent, and what's landing in your account. No jargon, nothing hidden.",
  },
];

const WHY = [
  {
    t: "A small, named team",
    b: "You'll know the people looking after your flat by name — not a call centre, not a ticket number. Real people who pick up and follow through.",
  },
  {
    t: "Treated like our own",
    b: "We look after every flat the way we'd want ours looked after — attentive to the details, protective of the space, and honest when something needs your call.",
  },
  {
    t: "Transparent reporting",
    b: "Clear monthly statements and an open line whenever you want to talk. You always know how your flat is doing and where your money is.",
  },
  {
    t: "Concierge for your guests",
    b: "Optional welcome touches and lifestyle extras — hampers, transfers, fresh flowers — that lift reviews and bring guests back to your flat.",
  },
];

const STEPS = [
  {
    n: "01",
    t: "Have a chat",
    b: "Tell us about your flat and what you're hoping for. We'll be straight with you about what it could earn and how we'd look after it.",
  },
  {
    n: "02",
    t: "We set it up",
    b: "We photograph, list and prepare your flat across the right channels — and handle the move from however it's run today, gently.",
  },
  {
    n: "03",
    t: "You relax",
    b: "Guests arrive, your flat is cared for, and a clear statement lands each month. You stay informed without the day-to-day.",
  },
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

export default function ManagementPage() {
  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", url: "https://nournestapartments.com" },
          { name: "Management", url: "https://nournestapartments.com/management" },
        ])}
      />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pt-24 pb-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm uppercase tracking-widest text-[#BF936A]">
              NourNest for landlords
            </p>
            <h1 className="mt-3 font-serif text-5xl sm:text-6xl text-[#385B4F] leading-tight">
              Your London flat, beautifully looked after.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-[#555555] leading-relaxed">
              We&rsquo;re an independent, hands-on management team for landlords, developers and
              owners who&rsquo;d rather their flat earned well without becoming a second job.
              We list it, host the guests, keep it spotless, and send you a clear statement each
              month &mdash; while you get your evenings back.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="mailto:hello@nournestapartments.com?subject=Property%20management%20enquiry"
                className="inline-flex rounded-full bg-[#FFDE59] px-8 py-3 text-sm font-semibold text-[#385B4F] hover:bg-[#f5d240] transition tracking-wide"
              >
                Talk to us about your property
              </a>
            </div>
          </div>

          {/* Arched cutout photo */}
          <div className="relative">
            <div
              className="aspect-[4/5] overflow-hidden bg-[#EAECE2]"
              style={{ borderRadius: "50% 50% 12px 12px / 35% 35% 6px 6px" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/locations/old-street-shoreditch.jpg"
                alt="A NourNest-managed London apartment"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6">
        <div className="h-px w-full bg-[#BF936A]/30" />
      </div>

      {/* What we handle */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-sm uppercase tracking-widest text-[#BF936A]">What we handle</p>
        <h2 className="mt-3 font-serif text-4xl sm:text-5xl text-[#385B4F]">
          Everything, so you don&rsquo;t have to.
        </h2>
        <p className="mt-6 max-w-2xl text-lg text-[#555555] leading-relaxed">
          From the first listing photo to the last line of your monthly statement, the day-to-day
          is ours. Here&rsquo;s what looking after your flat looks like.
        </p>
        <div className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {HANDLES.map((h) => (
            <div key={h.t} className="flex gap-3">
              <Check />
              <div>
                <h3 className="font-serif text-xl text-[#385B4F]">{h.t}</h3>
                <p className="mt-2 text-[#555555] leading-relaxed">{h.b}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why owners choose NourNest */}
      <section className="bg-[#F3FADC]">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="text-sm uppercase tracking-widest text-[#BF936A]">
            Why owners choose NourNest
          </p>
          <h2 className="mt-3 font-serif text-4xl sm:text-5xl text-[#385B4F]">
            Care you can feel, numbers you can see.
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((w) => (
              <div
                key={w.t}
                className="rounded-2xl border border-[#EAECE2] bg-[#FFFBF2] p-7"
              >
                <h3 className="font-serif text-xl text-[#385B4F]">{w.t}</h3>
                <p className="mt-3 text-[#555555] leading-relaxed">{w.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-sm uppercase tracking-widest text-[#BF936A]">How it works</p>
        <h2 className="mt-3 font-serif text-4xl sm:text-5xl text-[#385B4F]">
          Three easy steps.
        </h2>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n}>
              <p className="font-serif text-6xl text-[#BF936A]">{s.n}</p>
              <div className="mt-4 h-px w-12 bg-[#BF936A]/30" />
              <h3 className="mt-4 font-serif text-2xl text-[#385B4F]">{s.t}</h3>
              <p className="mt-3 text-[#555555] leading-relaxed">{s.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Fee */}
      <section className="mx-auto max-w-3xl px-6 pb-20">
        <div className="rounded-2xl border border-[#EAECE2] bg-[#FFFBF2] p-8 text-center">
          <p className="text-sm uppercase tracking-widest text-[#BF936A]">Simple, transparent pricing</p>
          <p className="mt-4 text-lg text-[#555555] leading-relaxed">
            We charge a simple management fee, agreed up front, and it covers the everyday running
            of your flat. No tangled tiers, no surprise add-ons &mdash; just one clear rate and an
            honest monthly statement.
          </p>
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-[#385B4F]">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <h2 className="font-serif text-4xl sm:text-5xl text-[#FFFBF2]">
            Let&rsquo;s look after your flat together.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-[#FFFBF2]/85 leading-relaxed">
            Tell us a little about your property and we&rsquo;ll be straight with you about what it
            could earn and how we&rsquo;d care for it. No pressure, no jargon.
          </p>
          <div className="mt-8 flex justify-center">
            <a
              href="mailto:hello@nournestapartments.com?subject=Property%20management%20enquiry"
              className="inline-flex rounded-full bg-[#FFDE59] px-8 py-3 text-sm font-semibold text-[#385B4F] hover:bg-[#f5d240] transition tracking-wide"
            >
              Talk to us about your property
            </a>
          </div>
          <p className="mt-6 text-sm text-[#FFFBF2]/70">
            Or email us directly at{" "}
            <a
              href="mailto:hello@nournestapartments.com"
              className="underline underline-offset-4 hover:text-[#FFFBF2]"
            >
              hello@nournestapartments.com
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
