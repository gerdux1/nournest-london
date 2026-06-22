import type { Metadata } from "next";
import { JsonLd, breadcrumb } from "@/lib/schema";
import { isValidCode, normaliseCode } from "@/lib/returning-guest";
import { WelcomeBackForm } from "./WelcomeBackForm";

// Returning-guest landing place. The post-stay offer (Victoria's rebooking
// engine) links checked-out guests here with ?ref=<CODE>. This is a DIRECT
// booking destination on our own domain — never an OTA — so we keep the OTA
// commission. The booking transaction itself happens in BOOM (the calendar
// source of truth → no double-bookings; hosted payment → no card data here).
//
// Not indexed: this is a private destination for returning guests, not a
// public marketing page, and the preferred-rate framing shouldn't surface in
// search. Copy on this page is kept on-policy (see lib/returning-guest.ts
// FORBIDDEN_TERMS) — "preferred returning-guest rate", never OTA-steering wording.

export const metadata: Metadata = {
  title: "Welcome back · your returning-guest rate",
  description:
    "A warm welcome back to NourNest. Quote your returning-guest reference and we'll arrange your next London stay at your preferred returning-guest rate.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://nournestapartments.com/welcome-back" },
};

export default async function WelcomeBackPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  const code = normaliseCode(ref);
  const valid = isValidCode(code);

  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <JsonLd
        data={[
          breadcrumb([
            { name: "Home", url: "https://nournestapartments.com" },
            { name: "Welcome back", url: "https://nournestapartments.com/welcome-back" },
          ]),
        ]}
      />

      <p className="text-sm uppercase tracking-widest text-[#BF936A]">For returning guests</p>
      <h1 className="mt-3 font-serif text-5xl text-[#385B4F] leading-[1.05]">Welcome back.</h1>
      <p className="mt-6 text-lg text-[#555555] leading-relaxed">
        It was a pleasure hosting you. As one of our returning guests, you&rsquo;re warmly invited
        to your <strong className="text-[#385B4F]">preferred returning-guest rate</strong> the next
        time your travels bring you back to London. Tell us your dates below and the NourNest team
        will arrange everything — like coming home.
      </p>

      {valid ? (
        <div className="mt-8 rounded-2xl border border-[#385B4F]/15 bg-[#F3FADC] p-6">
          <p className="text-xs uppercase tracking-widest text-[#BF936A]">Your returning-guest reference</p>
          <p className="mt-2 font-mono text-2xl tracking-wider text-[#385B4F]">{code}</p>
          <p className="mt-2 text-sm text-[#555555]">
            We&rsquo;ve recognised your reference. Quote it below and we&rsquo;ll apply your
            preferred returning-guest rate to your next stay.
          </p>
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-[#EAECE2] bg-white p-6">
          <p className="text-sm text-[#555555]">
            If you have a returning-guest reference from us, add it in your message below and
            we&rsquo;ll apply your preferred rate. No reference to hand? No problem — just tell us
            your dates and we&rsquo;ll take care of the rest.
          </p>
        </div>
      )}

      {/* How it works — calm, three steps, no OTA-steering wording */}
      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {[
          { n: 1, t: "Tell us your dates", b: "Share when you'd like to return and which part of London suits you." },
          { n: 2, t: "We confirm in BOOM", b: "We check live availability and hold your apartment — no double-bookings, ever." },
          { n: 3, t: "Your preferred rate", b: "We apply your returning-guest rate and send a secure way to pay. We never take card details by email." },
        ].map((s) => (
          <div key={s.n} className="rounded-2xl border border-[#EAECE2] p-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#385B4F] text-[#FFFBF2] font-serif">{s.n}</span>
            <h3 className="mt-3 font-serif text-lg text-[#385B4F]">{s.t}</h3>
            <p className="mt-2 text-sm text-[#555555] leading-relaxed">{s.b}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-16 font-serif text-3xl text-[#385B4F]">Request your returning-guest rate</h2>
      <WelcomeBackForm code={valid ? code : ""} />

      <div className="mt-12 flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#385B4F]">
        <span>NourNest Ltd · Company No. 16629708</span>
        <span aria-hidden="true">·</span>
        <span>154 Warwick Road, London W14 8PS</span>
        <span aria-hidden="true">·</span>
        <span>Real human reply, usually within 15 minutes during UK hours</span>
      </div>
    </section>
  );
}
