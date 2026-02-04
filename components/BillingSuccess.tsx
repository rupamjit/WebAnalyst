"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { syncDodoSubscription } from "@/actions/user";
import { useRouter, useSearchParams } from "next/navigation";

export function BillingSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get("success");

  useEffect(() => {
    if (success === "true") {
      const syncStatus = async () => {
        toast.message("Verifying subscription...");
        const result = await syncDodoSubscription();
        if (result.success) {
          toast.success("Subscription activated! Welcome to PRO.");
          router.replace("/dashboard/billing"); 
          router.refresh(); 
        } else {
          toast.error("Could not verify subscription automatically. Please contact support.");
        }
      };
      
      syncStatus();
    }
  }, [success, router]);

  return null;
}
