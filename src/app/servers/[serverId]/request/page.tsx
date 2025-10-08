"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Shield } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const tradeRequestSchema = z.object({
  buyerRobloxUsername: z
    .string()
    .min(3, "Le pseudo doit contenir au moins 3 caractères"),
  sellerRobloxUsername: z
    .string()
    .min(3, "Le pseudo doit contenir au moins 3 caractères"),
});

type TradeRequestForm = z.infer<typeof tradeRequestSchema>;

export default function RequestTradePage() {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TradeRequestForm>({
    resolver: zodResolver(tradeRequestSchema),
  });

  const onSubmit = async (data: TradeRequestForm) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serverId: params.serverId,
          buyerRobloxUsername: data.buyerRobloxUsername,
          sellerRobloxUsername: data.sellerRobloxUsername,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Une erreur est survenue");
      }

      // Redirect to Stripe checkout
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Demande de Trade
          </h1>
          <p className="text-xl text-gray-300">
            Remplis le formulaire pour démarrer ton trade sécurisé
          </p>
        </div>

        <Card className="bg-gray-900 border border-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <Shield className="h-6 w-6 text-green-500" />
              Informations du Trade
            </CardTitle>
            <CardDescription className="text-gray-400">
              Entre les pseudos Roblox de l'acheteur et du vendeur
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="buyerRobloxUsername" className="text-white">
                  Ton pseudo Roblox (Acheteur)
                </Label>
                <Input
                  id="buyerRobloxUsername"
                  placeholder="MonPseudoRoblox"
                  className="bg-gray-800 border-gray-700 text-white"
                  {...register("buyerRobloxUsername")}
                />
                {errors.buyerRobloxUsername && (
                  <p className="text-sm text-red-500">
                    {errors.buyerRobloxUsername.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sellerRobloxUsername" className="text-white">
                  Pseudo Roblox du vendeur
                </Label>
                <Input
                  id="sellerRobloxUsername"
                  placeholder="PseudoVendeur"
                  className="bg-gray-800 border-gray-700 text-white"
                  {...register("sellerRobloxUsername")}
                />
                {errors.sellerRobloxUsername && (
                  <p className="text-sm text-red-500">
                    {errors.sellerRobloxUsername.message}
                  </p>
                )}
              </div>

              {error && (
                <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
                  <p className="text-red-500 text-sm">{error}</p>
                </div>
              )}

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">Récapitulatif</p>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>✓ Service de middleman sécurisé</li>
                  <li>✓ Accès au serveur privé après paiement</li>
                  <li>✓ Notification envoyée au middleman</li>
                </ul>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? "Redirection..." : "Procéder au paiement"}
              </Button>

              <p className="text-xs text-center text-gray-500">
                En continuant, tu acceptes d'être redirigé vers Stripe pour
                effectuer le paiement sécurisé.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
