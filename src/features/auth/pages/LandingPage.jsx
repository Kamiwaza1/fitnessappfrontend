"use client";

import StarBackground from "@/features/auth/components/StarBackground";
import LandingHero from "@/features/auth/components/LandingHero";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <StarBackground />
      <main className="relative z-10">
        <LandingHero />
      </main>
    </div>
  );
}
