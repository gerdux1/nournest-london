"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const NAV = [
  { href: "/apartments", label: "Apartments" },
  { href: "/locations", label: "Locations" },
  { href: "/corporate", label: "Corporate" },
  { href: "/apartments-vs-hotels", label: "Apartments vs Hotels" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#EAECE2] bg-[#FFFBF2]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center"
          aria-label="NourNest · home"
          onClick={() => setOpen(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo-header.png"
            alt="NourNest Apartments"
            className="h-14 w-auto sm:h-16"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-7 text-sm text-[#385B4F]">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-[#BF936A] transition">
              {n.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/contact"
          className="hidden lg:inline-flex rounded-full bg-[#385B4F] px-5 py-2 text-sm font-medium text-[#FFFBF2] hover:bg-[#5a8074] transition"
        >
          Enquire
        </Link>

        <button
          type="button"
          className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-[#385B4F] hover:bg-[#EAECE2] transition"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          )}
        </button>
      </div>

      <div
        id="mobile-nav"
        className={`lg:hidden ${open ? "block" : "hidden"} border-t border-[#EAECE2] bg-[#FFFBF2]`}
      >
        <nav className="mx-auto max-w-7xl px-6 py-6 flex flex-col gap-1 text-base">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-[#385B4F] hover:bg-[#EAECE2] transition"
            >
              {n.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="mt-4 inline-flex w-full justify-center rounded-full bg-[#385B4F] px-6 py-3 text-sm font-medium text-[#FFFBF2] hover:bg-[#5a8074] transition"
          >
            Enquire
          </Link>
          <a
            href="mailto:hello@nournestapartments.com?subject=Direct%20booking%20enquiry"
            onClick={() => setOpen(false)}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#385B4F] px-6 py-3 text-sm font-medium text-[#385B4F] hover:bg-[#385B4F] hover:text-[#FFFBF2] transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 6-10 7L2 6" />
            </svg>
            hello@nournestapartments.com
          </a>
        </nav>
      </div>
    </header>
  );
}
