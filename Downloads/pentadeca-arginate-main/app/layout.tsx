import type { Metadata } from "next";
import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/playfair-display/900.css";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import "@fontsource/dm-sans/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/700.css";
import "./globals.css";
import Navbar from "@/components/Navbar";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import DisclaimerBar from "@/components/DisclaimerBar";

export const metadata: Metadata = {
  metadataBase: new URL("https://pentadecaarginate.com"),
  title: {
    default: "Pentadeca Arginate — The Complete Guide | PentaDecaArginate.com",
    template: "%s | PentaDecaArginate.com",
  },
  description:
    "Pentadeca Arginate (PDA) is a stabilized BPC-157 analog used for tissue repair, inflammation reduction, and healing. Compare top providers, read the latest research, and start treatment today.",
  keywords: [
    "pentadeca arginate",
    "PDA peptide",
    "BPC-157 alternative",
    "peptide therapy",
    "compounded peptides",
    "tissue repair peptide",
    "anti-inflammatory peptide",
  ],
  openGraph: {
    type: "website",
    siteName: "PentaDecaArginate.com",
    title: "Pentadeca Arginate — The Complete Guide",
    description:
      "Your trusted resource for Pentadeca Arginate information, provider comparisons, and treatment guidance.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pentadeca Arginate — The Complete Guide",
    description: "Compare top PDA providers, read research, and start treatment.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1 },
  },
  alternates: {
    canonical: "https://pentadecaarginate.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-stone-950">
        <DisclaimerBar />
        <Navbar />
        <main>{children}</main>
        <StickyMobileCTA />
      </body>
    </html>
  );
}
