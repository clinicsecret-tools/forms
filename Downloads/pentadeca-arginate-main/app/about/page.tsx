import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About PentaDecaArginate.com — Our Mission & Editorial Standards",
  description: "Learn about our mission to provide accurate, physician-reviewed information on Pentadeca Arginate therapy. Our editorial process, team, and disclosure policies.",
  alternates: { canonical: "https://pentadecaarginate.com/about" },
};

export default function AboutPage() {
  return (
    <>
      <section className="bg-stone-950 pt-14 pb-16 px-4 border-b border-stone-800/40">
        <div className="max-w-3xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-stone-500 mb-6">
            <Link href="/" className="hover:text-stone-300 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-stone-300">About</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 font-display">
            About <span className="text-gradient">PentaDecaArginate.com</span>
          </h1>
          <p className="text-xl text-stone-300 leading-relaxed">
            We're a team of researchers, physicians, and health writers dedicated to making accurate peptide therapy information accessible, understandable, and actionable.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-16 prose-dark">
        <h2>Our Mission</h2>
        <p>
          Pentadeca Arginate is a rapidly emerging therapy with enormous potential — but navigating the landscape of providers, dosing information, and regulatory context is confusing. We built PentaDecaArginate.com to be the single most reliable, up-to-date resource on PDA therapy.
        </p>

        <h2>Editorial Standards</h2>
        <p>
          Every article on this site is reviewed by a licensed medical professional before publication. We cite peer-reviewed research and preclinical studies. We clearly distinguish between established evidence and emerging or anecdotal data.
        </p>
        <p>
          Our editorial team is independent from our commercial partnerships. Provider rankings are based on objective criteria including physician credentials, pharmacy licensing, pricing transparency, and verified patient feedback.
        </p>

        <h2>Affiliate Disclosure</h2>
        <p>
          PentaDecaArginate.com participates in affiliate programs. When you click a provider link and make a purchase, we may receive a commission at no additional cost to you. This does not influence our editorial rankings or recommendations. Our top-rated providers earn their position based on merit.
        </p>

        <h2>Medical Disclaimer</h2>
        <p>
          The content on this website is for informational purposes only. It is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Compounded peptides including Pentadeca Arginate are not FDA-approved drugs. Always consult a qualified healthcare provider before starting any new treatment.
        </p>

        <h2>Contact Us</h2>
        <p>
          Have a question, correction, or partnership inquiry?{" "}
          <Link href="/contact" className="text-forest-400 hover:text-forest-300 transition-colors">
            Reach out via our contact page
          </Link>.
        </p>
      </div>

      <Footer />
    </>
  );
}
