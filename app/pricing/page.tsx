"use client";

import Navbar from "@/components/Navbar";
import PricingSection from "@/components/PricingSection";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-neutral-50/50">
      <Navbar />
      <main>
        <PricingSection />
      </main>
    </div>
  )
}