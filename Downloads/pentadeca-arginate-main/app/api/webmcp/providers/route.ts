import { NextResponse } from "next/server";
import providers from "@/data/providers.json";

export const dynamic = "force-static";

export async function GET() {
  const data = providers.map((p) => ({
    name: p.name,
    slug: p.slug,
    url: `https://pentadecaarginate.com/providers/${p.slug}`,
    category: p.category,
    rating: p.rating,
    review_count: p.reviewCount,
    price: p.price,
    price_details: p.priceDetails,
    cta: p.cta,
    badge: p.badge ?? null,
    features: p.features,
    conditions_treated: p.conditionsTreated,
    protocols: p.protocols,
    turnaround: p.turnaround,
  }));

  return NextResponse.json(
    {
      count: data.length,
      updated: "2025-01-15",
      providers: data,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=3600",
      },
    }
  );
}
