import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { stripe } from "@/lib/stripe";
import { getServerById, createTradeRequest, updateTradeRequest } from "@/lib/mock-data";

const checkoutSchema = z.object({
  serverId: z.string(),
  buyerRobloxUsername: z.string().min(3),
  sellerRobloxUsername: z.string().min(3),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { serverId, buyerRobloxUsername, sellerRobloxUsername } = checkoutSchema.parse(body);

    // Get the server details from mock data
    const server = getServerById(serverId);

    if (!server) {
      return NextResponse.json(
        { error: "Serveur introuvable" },
        { status: 404 }
      );
    }

    if (!server.isAvailable) {
      return NextResponse.json(
        { error: "Ce serveur n'est plus disponible" },
        { status: 400 }
      );
    }

    // Create a trade request in mock storage
    const tradeRequest = createTradeRequest(
      serverId,
      buyerRobloxUsername,
      sellerRobloxUsername
    );

    // Create a Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Service Middleman - ${server.name}`,
              description: `Trade sécurisé entre ${buyerRobloxUsername} et ${sellerRobloxUsername}`,
            },
            unit_amount: Math.round(server.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}&trade_id=${tradeRequest.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/servers/${serverId}/request`,
      metadata: {
        tradeRequestId: tradeRequest.id,
        serverId: serverId,
      },
    });

    // Update trade request with Stripe payment ID
    updateTradeRequest(tradeRequest.id, { stripePaymentId: session.id });

    return NextResponse.json({ checkoutUrl: session.url });
  } catch (error) {
    console.error("Checkout error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Données invalides" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Une erreur est survenue lors de la création du paiement" },
      { status: 500 }
    );
  }
}
