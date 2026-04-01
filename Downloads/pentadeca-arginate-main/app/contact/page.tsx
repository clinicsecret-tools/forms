import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Contact Us — PentaDecaArginate.com",
  description: "Contact the PentaDecaArginate.com team with questions, corrections, or partnership inquiries.",
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-stone-950 pt-14 pb-16 px-4 border-b border-stone-800/40">
        <div className="max-w-2xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-stone-500 mb-6">
            <Link href="/" className="hover:text-stone-300 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-stone-300">Contact</span>
          </nav>
          <h1 className="text-4xl font-bold text-white mb-5 font-display">Contact Us</h1>
          <p className="text-stone-300 text-lg">
            Questions, feedback, corrections, or partnership inquiries — we'd love to hear from you.
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          {[
            { icon: "✏️", title: "Editorial", desc: "Article corrections, research citations, or content feedback.", email: "editorial@pentadecaarginate.com" },
            { icon: "🤝", title: "Partnerships", desc: "Provider listings, affiliate programs, and sponsorships.", email: "partnerships@pentadecaarginate.com" },
          ].map((item) => (
            <div key={item.title} className="card p-6">
              <div className="text-2xl mb-3">{item.icon}</div>
              <h3 className="text-white font-bold mb-2">{item.title}</h3>
              <p className="text-stone-400 text-sm mb-3">{item.desc}</p>
              <a href={`mailto:${item.email}`} className="text-forest-400 hover:text-forest-300 text-sm transition-colors break-all">
                {item.email}
              </a>
            </div>
          ))}
        </div>

        <div className="card p-8">
          <h2 className="text-xl font-bold text-white mb-6 font-display">Send a Message</h2>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-400 text-sm mb-2">Name</label>
                <input type="text" className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-forest-600" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-stone-400 text-sm mb-2">Email</label>
                <input type="email" className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-forest-600" placeholder="your@email.com" />
              </div>
            </div>
            <div>
              <label className="block text-stone-400 text-sm mb-2">Message</label>
              <textarea rows={5} className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-forest-600 resize-none" placeholder="Your message..." />
            </div>
            <button className="btn-primary w-full justify-center">Send Message</button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
