// Schema.org JSON-LD generators. Each page renders one or more of these
// inside <script type="application/ld+json"> so AI engines + Google can cite.

import type { Listing } from "./listings";

const ORG_BASE = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: "NourNest",
  legalName: "NourNest Ltd",
  description:
    "Serviced apartments across Central London. Fully equipped, all bills included. Welcoming, warm, home away from home.",
  url: "https://nournestapartments.com",
  email: "hello@nournestapartments.com",
  identifier: {
    "@type": "PropertyValue",
    propertyID: "Companies House",
    value: "16629708",
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "154 Warwick Road",
    addressLocality: "London",
    addressRegion: "London",
    postalCode: "W14 8PS",
    addressCountry: "GB",
  },
  sameAs: [
    "https://www.instagram.com/nournest_apartments/",
    "https://find-and-update.company-information.service.gov.uk/company/16629708",
  ],
  founder: {
    "@type": "Person",
    name: "Gerda Micke",
    jobTitle: "Director",
  },
  areaServed: [
    { "@type": "Place", name: "Old Street & Shoreditch, London" },
    { "@type": "Place", name: "Borough & Pimlico, London" },
  ],
  amenityFeature: [
    "Fully fitted kitchen",
    "Wi-Fi",
    "Smart TV",
    "In-unit washer-dryer",
    "Self check-in",
    "All bills included",
    "24/7 guest support",
  ],
};

export function organizationSchema() {
  return ORG_BASE;
}

export function listingSchema(listing: Listing) {
  return {
    "@context": "https://schema.org",
    "@type": "Accommodation",
    "@id": `https://nournestapartments.com/apartments/${listing.slug}`,
    name: listing.title,
    description: listing.longDescription,
    numberOfRooms: listing.bedrooms,
    numberOfBedrooms: listing.bedrooms,
    numberOfBathroomsTotal: listing.bathrooms,
    occupancy: {
      "@type": "QuantitativeValue",
      maxValue: listing.maxGuests,
    },
    floorSize: {
      "@type": "QuantitativeValue",
      value: listing.sizeSqm,
      unitCode: "MTK",
    },
    amenityFeature: listing.amenities.map((a) => ({
      "@type": "LocationFeatureSpecification",
      name: a,
      value: true,
    })),
    address: {
      "@type": "PostalAddress",
      addressLocality: listing.areaLabel,
      addressRegion: "London",
      postalCode: listing.postcode,
      addressCountry: "GB",
    },
    ...(listing.latitude && listing.longitude
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: listing.latitude,
            longitude: listing.longitude,
          },
        }
      : {}),
    image: listing.heroImage.startsWith("http")
      ? listing.heroImage
      : `https://nournestapartments.com${listing.heroImage}`,
    offers: {
      "@type": "Offer",
      priceCurrency: "GBP",
      price: listing.fromGbpPerNight,
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: listing.fromGbpPerNight,
        priceCurrency: "GBP",
        unitText: "night",
        referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "DAY" },
      },
      availability: "https://schema.org/InStock",
      url: `https://nournestapartments.com/apartments/${listing.slug}`,
    },
    brand: { "@type": "Brand", name: "NourNest" },
  };
}

export function breadcrumb(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqSchema(qa: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qa.map((x) => ({
      "@type": "Question",
      name: x.question,
      acceptedAnswer: { "@type": "Answer", text: x.answer },
    })),
  };
}

// Render helper · drop into JSX:
//   <Json data={listingSchema(listing)} />
export function JsonLd({ data }: { data: object | object[] }) {
  const json = Array.isArray(data) ? data : [data];
  return (
    <>
      {json.map((d, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }}
        />
      ))}
    </>
  );
}
