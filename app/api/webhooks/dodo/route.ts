import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.DODO_PAYMENTS_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("DODO_PAYMENTS_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook secret missing" }, { status: 500 });
  }

  // Verify Payload matches Svix Header
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  // Get raw body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: any;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 400 });
  }

  const eventType = evt.type;
  console.log(`Dodo Webhook received: ${eventType}`);

  // Product ID to Plan mapping
  const PRODUCT_PLANS: Record<string, string> = {
    "pdt_0NXmG0XvHnpZuaIo8zvT4": "PRO",
    "pdt_0NXmG95HyNf2UGtiXdkWe": "Business",
  };

  try {
      const data = evt.data;
      
      // Extract userId from various possible locations in webhook payload
      const userId = data.metadata?.userId || 
                     data.customer?.metadata?.userId || 
                     data.subscription?.metadata?.userId ||
                     data.payload?.metadata?.userId; 

      // Extract product_id to determine the plan
      const productId = data.product_id || 
                        data.subscription?.product_id ||
                        data.payload?.product_id ||
                        data.product_cart?.[0]?.product_id;

      if (userId) {
        if (eventType === "subscription.active" || eventType === "payment.succeeded") {
            // Determine the plan based on the product_id
            const plan = productId ? (PRODUCT_PLANS[productId] || "PRO") : "PRO";
            
            console.log(`Activating subscription for user: ${userId}, Plan: ${plan}, Product: ${productId}`);
            
            await prisma.user.update({
                where: { clerkId: userId },
                data: {
                    subscriptionPlan: plan, 
                    subscriptionStatus: "active"
                }
            });
        }
        
        if (eventType === "subscription.cancelled" || eventType === "payment.failed") {
             console.log(`Deactivating subscription for user: ${userId}`);
             await prisma.user.update({
                where: { clerkId: userId },
                data: {
                    subscriptionPlan: "Hobby", 
                    subscriptionStatus: "inactive"
                }
            });
        }
      } else {
          console.log("No User ID found in webhook metadata. Data:", JSON.stringify(data, null, 2));
      }
  } catch (dbError) {
      console.error("Database error processing webhook:", dbError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
