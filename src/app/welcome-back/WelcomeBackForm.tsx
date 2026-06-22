"use client";

import { useState, FormEvent } from "react";

// Returning-guest enquiry form. Carries the trackable reference code through to
// the NourNest team (mailto, no backend — works on every device) so the team
// can apply the guest's preferred returning-guest rate and confirm the booking
// in BOOM. Mirrors the site ContactForm pattern + palette. The authoritative
// attribution is Victoria's redemption matcher (BOOM email-match), not this
// form — so a guest who ignores the form and just books direct still counts.

export function WelcomeBackForm({ code }: { code: string }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "sent">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(form: HTMLFormElement) {
    const data = new FormData(form);
    const e: Record<string, string> = {};
    const name = (data.get("name") as string)?.trim() || "";
    const email = (data.get("email") as string)?.trim() || "";
    const message = (data.get("message") as string)?.trim() || "";
    const checkin = (data.get("checkin") as string) || "";
    const checkout = (data.get("checkout") as string) || "";

    if (name.length < 2) e.name = "Please enter your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Please enter a valid email address";
    if (message.length > 2000) e.message = "Please keep it under 2,000 characters";
    if (checkin) {
      const ci = new Date(checkin);
      const today = new Date(); today.setHours(0, 0, 0, 0);
      if (ci < today) e.checkin = "Check-in cannot be in the past";
    }
    if (checkin && checkout && new Date(checkout) <= new Date(checkin)) {
      e.checkout = "Check-out must be after check-in";
    }
    return { errors: e, data: { name, email, message, checkin, checkout } };
  }

  function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const { errors: e, data } = validate(ev.currentTarget);
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setStatus("submitting");
    const ref = code || "(none supplied)";
    const subject = `Returning-guest enquiry · ${data.name} · ${ref}`;
    const body = [
      `Returning-guest reference: ${ref}`,
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Check in: ${data.checkin || "(not specified)"}`,
      `Check out: ${data.checkout || "(not specified)"}`,
      ``,
      `Notes:`,
      data.message || "(none)",
      ``,
      `— Sent from the NourNest welcome-back page. Please apply this guest's`,
      `preferred returning-guest rate and confirm availability in BOOM.`,
    ].join("\n");
    const mailto = `mailto:hello@nournestapartments.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setTimeout(() => setStatus("sent"), 400);
  }

  if (status === "sent") {
    return (
      <div className="mt-6 rounded-2xl border border-[#385B4F]/20 bg-[#F3FADC] p-6">
        <p className="font-serif text-xl text-[#385B4F]">Your enquiry is ready to send.</p>
        <p className="mt-2 text-sm text-[#385B4F]">
          We&rsquo;ve opened your email with everything pre-filled — including your reference. Hit
          send and the NourNest team will confirm availability and your preferred returning-guest
          rate, usually within 15 minutes during UK hours. If your email client didn&rsquo;t open,{" "}
          <a className="underline underline-offset-4" href="mailto:hello@nournestapartments.com">
            email us at hello@nournestapartments.com
          </a>
          .
        </p>
        <button type="button" onClick={() => setStatus("idle")} className="mt-4 text-sm underline underline-offset-4 text-[#385B4F]">
          Send another enquiry
        </button>
      </div>
    );
  }

  const inputBase = "mt-2 w-full rounded-lg border bg-white px-4 py-3 text-[#555555] focus:outline-none";
  const ok = "border-[#EAECE2] focus:border-[#385B4F]";
  const bad = "border-red-500 focus:border-red-600";

  return (
    <form className="mt-6 grid gap-6" onSubmit={onSubmit} noValidate>
      <div>
        <label className="text-sm font-medium text-[#385B4F]" htmlFor="name">Name</label>
        <input id="name" name="name" required minLength={2} maxLength={120} autoComplete="name"
          aria-invalid={!!errors.name}
          className={`${inputBase} ${errors.name ? bad : ok}`} />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>
      <div>
        <label className="text-sm font-medium text-[#385B4F]" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required maxLength={254} autoComplete="email" inputMode="email"
          aria-invalid={!!errors.email}
          className={`${inputBase} ${errors.email ? bad : ok}`} />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-[#385B4F]" htmlFor="checkin">Check in</label>
          <input id="checkin" name="checkin" type="date" min={new Date().toISOString().slice(0, 10)} max="2099-12-31"
            aria-invalid={!!errors.checkin} className={`${inputBase} ${errors.checkin ? bad : ok}`} />
          {errors.checkin && <p className="mt-1 text-sm text-red-600">{errors.checkin}</p>}
        </div>
        <div>
          <label className="text-sm font-medium text-[#385B4F]" htmlFor="checkout">Check out</label>
          <input id="checkout" name="checkout" type="date" min={new Date().toISOString().slice(0, 10)} max="2099-12-31"
            aria-invalid={!!errors.checkout} className={`${inputBase} ${errors.checkout ? bad : ok}`} />
          {errors.checkout && <p className="mt-1 text-sm text-red-600">{errors.checkout}</p>}
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-[#385B4F]" htmlFor="message">Anything we should know? (optional)</label>
        <textarea id="message" name="message" rows={4} maxLength={2000}
          placeholder="Neighbourhood you loved last time, number of guests, length of stay…"
          aria-invalid={!!errors.message} className={`${inputBase} ${errors.message ? bad : ok}`} />
        {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
      </div>
      <button type="submit" disabled={status === "submitting"}
        className="rounded-full bg-[#385B4F] px-6 py-3 text-sm font-medium text-[#FFFBF2] hover:bg-[#5a8074] transition justify-self-start disabled:opacity-60">
        {status === "submitting" ? "Preparing…" : "Request my returning-guest rate"}
      </button>
      <p className="text-xs text-[#555555]/80">
        We&rsquo;ll only use your details to arrange this stay. No third parties.
      </p>
    </form>
  );
}
