"use client";

import { useState, FormEvent } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");
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
    if (message.length < 10) e.message = "Tell us a little more so we can help (at least 10 characters)";
    if (message.length > 2000) e.message = "Please keep it under 2,000 characters";

    if (checkin) {
      const ci = new Date(checkin);
      const today = new Date(); today.setHours(0, 0, 0, 0);
      if (ci < today) e.checkin = "Check-in cannot be in the past";
    }
    if (checkin && checkout) {
      const ci = new Date(checkin);
      const co = new Date(checkout);
      if (co <= ci) e.checkout = "Check-out must be after check-in";
    }

    return { errors: e, data: { name, email, message, checkin, checkout } };
  }

  function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const { errors: e, data } = validate(ev.currentTarget);
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setStatus("submitting");

    // mailto fallback — works on every device with a mail client; no backend needed.
    const subject = `NourNest enquiry · ${data.name}`;
    const body = [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Check in: ${data.checkin || "(not specified)"}`,
      `Check out: ${data.checkout || "(not specified)"}`,
      ``,
      `Message:`,
      data.message,
      ``,
      `— Sent from nournestapartments.com contact form`,
    ].join("\n");

    const mailto = `mailto:hello@nournestapartments.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setTimeout(() => setStatus("sent"), 400);
  }

  if (status === "sent") {
    return (
      <div className="mt-4 rounded-2xl border border-[#385B4F]/20 bg-[#F3FADC] p-6">
        <p className="font-serif text-xl text-[#385B4F]">Enquiry ready to send.</p>
        <p className="mt-2 text-sm text-[#385B4F]">
          We&rsquo;ve opened your email client with the message pre-filled. Hit send and the
          NourNest team will reply, usually within 15 minutes during UK hours. If your email
          client didn&rsquo;t open, please{" "}
          <a className="underline underline-offset-4" href="mailto:hello@nournestapartments.com">
            email us directly
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm underline underline-offset-4 text-[#385B4F]"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form className="mt-4 grid gap-6" onSubmit={onSubmit} noValidate>
      <div>
        <label className="text-sm font-medium text-stone-900" htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          required
          minLength={2}
          maxLength={120}
          autoComplete="name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={`mt-2 w-full rounded-lg border bg-white px-4 py-3 text-stone-900 focus:outline-none ${
            errors.name ? "border-red-500 focus:border-red-600" : "border-stone-300 focus:border-[#385B4F]"
          }`}
        />
        {errors.name && <p id="name-error" className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>
      <div>
        <label className="text-sm font-medium text-stone-900" htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          inputMode="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={`mt-2 w-full rounded-lg border bg-white px-4 py-3 text-stone-900 focus:outline-none ${
            errors.email ? "border-red-500 focus:border-red-600" : "border-stone-300 focus:border-[#385B4F]"
          }`}
        />
        {errors.email && <p id="email-error" className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-stone-900" htmlFor="checkin">Check in</label>
          <input
            id="checkin"
            name="checkin"
            type="date"
            min={new Date().toISOString().slice(0, 10)}
            max="2099-12-31"
            aria-invalid={!!errors.checkin}
            className={`mt-2 w-full rounded-lg border bg-white px-4 py-3 text-stone-900 focus:outline-none ${
              errors.checkin ? "border-red-500 focus:border-red-600" : "border-stone-300 focus:border-[#385B4F]"
            }`}
          />
          {errors.checkin && <p className="mt-1 text-sm text-red-600">{errors.checkin}</p>}
        </div>
        <div>
          <label className="text-sm font-medium text-stone-900" htmlFor="checkout">Check out</label>
          <input
            id="checkout"
            name="checkout"
            type="date"
            min={new Date().toISOString().slice(0, 10)}
            max="2099-12-31"
            aria-invalid={!!errors.checkout}
            className={`mt-2 w-full rounded-lg border bg-white px-4 py-3 text-stone-900 focus:outline-none ${
              errors.checkout ? "border-red-500 focus:border-red-600" : "border-stone-300 focus:border-[#385B4F]"
            }`}
          />
          {errors.checkout && <p className="mt-1 text-sm text-red-600">{errors.checkout}</p>}
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-stone-900" htmlFor="message">Tell us a bit more</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          minLength={10}
          maxLength={2000}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          placeholder="How many guests, neighbourhood preference, anything else we should know."
          className={`mt-2 w-full rounded-lg border bg-white px-4 py-3 text-stone-900 focus:outline-none ${
            errors.message ? "border-red-500 focus:border-red-600" : "border-stone-300 focus:border-[#385B4F]"
          }`}
        />
        {errors.message && <p id="message-error" className="mt-1 text-sm text-red-600">{errors.message}</p>}
      </div>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded-full bg-[#385B4F] px-6 py-3 text-sm font-medium text-[#FFFBF2] hover:bg-[#5a8074] transition justify-self-start disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send enquiry"}
      </button>
      <p className="text-xs text-stone-500">
        We&rsquo;ll only use your details to reply to this enquiry. No marketing, no third parties.
      </p>
    </form>
  );
}
