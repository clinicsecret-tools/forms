import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import providers from "@/data/providers.json";
import CTABanner from "@/components/CTABanner";
import Footer from "@/components/Footer";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return providers.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const provider = providers.find((p) => p.slug === params.slug);
  if (!provider) return {};
  return {
    title: `${provider.name} Review 2025 — PDA Therapy Provider`,
    description: `${provider.name} review: pricing, pros & cons, patient experience, and how to start Pentadeca Arginate therapy. Rating: ${provider.rating}/5.`,
    alternates: { canonical: `https://pentadecaarginate.com/providers/${provider.slug}` },
  };
}

export default function ProviderPage({ params }: Props) {
  const provider = providers.find((p) => p.slug === params.slug);
  if (!provider) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: provider.name,
    url: provider.cta,
    description: provider.description,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: provider.rating,
      reviewCount: provider.reviewCount,
      bestRating: 5,
    },
  };

  const otherProviders = providers.filter((p) => p.slug !== provider.slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO */}
      <section className="bg-stone-950 pt-14 pb-12 px-4 border-b border-stone-800/40">
        <div className="max-w-4xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-stone-500 mb-6 flex-wrap">
            <Link href="/" className="hover:text-stone-300 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/providers" className="hover:text-stone-300 transition-colors">Providers</Link>
            <span>/</span>
            <span className="text-stone-300">{provider.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div>
              {provider.badge && (
                <span className="badge-gold mb-4 inline-block">{provider.badge}</span>
              )}
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-display">
                {provider.name}
                <span className="block text-xl text-stone-400 font-normal mt-2">
                  Pentadeca Arginate Provider Review
                </span>
              </h1>
              <div className="flex items-center gap-3">
                <StarRow rating={provider.rating} />
                <span className="text-gold-400 font-bold text-lg">{provider.rating}</span>
                <span className="text-stone-500 text-sm">({provider.reviewCount} verified reviews)</span>
              </div>
            </div>

            <div className="card p-6 md:w-64 shrink-0">
              <p className="text-stone-400 text-sm mb-1">Starting Price</p>
              <p className="text-forest-300 text-2xl font-bold font-display mb-1">{provider.price}</p>
              <p className="text-stone-600 text-xs mb-5">{provider.priceDetails}</p>
              <a
                href={provider.cta}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold w-full text-center block"
              >
                Start Consultation →
              </a>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-stone-400">
                  <svg className="w-3.5 h-3.5 text-forest-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Online consultation available
                </div>
                <div className="flex items-center gap-2 text-xs text-stone-400">
                  <svg className="w-3.5 h-3.5 text-forest-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  No insurance required
                </div>
                <div className="flex items-center gap-2 text-xs text-stone-400">
                  <svg className="w-3.5 h-3.5 text-forest-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Ships: {provider.turnaround}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="max-w-4xl mx-auto px-4 py-12">

        {/* Overview */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 font-display">Overview</h2>
          <p className="text-stone-300 leading-relaxed text-lg">{provider.description}</p>
        </section>

        {/* Features */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 font-display">What's Included</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {provider.features.map((f) => (
              <div key={f} className="card p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-forest-900 border border-forest-700/40 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-forest-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-stone-200 text-sm font-medium">{f}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Pros & Cons */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 font-display">Pros & Cons</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="text-forest-300 font-bold mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-forest-900 border border-forest-600 flex items-center justify-center text-xs">+</span>
                Pros
              </h3>
              <ul className="space-y-3">
                {provider.pros.map((p) => (
                  <li key={p} className="text-stone-300 text-sm flex items-start gap-2">
                    <span className="text-forest-400 mt-0.5 shrink-0">✓</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-6">
              <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-red-950 border border-red-800 flex items-center justify-center text-xs text-red-400">−</span>
                Cons
              </h3>
              <ul className="space-y-3">
                {provider.cons.map((c) => (
                  <li key={c} className="text-stone-400 text-sm flex items-start gap-2">
                    <span className="text-red-500 mt-0.5 shrink-0">✗</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Conditions treated */}
        {provider.conditionsTreated.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 font-display">Conditions Treated</h2>
            <div className="flex flex-wrap gap-2">
              {provider.conditionsTreated.map((c) => (
                <span key={c} className="bg-stone-800 border border-stone-700 text-stone-300 text-sm px-3 py-1.5 rounded-full">
                  {c}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Protocols */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 font-display">Available Protocols</h2>
          <div className="flex gap-3 flex-wrap">
            {provider.protocols.map((p) => (
              <span key={p} className="badge-green">{p}</span>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="card p-8 text-center border-forest-700/30">
          <h3 className="text-2xl font-bold text-white mb-3 font-display">Ready to Start with {provider.name}?</h3>
          <p className="text-stone-400 mb-6">Begin with an online consultation. No insurance required. Home delivery available.</p>
          <a
            href={provider.cta}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold text-lg px-10 py-4 inline-flex"
          >
            Start Consultation →
          </a>
        </div>

        {/* Other providers */}
        <section className="mt-16">
          <h2 className="text-xl font-bold text-white mb-6 font-display">Compare Other Providers</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {otherProviders.map((p) => (
              <Link
                key={p.slug}
                href={`/providers/${p.slug}`}
                className="card p-5 hover:border-stone-700 transition-all group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-semibold group-hover:text-forest-200 transition-colors">{p.name}</p>
                    <p className="text-stone-500 text-sm mt-1">{p.price}</p>
                  </div>
                  <span className="text-gold-400 font-bold text-sm">⭐ {p.rating}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link href="/providers" className="text-forest-400 hover:text-forest-300 text-sm transition-colors">
              View full comparison →
            </Link>
          </div>
        </section>
      </div>

      <CTABanner />
      <Footer />
    </>
  );
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-5 h-5 ${s <= Math.round(rating) ? "text-gold-400" : "text-stone-700"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}
