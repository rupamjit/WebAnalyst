import { getUserUsageStats } from "@/actions/user";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Package } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BillingSuccess } from "@/components/BillingSuccess";
import { SyncSubscriptionButton } from "@/components/SyncSubscriptionButton";


export default async function BillingPage() {
  const stats = await getUserUsageStats();
  
  if (!stats) {
    redirect("/");
  }

  const { plan, websiteCount, pageViewCount } = stats;

  const plans = [
    {
      name: "Hobby",
      price: "Free",
      features: ["3,000 page views/mo", "1 Website", "Basic Analytics"],
      key: "Hobby",
      limits: { views: 3000, websites: 1 }
    },
    {
      name: "PRO",
      price: "$14/mo",
      features: ["100,000 page views/mo", "10 Websites", "Advanced Filtering"],
      key: "PRO",
      limits: { views: 100000, websites: 10 }
    },
    {
      name: "Business",
      price: "$49/mo",
      features: ["Unlimited Views", "Unlimited Websites", "API Access"],
      key: "Business",
      limits: { views: Infinity, websites: Infinity }
    }
  ];

  const currentPlan = plans.find(p => p.key === plan) || plans[0];

  // Calculate usage percentages
  const viewLimit = currentPlan.limits.views;
  const viewPercentage = viewLimit === Infinity ? 0 : Math.min((pageViewCount / viewLimit) * 100, 100);
  
  const websiteLimit = currentPlan.limits.websites;
  const websitePercentage = websiteLimit === Infinity ? 0 : Math.min((websiteCount / websiteLimit) * 100, 100);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <BillingSuccess />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing & Plans</h1>
          <p className="text-muted-foreground mt-2">Manage your subscription and billing details.</p>
        </div>
        <SyncSubscriptionButton />
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>You are currently subscribed to the <span className="font-semibold text-primary">{currentPlan.name}</span> plan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-lg">{currentPlan.name}</span>
                    <Badge variant="secondary" className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{currentPlan.price}</p>
                </div>
                <div className="text-right">
                   {/* Placeholder for billing cycle - in a real app this would come from Stripe subscription object */}
                   <p className="text-sm font-medium">Renews</p>
                   <p className="text-sm text-muted-foreground">Monthly</p>
                </div>
              </div>

               <div className="space-y-2">
                  <h4 className="text-sm font-medium">Included Features</h4>
                  <ul className="grid gap-2 text-sm text-muted-foreground">
                    {currentPlan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
               </div>

               <div className="flex gap-4">
                 <Link href="/pricing">
                   <Button variant="outline">Change Plan</Button>
                 </Link>
               </div>
            </CardContent>
          </Card>

          {currentPlan.name !== "Hobby" && (
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>View your recent transactions.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="flex items-center justify-between p-4 border-b bg-muted/30 text-sm font-medium">
                  <div>Date</div>
                  <div>Amount</div>
                  <div>Status</div>
                  <div>Invoice</div>
                </div>
                {/* Mock Billing History only if PRO/Business */}
                <div className="p-8 text-center text-muted-foreground text-sm">
                   No invoices found.
                </div>
              </div>
            </CardContent>
          </Card>
          )}
        </div>

        <div className="space-y-6">
           <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="h-5 w-5 text-primary" />
                  Usage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="space-y-2">
                   <div className="flex justify-between text-sm">
                     <span>Page Views</span>
                     <span className="font-medium text-muted-foreground">
                       {pageViewCount.toLocaleString()} / {viewLimit === Infinity ? "Unlimited" : viewLimit.toLocaleString()}
                     </span>
                   </div>
                   <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                     <div 
                        className="h-full bg-primary" 
                        style={{ width: `${viewPercentage}%` }}
                     />
                   </div>
                 </div>
                 <div className="space-y-2">
                   <div className="flex justify-between text-sm">
                     <span>Websites</span>
                     <span className="font-medium text-muted-foreground">
                       {websiteCount} / {websiteLimit === Infinity ? "Unlimited" : websiteLimit}
                     </span>
                   </div>
                   <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                     <div 
                        className="h-full bg-primary" 
                        style={{ width: `${websitePercentage}%` }}
                     />
                   </div>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
