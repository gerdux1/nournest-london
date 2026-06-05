import type { Metadata } from "next";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact us",
  description:
    "Get in touch with NourNest. Email the NourNest team on hello@nournestapartments.com — real people, no call centres, no ticket numbers. Average reply under 15 minutes during UK hours.",
};

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <p className="text-sm uppercase tracking-widest text-stone-500">Contact us</p>
      <h1 className="mt-3 font-serif text-5xl text-[#385B4F]">Talk to a real person.</h1>
      <p className="mt-6 text-stone-700">
        Tell us where you want to stay and for how long. We&rsquo;ll come back with availability,
        pricing for your dates, and a warm welcome — like coming home.
      </p>

      {/* Trust strip — Companies House + response time (audit feedback) */}
      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#385B4F]">
        <span>NourNest Ltd · Company No. 16629708</span>
        <span aria-hidden="true">·</span>
        <span>154 Warwick Road, London W14 8PS</span>
        <span aria-hidden="true">·</span>
        <span>Average response time: under 15 minutes during UK hours</span>
      </div>

      {/* Speak to the NourNest team · primary fast contact */}
      <div className="mt-10 rounded-2xl border border-[#385B4F]/15 bg-[#F3FADC] p-6 sm:p-8">
        <p className="text-xs uppercase tracking-widest text-stone-500">Fastest way to reach us</p>
        <h2 className="mt-2 font-serif text-2xl sm:text-3xl text-[#385B4F]">
          Email the NourNest team.
        </h2>
        <p className="mt-3 text-stone-700">
          Send us your dates and preferred neighbourhood, and we&rsquo;ll come back with
          availability and your direct rate, usually within 15 minutes during UK hours.
          No call centres, no ticket numbers — just a real person making sure your London
          stay feels like home.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <a
            href="mailto:hello@nournestapartments.com?subject=Direct%20booking%20enquiry"
            className="inline-flex items-center gap-2 rounded-full bg-[#385B4F] px-6 py-3 text-sm font-medium text-[#FFFBF2] hover:bg-[#5a8074] transition"
            aria-label="Email the NourNest team at hello@nournestapartments.com"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
            Email hello@nournestapartments.com
          </a>
        </div>
        <p className="mt-4 text-xs text-stone-500">
          Real human reply, usually within 15 minutes during UK hours.
        </p>
      </div>

      <p className="mt-10 text-sm uppercase tracking-widest text-stone-500">Or use the form</p>
      <ContactForm />
    </section>
  );
}
