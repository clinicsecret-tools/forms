import { NextResponse } from "next/server";
import faqs from "@/data/faq.json";
import { NextRequest } from "next/server";

export const dynamic = "force-static";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  const filtered = category
    ? faqs.filter((f) => f.category === category)
    : faqs;

  const categories = Array.from(new Set(faqs.map((f) => f.category)));

  return NextResponse.json(
    {
      count: filtered.length,
      total: faqs.length,
      categories,
      schema_type: "FAQPage",
      faq: filtered.map((f) => ({
        question: f.question,
        answer: f.answer,
        category: f.category,
        schema: {
          "@type": "Question",
          name: f.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.answer,
          },
        },
      })),
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=3600",
      },
    }
  );
}
