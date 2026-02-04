"use client";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

export default function PricingPage() {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState<string | null>(null);

  const plans = [
    {
      name: "Hobby",
      price: "Free",
      period: "",
      description: "Always free. Perfect for side projects.",
      features: [
        "Up to 3,000 page views/mo",
        "1 Website",
        "24-hour data retention",
        "Basic analytics",
        "Community Support"
      ],
      buttonText: "Get Started",
      popular: false,
    },
    {
      name: "PRO",
      price: "$14",
      period: "/month",
      description: "For creators and growing startups.",
      features: [
        "Up to 100,000 page views/mo",
        "10 Websites",
        "1-year data retention",
        "Advanced filtering & events",
        "Priority Email Support"
      ],
      buttonText: "Upgrade to PRO",
      popular: true,
      checkoutUrl: "https://test.checkout.dodopayments.com/buy/pdt_0NXmG0XvHnpZuaIo8zvT4?quantity=1",
    },
    {
      name: "Business",
      price: "$49",
      period: "/month",
      description: "For agencies and larger teams.",
      features: [
        "Unlimited page views",
        "Unlimited Websites",
        "Unlimited retention",
        "Custom reports & API access",
        "Dedicated Account Manager"
      ],
      buttonText: "Upgrade to Business",
      popular: false,
      checkoutUrl: "https://test.checkout.dodopayments.com/buy/pdt_0NXmG95HyNf2UGtiXdkWe?quantity=1",
    }
  ];

  const handlePlanClick = async (plan: typeof plans[0] & { checkoutUrl?: string }) => {
    if (plan.name === "Hobby") {
      router.push("/dashboard");
      return;
    }

    if (!user) {
        toast.error("Please login first");
        return;
    }
    
    setLoading(plan.name);
    try {
      if (plan.checkoutUrl) {
          const targetUrl = new URL(plan.checkoutUrl);
          targetUrl.searchParams.append("metadata[userId]", user.id);

          targetUrl.searchParams.append("email", user.emailAddresses[0].emailAddress);
          
          window.location.href = targetUrl.toString();
          return;
      }
      

      toast.error("Checkout configuration missing.");
      
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to start payment.");
    } finally {
      setTimeout(() => setLoading(null), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50/50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your needs. No hidden fees, no credit card required to start.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.name}
              className={`relative flex flex-col p-8 bg-card rounded-2xl border ${
                plan.popular 
                  ? "border-primary shadow-2xl scale-105 z-10" 
                  : "border-border shadow-sm hover:shadow-md transition-shadow"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-muted-foreground text-sm">{plan.description}</p>
              </div>

              <div className="flex-1 space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                onClick={() => handlePlanClick(plan)}
                variant={plan.popular ? "default" : "outline"}
                disabled={loading !== null}
                className={`w-full ${plan.popular ? "bg-primary hover:bg-primary/90" : ""}`}
              >
                {loading === plan.name ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </div>
                ) : (
                  plan.buttonText
                )}
              </Button>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}