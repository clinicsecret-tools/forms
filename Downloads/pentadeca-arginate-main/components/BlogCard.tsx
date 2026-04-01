import Link from "next/link";

interface BlogPost {
  title: string;
  slug: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  summary: string;
}

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="card p-6 group hover:border-stone-700 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-stone-950/50">
      <div className="flex items-center gap-2 mb-3">
        <span className="badge-green">{post.category}</span>
        <span className="text-stone-600 text-xs">·</span>
        <span className="text-stone-500 text-xs">{post.readTime} read</span>
      </div>

      <h2 className="text-white font-bold text-lg mb-2 group-hover:text-forest-200 transition-colors font-display leading-snug">
        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
      </h2>

      <p className="text-stone-400 text-sm mb-4 line-clamp-3 leading-relaxed">{post.summary}</p>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-stone-400 text-xs font-medium">{post.author}</p>
          <p className="text-stone-600 text-xs">{new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
        </div>
        <Link
          href={`/blog/${post.slug}`}
          className="text-forest-400 hover:text-forest-300 text-sm font-medium transition-colors flex items-center gap-1"
        >
          Read more
          <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
