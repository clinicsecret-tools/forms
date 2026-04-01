import type { Metadata } from "next";
import Link from "next/link";
import { AFFILIATE } from "@/lib/affiliate";
import faqs from "@/data/faq.json";
import FAQAccordion from "@/components/FAQAccordion";
import CTABanner from "@/components/CTABanner";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "What is Pentadeca Arginate? Complete Science & Treatment Guide",
  description:
    "Everything you need to know about Pentadeca Arginate (PDA): mechanism of action, benefits, dosing protocols, safety profile, and how it compares to BPC-157. Physician-reviewed.",
  keywords: ["what is pentadeca arginate", "PDA peptide mechanism", "pentadeca arginate guide", "BPC-157 analog"],
  alternates: { canonical: "https://pentadecaarginate.com/arginate" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  name: "What is Pentadeca Arginate?",
  url: "https://pentadecaarginate.com/arginate",
  description: "Comprehensive medical reference on Pentadeca Arginate (PDA), a stabilized BPC-157 analog peptide.",
  about: {
    "@type": "Drug",
    name: "Pentadeca Arginate",
    alternateName: ["PDA", "Pentadecapeptide Arginate"],
    description: "A synthetic 15-amino-acid peptide derived from BPC-157, formulated as an arginate salt for enhanced stability.",
  },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://pentadecaarginate.com" },
      { "@type": "ListItem", position: 2, name: "What is PDA?", item: "https://pentadecaarginate.com/arginate" },
    ],
  },
};

const mechanismSteps = [
  {
    step: "01",
    title: "Nitric Oxide Modulation",
    desc: "PDA upregulates endothelial nitric oxide synthase (eNOS), increasing NO production which drives vasodilation and angiogenesis — critical for tissue perfusion during healing.",
  },
  {
    step: "02",
    title: "Growth Factor Expression",
    desc: "Stimulates expression of VEGF, EGF, and FGF — key growth factors responsible for new blood vessel formation, epithelial repair, and fibroblast proliferation.",
  },
  {
    step: "03",
    title: "Inflammatory Cytokine Regulation",
    desc: "Modulates pro-inflammatory cytokines (TNF-α, IL-6) while preserving the early inflammatory signals needed for proper tissue remodeling.",
  },
  {
    step: "04",
    title: "Collagen Synthesis",
    desc: "Enhances collagen type I and III production through fibroblast activation — essential for tendon, ligament, and connective tissue repair.",
  },
];

const dosingSections = [
  {
    route: "Subcutaneous Injection",
    icon: "💉",
    range: "250–500 mcg/day",
    timing: "Once daily, preferably AM on an empty stomach",
    cycle: "4–12 weeks",
    notes: "Highest bioavailability. Most common protocol for injury and inflammation.",
  },
  {
    route: "Oral / Sublingual",
    icon: "💊",
    range: "500–1000 mcg/day",
    timing: "Split dose AM/PM",
    cycle: "8–16 weeks",
    notes: "Lower bioavailability but preferred for gut-specific conditions. Sublingual improves absorption.",
  },
];

export default function ArginalePage() {
  const mechanismFAQs = faqs.filter((f) => ["mechanism", "basics", "dosing", "safety"].includes(f.category));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO */}
      <section className="relative overflow-hidden bg-stone-950 pt-14 pb-16 px-4">
        <div className="absolute inset-0 bg-mesh opacity-50" />
        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-stone-500 mb-8">
            <Link href="/" className="hover:text-stone-300 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-stone-300">What is Pentadeca Arginate?</span>
          </nav>

          <span className="badge-green mb-5 inline-block">Complete Science Guide</span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-display leading-tight">
            What is Pentadeca{" "}
            <span className="text-gradient">Arginate</span>?
          </h1>
          <p className="text-xl text-stone-300 mb-8 leading-relaxed max-w-3xl">
            A comprehensive, physician-reviewed guide to Pentadeca Arginate (PDA): its structure, mechanism of action, clinical applications, dosing protocols, safety profile, and how it differs from BPC-157.
          </p>

          <div className="flex flex-wrap gap-3">
            <a href={AFFILIATE.primary} target="_blank" rel="noopener noreferrer" className="btn-gold">
              Find a Provider →
            </a>
            <Link href="/providers" className="btn-primary">
              Compare Providers
            </Link>
          </div>

          {/* Quick stats */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Amino Acids", value: "15" },
              { label: "MW (Da)", value: "~1,758" },
              { label: "FDA Status", value: "Not Restricted" },
              { label: "Admin Routes", value: "2+" },
            ].map((stat) => (
              <div key={stat.label} className="card p-4 text-center">
                <p className="text-2xl font-bold text-forest-300 font-display">{stat.value}</p>
                <p className="text-stone-500 text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto px-4 pb-12">

        {/* What Is It */}
        <section className="py-12 border-b border-stone-800/60">
          <h2 className="text-3xl font-bold text-white mb-6 font-display">What is Pentadeca Arginate?</h2>
          <div className="prose-dark">
            <p>
              Pentadeca Arginate (PDA) is a <strong className="text-white">synthetic 15-amino-acid peptide</strong> that is structurally derived from Body Protection Compound 157 (BPC-157) — one of the most extensively studied regenerative peptides in preclinical research. The name "pentadeca" refers to its 15-amino-acid sequence, while "arginate" denotes the arginine salt form in which it is compounded.
            </p>
            <p>
              The critical innovation in PDA is its formulation as an arginate salt rather than as a free peptide. This chemical modification dramatically improves the compound's <strong className="text-white">stability in aqueous solution</strong>, reduces degradation during compounding and storage, and may enhance bioavailability after administration — key limitations that have historically challenged BPC-157 formulations.
            </p>
            <p>
              PDA emerged as a clinically significant compound after the FDA placed BPC-157 on its list of bulk drug substances that may not be used in compounding in 2023. With BPC-157 no longer accessible through licensed compounding pharmacies, PDA — which shares the same core amino acid sequence and biological targets — became the primary regulated alternative available via physician prescription.
            </p>
          </div>
        </section>

        {/* Mechanism */}
        <section className="py-12 border-b border-stone-800/60">
          <h2 className="text-3xl font-bold text-white mb-3 font-display">How Does Pentadeca Arginate Work?</h2>
          <p className="text-stone-400 mb-8">
            PDA exerts its effects through several interconnected biological pathways that collectively create a pro-healing, anti-inflammatory environment.
          </p>

          <div className="space-y-4">
            {mechanismSteps.map((item) => (
              <div key={item.step} className="card p-6 flex gap-6 items-start">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-forest-900 border border-forest-700/40 flex items-center justify-center">
                  <span className="text-forest-300 font-bold font-mono text-sm">{item.step}</span>
                </div>
                <div>
                  <h3 className="text-white font-bold mb-2">{item.title}</h3>
                  <p className="text-stone-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Conditions */}
        <section className="py-12 border-b border-stone-800/60">
          <h2 className="text-3xl font-bold text-white mb-6 font-display">Conditions & Applications</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { condition: "Tendinopathy & Tendon Tears", evidence: "Strong preclinical", icon: "🦴" },
              { condition: "Inflammatory Bowel Disease", evidence: "Moderate preclinical", icon: "🫁" },
              { condition: "Wound Healing", evidence: "Strong preclinical", icon: "🩹" },
              { condition: "Joint Inflammation", evidence: "Moderate preclinical", icon: "🦵" },
              { condition: "Post-Surgical Recovery", evidence: "Clinical use emerging", icon: "🏥" },
              { condition: "Leaky Gut / Intestinal Permeability", evidence: "Moderate preclinical", icon: "🔬" },
              { condition: "Neuroprotection", evidence: "Early preclinical", icon: "🧠" },
              { condition: "Chronic Systemic Inflammation", evidence: "Moderate preclinical", icon: "🔴" },
            ].map((item) => (
              <div key={item.condition} className="card p-4 flex items-center gap-4">
                <span className="text-2xl shrink-0">{item.icon}</span>
                <div>
                  <p className="text-white font-medium text-sm">{item.condition}</p>
                  <p className="text-stone-500 text-xs mt-0.5">Evidence: {item.evidence}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA inline */}
        <CTABanner variant="inline" title="Talk to a physician about PDA for your condition" />

        {/* Dosing */}
        <section className="py-12 border-b border-stone-800/60">
          <h2 className="text-3xl font-bold text-white mb-3 font-display">Dosing Protocols</h2>
          <p className="text-stone-400 mb-8">
            Always establish your protocol with a licensed physician. The following ranges reflect common clinical practice.
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
            {dosingSections.map((d) => (
              <div key={d.route} className="card p-6">
                <div className="text-3xl mb-3">{d.icon}</div>
                <h3 className="text-white font-bold mb-4">{d.route}</h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-stone-500">Dose range</dt>
                    <dd className="text-forest-300 font-medium">{d.range}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-stone-500">Timing</dt>
                    <dd className="text-stone-300">{d.timing}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-stone-500">Typical cycle</dt>
                    <dd className="text-stone-300">{d.cycle}</dd>
                  </div>
                </dl>
                <p className="text-stone-500 text-xs mt-4 pt-4 border-t border-stone-800">{d.notes}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-amber-950/30 border border-amber-800/30 rounded-xl">
            <p className="text-amber-200/80 text-sm">
              ⚕️ <strong className="text-amber-200">Important:</strong> Dosing information above is for educational purposes only. Compounded peptides require a valid physician prescription. Never self-administer without medical supervision.
            </p>
          </div>
        </section>

        {/* Safety */}
        <section className="py-12 border-b border-stone-800/60">
          <h2 className="text-3xl font-bold text-white mb-6 font-display">Safety & Side Effects</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-forest-300 font-semibold mb-4">Common (Mild)</h3>
              <ul className="space-y-2">
                {["Injection site redness or bruising", "Transient fatigue (first 1–2 weeks)", "Mild nausea (oral formulations)", "Temporary headache"].map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm text-stone-400">
                    <span className="text-amber-500 mt-0.5">•</span>{s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-stone-400 font-semibold mb-4">Rare / Serious</h3>
              <ul className="space-y-2">
                {["Allergic reaction (discontinue immediately)", "Blood pressure fluctuation", "Interaction with anticoagulants", "Unknown long-term effects (limited human data)"].map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm text-stone-400">
                    <span className="text-red-500 mt-0.5">•</span>{s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* PDA vs BPC-157 */}
        <section className="py-12 border-b border-stone-800/60">
          <h2 className="text-3xl font-bold text-white mb-6 font-display">
            Pentadeca Arginate vs BPC-157: Key Differences
          </h2>
          <div className="overflow-x-auto rounded-xl border border-stone-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-stone-900 border-b border-stone-800">
                  <th className="text-left p-4 text-stone-400">Property</th>
                  <th className="p-4 text-center text-forest-300 font-bold">Pentadeca Arginate</th>
                  <th className="p-4 text-center text-stone-400">BPC-157</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["FDA Compounding Status", "✓ Not restricted", "✗ Restricted (2023)"],
                  ["Formulation Stability", "✓ High (arginate salt)", "⚠ Moderate"],
                  ["Route: Injection", "✓ Yes", "✓ Yes"],
                  ["Route: Oral", "✓ Yes (improved)", "⚠ Limited"],
                  ["Human Clinical Data", "⚠ Emerging", "⚠ Limited"],
                  ["Animal Study History", "⚠ Shorter", "✓ Extensive"],
                  ["Provider Availability", "✓ Multiple licensed", "✗ Very limited"],
                ].map(([prop, pda, bpc], i) => (
                  <tr key={prop} className={`border-b border-stone-800/50 ${i % 2 === 0 ? "bg-stone-950/30" : ""}`}>
                    <td className="p-4 text-stone-400">{prop}</td>
                    <td className="p-4 text-center text-forest-300">{pda}</td>
                    <td className="p-4 text-center text-stone-500">{bpc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-center">
            <Link href="/blog/pentadeca-arginate-vs-bpc-157" className="text-forest-400 hover:text-forest-300 text-sm transition-colors">
              Read the full comparison article →
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12">
          <h2 className="text-3xl font-bold text-white mb-8 font-display">Common Questions</h2>
          <FAQAccordion faqs={mechanismFAQs} />
        </section>
      </div>

      <CTABanner />
      <Footer />
    </>
  );
}
