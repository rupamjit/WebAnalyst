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
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    const payment = await dodo.payments.create({
      product_cart: [{ product_id: productId, quantity: 1 }],
      customer: {
        email: user.emailAddresses[0].emailAddress,
        name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
      },
      billing: {
        city: "",
        country: "IN",
        state: "",
        street: "",
        zipcode: "",
      },
      metadata: { userId: user.id },
      payment_link: true,
    });

    return NextResponse.json({ url: payment.payment_link });
  } catch (error: any) {
    console.error("Dodo Checkout Error:", error);
    return NextResponse.json(
      { error: error.message || "Checkout failed" },
      { status: 500 }
    );
  }
}
