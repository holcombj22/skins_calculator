import { SkinsCalculator } from "@/components/skins-calculator"

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Golf Skins Pro",
  description:
    "Free online golf skins game calculator. Enter players, scores, and the total pot — instantly see who wins each skin and how much they earn.",
  applicationCategory: "SportsApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Calculate skins game results for 9 or 18 holes",
    "Support for 2 or more players",
    "Automatic carry-over for tied holes",
    "Configurable total pot amount",
  ],
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-dvh bg-[radial-gradient(circle_at_top,oklch(0.98_0.03_145),transparent_35%),var(--background)]">
        <SkinsCalculator />
      </main>
    </>
  )
}
