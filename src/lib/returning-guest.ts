// Returning-guest code helpers — the front-end half of Victoria's rebooking
// engine (~/victoria/app/rebooking/). The post-stay offer mints a trackable
// code STAYLIO-XX-1234 / NOURNEST-XX-1234 and links the guest to
// /welcome-back?ref=<CODE>. This file mirrors, EXACTLY, the regex in
// victoria/app/rebooking/offer.py (_CODE_RE) and the Pipeline "AM" column
// validation, so a code that resolves here also reconciles in the ledger.
//
// We deliberately do NOT call Victoria to resolve the code to a guest: a code
// is only semi-unguessable, so the page must not leak PII. We validate the
// format, greet warmly, and let the BOOM booking + Victoria's redemption
// matcher do the authoritative attribution.

export const CODE_RE = /^(STAYLIO|NOURNEST)-[A-Z]{1,5}-[A-Z0-9]{4}$/;

export function normaliseCode(raw: string | undefined | null): string {
  return (raw ?? "").trim().toUpperCase();
}

export function isValidCode(raw: string | undefined | null): boolean {
  return CODE_RE.test(normaliseCode(raw));
}

export function brandFromCode(raw: string | undefined | null): "staylio" | "nournest" | null {
  const code = normaliseCode(raw);
  if (!CODE_RE.test(code)) return null;
  return code.startsWith("NOURNEST") ? "nournest" : "staylio";
}

// Mirror of victoria/app/rebooking/offer.py FORBIDDEN_TERMS. Guest-facing copy
// on the returning-guest surface must contain NONE of these — the BAM Discount
// Policy bans OTA-steering / promotional wording. Exported so a test (or a
// human) can assert the page copy stays on-policy. The on-policy phrase is
// "preferred returning-guest rate".
export const FORBIDDEN_TERMS = [
  "discount", "cheaper", "cheap", "book direct", "direct booking", "directly",
  "save 10", "10% off", "% off", "percent off", "promo", "coupon", "voucher",
  "best price", "lowest price", "deal",
];

export function isCompliantCopy(text: string): boolean {
  const lc = (text || "").toLowerCase();
  return !FORBIDDEN_TERMS.some((t) => lc.includes(t));
}
