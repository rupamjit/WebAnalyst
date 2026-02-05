import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const PRODUCT_TO_PLAN: Record<string, string> = {
  pdt_0NXmG0XvHnpZuaIo8zvT4: "PRO",
  pdt_0NXmG95HyNf2UGtiXdkWe: "Business",
};

interface WebhookEvent {
  type: string;
  data: {
    metadata?: { userId?: string };
    customer?: { metadata?: { userId?: string } };
    subscription?: { metadata?: { userId?: string }; product_id?: string };
    product_id?: string;
    product_cart?: Array<{ product_id?: string }>;
  };
}

export async function POST(req: Request) {
  const secret = process.env.DODO_PAYMENTS_WEBHOOK_SECRET;
  
  if (!secret) {
    console.error("DODO_PAYMENTS_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook secret missing" }, { status: 500 });
  }

  try {
    const payload = await req.json();
    const body = JSON.stringify(payload);

    const h = await headers();
    const svixId = h.get("svix-id");
    const svixTimestamp = h.get("svix-timestamp");
    const svixSignature = h.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
    }

    const wh = new Webhook(secret);
    const evt = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;

    const data = evt.data;

    const userId =
      data.metadata?.userId ||
      data.customer?.metadata?.userId ||
      data.subscription?.metadata?.userId;

    const productId =
      data.product_id ||
      data.subscription?.product_id ||
      data.product_cart?.[0]?.product_id;

    console.log(`Webhook received: ${evt.type}, userId: ${userId}, productId: ${productId}`);

    if (!userId) {
      console.log("Webhook missing userId");
      return NextResponse.json({ ok: true });
    }

    if (evt.type === "subscription.active" || evt.type === "payment.succeeded") {
      const plan = productId ? PRODUCT_TO_PLAN[productId] : undefined;
      
      if (plan) {
        await prisma.user.update({
          where: { clerkId: userId },
          data: {
            subscriptionPlan: plan,
            subscriptionStatus: "active",
          },
        });
        console.log(`Updated user ${userId} to plan: ${plan}`);
      } else {
        console.log(`Unknown productId: ${productId}, skipping plan update`);
      }
    }

    if (evt.type === "subscription.cancelled" || evt.type === "payment.failed") {
      await prisma.user.update({
        where: { clerkId: userId },
        data: {
          subscriptionPlan: "Hobby",
          subscriptionStatus: "inactive",
        },
      });
      console.log(`User ${userId} subscription cancelled, reverted to Hobby`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: error.message || "Webhook failed" }, { status: 400 });
  }
}
