import { NextResponse } from "next/server";
import { LOCATIONS } from "@/lib/listings";

export const runtime = "nodejs";

type Body = {
  who?: string;
  size?: number;
  nights?: number;
  area?: string | null;
  interests?: string[];
  pace?: "relaxed" | "balanced" | "packed";
  email?: string;
  name?: string;
};

const WHO_LABEL: Record<string, string> = {
  couple: "couple",
  family: "family with kids",
  business: "business trip",
  friends: "group of friends",
  multigen: "multi-generational trip",
  solo: "solo trip",
};

const WHO_NOTE: Record<string, string> = {
  family: "Step-free routes, buggy-friendly cafés and an early dinner are built in.",
  multigen: "A gentle pace, plenty of seating stops and accessible venues throughout.",
  business: "Walkable from your base, with a couple of impressive client-dinner options.",
  couple: "A romantic evening and a long, lazy breakfast worked in.",
  friends: "A lively mix of food, culture and nights out.",
  solo: "Easy, walkable days with plenty to dip in and out of.",
};

const INTEREST_POOL: Record<string, string[]> = {
  "Food & drink": ["Brunch at a local favourite", "Street-food lunch at the market", "Dinner at a neighbourhood gem"],
  "Culture & museums": ["Morning at a landmark museum", "A gallery wander", "A historic walking loop"],
  "Nightlife": ["Cocktails at a rooftop bar", "Live music in the evening", "A late-night dessert spot"],
  "Shopping": ["Independent boutiques crawl", "Vintage market browse", "Flagship stores on the high street"],
  "Parks & nature": ["A slow morning in the park", "A riverside or canalside stroll", "A green-space picnic"],
  "Hidden gems": ["A tucked-away café locals love", "A backstreet bookshop", "A view most visitors miss"],
};

function templatePlan(b: Body) {
  const loc = LOCATIONS.find((l) => l.slug === b.area);
  const areaLabel = loc?.shortLabel ?? "central London";
  const perDay = b.pace === "packed" ? 4 : b.pace === "relaxed" ? 2 : 3;
  const days = Math.min(Math.max(b.nights ?? 3, 1), 3);

  let picks: string[] = [];
  (b.interests ?? []).forEach((i) => { if (INTEREST_POOL[i]) picks = picks.concat(INTEREST_POOL[i]); });
  if (picks.length === 0) picks = [`Explore ${areaLabel}`, "A standout lunch", "An evening highlight"];

  // Seed the first item of day 1 with a real local highlight when we have one.
  const localHighlights = loc?.nearbyHighlights ?? [];

  const out = [];
  for (let d = 0; d < days; d++) {
    const items: string[] = [];
    for (let s = 0; s < perDay; s++) {
      if (d === 0 && s === 0 && localHighlights[0]) {
        items.push(localHighlights[0]);
      } else {
        items.push(picks[(d * perDay + s) % picks.length]);
      }
    }
    out.push({ day: d + 1, items });
  }

  const whoLabel = WHO_LABEL[b.who ?? ""] ?? "trip";
  return {
    headline: `${b.size ?? 2}-person ${whoLabel} in ${areaLabel}`,
    note: WHO_NOTE[b.who ?? ""] ?? "A smart mix that keeps everyone happy.",
    days: out,
    areaSlug: b.area ?? null,
  };
}

// TODO(backend): when ANTHROPIC_API_KEY is set in Vercel env, generate a richer,
// genuinely neighbourhood-specific itinerary in NourNest's voice via the Claude API.
async function claudePlan(b: Body) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  const loc = LOCATIONS.find((l) => l.slug === b.area);
  const ctx = loc
    ? `Base neighbourhood: ${loc.label}. Why stay: ${loc.whyStayHere} Nearby: ${loc.nearbyHighlights.join("; ")}.`
    : "Base: central London (guest unsure — recommend an area).";
  const prompt = `You are NourNest's London concierge. Write a warm, day-by-day London itinerary as JSON.
Trip: ${b.size} people, ${WHO_LABEL[b.who ?? ""] ?? "trip"}, ${b.nights} nights, pace=${b.pace}, interests=${(b.interests ?? []).join(", ")}.
${ctx}
Return ONLY JSON: {"headline": string, "note": string, "days": [{"day": number, "items": string[]}]}.
Keep it to ${Math.min(b.nights ?? 3, 3)} days, ${b.pace === "packed" ? 4 : b.pace === "relaxed" ? 2 : 3} items per day. UK spelling. Real, specific London places near the base.`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1200,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const text: string = data?.content?.[0]?.text ?? "";
    const json = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
    return { ...json, areaSlug: b.area ?? null };
  } catch {
    return null;
  }
}

// TODO(backend): push the captured lead into GoHighLevel (tag: london-planner)
// once GHL_API_KEY / location id are added to Vercel env. Fire-and-forget.
async function captureLead(_b: Body) {
  return;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  if (body.email) {
    captureLead(body).catch(() => {});
  }

  const plan = (await claudePlan(body)) ?? templatePlan(body);
  return NextResponse.json(plan);
}
