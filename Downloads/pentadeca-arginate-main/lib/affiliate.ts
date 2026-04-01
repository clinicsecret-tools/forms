export const AFFILIATE = {
  primary: "https://ExploreTreatments.com/Clinicsecret",
  providers: {
    "clinic-secret": "https://ExploreTreatments.com/Clinicsecret",
    "defy-medical": "https://ExploreTreatments.com/Clinicsecret",
    "peptide-sciences": "https://ExploreTreatments.com/Clinicsecret",
  },
} as const;

export function getProviderCTA(slug: string): string {
  return AFFILIATE.providers[slug as keyof typeof AFFILIATE.providers] ?? AFFILIATE.primary;
}

export function trackClick(provider: string, page: string) {
  // Analytics tracking placeholder
  if (typeof window !== "undefined") {
    console.log(`[Affiliate Click] Provider: ${provider}, Page: ${page}`);
  }
}
