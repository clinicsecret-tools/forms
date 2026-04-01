import type { Metadata } from "next";
import Link from "next/link";
import { AFFILIATE } from "@/lib/affiliate";
import providers from "@/data/providers.json";
import ProviderCard from "@/components/ProviderCard";
import ComparisonTable from "@/components/ComparisonTable";
import CTABanner from "@/components/CTABanner";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Best Pentadeca Arginate Providers 2025 — Compared & Ranked",
  description:
    "Compare the top telehealth providers offering Pentadeca Arginate therapy in 2025. Ranked by physician quality, pricing, delivery, and patient outcomes.",
  keywords: ["pentadeca arginate providers", "where to get PDA", "PDA telehealth", "best peptide therapy provider"],
  alternates: { canonical: "https://pentadecaarginate.com/providers" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Best Pentadeca Arginate Providers 2025",
  url: "https://pentadecaarginate.com/providers",
  itemListElement: providers.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: p.name,
    url: `https://pentadecaarginate.com/providers/${p.slug}`,
    description: p.description,
  })),
};

export default function ProvidersPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO */}
      <section className="relative bg-stone-950 pt-14 pb-16 px-4 border-b border-stone-800/40">
        <div className="absolute inset-0 bg-mesh opacity-40" />
        <div className="relative z-10 max-w-5xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-stone-500 mb-6">
            <Link href="/" className="hover:text-stone-300 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-stone-300">Providers</span>
          </nav>

          <span className="badge-green mb-5 inline-block">2025 Rankings</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 font-display">
            Best Pentadeca Arginate{" "}
            <span className="text-gradient">Providers</span>
          </h1>
          <p className="text-xl text-stone-300 max-w-3xl mb-8">
            We've evaluated every major telehealth platform offering PDA therapy and ranked them on physician quality, pricing transparency, delivery speed, and patient outcomes.
          </p>

          <div className="flex flex-wrap gap-4 items-center">
            <a href={AFFILIATE.primary} target="_blank" rel="noopener noreferrer" className="btn-gold">
              #1 Pick: Clinic Secret →
            </a>
            <p className="text-stone-500 text-sm">Updated January 2025 · {providers.length} providers reviewed</p>
          </div>
        </div>
      </section>

      {/* METHODOLOGY */}
      <section className="py-10 px-4 bg-stone-900/30 border-b border-stone-800/40">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap gap-8 justify-center">
            {[
              { icon: "🏥", label: "Physician Credentials", desc: "Board certification & peptide experience" },
              { icon: "💊", label: "Pharmacy Quality", desc: "503A licensed compounders only" },
              { icon: "💰", label: "Pricing Transparency", desc: "No hidden fees or bait-and-switch" },
              { icon: "⭐", label: "Patient Reviews", desc: "Verified from multiple platforms" },
              { icon: "🚚", label: "Delivery Speed", desc: "Time from Rx to doorstep" },
            ].map((m) => (
              <div key={m.label} className="text-center">
                <div className="text-2xl mb-1">{m.icon}</div>
                <p className="text-white text-sm font-medium">{m.label}</p>
                <p className="text-stone-500 text-xs">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROVIDER CARDS */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 font-display">
            Ranked: Top {providers.length} Providers
          </h2>

          <div className="space-y-6">
            {providers.map((provider, i) => (
              <div key={provider.slug} className="flex gap-4 items-start">
                <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold font-display text-lg mt-1 ${
                  i === 0 ? "bg-gold-500 text-stone-950" : "bg-stone-800 text-stone-400"
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <ProviderCard provider={provider} featured={i === 0} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="py-16 px-4 bg-stone-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="badge-green mb-4 inline-block">Side by Side</span>
            <h2 className="section-title">Provider Comparison Table</h2>
          </div>
          <ComparisonTable providers={providers} />
        </div>
      </section>

      {/* BUYING GUIDE */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-title text-center mb-12">How to Choose a PDA Provider</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                title: "Verify Physician Credentials",
                desc: "Ensure the prescribing physician is board-certified and experienced with peptide therapy. Ask about their training and the number of peptide patients they manage.",
              },
              {
                title: "Confirm 503A Compounding",
                desc: "Your medication should come from a licensed 503A compounding pharmacy. This ensures quality control, proper sterility testing, and regulatory compliance.",
              },
              {
                title: "Understand Total Cost",
                desc: "Look beyond the base price. Factor in consultation fees, lab work requirements, monthly subscription costs, and shipping to calculate true total cost.",
              },
              {
                title: "Check State Availability",
                desc: "Telehealth regulations vary by state. Confirm the provider operates in your state before starting the consultation process.",
              },
              {
                title: "Review the Onboarding Process",
                desc: "A quality provider will review your health history, current medications, and goals before prescribing. Be cautious of providers who prescribe without proper intake.",
              },
              {
                title: "Look for Ongoing Support",
                desc: "PDA therapy works best with ongoing monitoring. Choose a provider with responsive patient support, regular check-ins, and protocol adjustment capability.",
              },
            ].map((item) => (
              <div key={item.title} className="card p-6">
                <h3 className="text-white font-bold mb-2">{item.title}</h3>
                <p className="text-stone-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
      <Footer />
    </>
  );
}
