import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import blogPosts from "@/data/blog.json";
import providers from "@/data/providers.json";
import CTABanner from "@/components/CTABanner";
import Footer from "@/components/Footer";
import { AFFILIATE } from "@/lib/affiliate";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
    keywords: post.keywords,
    alternates: { canonical: `https://pentadecaarginate.com/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const relatedPosts = blogPosts.filter((p) => p.slug !== post.slug && p.category === post.category).slice(0, 3);
  const otherPosts = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);
  const displayRelated = relatedPosts.length > 0 ? relatedPosts : otherPosts;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.summary,
    author: { "@type": "Person", name: post.author },
    datePublished: post.date,
    publisher: {
      "@type": "Organization",
      name: "PentaDecaArginate.com",
      url: "https://pentadecaarginate.com",
    },
    keywords: post.keywords.join(", "),
  };

  const topProvider = providers[0];

  // Build full article content from sections + content
  const hasDetailedSections = post.sections && post.sections.length > 0;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO */}
      <section className="bg-stone-950 pt-14 pb-12 px-4 border-b border-stone-800/40">
        <div className="max-w-3xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-stone-500 mb-6 flex-wrap">
            <Link href="/" className="hover:text-stone-300 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-stone-300 transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-stone-300 truncate max-w-xs">{post.title}</span>
          </nav>

          <div className="flex items-center gap-3 mb-5">
            <span className="badge-green">{post.category}</span>
            <span className="text-stone-600 text-sm">·</span>
            <span className="text-stone-500 text-sm">{post.readTime} read</span>
            <span className="text-stone-600 text-sm">·</span>
            <time className="text-stone-500 text-sm">
              {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </time>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-5 font-display leading-tight">
            {post.title}
          </h1>

          <p className="text-stone-300 text-lg leading-relaxed mb-6">{post.summary}</p>

          <div className="flex items-center gap-3 py-4 border-t border-b border-stone-800/60">
            <div className="w-9 h-9 rounded-full bg-forest-800 border border-forest-600/40 flex items-center justify-center text-forest-300 text-sm font-bold">
              {post.author.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <p className="text-white text-sm font-semibold">{post.author}</p>
              <p className="text-stone-500 text-xs">Medical Reviewer · PentaDecaArginate.com</p>
            </div>
          </div>
        </div>
      </section>

      {/* ARTICLE + SIDEBAR */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* ARTICLE */}
          <article className="flex-1 min-w-0 prose-dark">
            {/* Intro */}
            <p className="text-lg text-stone-300 leading-relaxed mb-8">{post.content}</p>

            {/* Inline CTA #1 */}
            <CTABanner variant="inline" />

            {/* Sections */}
            {hasDetailedSections ? (
              post.sections.map((section: { heading: string; body: string }, i: number) => (
                <div key={i}>
                  <h2>{section.heading}</h2>
                  <p>{section.body}</p>
                  {i === 1 && (
                    <div className="my-6 p-5 bg-forest-950/50 border border-forest-800/40 rounded-xl not-prose">
                      <p className="text-forest-300 font-semibold text-sm mb-2">💡 Key Takeaway</p>
                      <p className="text-stone-300 text-sm">
                        The choice between PDA and BPC-157 has largely been made for you by regulation — Pentadeca Arginate is now the primary legal option available through licensed compounding pharmacies.
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <>
                <h2>Understanding the Evidence Base</h2>
                <p>
                  Most of the research supporting Pentadeca Arginate's efficacy comes from preclinical animal models, given that PDA is a relatively recent compound. However, the substantial body of literature on BPC-157 — from which PDA is derived — provides a strong mechanistic foundation for understanding PDA's potential effects.
                </p>

                <h2>What Patients and Physicians Are Reporting</h2>
                <p>
                  Telehealth providers who have been offering PDA since its emergence report promising anecdotal outcomes across the conditions discussed in this article. Physicians note that PDA appears to produce comparable results to BPC-157 in their patient populations, with the added benefit of improved formulation stability and regulatory compliance.
                </p>

                <h3>Working with a Physician</h3>
                <p>
                  The most important step before starting any peptide therapy is working with a licensed physician who has experience in peptide optimization. They can assess your specific situation, recommend appropriate dosing, and monitor your progress over time.
                </p>

                {/* Inline CTA #2 */}
                <CTABanner variant="compact" title={`Ready to explore PDA for ${post.category.toLowerCase()}?`} />

                <h2>Next Steps</h2>
                <p>
                  If you're interested in exploring Pentadeca Arginate therapy for yourself, the first step is connecting with a qualified telehealth provider who can conduct a proper intake and determine if PDA is appropriate for your situation.
                </p>
                <p>
                  Our top-rated provider, Clinic Secret, offers a fully online consultation process with board-certified physicians experienced in peptide therapy. No insurance is required, and medications are shipped directly to your home.
                </p>
              </>
            )}

            {/* Keywords / Entities for LLM SEO */}
            <section className="mt-10 p-5 bg-stone-900/50 border border-stone-800 rounded-xl not-prose">
              <h3 className="text-stone-400 text-xs uppercase tracking-wider mb-3 font-medium">Related Topics</h3>
              <div className="flex flex-wrap gap-2">
                {post.keywords.map((kw: string) => (
                  <span key={kw} className="text-xs bg-stone-800 border border-stone-700 text-stone-400 px-2.5 py-1 rounded-full">
                    {kw}
                  </span>
                ))}
                {post.related_entities.map((entity: string) => (
                  <span key={entity} className="text-xs bg-forest-950 border border-forest-800/50 text-forest-400 px-2.5 py-1 rounded-full">
                    {entity}
                  </span>
                ))}
              </div>
            </section>

            {/* Disclaimer */}
            <div className="mt-8 p-4 bg-amber-950/30 border border-amber-800/30 rounded-xl not-prose">
              <p className="text-amber-200/70 text-xs leading-relaxed">
                <strong className="text-amber-200">Medical Disclaimer:</strong> This article is for informational purposes only and does not constitute medical advice. Pentadeca Arginate is a compounded peptide, not an FDA-approved drug. Always consult a licensed physician before starting any peptide therapy.
              </p>
            </div>
          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-72 shrink-0 space-y-6">
            {/* Provider CTA */}
            <div className="card p-6 border-forest-700/30 sticky top-20">
              <div className="badge-gold mb-3 inline-block">Top Rated Provider</div>
              <h3 className="text-white font-bold text-lg font-display mb-2">{topProvider.name}</h3>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-gold-400 text-sm">⭐ {topProvider.rating}</span>
                <span className="text-stone-600 text-xs">({topProvider.reviewCount} reviews)</span>
              </div>
              <p className="text-stone-400 text-sm mb-4 leading-relaxed">{topProvider.description.slice(0, 120)}...</p>
              <ul className="space-y-1.5 mb-5">
                {topProvider.features.slice(0, 3).map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-stone-300">
                    <svg className="w-3 h-3 text-forest-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={AFFILIATE.primary}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold w-full text-center block text-sm"
              >
                Start Consultation →
              </a>
              <Link
                href={`/providers/${topProvider.slug}`}
                className="block text-center text-forest-400 hover:text-forest-300 text-xs mt-3 transition-colors"
              >
                Read full review
              </Link>
            </div>

            {/* Related articles */}
            <div>
              <h3 className="text-stone-400 text-xs uppercase tracking-wider mb-4 font-medium">Related Articles</h3>
              <div className="space-y-3">
                {displayRelated.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="block card p-4 hover:border-stone-700 transition-all group"
                  >
                    <span className="badge-green text-xs mb-2 inline-block">{p.category}</span>
                    <p className="text-stone-300 text-sm font-medium group-hover:text-forest-200 transition-colors leading-snug">
                      {p.title}
                    </p>
                    <p className="text-stone-600 text-xs mt-1.5">{p.readTime} read</p>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <CTABanner />
      <Footer />
    </>
  );
}
