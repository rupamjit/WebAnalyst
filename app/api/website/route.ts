import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
    const { getPlanLimits } = await import("@/lib/plans");

export const POST = async (req: NextRequest) => {
  try {
    const user = await currentUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const userId = user.id;

    const { websiteId, domain, timezone, enableLocalTracking } =
      await req.json();

    if (
      !websiteId ||
      !domain ||
      !timezone ||
      typeof enableLocalTracking !== "boolean"
    ) {
      return new Response("Bad Request", { status: 400 });
    }

    const findUser = await prisma.user.findFirst({
      where: {
        clerkId: userId,
      },
    });

    console.log(findUser);

    if (!findUser) {
      return new Response("Unauthorized", { status: 401 });
    }


    const findWebsite = await prisma.website.findFirst({
      where: {
        domain,
        userId: findUser.id,
      },
    });

    if (findWebsite) {
      return new Response("Website already exists", { status: 400 });
    }

    const limits = getPlanLimits(findUser.subscriptionPlan);
    
  
    const currentWebsiteCount = await prisma.website.count({
        where: { userId: findUser.id }
    });

    if (currentWebsiteCount >= limits.websites) {
         return new Response(
             JSON.stringify({ 
                 error: `Plan limit reached. Upgrade to add more websites. Limit: ${limits.websites}` 
             }), 
             { status: 403, headers: { 'Content-Type': 'application/json' } }
         );
    }

    const website = await prisma.website.create({
      data: {
        websiteId,
        domain,
        timezone,
        enableLocalTracking,
        userId: findUser.id,
      },
    });

    return new Response(JSON.stringify(website), { status: 201 });
  } catch (error) {
    console.log(error);
    return new Response("Internal Server Error", { status: 500 });
  }
};

export const GET = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }


    const findUser = await prisma.user.findFirst({
      where: {
        clerkId: user.id,
      },
    });

    if (!findUser) {
      return new Response("Unauthorized", { status: 401 });
    }

    const allWebsite = await prisma.website.findMany({
      where: {
        userId: findUser.id,
      },
    });


    return new Response(JSON.stringify(allWebsite), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Internal Server Error", { status: 500 });
  }
};

