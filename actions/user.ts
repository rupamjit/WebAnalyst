"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { dodo } from "@/lib/dodo";

const checkUser = async () => {
  const user = await currentUser();

  const existingUser = await prisma.user.findFirst({
    where: {
      clerkId: user?.id,
    },
  });

  if (existingUser) {
    return existingUser;
  }
  

  const newUser = await prisma.user.create({
    data: {
      clerkId: user?.id as string,
      email: user?.emailAddresses[0].emailAddress as string,
      userName: user?.firstName || undefined,
      imageUrl: user?.imageUrl || undefined,
      name: user?.firstName && user?.lastName 
        ? `${user?.firstName} ${user?.lastName}` 
        : user?.firstName || undefined,
    },
  });

  return newUser;
};

const getUserData = async () => {
    const user = await currentUser();
    if (!user) return null;
    
    return await prisma.user.findFirst({
        where: { clerkId: user.id }
    });
};

const getUserUsageStats = async () => {
  const user = await currentUser();
  if (!user) return null;

  const dbUser = await prisma.user.findFirst({
      where: { clerkId: user.id }
  });
  if (!dbUser) return null;

  const websiteCount = await prisma.website.count({
      where: { userId: dbUser.id }
  });

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const pageViewCount = await prisma.websitePageView.count({
      where: {
          website: { userId: dbUser.id },
          createdAt: { gte: startOfMonth }
      }
  });

  return {
      plan: dbUser.subscriptionPlan,
      websiteCount,
      pageViewCount
  };
};

const upgradeSubscription = async (plan: string) => {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    const updatedUser = await prisma.user.update({
        where: { clerkId: user.id },
        data: { 
            subscriptionPlan: plan,
            subscriptionStatus: "active"
        }
    });

    return { success: true };
};



const syncDodoSubscription = async () => {
    const user = await currentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const PRODUCT_PLANS: Record<string, string> = {
        "pdt_0NXmG0XvHnpZuaIo8zvT4": "PRO",
        "pdt_0NXmG95HyNf2UGtiXdkWe": "Business",
    };

    try {
        const email = user.emailAddresses[0].emailAddress;

        // Strategy 1: Check Payments (Best for different emails but matching Metadata)
        const paymentsResponse = await dodo.payments.list({
            page_size: 100,
        });
        
        // Handle payment list structure variations
        let payments: any[] = [];
        if (paymentsResponse && typeof paymentsResponse === 'object') {
             if ('items' in paymentsResponse && Array.isArray((paymentsResponse as any).items)) {
                payments = (paymentsResponse as any).items;
            } else if (Array.isArray(paymentsResponse)) {
                payments = paymentsResponse;
            } else if ('data' in paymentsResponse && Array.isArray((paymentsResponse as any).data)) {
                payments = (paymentsResponse as any).data;
            }
        }

        let matchedSubscriptionId: string | null = null;
        
        // Find payment with matching userId in metadata
        const matchedPayment = payments.find(p => {
            const meta = p.metadata as Record<string, any> | undefined;
            return meta?.userId === user.id && (p.subscription_id || p.subscriptionId);
        });

        if (matchedPayment) {
            matchedSubscriptionId = matchedPayment.subscription_id || matchedPayment.subscriptionId;
        }

        let activeSub: any = null;

        // If we found a subscription ID from the payment, fetch it directly
        if (matchedSubscriptionId) {
             try {
                const sub = await dodo.subscriptions.retrieve(matchedSubscriptionId);
                if (sub && sub.status === 'active') {
                    activeSub = sub;
                }
             } catch (err) {
                 console.error("Could not fetch specific subscription:", err);
             }
        }

        // Strategy 2: Fallback to listing Subscriptions (If no payment match or direct fetch failed)
        if (!activeSub) {
             const subscriptions = await dodo.subscriptions.list({
                page_size: 100,
            });

            let items: any[] = [];
            if (subscriptions && typeof subscriptions === 'object') {
                if ('items' in subscriptions && Array.isArray((subscriptions as any).items)) {
                    items = (subscriptions as any).items;
                } else if (Array.isArray(subscriptions)) {
                    items = subscriptions;
                } else if ('data' in subscriptions && Array.isArray((subscriptions as any).data)) {
                    items = (subscriptions as any).data;
                }
            }

            // Find valid subscription in the list
            for (const sub of items) {
                const subEmail = sub.customer?.email?.toLowerCase();
                const userEmail = email.toLowerCase();
                const metadata = sub.metadata as Record<string, any> | undefined;
                
                const matchesMetadata = metadata?.userId === user.id;
                const matchesEmail = subEmail?.toLowerCase() === userEmail?.toLowerCase();

                if (sub.status === 'active' && (matchesEmail || matchesMetadata)) {
                    activeSub = sub;
                    break;
                }
            }
        }

        if (activeSub) {
            const productId = activeSub.product_id || activeSub.productId;
            const plan = PRODUCT_PLANS[productId];
             
            if (plan) {
                await prisma.user.update({
                    where: { clerkId: user.id },
                    data: { 
                        subscriptionPlan: plan, 
                        subscriptionStatus: "active"
                    }
                });
                return { success: true, plan };
            }
        }
        
        // Default to Hobby if no active sub found
        await prisma.user.update({
            where: { clerkId: user.id },
            data: { 
                subscriptionPlan: "Hobby", 
                subscriptionStatus: "active"
            }
        });
        return { success: true, plan: "Hobby" };

    } catch (e) {
        console.error("Dodo Sync Error:", e);
        return { success: false, error: "Sync failed" };
    }
};



export { checkUser, getUserData, getUserUsageStats, upgradeSubscription, syncDodoSubscription };


