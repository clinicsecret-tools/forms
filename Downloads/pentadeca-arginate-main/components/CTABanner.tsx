import { AFFILIATE } from "@/lib/affiliate";

interface CTABannerProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  variant?: "default" | "compact" | "inline";
}

export default function CTABanner({
  title = "Ready to Start Pentadeca Arginate Therapy?",
  subtitle = "Connect with a licensed physician online. No insurance required.",
  buttonText = "Start Your Consultation",
  variant = "default",
}: CTABannerProps) {
  if (variant === "compact") {
    return (
      <div className="bg-forest-900/40 border border-forest-700/30 rounded-xl p-6 my-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-white font-semibold">{title}</p>
          <p className="text-stone-400 text-sm mt-1">{subtitle}</p>
        </div>
        <a
          href={AFFILIATE.primary}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold shrink-0"
        >
          {buttonText} →
        </a>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className="bg-gradient-to-r from-forest-950 to-stone-900 border border-forest-800/40 rounded-lg p-5 my-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-stone-300 text-sm">
            <span className="text-forest-300 font-semibold">✓ Online consultation available</span>
            {" "}— Talk to a physician about PDA today.
          </p>
          <a
            href={AFFILIATE.primary}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-sm shrink-0"
          >
            Get Started →
          </a>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative overflow-hidden bg-gradient-to-br from-forest-900 to-stone-900 border border-forest-700/40 rounded-2xl p-10 text-center glow-green">
          {/* Background orbs */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-forest-500/10 rounded-full blur-3xl -translate-y-1/2" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-forest-600/10 rounded-full blur-3xl translate-y-1/2" />
          
          <div className="relative z-10">
            <div className="badge-green mb-4">Trusted Providers</div>
            <h2 className="section-title text-3xl md:text-4xl mb-4">{title}</h2>
            <p className="text-stone-300 text-lg mb-8 max-w-2xl mx-auto">{subtitle}</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href={AFFILIATE.primary}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold text-lg px-8 py-4"
              >
                {buttonText} →
              </a>
            </div>
            
            <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-stone-400">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-forest-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Online consultation
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-forest-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                No insurance required
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-forest-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Licensed physicians
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-forest-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Home delivery
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
