import { currentUser } from "@clerk/nextjs/server";
import prisma from "./prisma";

export async function getUserUsageStats() {
  const user = await currentUser();

  if (!user) {
    return null;
  }


  const dbUser = await prisma.user.findFirst({
    where: {
      clerkId: user.id,
    },
    include: {
      websites: {
        include: {
          websitePageViews: true,
        },
      },
    },
  });

  if (!dbUser) {
    return null;
  }

  // Count websites
  const websiteCount = dbUser.websites.length;

  // Count total page views across all websites
  const pageViewCount = dbUser.websites.reduce(
    (total, website) => total + website.websitePageViews.length,
    0
  );

  return {
    plan: dbUser.subscriptionPlan,
    websiteCount,
    pageViewCount,
  };
}
