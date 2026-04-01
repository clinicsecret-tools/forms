import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET() {
  const comparisons = [
    {
      id: "pda-vs-bpc157",
      title: "Pentadeca Arginate vs BPC-157",
      slug: "pentadeca-arginate-vs-bpc-157",
      url: "https://pentadecaarginate.com/blog/pentadeca-arginate-vs-bpc-157",
      entities: ["Pentadeca Arginate", "BPC-157"],
      summary:
        "PDA and BPC-157 share the same core amino acid sequence but differ in formulation stability and regulatory status. PDA (arginate salt) is currently available through licensed compounding pharmacies; BPC-157 was placed on the FDA restricted list in 2023.",
      winner: "Pentadeca Arginate",
      winner_reason: "Available via licensed telehealth with physician oversight. Not on FDA restricted list.",
      comparison_points: [
        {
          property: "FDA Compounding Status",
          pda: "Not restricted",
          bpc157: "Restricted since 2023",
          advantage: "pda",
        },
        {
          property: "Chemical Stability",
          pda: "High (arginate salt form)",
          bpc157: "Moderate",
          advantage: "pda",
        },
        {
          property: "Oral Bioavailability",
          pda: "Improved",
          bpc157: "Limited",
          advantage: "pda",
        },
        {
          property: "Animal Research Volume",
          pda: "Growing",
          bpc157: "Extensive (decades)",
          advantage: "bpc157",
        },
        {
          property: "Human Clinical Data",
          pda: "Emerging",
          bpc157: "Limited",
          advantage: "tie",
        },
        {
          property: "Provider Availability",
          pda: "Multiple licensed telehealth platforms",
          bpc157: "Very limited",
          advantage: "pda",
        },
        {
          property: "Mechanism of Action",
          pda: "NOS modulation, VEGF/EGF upregulation",
          bpc157: "Same pathways",
          advantage: "tie",
        },
      ],
    },
    {
      id: "pda-vs-pain-meds",
      title: "Pentadeca Arginate vs Conventional Pain Medications",
      slug: null,
      url: "https://pentadecaarginate.com/arginate",
      entities: ["Pentadeca Arginate", "NSAIDs", "opioids", "corticosteroids"],
      summary:
        "Unlike conventional pain medications which primarily suppress pain signals, PDA targets the underlying biology of tissue damage and inflammation — potentially addressing root causes rather than masking symptoms.",
      winner: "Depends on use case",
      winner_reason: "PDA is not a replacement for acute pain management but may offer superior long-term outcomes for chronic inflammatory conditions and tissue repair.",
      comparison_points: [
        {
          property: "Mechanism",
          pda: "Tissue repair + anti-inflammatory",
          conventional: "Pain signal suppression",
          advantage: "pda_long_term",
        },
        {
          property: "Addiction Potential",
          pda: "None identified",
          conventional: "High (opioids), Low (NSAIDs)",
          advantage: "pda",
        },
        {
          property: "Gut Safety",
          pda: "May improve gut health",
          conventional: "NSAIDs damage gut lining",
          advantage: "pda",
        },
        {
          property: "Speed of Relief",
          pda: "Gradual (days to weeks)",
          conventional: "Rapid (minutes to hours)",
          advantage: "conventional",
        },
        {
          property: "FDA Approval",
          pda: "Not approved",
          conventional: "Approved",
          advantage: "conventional",
        },
        {
          property: "Long-Term Tissue Health",
          pda: "May improve",
          conventional: "May worsen (steroids, NSAIDs)",
          advantage: "pda",
        },
        {
          property: "Prescription Required",
          pda: "Yes (compounded)",
          conventional: "Varies",
          advantage: "tie",
        },
      ],
    },
    {
      id: "pda-vs-tb500",
      title: "Pentadeca Arginate vs TB-500 (Thymosin Beta-4)",
      slug: null,
      url: "https://pentadecaarginate.com/arginate",
      entities: ["Pentadeca Arginate", "TB-500", "Thymosin Beta-4"],
      summary:
        "PDA and TB-500 are often stacked together for injury recovery. They work through different but complementary mechanisms — PDA primarily through nitric oxide and growth factor modulation, TB-500 through actin regulation and cell migration.",
      winner: "Stack both",
      winner_reason: "PDA and TB-500 complement each other. PDA for inflammation and vascular repair, TB-500 for cellular migration and tissue regeneration.",
      comparison_points: [
        {
          property: "Primary Mechanism",
          pda: "NO modulation, VEGF/EGF",
          tb500: "Actin binding, cell migration",
          advantage: "complementary",
        },
        {
          property: "Best For",
          pda: "Inflammation, gut, tendon",
          tb500: "Muscle, nerve, systemic repair",
          advantage: "use_case_dependent",
        },
        {
          property: "Can Combine",
          pda: "Yes",
          tb500: "Yes",
          advantage: "stack",
        },
      ],
    },
  ];

  return NextResponse.json(
    {
      count: comparisons.length,
      updated: "2025-01-15",
      comparisons,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=3600",
      },
    }
  );
}
