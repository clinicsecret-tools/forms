import Link from "next/link";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-lg">
          <div className="w-16 h-16 rounded-2xl bg-forest-900 border border-forest-700/40 flex items-center justify-center mx-auto mb-6">
            <span className="text-forest-300 font-bold font-mono text-lg">404</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4 font-display">Page Not Found</h1>
          <p className="text-stone-400 mb-8">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="btn-primary">← Back to Home</Link>
            <Link href="/providers" className="btn-gold">Compare Providers</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
