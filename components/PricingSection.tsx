"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

export default function PricingSection() {
  const router = useRouter();
  const { user } = useUser();

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
        "Community Support",
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
        "Priority Email Support",
      ],
      buttonText: "Upgrade to PRO",
      popular: true,
      checkoutUrl: "https://test.checkout.dodopayments.com/buy/pdt_0NXmG0XvHnpZuaIo8zvT4?quantity=1&redirect_url=" + encodeURIComponent(typeof window !== "undefined" ? window.location.origin + "/dashboard/billing" : ""),
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
        "Dedicated Account Manager",
      ],
      buttonText: "Upgrade to Business",
      popular: false,
      checkoutUrl: "https://test.checkout.dodopayments.com/buy/pdt_0NXmG95HyNf2UGtiXdkWe?quantity=1&redirect_url=" + encodeURIComponent(typeof window !== "undefined" ? window.location.origin + "/dashboard/billing" : ""),
    },
  ];

  const handlePlanClick = (plan: { name: string; checkoutUrl?: string }) => {
    if (plan.name === "Hobby") {
      router.push("/dashboard");
      return;
    }

    if (!user) {
      toast.error("Please login first");
      return;
    }

    if (plan.checkoutUrl) {
      window.location.href = plan.checkoutUrl;
    }
  };

  return (
    <section className="py-24" id="pricing">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        {plans.map((plan) => (
          <div key={plan.name} className="p-8 border rounded-2xl">
            <h3 className="text-xl font-bold">{plan.name}</h3>
            <p className="text-4xl font-bold mt-2">
              {plan.price}
              <span className="text-sm text-muted-foreground">{plan.period}</span>
            </p>

            <ul className="mt-6 space-y-2">
              {plan.features.map((f: string) => (
                <li key={f} className="flex gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  {f}
                </li>
              ))}
            </ul>

            <Button
              className="w-full mt-6"
              onClick={() => handlePlanClick(plan)}
            >
              {plan.buttonText}
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
