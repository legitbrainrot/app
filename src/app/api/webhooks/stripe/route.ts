import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { sendMiddlemanNotification } from "@/lib/email";
import { getServerById } from "@/lib/mock-data";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET ?? "",
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const { serverId, buyerRobloxUsername, sellerRobloxUsername } =
        session.metadata || {};

      if (!serverId || !buyerRobloxUsername || !sellerRobloxUsername) {
        console.error("Missing metadata in session");
        return NextResponse.json(
          { error: "Missing metadata" },
          { status: 400 },
        );
      }

      // Get the server details
      const server = getServerById(serverId);

      if (!server) {
        console.error("Server not found:", serverId);
        return NextResponse.json(
          { error: "Server not found" },
          { status: 404 },
        );
      }

      // Send email notification to the middleman
      await sendMiddlemanNotification({
        middlemanEmail: server.middlemanEmail,
        serverName: server.name,
        buyerRobloxUsername,
        sellerRobloxUsername,
        tradeRequestId: session.id,
      });

      console.log("Payment completed for session:", session.id);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 },
    );
  }
}
