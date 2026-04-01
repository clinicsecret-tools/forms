import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — PentaDecaArginate.com",
  description: "Privacy policy for PentaDecaArginate.com covering data collection, cookies, and affiliate disclosures.",
};

export default function PrivacyPage() {
  return (
    <>
      <section className="bg-stone-950 pt-14 pb-12 px-4 border-b border-stone-800/40">
        <div className="max-w-3xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-stone-500 mb-6">
            <Link href="/" className="hover:text-stone-300 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-stone-300">Privacy Policy</span>
          </nav>
          <h1 className="text-4xl font-bold text-white mb-4 font-display">Privacy Policy</h1>
          <p className="text-stone-400 text-sm">Last updated: January 2025</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-16 prose-dark">
        <h2>Information We Collect</h2>
        <p>We collect information you provide directly (such as through contact forms) and information automatically collected through your use of our website, including IP addresses, browser type, and pages visited.</p>

        <h2>How We Use Information</h2>
        <p>We use collected information to improve site content, analyze traffic patterns, and respond to inquiries. We do not sell personal information to third parties.</p>

        <h2>Cookies</h2>
        <p>We use cookies for analytics and to remember user preferences. You can disable cookies in your browser settings, though this may affect site functionality.</p>

        <h2>Affiliate Links</h2>
        <p>This site contains affiliate links. When you click these links and make a purchase, we may receive a commission. Affiliate links are disclosed in our footer and content disclosures. Clicking affiliate links may place third-party cookies on your device.</p>

        <h2>Third-Party Analytics</h2>
        <p>We use Google Analytics to understand traffic patterns. Google's privacy policy governs data collected through this service. You may opt out via Google's opt-out browser add-on.</p>

        <h2>Medical Information</h2>
        <p>We do not collect sensitive health information. Content on this site is informational only. Do not submit personal health details through contact forms.</p>

        <h2>Contact</h2>
        <p>Privacy questions: <a href="mailto:privacy@pentadecaarginate.com" className="text-forest-400 hover:text-forest-300">privacy@pentadecaarginate.com</a></p>
      </div>

      <Footer />
    </>
  );
}
