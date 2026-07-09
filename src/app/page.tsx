'use client';

import { HeroSection, FeaturesSection, BenefitsSection, CTASection } from '@/components/landing';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <FeaturesSection />
      <BenefitsSection />
      <CTASection />
    </main>
  );
}