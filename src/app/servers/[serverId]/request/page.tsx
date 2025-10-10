"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  CheckCircle,
  CreditCard,
  Lock,
  Shield,
} from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-b from-[#121212] to-[#1a1a1a] text-white">
      <div className="container mx-auto px-4 py-8 md:py-16 max-w-2xl">
        {/* Hero Section */}
        <div className="text-center mb-6 md:mb-8">
          {/* Trust Reinforcement Banner */}
          <div className="flex justify-center items-center gap-2 mb-4 md:mb-6">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg">
              <Shield className="h-4 w-4" />
              Paiement 100% sécurisé
            </div>
          </div>

          <h1 className="font-bold mb-3 md:mb-4 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight px-2">
            Demande de Trade Sécurisé
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 px-4">
            Dernière étape avant de sécuriser ton trade pour 1,99€
          </p>
        </div>

        {/* Comment ça marche - Workflow */}
        <div className="mb-6 md:mb-8 px-4">
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl text-white">
                Comment ça marche ?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <p className="text-gray-300">
                    <span className="font-semibold text-white">
                      Remplis le formulaire
                    </span>{" "}
                    avec les pseudos Roblox des deux traders
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <p className="text-gray-300">
                    <span className="font-semibold text-white">
                      Un seul d'entre vous paie
                    </span>{" "}
                    1,99€ via Stripe de façon 100% sécurisée
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <p className="text-gray-300">
                    <span className="font-semibold text-white">
                      Rejoins le serveur
                    </span>{" "}
                    via le lien reçu après paiement
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center font-bold text-xs">
                    4
                  </div>
                  <p className="text-gray-300">
                    <span className="font-semibold text-white">
                      Trade en toute sécurité
                    </span>{" "}
                    avec le middleman vérifié
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl text-white flex items-center gap-2">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
              Informations du Trade
            </CardTitle>
            <CardDescription className="text-sm sm:text-base text-gray-400">
              Entre les pseudos Roblox des deux traders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="buyerRobloxUsername"
                  className="text-sm sm:text-base text-white font-medium"
                >
                  Ton pseudo Roblox
                </Label>
                <Input
                  id="buyerRobloxUsername"
                  placeholder="Mon pseudo roblox"
                  className="bg-gray-800 border-gray-700 text-white text-sm sm:text-base h-12"
                  {...register("buyerRobloxUsername")}
                />
                {errors.buyerRobloxUsername && (
                  <p className="text-xs sm:text-sm text-red-400 flex items-center gap-1">
                    <span>⚠️</span>
                    {errors.buyerRobloxUsername.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="sellerRobloxUsername"
                  className="text-sm sm:text-base text-white font-medium"
                >
                  Pseudo Roblox du vendeur
                </Label>
                <Input
                  id="sellerRobloxUsername"
                  placeholder="Pseudo du vendeur"
                  className="bg-gray-800 border-gray-700 text-white text-sm sm:text-base h-12"
                  {...register("sellerRobloxUsername")}
                />
                {errors.sellerRobloxUsername && (
                  <p className="text-xs sm:text-sm text-red-400 flex items-center gap-1">
                    <span>⚠️</span>
                    {errors.sellerRobloxUsername.message}
                  </p>
                )}
              </div>

              {error && (
                <div className="bg-red-900/20 border border-red-500 rounded-xl p-4 animate-fade-in">
                  <p className="text-red-400 text-sm sm:text-base flex items-start gap-2">
                    <span className="text-lg">⚠️</span>
                    {error}
                  </p>
                </div>
              )}

              {/* Enhanced Summary Box */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-green-500/30 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-700">
                  <p className="text-sm sm:text-base font-semibold text-white">
                    Ce que tu obtiens
                  </p>
                  <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs sm:text-sm font-bold">
                    1,99€
                  </div>
                </div>
                <ul className="space-y-3 text-xs sm:text-sm">
                  <li className="flex items-start gap-3 text-gray-200">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Middleman vérifié protège ton trade à 100%</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-200">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Accès instantané au serveur privé</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-200">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Remboursement garanti si problème sous 24h</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-200">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Support Discord réactif en cas de besoin</span>
                  </li>
                </ul>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-sm sm:text-base py-6 sm:py-7 font-bold shadow-xl transition-all duration-300 hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Redirection vers Stripe...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Payer 1,99€ en toute sécurité
                    <ArrowRight className="h-5 w-5" />
                  </span>
                )}
              </Button>

              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <p className="text-xs sm:text-sm text-center text-blue-300 flex items-center gap-2 justify-center">
                  <CreditCard className="h-4 w-4 flex-shrink-0" />
                  <span>
                    Paiement sécurisé par Stripe. Tes données sont protégées.
                  </span>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
