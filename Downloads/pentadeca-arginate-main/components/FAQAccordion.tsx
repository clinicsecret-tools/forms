"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function FAQAccordion({ faqs }: { faqs: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className={`card overflow-hidden transition-all duration-200 ${
            openIndex === index ? "border-forest-700/50" : "hover:border-stone-700"
          }`}
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full text-left p-5 flex items-start justify-between gap-4 group"
            aria-expanded={openIndex === index}
          >
            <h3 className="text-white font-semibold group-hover:text-forest-200 transition-colors pr-2">
              {faq.question}
            </h3>
            <div
              className={`shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-200 ${
                openIndex === index
                  ? "border-forest-500 bg-forest-900 rotate-180"
                  : "border-stone-700 bg-stone-800"
              }`}
            >
              <svg
                className={`w-3 h-3 ${openIndex === index ? "text-forest-300" : "text-stone-500"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {openIndex === index && (
            <div className="px-5 pb-5">
              <div className="border-t border-stone-800 pt-4">
                <p className="text-stone-300 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
