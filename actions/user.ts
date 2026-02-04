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

    try {
        const email = user.emailAddresses[0].emailAddress;

        const subscriptions = await dodo.subscriptions.list({
             // limit: 100,
        });

        const items = (subscriptions as any).items || (Array.isArray(subscriptions) ? subscriptions : []);
        
        let activeSub = null;
        for (const sub of items) {
             if (sub.status === 'active' && (sub.customer?.email === email)) {
                 activeSub = sub;
                 break;
             }
        }

        if (activeSub) {
             
             await prisma.user.update({
                where: { clerkId: user.id },
                data: { 
                    subscriptionPlan: "PRO", 
                    subscriptionStatus: "active"
                }
            });
            return { success: true, plan: "PRO" };
        }
        
        return { success: false, error: "No active subscription found" };

    } catch (e) {
        console.error("Dodo Sync Error:", e);
        return { success: false, error: "Sync failed" };
    }
}

export { checkUser, getUserData, getUserUsageStats, upgradeSubscription, syncDodoSubscription };


