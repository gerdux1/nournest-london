import { NextResponse } from "next/server";
import { LOCATIONS, LISTINGS } from "@/lib/listings";

export const runtime = "nodejs";

type Body = {
  who?: string;
  size?: number;
  nights?: number;
  area?: string | null;
  propertySlug?: string | null;
  arrival?: string | null;
  interests?: string[];
  pace?: "relaxed" | "balanced" | "packed";
  email?: string;
  name?: string;
};

type EventItem = { name: string; date: string; venue: string; url: string | null; category: string };

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

// Shorten a transport entry like "Borough (Northern)" to its station name.
function stationName(entry: string) {
  return entry.replace(/\s*\(.*\)\s*$/, "").trim();
}

function templatePlan(b: Body) {
  const listing = b.propertySlug ? LISTINGS.find((l) => l.slug === b.propertySlug) : undefined;
  const areaSlug = listing?.area ?? b.area ?? null;
  const loc = LOCATIONS.find((l) => l.slug === areaSlug);
  const areaLabel = loc?.shortLabel ?? "central London";
  const perDay = b.pace === "packed" ? 4 : b.pace === "relaxed" ? 2 : 3;
  const days = Math.min(Math.max(b.nights ?? 3, 1), 3);

  let picks: string[] = [];
  (b.interests ?? []).forEach((i) => { if (INTEREST_POOL[i]) picks = picks.concat(INTEREST_POOL[i]); });
  if (picks.length === 0) picks = [`Explore ${areaLabel}`, "A standout lunch", "An evening highlight"];

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

  // Getting-around tips, anchored to the base + nearest stations.
  const transport = loc?.transport ?? [];
  const gettingAround: string[] = [];
  if (transport[0]) {
    gettingAround.push(`Nearest Underground: ${transport[0]} — your everyday line in and out of town.`);
  }
  if (transport[1]) {
    gettingAround.push(`Also close: ${transport[1]} for fast links across the city.`);
  }
  gettingAround.push(
    listing
      ? `Most of this plan is a short walk or one tube hop from ${listing.title}.`
      : `Most of this plan is walkable or a short tube hop from ${areaLabel}.`
  );
  gettingAround.push("Tap in with a contactless card or phone — no need to buy tickets.");

  const whoLabel = WHO_LABEL[b.who ?? ""] ?? "trip";
  return {
    headline: `${b.size ?? 2}-person ${whoLabel} in ${areaLabel}`,
    note: WHO_NOTE[b.who ?? ""] ?? "A smart mix that keeps everyone happy.",
    days: out,
    areaSlug,
    base: loc
      ? { title: listing?.title ?? null, areaLabel, nearestStation: transport[0] ? stationName(transport[0]) : null }
      : null,
    transport,
    gettingAround,
    bookingUrl: listing?.bookingUrl ?? null,
    booked: !!listing,
  };
}

// When ANTHROPIC_API_KEY is set in Vercel env, generate a richer,
// genuinely neighbourhood-specific itinerary in NourNest's voice via the Claude API.
async function claudePlan(b: Body) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  const listing = b.propertySlug ? LISTINGS.find((l) => l.slug === b.propertySlug) : undefined;
  const areaSlug = listing?.area ?? b.area ?? null;
  const loc = LOCATIONS.find((l) => l.slug === areaSlug);
  const baseLine = listing
    ? `Guest is staying at our apartment "${listing.title}" (${listing.postcode ?? ""}) in ${loc?.label ?? "London"}.`
    : loc
      ? `Base neighbourhood: ${loc.label}.`
      : "Base: central London (guest unsure — recommend an area).";
  const ctx = loc
    ? `${baseLine} Why stay: ${loc.whyStayHere} Nearby: ${loc.nearbyHighlights.join("; ")}. Nearest stations/lines: ${loc.transport.join("; ")}.`
    : baseLine;
  const days = Math.min(b.nights ?? 3, 3);
  const perDay = b.pace === "packed" ? 4 : b.pace === "relaxed" ? 2 : 3;
  const prompt = `You are NourNest's London concierge — warm, specific, never generic.
Write a day-by-day London itinerary as JSON for this guest.
Trip: ${b.size} people, ${WHO_LABEL[b.who ?? ""] ?? "trip"}, ${b.nights} nights, pace=${b.pace}, interests=${(b.interests ?? []).join(", ")}.
${ctx}
For EACH itinerary item, name a real, specific London place and, where it helps, add a short tube/walking hint from the base (e.g. "(Northern line, 3 stops)" or "(8-min walk)").
Also write 3-4 "gettingAround" tips: the nearest stations and the smartest way to move around from this exact base.
Return ONLY JSON: {"headline": string, "note": string, "days": [{"day": number, "items": string[]}], "gettingAround": string[]}.
Keep it to ${days} days, ${perDay} items per day. UK spelling.`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1500,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const text: string = data?.content?.[0]?.text ?? "";
    const json = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
    const transport = loc?.transport ?? [];
    return {
      ...json,
      areaSlug,
      base: loc
        ? { title: listing?.title ?? null, areaLabel: loc.shortLabel, nearestStation: transport[0] ? stationName(transport[0]) : null }
        : null,
      transport,
      bookingUrl: listing?.bookingUrl ?? null,
      booked: !!listing,
    };
  } catch {
    return null;
  }
}

// Map our interest labels to Ticketmaster classification segments.
const SEGMENT_FOR_INTEREST: Record<string, string> = {
  "Nightlife": "Music",
  "Culture & museums": "Arts & Theatre",
  "Food & drink": "Miscellaneous",
};

function dateRange(arrival?: string | null, nights?: number) {
  const start = arrival ? new Date(arrival) : new Date();
  if (isNaN(start.getTime())) start.setTime(Date.now());
  const end = new Date(start);
  end.setDate(end.getDate() + Math.min(Math.max(nights ?? 3, 1), 14));
  const iso = (d: Date) => d.toISOString().slice(0, 19) + "Z";
  return { start, end, startIso: iso(start), endIso: iso(end) };
}

function prettyDate(d: string) {
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return "";
  return dt.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

// Curated, area-aware fallback so the feed always looks alive before the key is set.
function fallbackEvents(b: Body): EventItem[] {
  const listing = b.propertySlug ? LISTINGS.find((l) => l.slug === b.propertySlug) : undefined;
  const areaSlug = listing?.area ?? b.area ?? null;
  const { start } = dateRange(b.arrival, b.nights);
  // Next occurrence of a given weekday (0=Sun) on/after start.
  const onNext = (weekday: number) => {
    const d = new Date(start);
    d.setDate(d.getDate() + ((weekday - d.getDay() + 7) % 7));
    return d.toISOString();
  };
  const common: EventItem[] = [
    { name: "Borough Market — street food & traders", date: onNext(6), venue: "Borough Market, SE1", url: "https://boroughmarket.org.uk", category: "Food & drink" },
    { name: "West End theatre — evening show", date: onNext(5), venue: "West End", url: null, category: "Culture" },
  ];
  const byArea: Record<string, EventItem[]> = {
    "old-street-shoreditch": [
      { name: "Old Spitalfields Market", date: onNext(4), venue: "Spitalfields, E1", url: "https://oldspitalfieldsmarket.com", category: "Shopping" },
      { name: "Brick Lane Sunday Market", date: onNext(0), venue: "Brick Lane, E1", url: null, category: "Hidden gems" },
    ],
    "hackney": [
      { name: "Columbia Road Flower Market", date: onNext(0), venue: "Columbia Road, E2", url: null, category: "Parks & nature" },
      { name: "Broadway Market", date: onNext(6), venue: "Broadway Market, E8", url: null, category: "Food & drink" },
    ],
    "islington-angel": [
      { name: "Camden Passage Antiques", date: onNext(3), venue: "Camden Passage, N1", url: null, category: "Shopping" },
      { name: "Sadler's Wells — dance", date: onNext(5), venue: "Sadler's Wells, EC1", url: "https://sadlerswells.com", category: "Culture" },
    ],
    "borough-pimlico": [
      { name: "Tate Modern — late opening", date: onNext(5), venue: "Bankside, SE1", url: "https://tate.org.uk", category: "Culture" },
      { name: "Maltby Street Market", date: onNext(6), venue: "Maltby Street, SE1", url: null, category: "Food & drink" },
    ],
  };
  const out = [...(areaSlug && byArea[areaSlug] ? byArea[areaSlug] : []), ...common];
  return out.slice(0, 4).sort((a, b2) => a.date.localeCompare(b2.date));
}

// Live London events near the base via Ticketmaster Discovery API.
// Set TICKETMASTER_API_KEY in Vercel env to switch from the curated fallback to live data.
async function fetchEvents(b: Body): Promise<EventItem[]> {
  const key = process.env.TICKETMASTER_API_KEY;
  if (!key) return fallbackEvents(b);

  const listing = b.propertySlug ? LISTINGS.find((l) => l.slug === b.propertySlug) : undefined;
  const areaSlug = listing?.area ?? b.area ?? null;
  const loc = LOCATIONS.find((l) => l.slug === areaSlug);
  const lat = listing?.latitude ?? loc?.latitude;
  const long = listing?.longitude ?? loc?.longitude;
  const { startIso, endIso } = dateRange(b.arrival, b.nights);

  const params = new URLSearchParams({
    apikey: key,
    city: "London",
    startDateTime: startIso,
    endDateTime: endIso,
    size: "8",
    sort: "date,asc",
  });
  if (lat != null && long != null) {
    params.set("latlong", `${lat},${long}`);
    params.set("radius", "4");
    params.set("unit", "miles");
  }
  const seg = (b.interests ?? []).map((i) => SEGMENT_FOR_INTEREST[i]).find(Boolean);
  if (seg) params.set("classificationName", seg);

  try {
    const res = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?${params.toString()}`);
    if (!res.ok) return fallbackEvents(b);
    const data = await res.json();
    const events = data?._embedded?.events ?? [];
    const mapped: EventItem[] = events.slice(0, 5).map((e: Record<string, unknown>) => {
      const dates = e.dates as { start?: { dateTime?: string; localDate?: string } } | undefined;
      const embedded = e._embedded as { venues?: { name?: string }[] } | undefined;
      const cls = (e.classifications as { segment?: { name?: string } }[] | undefined)?.[0];
      return {
        name: String(e.name ?? "London event"),
        date: dates?.start?.dateTime ?? dates?.start?.localDate ?? "",
        venue: embedded?.venues?.[0]?.name ?? "London",
        url: typeof e.url === "string" ? e.url : null,
        category: cls?.segment?.name ?? "Event",
      };
    });
    return mapped.length ? mapped : fallbackEvents(b);
  } catch {
    return fallbackEvents(b);
  }
}

// Push the captured lead into GoHighLevel (tag: london-planner) once
// GHL_API_KEY / location id are added to Vercel env. Fire-and-forget.
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

  const [plan, events] = await Promise.all([
    (async () => (await claudePlan(body)) ?? templatePlan(body))(),
    fetchEvents(body),
  ]);
  return NextResponse.json({ ...plan, events: events.map((e) => ({ ...e, dateLabel: prettyDate(e.date) })) });
}
