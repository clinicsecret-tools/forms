"use client";

import Link from "next/link";
import { useState } from "react";
import { AFFILIATE } from "@/lib/affiliate";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-stone-950/95 backdrop-blur-md border-b border-stone-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-forest-600 flex items-center justify-center group-hover:bg-forest-500 transition-colors">
              <span className="text-white text-xs font-bold font-mono">PDA</span>
            </div>
            <span className="font-display font-bold text-white text-lg hidden sm:block">
              PentaDecaArginate<span className="text-forest-400">.com</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink href="/arginate">What is PDA?</NavLink>
            <NavLink href="/providers">Providers</NavLink>
            <NavLink href="/blog">Blog</NavLink>
            <NavLink href="/about">About</NavLink>
          </div>

          {/* CTA + Mobile */}
          <div className="flex items-center gap-3">
            <a
              href={AFFILIATE.primary}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 bg-forest-600 hover:bg-forest-500 text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-forest-500/20"
            >
              Start Treatment →
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-stone-400 hover:text-white p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-stone-800 bg-stone-950/98">
          <div className="px-4 py-4 space-y-2">
            <MobileNavLink href="/arginate" onClick={() => setIsOpen(false)}>What is PDA?</MobileNavLink>
            <MobileNavLink href="/providers" onClick={() => setIsOpen(false)}>Compare Providers</MobileNavLink>
            <MobileNavLink href="/blog" onClick={() => setIsOpen(false)}>Blog</MobileNavLink>
            <MobileNavLink href="/about" onClick={() => setIsOpen(false)}>About</MobileNavLink>
            <a
              href={AFFILIATE.primary}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center px-4 py-3 bg-forest-600 hover:bg-forest-500 text-white font-semibold rounded-lg transition-colors mt-3"
            >
              Start Treatment →
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 py-2 text-stone-400 hover:text-white text-sm font-medium rounded-lg hover:bg-stone-800/50 transition-all duration-150"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-3 py-2.5 text-stone-300 hover:text-white font-medium rounded-lg hover:bg-stone-800 transition-colors"
    >
      {children}
    </Link>
  );
}
