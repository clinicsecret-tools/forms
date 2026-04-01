import Link from "next/link";

interface Provider {
  name: string;
  slug: string;
  rating: number;
  reviewCount: number;
  price: string;
  badge?: string;
  features: string[];
  description: string;
  cta: string;
}

export default function ProviderCard({ provider, featured = false }: { provider: Provider; featured?: boolean }) {
  const stars = Math.round(provider.rating * 2) / 2;

  return (
    <div
      className={`relative card p-6 transition-all duration-300 hover:border-forest-700/60 hover:-translate-y-1 hover:shadow-xl hover:shadow-forest-950/50 ${
        featured ? "border-forest-600/40 ring-1 ring-forest-600/20" : ""
      }`}
    >
      {featured && (
        <div className="absolute -top-3 left-6">
          <span className="badge-gold text-xs">⭐ Top Rated</span>
        </div>
      )}

      {provider.badge && !featured && (
        <div className="absolute -top-3 left-6">
          <span className="badge-green text-xs">{provider.badge}</span>
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-white font-bold text-xl font-display">{provider.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <StarRating rating={stars} />
            <span className="text-gold-400 font-semibold text-sm">{provider.rating}</span>
            <span className="text-stone-500 text-sm">({provider.reviewCount} reviews)</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-forest-300 font-bold">{provider.price}</p>
          <p className="text-stone-500 text-xs">per month</p>
        </div>
      </div>

      <p className="text-stone-400 text-sm mb-4 line-clamp-2">{provider.description}</p>

      <ul className="space-y-1.5 mb-6">
        {provider.features.slice(0, 4).map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-sm text-stone-300">
            <svg className="w-3.5 h-3.5 text-forest-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      <div className="flex gap-3">
        <a
          href={provider.cta}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex-1 text-center py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
            featured
              ? "bg-gold-500 hover:bg-gold-400 text-stone-950"
              : "bg-forest-600 hover:bg-forest-500 text-white"
          }`}
        >
          Start Consultation →
        </a>
        <Link
          href={`/providers/${provider.slug}`}
          className="px-4 py-2.5 border border-stone-700 hover:border-stone-600 text-stone-400 hover:text-white rounded-lg text-sm font-medium transition-all duration-200"
        >
          Review
        </Link>
      </div>
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${star <= rating ? "text-gold-400" : star - 0.5 <= rating ? "text-gold-400" : "text-stone-700"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}
