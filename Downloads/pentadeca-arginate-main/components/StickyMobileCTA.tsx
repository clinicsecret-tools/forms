"use client";

import { AFFILIATE } from "@/lib/affiliate";

export default function StickyMobileCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden p-3 bg-stone-950/95 backdrop-blur-md border-t border-stone-800">
      <a
        href={AFFILIATE.primary}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-3.5 bg-forest-600 hover:bg-forest-500 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-forest-900/50"
      >
        <span>Start PDA Treatment</span>
        <span className="text-forest-200">→</span>
      </a>
      <p className="text-center text-stone-600 text-xs mt-1.5">Online consultation · No insurance required</p>
    </div>
  );
}
