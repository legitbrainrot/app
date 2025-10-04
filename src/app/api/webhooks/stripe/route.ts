import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { getTradeRequestById, updateTradeRequest, getServerById } from "@/lib/mock-data";
import { sendMiddlemanNotification } from "@/lib/email";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const tradeRequestId = session.metadata?.tradeRequestId;

      if (!tradeRequestId) {
        console.error("No tradeRequestId in session metadata");
        return NextResponse.json(
          { error: "Missing tradeRequestId" },
          { status: 400 }
        );
      }

      // Get the trade request from mock data
      const tradeRequest = getTradeRequestById(tradeRequestId);

      if (!tradeRequest) {
        console.error("Trade request not found:", tradeRequestId);
        return NextResponse.json(
          { error: "Trade request not found" },
          { status: 404 }
        );
      }

      // Get the server details
      const server = getServerById(tradeRequest.privateServerId);

      if (!server) {
        console.error("Server not found:", tradeRequest.privateServerId);
        return NextResponse.json(
          { error: "Server not found" },
          { status: 404 }
        );
      }

      // Update the trade request as paid
      updateTradeRequest(tradeRequestId, {
        isPaid: true,
        stripePaymentStatus: "completed",
      });

      // Send email notification to the middleman
      await sendMiddlemanNotification({
        middlemanEmail: server.middlemanEmail,
        serverName: server.name,
        buyerRobloxUsername: tradeRequest.buyerRobloxUsername,
        sellerRobloxUsername: tradeRequest.sellerRobloxUsername,
        tradeRequestId: tradeRequest.id,
      });

      console.log("Payment completed for trade request:", tradeRequestId);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
