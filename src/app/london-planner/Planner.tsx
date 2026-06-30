"use client";

import { useState } from "react";
import Link from "next/link";
import { LOCATIONS } from "@/lib/listings";

type Who = "couple" | "family" | "business" | "friends" | "multigen" | "solo";
type Pace = "relaxed" | "balanced" | "packed";

const WHO: { k: Who; t: string }[] = [
  { k: "couple", t: "Couple" },
  { k: "family", t: "Family with kids" },
  { k: "business", t: "Business" },
  { k: "friends", t: "Friends" },
  { k: "multigen", t: "Multi-gen / elderly" },
  { k: "solo", t: "Solo" },
];

const INTERESTS = [
  "Food & drink",
  "Culture & museums",
  "Nightlife",
  "Shopping",
  "Parks & nature",
  "Hidden gems",
];

const PACE: { k: Pace; t: string; d: string }[] = [
  { k: "relaxed", t: "Relaxed", d: "A few highlights, room to breathe" },
  { k: "balanced", t: "Balanced", d: "A good mix each day" },
  { k: "packed", t: "Packed", d: "See as much as possible" },
];

type ItineraryDay = { day: number; items: string[] };
type PlanResult = { headline: string; note: string; days: ItineraryDay[]; areaSlug: string | null };

const STEPS = 7;

export function Planner() {
  const [step, setStep] = useState(0);
  const [who, setWho] = useState<Who | null>(null);
  const [size, setSize] = useState(2);
  const [nights, setNights] = useState(3);
  const [area, setArea] = useState<string | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [pace, setPace] = useState<Pace | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [emailErr, setEmailErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PlanResult | null>(null);

  const green = "#385B4F";
  const copper = "#BF936A";

  function toggleInterest(i: string) {
    setInterests((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));
  }

  async function reveal() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailErr(true);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ who, size, nights, area, interests, pace, email: email.trim(), name: name.trim() }),
      });
      const data = (await res.json()) as PlanResult;
      setResult(data);
      setStep(STEPS);
    } catch {
      setResult({
        headline: "Your London plan",
        note: "We hit a snag generating live suggestions — we'll email your full plan shortly.",
        days: [],
        areaSlug: area,
      });
      setStep(STEPS);
    } finally {
      setLoading(false);
    }
  }

  function restart() {
    setStep(0); setWho(null); setSize(2); setNights(3); setArea(null);
    setInterests([]); setPace(null); setEmail(""); setName(""); setResult(null); setEmailErr(false);
  }

  const pct = Math.round((step / STEPS) * 100);

  const cardBase =
    "cursor-pointer rounded-2xl border bg-white px-4 py-4 text-left transition hover:shadow-md flex items-center gap-3";
  function cardCls(active: boolean) {
    return `${cardBase} ${active ? "border-[#385B4F] ring-1 ring-[#385B4F]" : "border-[#EAECE2]"}`;
  }

  const selectedLoc = LOCATIONS.find((l) => l.slug === area);

  return (
    <div className="rounded-3xl border border-[#EAECE2] bg-[#FFFBF2] p-6 sm:p-8">
      {step > 0 && step <= STEPS && (
        <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-[#EAECE2]">
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: green }} />
        </div>
      )}

      {step === 0 && (
        <div>
          <p className="text-xs uppercase tracking-widest" style={{ color: copper }}>Free · under a minute</p>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl" style={{ color: green }}>Plan your perfect London stay</h2>
          <p className="mt-4 max-w-xl text-[#555555] leading-relaxed">
            Answer a few quick questions and we&rsquo;ll build you a personalised, day-by-day London plan —
            tailored to who you&rsquo;re travelling with and the neighbourhoods we know best.
          </p>
          <ul className="mt-6 space-y-2 text-[#385B4F]">
            {["Tailored to your group", "Built around our London neighbourhoods", "Yours instantly, by email"].map((t) => (
              <li key={t} className="flex items-center gap-2"><Dot /> {t}</li>
            ))}
          </ul>
          <button onClick={() => setStep(1)} className="mt-8 w-full rounded-full bg-[#FFDE59] px-6 py-3 font-semibold tracking-wide text-[#385B4F] transition hover:bg-[#f5d240]">
            START PLANNING
          </button>
        </div>
      )}

      {step === 1 && (
        <Step title="Who's travelling?" sub="This shapes the pace, the picks and the practicalities." onBack={() => setStep(0)} onNext={() => setStep(2)} canNext={!!who}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {WHO.map((o) => (
              <div key={o.k} className={cardCls(who === o.k)} onClick={() => setWho(o.k)}>{o.t}</div>
            ))}
          </div>
        </Step>
      )}

      {step === 2 && (
        <Step title="The basics" sub="How many of you, and how long are you staying?" onBack={() => setStep(1)} onNext={() => setStep(3)} canNext>
          <div className="space-y-7">
            <Slider label="Group size" value={size} min={1} max={10} suffix={size === 1 ? "person" : "people"} onChange={setSize} />
            <Slider label="Nights" value={nights} min={1} max={14} suffix={nights === 1 ? "night" : "nights"} onChange={setNights} />
          </div>
        </Step>
      )}

      {step === 3 && (
        <Step title="Where will you be based?" sub="We'll anchor your plan around the right neighbourhood." onBack={() => setStep(2)} onNext={() => setStep(4)} canNext={!!area}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {LOCATIONS.map((l) => (
              <div key={l.slug} className={`${cardCls(area === l.slug)} flex-col items-start`} onClick={() => setArea(l.slug)}>
                <span className="font-medium" style={{ color: green }}>{l.shortLabel}</span>
                <span className="mt-1 text-sm text-[#555555]">{l.whyStayHere.split(".")[0]}.</span>
              </div>
            ))}
            <div className={`${cardCls(area === "unsure")} flex-col items-start`} onClick={() => setArea("unsure")}>
              <span className="font-medium" style={{ color: green }}>Not sure yet</span>
              <span className="mt-1 text-sm text-[#555555]">Help me choose the right area.</span>
            </div>
          </div>
        </Step>
      )}

      {step === 4 && (
        <Step title="What are you into?" sub="Pick as many as you like." onBack={() => setStep(3)} onNext={() => setStep(5)} canNext={interests.length > 0}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {INTERESTS.map((i) => (
              <div key={i} className={cardCls(interests.includes(i))} onClick={() => toggleInterest(i)}>
                <span className="flex-1">{i}</span>
                {interests.includes(i) && <Dot />}
              </div>
            ))}
          </div>
        </Step>
      )}

      {step === 5 && (
        <Step title="What's your pace?" sub="How full do you like your days?" onBack={() => setStep(4)} onNext={() => setStep(6)} canNext={!!pace}>
          <div className="space-y-3">
            {PACE.map((p) => (
              <div key={p.k} className={`${cardCls(pace === p.k)} flex-col items-start`} onClick={() => setPace(p.k)}>
                <span className="font-medium" style={{ color: green }}>{p.t}</span>
                <span className="mt-1 text-sm text-[#555555]">{p.d}</span>
              </div>
            ))}
          </div>
        </Step>
      )}

      {step === 6 && (
        <div>
          <h3 className="font-serif text-2xl" style={{ color: green }}>Where shall we send your plan?</h3>
          <p className="mt-2 text-[#555555]">Pop your email in and your personalised London itinerary appears instantly.</p>
          <div className="mt-5 space-y-3">
            <input
              type="email" placeholder="you@email.com" value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailErr(false); }}
              className={`w-full rounded-xl border bg-white px-4 py-3 outline-none ${emailErr ? "border-red-400" : "border-[#EAECE2] focus:border-[#385B4F]"}`}
            />
            <input
              type="text" placeholder="First name (optional)" value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-[#EAECE2] bg-white px-4 py-3 outline-none focus:border-[#385B4F]"
            />
            {emailErr && <p className="text-sm text-red-500">Please enter a valid email address.</p>}
            <p className="text-xs text-[#999]">No spam — just your plan and the occasional London tip. Unsubscribe anytime.</p>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <button onClick={() => setStep(5)} className="text-sm text-[#555555] underline">Back</button>
            <button onClick={reveal} disabled={loading} className="rounded-full bg-[#FFDE59] px-6 py-3 font-semibold tracking-wide text-[#385B4F] transition hover:bg-[#f5d240] disabled:opacity-60">
              {loading ? "Building your plan…" : "REVEAL MY PLAN"}
            </button>
          </div>
        </div>
      )}

      {step === 7 && result && (
        <div>
          <p className="text-xs uppercase tracking-widest" style={{ color: copper }}>Your personalised plan</p>
          <h3 className="mt-2 font-serif text-2xl sm:text-3xl" style={{ color: green }}>{result.headline}</h3>
          {result.note && <p className="mt-2 text-[#555555]">{result.note}</p>}
          <div className="mt-3 rounded-xl bg-[#F3FADC] px-4 py-3 text-sm text-[#385B4F]">
            Full plan on its way to {email || "your inbox"}.
          </div>

          <div className="mt-6 space-y-4">
            {result.days.map((d) => (
              <div key={d.day} className="rounded-2xl border border-[#EAECE2] bg-white p-5">
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#385B4F] text-sm text-[#FFFBF2]">{d.day}</span>
                  <span className="font-medium" style={{ color: green }}>Day {d.day}</span>
                </div>
                <ul className="ml-1 space-y-2">
                  {d.items.map((it, idx) => (
                    <li key={idx} className="flex gap-2 text-[#555555]"><Dot /> {it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {selectedLoc && (
            <div className="mt-6 rounded-2xl border-2 border-[#385B4F] bg-white p-6">
              <p className="font-serif text-xl" style={{ color: green }}>Stay in the heart of {selectedLoc.shortLabel}</p>
              <p className="mt-2 text-[#555555]">Make it effortless — book a NourNest apartment right where your plan happens.</p>
              <Link href={`/locations/${selectedLoc.slug}`} className="mt-4 inline-flex rounded-full bg-[#FFDE59] px-6 py-2.5 font-semibold tracking-wide text-[#385B4F] transition hover:bg-[#f5d240]">
                SEE APARTMENTS IN {selectedLoc.shortLabel.toUpperCase()}
              </Link>
            </div>
          )}

          <div className="mt-6 text-center">
            <button onClick={restart} className="text-sm text-[#555555] underline">Start over</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Step({ title, sub, children, onBack, onNext, canNext }: {
  title: string; sub: string; children: React.ReactNode; onBack: () => void; onNext: () => void; canNext: boolean;
}) {
  return (
    <div>
      <h3 className="font-serif text-2xl" style={{ color: "#385B4F" }}>{title}</h3>
      <p className="mt-2 mb-5 text-[#555555]">{sub}</p>
      {children}
      <div className="mt-6 flex items-center justify-between">
        <button onClick={onBack} className="text-sm text-[#555555] underline">Back</button>
        <button onClick={onNext} disabled={!canNext}
          className="rounded-full bg-[#FFDE59] px-6 py-3 font-semibold tracking-wide text-[#385B4F] transition hover:bg-[#f5d240] disabled:cursor-not-allowed disabled:opacity-40">
          NEXT
        </button>
      </div>
    </div>
  );
}

function Slider({ label, value, min, max, suffix, onChange }: {
  label: string; value: number; min: number; max: number; suffix: string; onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-[#555555]">{label}</label>
      <div className="flex items-center gap-4">
        <input type="range" min={min} max={max} step={1} value={value} onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 accent-[#385B4F]" />
        <span className="min-w-[80px] font-medium" style={{ color: "#385B4F" }}>{value} {suffix}</span>
      </div>
    </div>
  );
}

function Dot() {
  return <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#BF936A]" aria-hidden="true" />;
}
