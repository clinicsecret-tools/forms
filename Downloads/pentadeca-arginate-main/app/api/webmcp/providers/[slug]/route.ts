import { NextResponse } from "next/server";
import providers from "@/data/providers.json";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return providers.map((p) => ({ slug: p.slug }));
}

export async function GET(_request: Request, { params }: Props) {
  const provider = providers.find((p) => p.slug === params.slug);

  if (!provider) {
    return NextResponse.json(
      { error: "Provider not found", slug: params.slug },
      { status: 404 }
    );
  }

  const data = {
    name: provider.name,
    slug: provider.slug,
    url: `https://pentadecaarginate.com/providers/${provider.slug}`,
    category: provider.category,
    rating: provider.rating,
    review_count: provider.reviewCount,
    price: provider.price,
    price_details: provider.priceDetails,
    cta: provider.cta,
    badge: provider.badge ?? null,
    description: provider.description,
    features: provider.features,
    pros: provider.pros,
    cons: provider.cons,
    conditions_treated: provider.conditionsTreated,
    protocols: provider.protocols,
    turnaround: provider.turnaround,
    aggregate_rating: {
      "@type": "AggregateRating",
      rating_value: provider.rating,
      review_count: provider.reviewCount,
      best_rating: 5,
      worst_rating: 1,
    },
  };

  return NextResponse.json(data, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, s-maxage=3600",
    },
  });
}
