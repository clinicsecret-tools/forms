import type { Metadata } from "next";
import Link from "next/link";
import { AFFILIATE } from "@/lib/affiliate";
import providers from "@/data/providers.json";
import blogPosts from "@/data/blog.json";
import faqs from "@/data/faq.json";
import ProviderCard from "@/components/ProviderCard";
import BlogCard from "@/components/BlogCard";
import FAQAccordion from "@/components/FAQAccordion";
import CTABanner from "@/components/CTABanner";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Pentadeca Arginate — Complete Guide, Providers & Research",
  description:
    "The most comprehensive guide to Pentadeca Arginate (PDA). Compare top providers, read the latest research, and learn how PDA supports tissue repair and inflammation reduction.",
  alternates: { canonical: "https://pentadecaarginate.com" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MedicalWebPage",
      name: "Pentadeca Arginate — Complete Guide",
      url: "https://pentadecaarginate.com",
      description: "Comprehensive resource on Pentadeca Arginate peptide therapy.",
      medicalAudience: { "@type": "MedicalAudience", audienceType: "Patient" },
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.slice(0, 5).map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
    {
      "@type": "ItemList",
      name: "Top Pentadeca Arginate Providers",
      itemListElement: providers.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: p.name,
        url: `https://pentadecaarginate.com/providers/${p.slug}`,
      })),
    },
  ],
};

export default function HomePage() {
  const topProvider = providers[0];
  const featuredFAQs = faqs.slice(0, 6);
  const featuredPosts = blogPosts.slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO */}
      <section className="relative overflow-hidden bg-stone-950 pt-16 pb-20 px-4">
        <div className="absolute inset-0 bg-mesh" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-forest-600/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-forest-950 border border-forest-700/40 rounded-full px-4 py-1.5 mb-8">
            <div className="w-2 h-2 bg-forest-400 rounded-full animate-pulse-slow" />
            <span className="text-forest-300 text-sm font-medium">Updated Jan 2025 — BPC-157 Alternative Guide</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight font-display">
            Pentadeca{" "}
            <span className="text-gradient">Arginate</span>
            <br />
            <span className="text-3xl md:text-4xl text-stone-300 font-normal">The Complete Guide</span>
          </h1>

          <p className="text-xl text-stone-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            Pentadeca Arginate (PDA) is a stabilized peptide analog showing remarkable potential for tissue repair, inflammation reduction, and healing acceleration. Compare top providers, read the research, and start treatment with a licensed physician.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={AFFILIATE.primary}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold text-lg px-8 py-4"
            >
              Start Treatment with Clinic Secret →
            </a>
            <Link href="/arginate" className="btn-primary text-lg px-8 py-4">
              Learn About PDA
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-10 flex flex-wrap justify-center gap-8 text-sm text-stone-500">
            <TrustBadge icon="🏥" text="Licensed Physicians" />
            <TrustBadge icon="🚚" text="Home Delivery" />
            <TrustBadge icon="💳" text="No Insurance Required" />
            <TrustBadge icon="🔬" text="503A Compounded" />
          </div>
        </div>
      </section>

      {/* WHAT IS PDA */}
      <section className="py-20 px-4 bg-stone-950">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="badge-green mb-4 inline-block">The Basics</span>
              <h2 className="section-title">What is Pentadeca Arginate?</h2>
              <div className="prose-dark">
                <p>
                  Pentadeca Arginate (PDA) is a synthetic 15-amino-acid peptide derived from BPC-157 — one of the most studied regenerative peptides. The key difference: PDA is formulated as an <strong className="text-forest-300">arginate salt</strong>, dramatically improving its chemical stability and bioavailability.
                </p>
                <p>
                  When the FDA placed BPC-157 on its list of restricted compounding substances in 2023, PDA emerged as the primary clinically viable alternative — sharing the same regenerative mechanisms without the regulatory barriers.
                </p>
              </div>
              <Link href="/arginate" className="btn-primary mt-6 inline-flex">
                Full PDA Deep Dive →
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "🔬", title: "15 Amino Acids", desc: "Pentadecapeptide derived from BPC-157" },
                { icon: "⚗️", title: "Arginate Salt", desc: "Enhanced stability vs standard BPC-157" },
                { icon: "🌿", title: "Not Banned", desc: "Not on FDA restricted compounding list" },
                { icon: "💉", title: "Compounded", desc: "Available via 503A pharmacies with Rx" },
              ].map((item) => (
                <div key={item.title} className="card p-5">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <p className="text-white font-semibold text-sm">{item.title}</p>
                  <p className="text-stone-500 text-xs mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-20 px-4 bg-stone-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="badge-green mb-4 inline-block">Therapeutic Benefits</span>
            <h2 className="section-title">What Can PDA Treat?</h2>
            <p className="section-subtitle">
              Preclinical research and clinical reports support PDA's utility across multiple tissue types and inflammatory conditions.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "🦴", title: "Joint & Tendon Repair", desc: "Accelerates collagen synthesis and reduces inflammation in tendons, ligaments, and joints.", link: "/blog/pentadeca-arginate-joint-pain-tendon" },
              { icon: "🫁", title: "Gut Health & IBD", desc: "Supports intestinal barrier integrity, reduces gut inflammation, and aids mucosal healing.", link: "/blog/pentadeca-arginate-gut-health" },
              { icon: "🩹", title: "Wound Healing", desc: "Upregulates growth factors to accelerate wound closure and reduce scarring." , link: "/arginate" },
              { icon: "🧠", title: "Neuroprotection", desc: "Emerging evidence for reducing neuroinflammation and supporting nerve recovery.", link: "/arginate" },
              { icon: "🏋️", title: "Athletic Recovery", desc: "Reduces post-training inflammation and speeds recovery from micro-tears and overuse injuries.", link: "/blog/pentadeca-arginate-joint-pain-tendon" },
              { icon: "🔴", title: "Chronic Inflammation", desc: "Modulates inflammatory cytokines and nitric oxide pathways for systemic anti-inflammatory effects.", link: "/arginate" },
            ].map((benefit) => (
              <Link
                key={benefit.title}
                href={benefit.link}
                className="card p-6 hover:border-forest-700/50 transition-all duration-200 hover:-translate-y-1 group"
              >
                <div className="text-3xl mb-3">{benefit.icon}</div>
                <h3 className="text-white font-bold mb-2 group-hover:text-forest-200 transition-colors">{benefit.title}</h3>
                <p className="text-stone-400 text-sm leading-relaxed">{benefit.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA inline */}
      <div className="max-w-6xl mx-auto px-4">
        <CTABanner variant="compact" />
      </div>

      {/* PROVIDERS */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="badge-green mb-4 inline-block">2025 Rankings</span>
            <h2 className="section-title">Best Pentadeca Arginate Providers</h2>
            <p className="section-subtitle">
              We've evaluated the top telehealth providers offering PDA therapy based on physician quality, pricing, and patient outcomes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {providers.map((provider, i) => (
              <ProviderCard key={provider.slug} provider={provider} featured={i === 0} />
            ))}
          </div>

          <div className="text-center">
            <Link href="/providers" className="btn-primary">
              Full Provider Comparison →
            </Link>
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="py-20 px-4 bg-stone-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="badge-green mb-4 inline-block">Head-to-Head</span>
            <h2 className="section-title">Pentadeca Arginate vs BPC-157</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <ComparisonCard
              title="Pentadeca Arginate (PDA)"
              highlight
              points={[
                "✓ Not on FDA restricted compounding list",
                "✓ Arginate salt = superior stability",
                "✓ Available via licensed telehealth",
                "✓ Growing clinical evidence base",
                "✓ Consistent supply from 503A pharmacies",
              ]}
            />
            <ComparisonCard
              title="BPC-157"
              points={[
                "✗ Added to FDA restricted list (2023)",
                "✗ Less stable in solution",
                "✗ Limited licensed prescribers",
                "✓ Longer animal study history",
                "✗ Compounding restrictions in many states",
              ]}
            />
          </div>

          <div className="text-center mt-8">
            <Link href="/blog/pentadeca-arginate-vs-bpc-157" className="text-forest-400 hover:text-forest-300 text-sm font-medium transition-colors">
              Read the full comparison →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="badge-green mb-4 inline-block">Common Questions</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>
          <FAQAccordion faqs={featuredFAQs} />
        </div>
      </section>

      {/* CTA full */}
      <CTABanner />

      {/* BLOG */}
      <section className="py-20 px-4 bg-stone-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="badge-green mb-3 inline-block">Research & Guides</span>
              <h2 className="section-title mb-0">Latest Articles</h2>
            </div>
            <Link href="/blog" className="text-forest-400 hover:text-forest-300 text-sm font-medium transition-colors hidden md:block">
              View all articles →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

function TrustBadge({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <span>{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function ComparisonCard({
  title,
  points,
  highlight = false,
}: {
  title: string;
  points: string[];
  highlight?: boolean;
}) {
  return (
    <div
      className={`card p-8 ${
        highlight ? "border-forest-600/40 ring-1 ring-forest-600/20" : ""
      }`}
    >
      <h3
        className={`text-xl font-bold mb-6 font-display ${
          highlight ? "text-forest-200" : "text-stone-300"
        }`}
      >
        {title}
      </h3>
      <ul className="space-y-3">
        {points.map((point) => (
          <li
            key={point}
            className={`text-sm ${
              point.startsWith("✓") ? "text-forest-300" : "text-stone-500"
            }`}
          >
            {point}
          </li>
        ))}
      </ul>
      {highlight && (
        <a
          href={AFFILIATE.primary}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold w-full text-center mt-6 block"
        >
          Get PDA Today →
        </a>
      )}
    </div>
  );
}
