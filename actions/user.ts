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


        const subscriptions = await dodo.subscriptions.list({});
        console.log("Dodo subscriptions response:", JSON.stringify(subscriptions, null, 2));

        // Handle different response formats
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
        
        
        
        let activeSub = null;
        for (const sub of items) {
            console.log("Checking subscription:", {
                id: sub.subscription_id || sub.id,
                status: sub.status,
                customerEmail: sub.customer?.email,
                productId: sub.product_id || sub.productId
            });
            
            
            if (sub.status === 'active' && sub.customer?.email === email) {
                activeSub = sub;
                break;
            }
        }

        if (activeSub) {
            const productId = activeSub.product_id || activeSub.productId;
            const plan = PRODUCT_PLANS[productId] || "PRO";
            
           
             
            await prisma.user.update({
                where: { clerkId: user.id },
                data: { 
                    subscriptionPlan: plan, 
                    subscriptionStatus: "active"
                }
            });
            return { success: true, plan };
        }
        
      
        return { success: false, error: "No active subscription found" };

    } catch (e) {
        console.error("Dodo Sync Error:", e);
        return { success: false, error: "Sync failed" };
    }
}

export { checkUser, getUserData, getUserUsageStats, upgradeSubscription, syncDodoSubscription };


