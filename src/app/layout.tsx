import type { Metadata } from "next";
import { Playfair_Display, EB_Garamond } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { JsonLd, organizationSchema } from "@/lib/schema";

// NourNest brand fonts per brand guidelines:
// Headings: Playfair Display · Body: Garamond (EB Garamond is the closest open-source equivalent)
const serif = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const body = EB_Garamond({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nournestapartments.com"),
  title: {
    default: "NourNest Apartments · Your Home Away From Home in London",
    template: "%s · NourNest Apartments",
  },
  description:
    "Curated, fully equipped serviced apartments across Central London. Welcoming, warm, and personalised. Where every stay feels like coming home.",
  openGraph: {
    title: "NourNest Apartments · Your Home Away From Home in London",
    description:
      "Curated, fully equipped serviced apartments across Central London. Welcoming, warm, personalised.",
    url: "https://nournestapartments.com",
    siteName: "NourNest Apartments",
    locale: "en_GB",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className={`${serif.variable} ${body.variable}`}>
      <body className="font-body antialiased text-stone-900 bg-[#FFFBF2]">
        <JsonLd data={organizationSchema()} />
        <Header />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
