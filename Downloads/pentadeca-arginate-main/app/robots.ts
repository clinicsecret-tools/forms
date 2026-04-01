import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: [],
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: [],
      },
      {
        userAgent: "GoogleOther",
        allow: "/",
        disallow: [],
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: [],
      },
    ],
    sitemap: "https://pentadecaarginate.com/sitemap.xml",
    host: "https://pentadecaarginate.com",
  };
}
