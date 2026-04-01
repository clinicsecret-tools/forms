import type { Metadata } from "next";
import Link from "next/link";
import blogPosts from "@/data/blog.json";
import BlogCard from "@/components/BlogCard";
import CTABanner from "@/components/CTABanner";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Pentadeca Arginate Blog — Research, Guides & Treatment News",
  description:
    "Physician-reviewed articles on Pentadeca Arginate therapy, dosing protocols, comparisons, and clinical research. Stay current with PDA science.",
  alternates: { canonical: "https://pentadecaarginate.com/blog" },
};

const categories = ["All", ...Array.from(new Set(blogPosts.map((p) => p.category)))];

export default function BlogPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-stone-950 pt-14 pb-14 px-4 border-b border-stone-800/40">
        <div className="relative z-10 max-w-5xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-stone-500 mb-6">
            <Link href="/" className="hover:text-stone-300 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-stone-300">Blog</span>
          </nav>
          <span className="badge-green mb-5 inline-block">Physician-Reviewed</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 font-display">
            Pentadeca Arginate{" "}
            <span className="text-gradient">Research & Guides</span>
          </h1>
          <p className="text-xl text-stone-300 max-w-3xl">
            Evidence-based articles covering PDA mechanisms, protocols, comparisons, and clinical applications — written and reviewed by medical professionals.
          </p>
        </div>
      </section>

      {/* POSTS */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <span
                key={cat}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors cursor-pointer ${
                  cat === "All"
                    ? "bg-forest-700 border-forest-600 text-white"
                    : "border-stone-700 text-stone-400 hover:border-stone-600 hover:text-stone-200"
                }`}
              >
                {cat}
              </span>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* INLINE CTA */}
      <div className="max-w-6xl mx-auto px-4">
        <CTABanner variant="compact" title="Ready to discuss PDA therapy with a physician?" />
      </div>

      {/* SEO TOPICS */}
      <section className="py-16 px-4 bg-stone-900/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 font-display text-center">
            Popular Topics
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: "PDA vs BPC-157", href: "/blog/pentadeca-arginate-vs-bpc-157" },
              { label: "Dosing Protocols", href: "/blog/pentadeca-arginate-dosing-guide" },
              { label: "Gut Health", href: "/blog/pentadeca-arginate-gut-health" },
              { label: "Joint & Tendon Repair", href: "/blog/pentadeca-arginate-joint-pain-tendon" },
              { label: "FDA & Legal Status", href: "/blog/pentadeca-arginate-legal-fda-status" },
              { label: "How to Get Started", href: "/blog/how-to-start-pentadeca-arginate-therapy" },
            ].map((topic) => (
              <Link
                key={topic.href}
                href={topic.href}
                className="card p-4 text-center hover:border-forest-700/50 transition-all hover:-translate-y-0.5 group"
              >
                <span className="text-stone-300 group-hover:text-forest-200 transition-colors text-sm font-medium">
                  {topic.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
      <Footer />
    </>
  );
}
