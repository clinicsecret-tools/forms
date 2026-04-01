import Link from "next/link";

interface Provider {
  name: string;
  slug: string;
  rating: number;
  price: string;
  badge?: string;
  features: string[];
  cta: string;
}

export default function ComparisonTable({ providers }: { providers: Provider[] }) {
  const features = [
    "Online consultation",
    "Home delivery",
    "No insurance required",
    "Licensed physicians",
    "Ongoing support",
  ];

  return (
    <div className="overflow-x-auto rounded-xl border border-stone-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-stone-900 border-b border-stone-800">
            <th className="text-left p-4 text-stone-400 font-medium w-1/4">Feature</th>
            {providers.map((p) => (
              <th key={p.slug} className="p-4 text-center">
                <div>
                  <p className="text-white font-bold">{p.name}</p>
                  <p className="text-forest-300 text-xs font-normal mt-0.5">{p.price}</p>
                  {p.badge && (
                    <span className="inline-block mt-1 text-xs bg-forest-900 text-forest-300 border border-forest-700 px-2 py-0.5 rounded-full">
                      {p.badge}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-stone-800 bg-stone-950/50">
            <td className="p-4 text-stone-400">Rating</td>
            {providers.map((p) => (
              <td key={p.slug} className="p-4 text-center text-gold-400 font-bold">
                ⭐ {p.rating}
              </td>
            ))}
          </tr>
          {features.map((feature, i) => (
            <tr
              key={feature}
              className={`border-b border-stone-800/50 ${i % 2 === 0 ? "bg-stone-950/30" : ""}`}
            >
              <td className="p-4 text-stone-400">{feature}</td>
              {providers.map((p) => (
                <td key={p.slug} className="p-4 text-center">
                  {p.features.includes(feature) ? (
                    <svg className="w-4 h-4 text-forest-400 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-stone-700 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <td className="p-4 text-stone-400 font-medium">Action</td>
            {providers.map((p, i) => (
              <td key={p.slug} className="p-4 text-center">
                <a
                  href={p.cta}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    i === 0
                      ? "bg-gold-500 hover:bg-gold-400 text-stone-950"
                      : "bg-stone-800 hover:bg-stone-700 text-white"
                  }`}
                >
                  Select →
                </a>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
