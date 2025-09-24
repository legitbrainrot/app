import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";
import { notificationService } from "@/lib/notifications";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed.`, err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 },
    );
  }

  try {
    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSuccess(paymentIntent);
        break;
      }
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailure(paymentIntent);
        break;
      }
      case "payment_intent.canceled": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentCancellation(paymentIntent);
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  console.log("Payment succeeded:", paymentIntent.id);

  // Update payment status
  const payment = await prisma.payment.findUnique({
    where: { stripePaymentIntentId: paymentIntent.id },
    include: { trade: true },
  });

  if (!payment) {
    console.error(`Payment not found for payment intent: ${paymentIntent.id}`);
    return;
  }

  await prisma.payment.update({
    where: { id: payment.id },
    data: { status: "COMPLETED" },
  });

  // Update trade status to indicate payment is complete and ready for review
  await prisma.trade.update({
    where: { id: payment.tradeId },
    data: {
      status: "UNDER_REVIEW", // Ready for middleman review
    },
  });

  // Get user details for notification
  const user = await prisma.user.findUnique({
    where: { id: payment.userId },
    select: { username: true },
  });

  // Send real-time notification
  await notificationService.notifyPaymentReceived(
    payment.tradeId,
    payment.userId,
    user?.username || "User",
    payment.amount,
  );

  console.log(`Payment completed for trade: ${payment.tradeId}`);
}

async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  console.log("Payment failed:", paymentIntent.id);

  const payment = await prisma.payment.findUnique({
    where: { stripePaymentIntentId: paymentIntent.id },
  });

  if (!payment) {
    console.error(`Payment not found for payment intent: ${paymentIntent.id}`);
    return;
  }

  await prisma.payment.update({
    where: { id: payment.id },
    data: { status: "FAILED" },
  });

  console.log(`Payment failed for trade: ${payment.tradeId}`);
}

async function handlePaymentCancellation(paymentIntent: Stripe.PaymentIntent) {
  console.log("Payment canceled:", paymentIntent.id);

  const payment = await prisma.payment.findUnique({
    where: { stripePaymentIntentId: paymentIntent.id },
  });

  if (!payment) {
    console.error(`Payment not found for payment intent: ${paymentIntent.id}`);
    return;
  }

  await prisma.payment.update({
    where: { id: payment.id },
    data: { status: "CANCELLED" },
  });

  console.log(`Payment cancelled for trade: ${payment.tradeId}`);
}

