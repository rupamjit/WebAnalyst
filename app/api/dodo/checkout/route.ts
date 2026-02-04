import { dodo } from "@/lib/dodo";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const email = user.emailAddresses[0].emailAddress;
    const name = `${user.firstName} ${user.lastName}`.trim();

    const payment = await dodo.payments.create({
      product_cart: [{
          product_id: productId,
          quantity: 1
      }],
      billing: {
        city: "Mumbai",
        country: "IN",
        state: "MH",
        zipcode: "400001",
        street: "Main St",
      },
      customer: {
        email: email,
        name: name,
      },
      metadata: {
          userId: user.id
      },
      payment_link: true, 
    } as any);

    return NextResponse.json({ url: payment.payment_link }); 

  } catch (error: any) {
    console.error("Dodo Checkout Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
