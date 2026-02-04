"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { syncDodoSubscription } from "@/actions/user";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function SyncSubscriptionButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSync = async () => {
    setLoading(true);
    try {
      toast.message("Checking subscription status...");
      const result = await syncDodoSubscription();
      
      if (result.success) {
        toast.success(`Subscription verified: ${result.plan || 'Active'}`);
        router.refresh();
      } else {
        toast.error("Could not find active subscription.");
      }
    } catch (error) {
      toast.error("Sync failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleSync} 
      disabled={loading}
    >
      <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
      Sync Subscription
    </Button>
  );
}
