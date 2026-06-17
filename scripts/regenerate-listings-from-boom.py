#!/usr/bin/env python3.12
"""
Regenerate src/lib/listings.ts from live BOOM Provider API.

Run when BOOM listings change. Requires boom-mcp installed at ~/boom-mcp and
its .env file populated with BOOM_PROVIDER_CLIENT_ID + BOOM_PROVIDER_CLIENT_SECRET.

Usage:
    cd ~/staylio-london && python3.12 scripts/regenerate-listings-from-boom.py
"""
import asyncio
import json
import re
import sys
from collections import Counter
from pathlib import Path

BOOM_MCP = Path.home() / "boom-mcp"
sys.path.insert(0, str(BOOM_MCP))

from dotenv import load_dotenv
load_dotenv(BOOM_MCP / ".env")

from tools.listings import get_listings  # type: ignore  # noqa: E402

POSTCODE_TO_AREA = {
    "NW8": "regents-park-marylebone", "NW1": "regents-park-marylebone",
    "W1U": "regents-park-marylebone", "W1H": "regents-park-marylebone", "W1G": "regents-park-marylebone",
    "EC1V": "old-street-shoreditch", "EC1Y": "old-street-shoreditch",
    "E1": "old-street-shoreditch",
    "E2": "hackney", "E8": "hackney", "E5": "hackney", "E9": "hackney",
    "N1": "islington-angel",
    "W8": "kensington-hammersmith", "W14": "kensington-hammersmith",
    "W6": "kensington-hammersmith", "W12": "kensington-hammersmith",
    "SW5": "kensington-hammersmith", "SW7": "kensington-hammersmith",
    "W1T": "fitzrovia-mayfair", "W1F": "fitzrovia-mayfair",
    "W1B": "fitzrovia-mayfair", "W1K": "fitzrovia-mayfair",
    "W1J": "fitzrovia-mayfair", "W1S": "fitzrovia-mayfair",
    "EC1M": "barbican-farringdon", "EC1A": "barbican-farringdon",
    "EC1N": "barbican-farringdon", "EC2Y": "barbican-farringdon",
    "EC2V": "barbican-farringdon", "EC4A": "barbican-farringdon",
    "SE1": "borough-pimlico", "SE17": "borough-pimlico",
    "SW1V": "borough-pimlico", "SW1P": "borough-pimlico",
    "W9": "little-venice-maida-vale", "W2": "little-venice-maida-vale",
    "NW6": "little-venice-maida-vale",
}

AREA_LABEL = {
    "regents-park-marylebone": "Regent's Park & Marylebone",
    "old-street-shoreditch": "Old Street & Shoreditch",
    "hackney": "Hackney",
    "islington-angel": "Islington & Angel",
    "kensington-hammersmith": "Kensington & Hammersmith",
    "fitzrovia-mayfair": "Fitzrovia & Mayfair",
    "barbican-farringdon": "Barbican & Farringdon",
    "borough-pimlico": "Borough & Pimlico",
    "little-venice-maida-vale": "Little Venice & Maida Vale",
}

SHORT_DESC = {
    "regents-park-marylebone": "in a quiet street between Marylebone Village and Regent's Park.",
    "old-street-shoreditch": "minutes from Spitalfields Market, Old Street, and the City.",
    "hackney": "steps from Columbia Road, Broadway Market, and Victoria Park.",
    "islington-angel": "near Upper Street dining, Camden Passage, and Angel station.",
    "kensington-hammersmith": "walking distance to museums, parks, and the Piccadilly line.",
    "fitzrovia-mayfair": "steps from Bond Street, Mount Street, and the West End.",
    "barbican-farringdon": "on a Georgian square minutes from the Barbican and Farringdon.",
    "borough-pimlico": "walkable to Borough Market, the Tate Modern, and the Thames.",
    "little-venice-maida-vale": "overlooking the Regent's Canal with Bakerloo line at the door.",
}

LOCATIONS = [
    # See src/lib/listings.ts for full details; kept short here so the regenerated
    # file remains brand-consistent. Edit this list in the generated TS when changing copy.
]


def slugify(s: str) -> str:
    s = re.sub(r"[^a-z0-9\s-]", "", s.lower())
    s = re.sub(r"\s+", "-", s).strip("-")
    return re.sub(r"-+", "-", s)[:80]


def map_area(listing: dict) -> str | None:
    zip_code = (listing.get("zip_code") or "").upper().replace(" ", "")
    address = (listing.get("address") or "").upper()
    name = (listing.get("name") or "").upper()
    title = (listing.get("title") or "").upper()
    haystack = f"{zip_code} {address} {name} {title}"
    for prefix, area in POSTCODE_TO_AREA.items():
        if zip_code.startswith(prefix) or f" {prefix} " in haystack or f" {prefix}," in haystack:
            return area
    for keywords, area in [
        (["MARYLEBONE", "REGENT", "BAKER ST", "ST JOHN", "FRAMPTON", "EUSTON"], "regents-park-marylebone"),
        (["HACKNEY", "BETHNAL GREEN", "COLUMBIA RD", "BROADWAY MARKET", "LONDON FIELDS", "VICTORIA PARK", "DALSTON"], "hackney"),
        (["ISLINGTON", "ANGEL", "UPPER ST", "LIVERPOOL RD", "CAMDEN PASSAGE", "BARNSBURY", "CANONBURY"], "islington-angel"),
        (["SHOREDITCH", "HOXTON", "OLD STREET", "SPITALFIELDS", "BRICK LANE", "ALDGATE"], "old-street-shoreditch"),
        (["KENSINGTON", "HAMMERSMITH", "SHEPHERD", "NOTTING HILL", "CHELSEA", "EARL"], "kensington-hammersmith"),
        (["MAYFAIR", "FITZROVIA", "SOHO", "BOND ST", "CHARLOTTE ST", "MOUNT ST"], "fitzrovia-mayfair"),
        (["BARBICAN", "FARRINGDON", "CLERKENWELL", "SMITHFIELD"], "barbican-farringdon"),
        (["BOROUGH", "PIMLICO", "WATERLOO", "SOUTHWARK", "VAUXHALL", "KENT RD"], "borough-pimlico"),
        (["LITTLE VENICE", "MAIDA VALE", "PADDINGTON", "WARWICK AVE", "EDGWARE"], "little-venice-maida-vale"),
    ]:
        if any(k in haystack for k in keywords):
            return area
    return None


def pricing_for(bedrooms: int) -> int:
    return {0: 115, 1: 145, 2: 195, 3: 245, 4: 325}.get(int(bedrooms or 0), 165)


async def main() -> None:
    raw = await get_listings(per_page=100, active_only=True)
    data = json.loads(raw)
    listings = data.get("data", data.get("listings", data)) if isinstance(data, dict) else data
    print(f"BOOM returned {len(listings)} listings")

    mapped = []
    unmapped = []
    for entry in listings:
        area = map_area(entry)
        if not area:
            unmapped.append(entry.get("name", entry.get("id")))
            continue
        bedrooms = int(entry.get("bedrooms") or 0)
        bathrooms = int(entry.get("bathrooms") or 1)
        max_guests = int(entry.get("max_guests") or (bedrooms * 2 if bedrooms else 2))
        name = (entry.get("name") or "").split(" - ")[0].strip() or "Apartment"
        title = (
            f"{AREA_LABEL[area].split(' & ')[0]} {bedrooms}-Bed {name}"
            if bedrooms > 0
            else f"{AREA_LABEL[area].split(' & ')[0]} Studio {name}"
        ).replace("  ", " ")[:80]
        slug = slugify(f"{area} {name} {entry.get('id', '')[:6]}")
        picture = entry.get("picture") or ""
        short = (
            f"A {bedrooms}-bed apartment {SHORT_DESC[area]}"
            if bedrooms > 0
            else f"A studio apartment {SHORT_DESC[area]}"
        )
        long_desc = (entry.get("description") or short).strip() or short

        mapped.append({
            "slug": slug,
            "title": title,
            "area": area,
            "areaLabel": AREA_LABEL[area],
            "bedrooms": bedrooms,
            "bathrooms": bathrooms,
            "maxGuests": max_guests,
            "sizeSqm": 0,
            "fromGbpPerNight": pricing_for(bedrooms),
            "shortDescription": short,
            "longDescription": long_desc,
            "amenities": [
                "Wi-Fi", "Smart TV", "Fitted kitchen", "Washer-dryer", "Smart lock",
                "Linen + towels", "Fortnightly housekeeping", "All bills included",
            ],
            "heroImage": picture or "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80",
            "gallery": [picture] if picture else [],
            "latitude": float(entry.get("lat") or 0) or None,
            "longitude": float(entry.get("lng") or 0) or None,
            "postcode": entry.get("zip_code"),
            "boomListingId": entry.get("id"),
        })

    counts = Counter(x["area"] for x in mapped)
    print(f"Mapped {len(mapped)} / {len(listings)} ({len(unmapped)} outside Staylio's 7 areas)")
    for area, label in AREA_LABEL.items():
        print(f"  {label}: {counts.get(area, 0)}")
    if unmapped:
        print("\nUnmapped (out-of-area):")
        for n in unmapped:
            print(f"  - {n}")

    # Write JSON snapshot for inspection
    snapshot = Path(__file__).parent.parent / "data" / "boom-listings-snapshot.json"
    snapshot.parent.mkdir(exist_ok=True)
    snapshot.write_text(json.dumps(mapped, indent=2, default=str))
    print(f"\nSnapshot written to {snapshot}")
    print("Now hand-merge into src/lib/listings.ts (or run the full generator).")


if __name__ == "__main__":
    asyncio.run(main())
