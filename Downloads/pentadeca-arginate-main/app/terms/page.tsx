import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Use — PentaDecaArginate.com",
  description: "Terms of use for PentaDecaArginate.com",
};

export default function TermsPage() {
  return (
    <>
      <section className="bg-stone-950 pt-14 pb-12 px-4 border-b border-stone-800/40">
        <div className="max-w-3xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-stone-500 mb-6">
            <Link href="/" className="hover:text-stone-300 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-stone-300">Terms of Use</span>
          </nav>
          <h1 className="text-4xl font-bold text-white mb-4 font-display">Terms of Use</h1>
          <p className="text-stone-400 text-sm">Last updated: January 2025</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-16 prose-dark">
        <h2>Acceptance of Terms</h2>
        <p>By accessing PentaDecaArginate.com, you agree to these terms. If you do not agree, please do not use this site.</p>

        <h2>Informational Purpose Only</h2>
        <p>All content on this site is for informational and educational purposes only. Nothing on this site constitutes medical advice, diagnosis, or treatment. Always consult a licensed healthcare provider before making health decisions.</p>

        <h2>No Medical Relationship</h2>
        <p>Using this site does not create a physician-patient relationship. We are an informational resource, not a medical practice.</p>

        <h2>Affiliate Relationships</h2>
        <p>This site has commercial relationships with some providers listed. These relationships are disclosed. We may earn compensation when you click affiliate links. This compensation does not affect our editorial independence.</p>

        <h2>Accuracy</h2>
        <p>We strive to keep information accurate and current. However, medical information changes rapidly. Verify current information with your physician and the relevant regulatory bodies.</p>

        <h2>Compounded Medications Disclaimer</h2>
        <p>Compounded peptides discussed on this site are not FDA-approved drugs. Information about compounded medications is provided for educational purposes only. Regulations regarding compounded medications vary by jurisdiction and change over time.</p>

        <h2>Limitation of Liability</h2>
        <p>PentaDecaArginate.com and its operators are not liable for decisions made based on content found on this site. Use information at your own discretion and with appropriate medical supervision.</p>

        <h2>Intellectual Property</h2>
        <p>Content on this site is protected by copyright. You may share brief excerpts with attribution. Wholesale reproduction is prohibited without written permission.</p>

        <h2>Contact</h2>
        <p>Legal questions: <a href="mailto:legal@pentadecaarginate.com" className="text-forest-400 hover:text-forest-300">legal@pentadecaarginate.com</a></p>
      </div>

      <Footer />
    </>
  );
}
