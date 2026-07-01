import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy · NourNest Apartments",
  description: "How NourNest Apartments collects, uses and protects your personal data.",
  alternates: { canonical: "https://nournestapartments.com/privacy" },
};

// NOTE: Draft privacy notice — please have this reviewed by a solicitor before relying on it.
export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <p className="text-xs uppercase tracking-widest text-[#BF936A]">Legal</p>
      <h1 className="mt-3 font-serif text-4xl text-[#385B4F]">Privacy Policy</h1>
      <p className="mt-2 text-sm text-[#999]">Last updated: July 2026</p>

      <div className="mt-8 space-y-6 leading-relaxed text-[#555]">
        <p>
          This notice explains how NourNest Apartments (&ldquo;we&rdquo;, &ldquo;us&rdquo;) collects and uses your
          personal data when you use our website, including the London Planner tool. We are the data controller
          for the information you provide.
        </p>

        <div>
          <h2 className="font-serif text-xl text-[#385B4F]">What we collect</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Contact details you give us — your email address and, optionally, your first name.</li>
            <li>Trip preferences you enter into the planner (group, dates, area and interests) so we can build your itinerary.</li>
            <li>Basic, anonymised usage analytics to help us improve the site.</li>
          </ul>
        </div>

        <div>
          <h2 className="font-serif text-xl text-[#385B4F]">How we use it</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>To create and email you your personalised London plan.</li>
            <li>With your consent, to send you occasional London tips and offers from NourNest. You can unsubscribe at any time via the link in any email.</li>
          </ul>
          <p className="mt-2">
            Our lawful basis is your consent (for marketing) and our legitimate interest in responding to your request
            (for delivering the plan you asked for).
          </p>
        </div>

        <div>
          <h2 className="font-serif text-xl text-[#385B4F]">Who we share it with</h2>
          <p className="mt-2">
            We use trusted service providers to run the website and send email (for example our hosting and CRM
            providers). They process data only on our instructions. We never sell your data.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-xl text-[#385B4F]">Your rights</h2>
          <p className="mt-2">
            You can ask us to access, correct or delete your data, or to stop marketing to you, at any time. To do so,
            contact us at{" "}
            <a href="mailto:hello@nournestapartments.com" className="underline text-[#385B4F]">hello@nournestapartments.com</a>.
            You also have the right to complain to the UK Information Commissioner&rsquo;s Office (ICO).
          </p>
        </div>
      </div>
    </section>
  );
}
