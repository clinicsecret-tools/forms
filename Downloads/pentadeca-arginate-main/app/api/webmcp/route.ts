import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET() {
  const data = {
    site: "PentaDecaArginate.com",
    type: "medical-affiliate-resource",
    description: "Comprehensive reference site for Pentadeca Arginate (PDA) peptide therapy. Covers mechanism of action, clinical applications, dosing protocols, provider comparisons, and regulatory status.",
    version: "1.0",
    last_updated: "2025-01-15",
    entities: [
      "pentadeca arginate",
      "PDA peptide",
      "BPC-157 analog",
      "peptide therapy",
      "compounded peptides",
      "telehealth peptides",
      "tissue repair",
      "anti-inflammatory peptide",
    ],
    primary_actions: [
      "compare providers",
      "learn treatment mechanism",
      "start consultation",
      "read research",
      "understand dosing",
    ],
    top_provider: "Clinic Secret",
    affiliate: true,
    affiliate_disclosure: "This site contains affiliate links. Provider rankings are based on independent evaluation criteria.",
    endpoints: {
      providers: "/api/webmcp/providers",
      articles: "/api/webmcp/articles",
      faq: "/api/webmcp/faq",
      comparisons: "/api/webmcp/comparisons",
    },
    canonical_url: "https://pentadecaarginate.com",
    sitemap: "https://pentadecaarginate.com/sitemap.xml",
    robots: "https://pentadecaarginate.com/robots.txt",
    medical_disclaimer: "Content is for informational purposes only. Compounded peptides are not FDA-approved drugs.",
    scalable_verticals: ["GLP-1", "TRT", "NAD+", "peptide therapy"],
  };

  return NextResponse.json(data, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      "X-Robots-Tag": "noindex",
    },
  });
}
