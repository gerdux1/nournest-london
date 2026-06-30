"use client";

import { useState } from "react";
import Link from "next/link";
import { LOCATIONS, LISTINGS } from "@/lib/listings";

type Who = "couple" | "family" | "business" | "friends" | "multigen" | "solo";
type Pace = "relaxed" | "balanced" | "packed";

const WHO: { k: Who; t: string; icon: string }[] = [
  { k: "couple", t: "Couple", icon: "💑" },
  { k: "family", t: "Family with kids", icon: "🧸" },
  { k: "business", t: "Business", icon: "💼" },
  { k: "friends", t: "Friends", icon: "🥂" },
  { k: "multigen", t: "Multi-gen / elderly", icon: "👵" },
  { k: "solo", t: "Solo", icon: "🎒" },
];

const INTERESTS: { t: string; icon: string }[] = [
  { t: "Food & drink", icon: "🍽️" },
  { t: "Culture & museums", icon: "🏛️" },
  { t: "Nightlife", icon: "🍸" },
  { t: "Shopping", icon: "🛍️" },
  { t: "Parks & nature", icon: "🌳" },
  { t: "Hidden gems", icon: "💎" },
];

const PACE: { k: Pace; t: string; d: string; icon: string }[] = [
  { k: "relaxed", t: "Relaxed", d: "A few highlights, room to breathe", icon: "🍃" },
  { k: "balanced", t: "Balanced", d: "A good mix each day", icon: "⚖️" },
  { k: "packed", t: "Packed", d: "See as much as possible", icon: "⚡" },
];

const SLOTS = [
  { label: "Morning", icon: "🌅" },
  { label: "Afternoon", icon: "☀️" },
  { label: "Evening", icon: "🌆" },
  { label: "Late", icon: "🌙" },
];

const STEPS = 5; // input steps (progress denominator)
const RESULT = 6;
const GREEN = "#385B4F";
const COPPER = "#BF936A";

type ItineraryDay = { day: number; items: string[] };
type EventItem = { name: string; dateLabel: string; venue: string; url: string | null; category: string };
type VenueItem = { name: string; category: string; rating: number | null; detail: string; url: string | null };
type PlanResult = {
  headline: string;
  note: string;
  days: ItineraryDay[];
  areaSlug: string | null;
  base?: { title: string | null; areaLabel: string; nearestStation: string | null } | null;
  transport?: string[];
  gettingAround?: string[];
  events?: EventItem[];
  venues?: VenueItem[];
  bookingUrl?: string | null;
  booked?: boolean;
};

export function Planner() {
  const [step, setStep] = useState(0);
  const [who, setWho] = useState<Who | null>(null);
  const [size, setSize] = useState(2);
  const [nights, setNights] = useState(3);
  const [arrival, setArrival] = useState("");
  const [baseMode, setBaseMode] = useState<"ours" | "area">("ours");
  const [area, setArea] = useState<string | null>(null);
  const [propertySlug, setPropertySlug] = useState<string | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [pace, setPace] = useState<Pace | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PlanResult | null>(null);
  // PDF capture (value-first: collected after the plan is shown)
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [emailErr, setEmailErr] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfSent, setPdfSent] = useState(false);

  function toggleInterest(i: string) {
    setInterests((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));
  }
  function pickProperty(slug: string, areaSlug: string) { setPropertySlug(slug); setArea(areaSlug); }
  function pickArea(slug: string) { setArea(slug); setPropertySlug(null); }

  const payload = () => ({ who, size, nights, area, propertySlug, arrival, interests, pace });

  async function reveal() {
    setLoading(true);
    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload()),
      });
      setResult((await res.json()) as PlanResult);
      setStep(RESULT);
    } catch {
      setResult({ headline: "Your London plan", note: "Something went wrong — please try again.", days: [], areaSlug: area });
      setStep(RESULT);
    } finally {
      setLoading(false);
    }
  }

  async function sendPdf() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setEmailErr(true); return; }
    setPdfLoading(true);
    try {
      await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload(), email: email.trim(), name: name.trim(), wantPdf: true }),
      });
      setPdfSent(true);
    } catch {
      setPdfSent(true);
    } finally {
      setPdfLoading(false);
    }
  }

  function restart() {
    setStep(0); setWho(null); setSize(2); setNights(3); setArrival(""); setBaseMode("ours"); setArea(null);
    setPropertySlug(null); setInterests([]); setPace(null); setResult(null);
    setEmail(""); setName(""); setEmailErr(false); setPdfLoading(false); setPdfSent(false);
  }

  const pct = Math.round((step / STEPS) * 100);
  const selectedLoc = LOCATIONS.find((l) => l.slug === (result?.areaSlug ?? area));
  const repProperty = selectedLoc ? LISTINGS.find((l) => l.area === selectedLoc.slug) : undefined;
  const canNextBase = baseMode === "ours" ? !!propertySlug : !!area;

  return (
    <div className="np-wrap rounded-3xl border border-[#EAECE2] bg-[#FFFBF2] p-5 sm:p-8">
      <style jsx>{`
        @keyframes npFade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes npPulse { 0%,100% { opacity: .35; } 50% { opacity: 1; } }
        .np-step { animation: npFade .35s ease both; }
        .np-tile { transition: transform .15s ease, box-shadow .2s ease, border-color .2s ease; }
        .np-tile:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(56,91,79,.10); }
        .np-tile-active { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(56,91,79,.16); }
        .np-dot { animation: npPulse 1s infinite ease-in-out; }
      `}</style>

      {loading ? (
        <div className="np-step flex flex-col items-center justify-center py-16 text-center">
          <div className="text-4xl">🧭</div>
          <h3 className="mt-4 font-serif text-2xl" style={{ color: GREEN }}>Crafting your London plan</h3>
          <p className="mt-2 text-[#555]">Mapping your days, the local favourites and the smartest way around…</p>
          <div className="mt-5 flex gap-1.5">
            <span className="np-dot h-2 w-2 rounded-full" style={{ background: GREEN }} />
            <span className="np-dot h-2 w-2 rounded-full" style={{ background: GREEN, animationDelay: ".15s" }} />
            <span className="np-dot h-2 w-2 rounded-full" style={{ background: GREEN, animationDelay: ".3s" }} />
          </div>
        </div>
      ) : (
        <>
          {step > 0 && step <= STEPS && (
            <div className="mb-6">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#EAECE2]">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: GREEN }} />
              </div>
              <p className="mt-2 text-xs tracking-wide text-[#999]">Step {step} of {STEPS}</p>
            </div>
          )}

          {/* INTRO */}
          {step === 0 && (
            <div className="np-step">
              <p className="text-xs uppercase tracking-widest" style={{ color: COPPER }}>Free · under a minute · instant</p>
              <h2 className="mt-3 font-serif text-3xl sm:text-4xl" style={{ color: GREEN }}>Plan your perfect London stay</h2>
              <p className="mt-4 max-w-xl leading-relaxed text-[#555]">
                Answer a few quick questions and we&rsquo;ll build you a personalised, day-by-day London plan —
                tailored to who you&rsquo;re travelling with, the neighbourhoods we know best, and how to get around from your door.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { i: "🗺️", t: "Tailored day-by-day plan" },
                  { i: "🚇", t: "Tube tips from your base" },
                  { i: "🍽️", t: "Local favourites nearby" },
                ].map((c) => (
                  <div key={c.t} className="rounded-2xl border border-[#EAECE2] bg-white px-4 py-4">
                    <div className="text-2xl">{c.i}</div>
                    <div className="mt-2 text-sm font-medium" style={{ color: GREEN }}>{c.t}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => setStep(1)} className="mt-8 w-full rounded-full bg-[#FFDE59] px-6 py-3.5 font-semibold tracking-wide text-[#385B4F] transition hover:bg-[#f5d240]">
                START PLANNING →
              </button>
            </div>
          )}

          {/* WHO */}
          {step === 1 && (
            <Step title="Who's travelling?" sub="This shapes the pace, the picks and the practicalities." onBack={() => setStep(0)} onNext={() => setStep(2)} canNext={!!who}>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {WHO.map((o) => (
                  <Tile key={o.k} active={who === o.k} onClick={() => setWho(o.k)}>
                    <span className="text-2xl">{o.icon}</span>
                    <span className="mt-2 text-sm font-medium" style={{ color: GREEN }}>{o.t}</span>
                  </Tile>
                ))}
              </div>
            </Step>
          )}

          {/* BASICS */}
          {step === 2 && (
            <Step title="The basics" sub="How many of you, and when are you coming?" onBack={() => setStep(1)} onNext={() => setStep(3)} canNext>
              <div className="space-y-7">
                <Slider label="Group size" value={size} min={1} max={10} suffix={size === 1 ? "person" : "people"} onChange={setSize} />
                <Slider label="Nights" value={nights} min={1} max={14} suffix={nights === 1 ? "night" : "nights"} onChange={setNights} />
                <div>
                  <label className="mb-2 block text-sm text-[#555]">Arriving <span className="text-[#999]">(optional — unlocks live events on your dates)</span></label>
                  <input type="date" value={arrival} onChange={(e) => setArrival(e.target.value)}
                    className="w-full rounded-xl border border-[#EAECE2] bg-white px-4 py-3 text-[#385B4F] outline-none focus:border-[#385B4F] sm:w-auto" />
                </div>
              </div>
            </Step>
          )}

          {/* WHERE */}
          {step === 3 && (
            <Step title="Where are you staying?" sub="Pick your NourNest apartment for door-to-door tube tips — or just choose an area." onBack={() => setStep(2)} onNext={() => setStep(4)} canNext={canNextBase}>
              <div className="mb-5 inline-flex rounded-full border border-[#EAECE2] bg-white p-1">
                <button onClick={() => setBaseMode("ours")} className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${baseMode === "ours" ? "bg-[#385B4F] text-[#FFFBF2]" : "text-[#555]"}`}>Our apartments</button>
                <button onClick={() => setBaseMode("area")} className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${baseMode === "area" ? "bg-[#385B4F] text-[#FFFBF2]" : "text-[#555]"}`}>Just an area</button>
              </div>
              {baseMode === "ours" ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {LISTINGS.map((l) => (
                    <PhotoTile key={l.slug} img={l.heroImage} active={propertySlug === l.slug} onClick={() => pickProperty(l.slug, l.area)}
                      title={l.title} sub={`${l.areaLabel} · from £${l.fromGbpPerNight}/night`} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {LOCATIONS.map((l) => (
                    <PhotoTile key={l.slug} img={l.heroImage} active={area === l.slug && !propertySlug} onClick={() => pickArea(l.slug)}
                      title={l.shortLabel} sub={l.whyStayHere.split(".")[0] + "."} />
                  ))}
                  <Tile active={area === "unsure" && !propertySlug} onClick={() => pickArea("unsure")} className="!flex-col !items-start text-left">
                    <span className="text-2xl">🤔</span>
                    <span className="mt-2 font-medium" style={{ color: GREEN }}>Not sure yet</span>
                    <span className="mt-1 text-sm text-[#555]">Help me choose the right area.</span>
                  </Tile>
                </div>
              )}
            </Step>
          )}

          {/* INTERESTS */}
          {step === 4 && (
            <Step title="What are you into?" sub="Pick as many as you like." onBack={() => setStep(3)} onNext={() => setStep(5)} canNext={interests.length > 0}>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {INTERESTS.map((i) => (
                  <Tile key={i.t} active={interests.includes(i.t)} onClick={() => toggleInterest(i.t)}>
                    <span className="text-2xl">{i.icon}</span>
                    <span className="mt-2 text-sm font-medium" style={{ color: GREEN }}>{i.t}</span>
                  </Tile>
                ))}
              </div>
            </Step>
          )}

          {/* PACE — last input step, reveals the plan (no email gate) */}
          {step === 5 && (
            <Step title="What's your pace?" sub="How full do you like your days?" onBack={() => setStep(4)} onNext={reveal} canNext={!!pace} nextLabel="SEE MY PLAN ✨">
              <div className="grid gap-3 sm:grid-cols-3">
                {PACE.map((p) => (
                  <Tile key={p.k} active={pace === p.k} onClick={() => setPace(p.k)} className="!flex-col !items-start text-left">
                    <span className="text-2xl">{p.icon}</span>
                    <span className="mt-2 font-medium" style={{ color: GREEN }}>{p.t}</span>
                    <span className="mt-1 text-sm text-[#555]">{p.d}</span>
                  </Tile>
                ))}
              </div>
            </Step>
          )}

          {/* RESULT */}
          {step === RESULT && result && (
            <div className="np-step">
              {selectedLoc && (
                <div className="relative mb-5 h-56 w-full overflow-hidden rounded-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selectedLoc.heroImage} alt={selectedLoc.shortLabel} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 text-[#FFFBF2]">
                    <span className="inline-block h-0.5 w-10 bg-[#FFDE59]" />
                    <p className="mt-3 text-xs uppercase tracking-[0.25em] text-[#FFDE59]">Your personalised plan</p>
                    <p className="mt-1 font-serif text-3xl leading-tight">{result.headline}</p>
                  </div>
                </div>
              )}
              {!selectedLoc && (
                <>
                  <p className="text-xs uppercase tracking-widest" style={{ color: COPPER }}>Your personalised plan</p>
                  <h3 className="mt-2 font-serif text-2xl sm:text-3xl" style={{ color: GREEN }}>{result.headline}</h3>
                </>
              )}
              {result.note && <p className="mt-2 text-[#555]">{result.note}</p>}

              {/* Getting around */}
              {result.base && (
                <div className="mt-6 rounded-2xl border border-[#EAECE2] bg-white p-5">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🚇</span>
                    <span className="font-medium" style={{ color: GREEN }}>
                      Getting around{result.base.title ? ` from ${result.base.title}` : ` in ${result.base.areaLabel}`}
                    </span>
                  </div>
                  {result.transport && result.transport.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {result.transport.map((t) => (
                        <span key={t} className="rounded-full bg-[#EEF3EC] px-3 py-1 text-xs font-medium text-[#385B4F]">{t}</span>
                      ))}
                    </div>
                  )}
                  {result.gettingAround && result.gettingAround.length > 0 && (
                    <ul className="mt-3 space-y-1.5">
                      {result.gettingAround.map((g, i) => (
                        <li key={i} className="flex gap-2 text-sm text-[#555]"><Dot /> {g}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Local favourites — venue feed */}
              {result.venues && result.venues.length > 0 && (
                <div className="mt-6 rounded-2xl border border-[#EAECE2] bg-white p-6">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🍽️</span>
                    <span className="font-medium" style={{ color: GREEN }}>
                      Local favourites{result.base?.title ? ` near ${result.base.title}` : ""}
                    </span>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {result.venues.map((v, i) => (
                      <a key={i} href={v.url ?? undefined} target={v.url ? "_blank" : undefined} rel="noopener noreferrer"
                        className={`rounded-xl border border-[#EAECE2] px-4 py-3 transition ${v.url ? "hover:border-[#385B4F] hover:bg-[#FBFCF7]" : ""}`}>
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate font-medium text-[#3A3A3A]">{v.name}</span>
                          {v.rating != null && <span className="shrink-0 text-xs font-semibold" style={{ color: COPPER }}>★ {v.rating}</span>}
                        </div>
                        <div className="mt-0.5 truncate text-xs text-[#777]">{v.category} · {v.detail}</div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* What's on — events feed */}
              {result.events && result.events.length > 0 && (
                <div className="mt-6 rounded-2xl border border-[#EAECE2] bg-white p-6">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🎟️</span>
                    <span className="font-medium" style={{ color: GREEN }}>What&rsquo;s on during your stay</span>
                  </div>
                  <div className="mt-4 space-y-3">
                    {result.events.map((ev, i) => (
                      <a key={i} href={ev.url ?? undefined} target={ev.url ? "_blank" : undefined} rel="noopener noreferrer"
                        className={`flex items-center gap-4 rounded-xl border border-[#EAECE2] px-4 py-3 transition ${ev.url ? "hover:border-[#385B4F] hover:bg-[#FBFCF7]" : ""}`}>
                        <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg" style={{ background: "#EEF3EC" }}>
                          <span className="text-[10px] font-semibold uppercase" style={{ color: COPPER }}>{ev.dateLabel.split(" ")[0]}</span>
                          <span className="text-sm font-semibold" style={{ color: GREEN }}>{ev.dateLabel.split(" ")[1] || ""}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-medium text-[#3A3A3A]">{ev.name}</div>
                          <div className="truncate text-xs text-[#777]">{ev.venue} · {ev.category}</div>
                        </div>
                        {ev.url && <span className="shrink-0 text-sm" style={{ color: COPPER }}>→</span>}
                      </a>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-[#999]">Dates and tickets are indicative — we&rsquo;ll confirm what&rsquo;s on close to your stay.</p>
                </div>
              )}

              {/* Days — magazine timeline */}
              <div className="mt-6 space-y-4">
                {result.days.map((d) => (
                  <div key={d.day} className="rounded-2xl border border-[#EAECE2] bg-white p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full font-serif text-base text-[#FFFBF2]" style={{ background: GREEN }}>{d.day}</span>
                      <div>
                        <span className="block text-[10px] uppercase tracking-[0.2em]" style={{ color: COPPER }}>Day {d.day}</span>
                        <span className="block font-serif text-lg" style={{ color: GREEN }}>Your day, hour by hour</span>
                      </div>
                    </div>
                    <ol className="relative ml-4 space-y-5 border-l border-dashed border-[#D9DFD2] pl-6">
                      {d.items.map((it, idx) => {
                        const slot = SLOTS[Math.min(idx, SLOTS.length - 1)];
                        return (
                          <li key={idx} className="relative">
                            <span className="absolute -left-[33px] flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] ring-1 ring-[#D9DFD2]">{slot.icon}</span>
                            <span className="block text-[11px] font-semibold uppercase tracking-wide" style={{ color: COPPER }}>{slot.label}</span>
                            <span className="mt-0.5 block text-[#3A3A3A]">{it}</span>
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                ))}
              </div>

              {/* PDF capture — value-first: only after the plan is shown */}
              <div className="mt-6 rounded-2xl border-2 border-dashed border-[#385B4F]/40 bg-[#FBFCF7] p-6">
                {pdfSent ? (
                  <div className="text-center">
                    <div className="text-3xl">✉️</div>
                    <p className="mt-2 font-serif text-xl" style={{ color: GREEN }}>On its way to {email}</p>
                    <p className="mt-1 text-sm text-[#555]">Check your inbox for the full PDF — plus the occasional London tip.</p>
                  </div>
                ) : (
                  <>
                    <p className="font-serif text-xl" style={{ color: GREEN }}>Want this as a PDF to keep? 📄</p>
                    <p className="mt-1 text-sm text-[#555]">We&rsquo;ll email you the full itinerary — venues, tube tips and all — ready for your trip.</p>
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                      <input type="email" placeholder="you@email.com" value={email}
                        onChange={(e) => { setEmail(e.target.value); setEmailErr(false); }}
                        className={`flex-1 rounded-xl border bg-white px-4 py-3 outline-none ${emailErr ? "border-red-400" : "border-[#EAECE2] focus:border-[#385B4F]"}`} />
                      <button onClick={sendPdf} disabled={pdfLoading}
                        className="rounded-full bg-[#FFDE59] px-6 py-3 font-semibold tracking-wide text-[#385B4F] transition hover:bg-[#f5d240] disabled:opacity-60">
                        {pdfLoading ? "Sending…" : "EMAIL ME THE PDF"}
                      </button>
                    </div>
                    {emailErr && <p className="mt-2 text-sm text-red-500">Please enter a valid email address.</p>}
                    <p className="mt-2 text-xs text-[#999]">No spam — just your plan and the occasional London tip. Unsubscribe anytime.</p>
                  </>
                )}
              </div>

              {/* Booking / concierge CTA */}
              {result.booked && result.bookingUrl ? (
                <div className="mt-6 rounded-2xl border-2 border-[#385B4F] bg-white p-6">
                  <p className="font-serif text-xl" style={{ color: GREEN }}>You&rsquo;re all set 🎉</p>
                  <p className="mt-2 text-[#555]">Need anything during your stay — early check-in, a grocery drop, extra nights? Your NourNest concierge is a message away.</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <a href={result.bookingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex rounded-full bg-[#FFDE59] px-6 py-2.5 font-semibold tracking-wide text-[#385B4F] transition hover:bg-[#f5d240]">EXTEND MY STAY</a>
                    <Link href="/contact" className="inline-flex rounded-full border border-[#385B4F] px-6 py-2.5 font-semibold tracking-wide text-[#385B4F] transition hover:bg-[#385B4F] hover:text-[#FFFBF2]">ASK THE CONCIERGE</Link>
                  </div>
                </div>
              ) : selectedLoc ? (
                <div className="mt-6 overflow-hidden rounded-2xl border-2 border-[#385B4F] bg-white">
                  {repProperty && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={repProperty.heroImage} alt={selectedLoc.shortLabel} className="h-36 w-full object-cover" />
                  )}
                  <div className="p-6">
                    <p className="font-serif text-xl" style={{ color: GREEN }}>Stay in the heart of {selectedLoc.shortLabel}</p>
                    <p className="mt-2 text-[#555]">Make it effortless — book a NourNest apartment right where your plan happens.</p>
                    <Link href={`/locations/${selectedLoc.slug}`} className="mt-4 inline-flex rounded-full bg-[#FFDE59] px-6 py-2.5 font-semibold tracking-wide text-[#385B4F] transition hover:bg-[#f5d240]">
                      SEE APARTMENTS IN {selectedLoc.shortLabel.toUpperCase()}
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border-2 border-[#385B4F] bg-white p-6">
                  <p className="font-serif text-xl" style={{ color: GREEN }}>Not booked yet?</p>
                  <p className="mt-2 text-[#555]">Tell us your dates and we&rsquo;ll match you to the right NourNest neighbourhood.</p>
                  <Link href="/locations" className="mt-4 inline-flex rounded-full bg-[#FFDE59] px-6 py-2.5 font-semibold tracking-wide text-[#385B4F] transition hover:bg-[#f5d240]">EXPLORE OUR APARTMENTS</Link>
                </div>
              )}

              <div className="mt-6 text-center">
                <button onClick={restart} className="text-sm text-[#555] underline">Start over</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Step({ title, sub, children, onBack, onNext, canNext, nextLabel = "NEXT →" }: {
  title: string; sub: string; children: React.ReactNode; onBack: () => void; onNext: () => void; canNext: boolean; nextLabel?: string;
}) {
  return (
    <div className="np-step">
      <h3 className="font-serif text-2xl" style={{ color: GREEN }}>{title}</h3>
      <p className="mt-2 mb-5 text-[#555]">{sub}</p>
      {children}
      <div className="mt-6 flex items-center justify-between">
        <button onClick={onBack} className="text-sm text-[#555] underline">Back</button>
        <button onClick={onNext} disabled={!canNext}
          className="rounded-full bg-[#FFDE59] px-6 py-3 font-semibold tracking-wide text-[#385B4F] transition hover:bg-[#f5d240] disabled:cursor-not-allowed disabled:opacity-40">
          {nextLabel}
        </button>
      </div>
    </div>
  );
}

function Tile({ active, onClick, children, className = "" }: {
  active: boolean; onClick: () => void; children: React.ReactNode; className?: string;
}) {
  return (
    <div onClick={onClick}
      className={`np-tile ${active ? "np-tile-active border-[#385B4F] ring-1 ring-[#385B4F]" : "border-[#EAECE2]"} relative flex cursor-pointer flex-col items-center rounded-2xl border bg-white px-4 py-5 text-center ${className}`}>
      {active && <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#385B4F] text-[11px] text-[#FFFBF2]">✓</span>}
      {children}
    </div>
  );
}

function PhotoTile({ img, title, sub, active, onClick }: {
  img: string; title: string; sub: string; active: boolean; onClick: () => void;
}) {
  return (
    <div onClick={onClick}
      className={`np-tile ${active ? "np-tile-active border-[#385B4F] ring-1 ring-[#385B4F]" : "border-[#EAECE2]"} relative cursor-pointer overflow-hidden rounded-2xl border bg-white`}>
      {active && <span className="absolute right-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-[#385B4F] text-xs text-[#FFFBF2]">✓</span>}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img} alt={title} className="h-28 w-full object-cover" />
      <div className="px-4 py-3 text-left">
        <div className="text-sm font-medium" style={{ color: GREEN }}>{title}</div>
        <div className="mt-0.5 text-xs text-[#777]">{sub}</div>
      </div>
    </div>
  );
}

function Slider({ label, value, min, max, suffix, onChange }: {
  label: string; value: number; min: number; max: number; suffix: string; onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-[#555]">{label}</label>
      <div className="flex items-center gap-4">
        <input type="range" min={min} max={max} step={1} value={value} onChange={(e) => onChange(Number(e.target.value))} className="flex-1 accent-[#385B4F]" />
        <span className="min-w-[80px] font-medium" style={{ color: GREEN }}>{value} {suffix}</span>
      </div>
    </div>
  );
}

function Dot() {
  return <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: COPPER }} aria-hidden="true" />;
}
