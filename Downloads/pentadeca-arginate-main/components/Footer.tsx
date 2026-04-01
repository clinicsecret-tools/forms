import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-stone-950 border-t border-stone-800/60 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-forest-600 flex items-center justify-center">
                <span className="text-white text-xs font-bold font-mono">PDA</span>
              </div>
              <span className="font-display font-bold text-white text-lg">
                PentaDecaArginate<span className="text-forest-400">.com</span>
              </span>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed max-w-sm">
              Your trusted resource for Pentadeca Arginate research, provider comparisons, and treatment guidance. Always consult a licensed physician before starting any peptide therapy.
            </p>
            <div className="mt-4 p-3 bg-amber-950/40 border border-amber-800/30 rounded-lg">
              <p className="text-amber-200/70 text-xs">
                ⚕️ This website contains affiliate links. We may earn a commission when you click through and purchase. This does not affect our editorial independence.
              </p>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2.5">
              {[
                { href: "/arginate", label: "What is PDA?" },
                { href: "/providers", label: "Compare Providers" },
                { href: "/blog", label: "Research & Guides" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-stone-400 hover:text-forest-300 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2.5">
              {[
                { href: "/privacy-policy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Use" },
                { href: "/api/webmcp", label: "WEBMCP API" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-stone-400 hover:text-forest-300 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800/60 pt-8">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <p className="text-stone-600 text-xs">
              © {new Date().getFullYear()} PentaDecaArginate.com. All rights reserved.
            </p>
            <p className="text-stone-600 text-xs max-w-xl text-right">
              This content is for informational purposes only and does not constitute medical advice. Compounded peptides are not FDA-approved drugs. Consult a licensed healthcare provider.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
