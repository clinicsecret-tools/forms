import { NextResponse } from "next/server";
import blogPosts from "@/data/blog.json";

export const dynamic = "force-static";

export async function GET() {
  const data = blogPosts.map((post) => ({
    title: post.title,
    slug: post.slug,
    url: `https://pentadecaarginate.com/blog/${post.slug}`,
    date: post.date,
    author: post.author,
    category: post.category,
    read_time: post.readTime,
    keywords: post.keywords,
    summary: post.summary,
    related_entities: post.related_entities,
  }));

  return NextResponse.json(
    {
      count: data.length,
      updated: "2025-01-15",
      articles: data,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=3600",
      },
    }
  );
}
