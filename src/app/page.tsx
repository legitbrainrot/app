import { ArrowRight, MessageCircle, Plus, Search, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FAQ } from "@/components/faq";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const popularTrades = [
  {
    id: "1",
    name: "Skibidi Toilet",
    creator: "@toiletmaster",
    image:
      "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=300&h=200&fit=crop",
    price: "2,50€",
  },
  {
    id: "2",
    name: "Ohio Sigma",
    creator: "@sigmachad",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
    price: "2,50€",
  },
  {
    id: "3",
    name: "Gyatt Rizz",
    creator: "@rizzgod",
    image:
      "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=300&h=200&fit=crop",
    price: "2,50€",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-16">
          <div className="flex justify-center items-center gap-2 mb-6">
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
              <Shield className="h-4 w-4" />
              100% Sécurisé
            </div>
          </div>

          <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            LegitBrainrot
          </h1>
          <p className="text-2xl text-gray-300 mb-4 font-medium">
            Échange ton brainrot en toute sécurité avec notre middleman de
            confiance !
          </p>
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
            Fini les arnaques ! Notre équipe protège chaque échange brainrot
            (2,50€ chacun) grâce à notre service middleman sécurisé.
          </p>

          {/* 4-Step Process */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                1. Publie ton brainrot
              </h3>
              <p className="text-gray-400">
                Partage ton contenu brainrot sur notre plateforme
              </p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                2. Chat avec intéressés
              </h3>
              <p className="text-gray-400">
                Discute avec les utilisateurs qui veulent ton brainrot
              </p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                3. Paiement sécurisé
              </h3>
              <p className="text-gray-400">
                Chaque participant paie 2,50€ ensemble de façon sécurisée
              </p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                4. Rejoins le middleman
              </h3>
              <p className="text-gray-400">
                Reçois le lien pour rejoindre le middleman et faire l'échange
              </p>
            </div>
          </div>

          <div className="flex gap-6 justify-center">
            <Button
              asChild
              size="lg"
              className="px-8 py-4 text-lg bg-green-600 hover:bg-green-700"
            >
              <Link href="/trade/publish">
                <Plus className="h-6 w-6 mr-2" />
                Publier mon brainrot
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="px-8 py-4 text-lg border-2 border-gray-600 text-white hover:bg-gray-800"
            >
              <Link href="/trade">
                <Search className="h-6 w-6 mr-2" />
                Découvrir les brainrot
              </Link>
            </Button>
          </div>
        </div>

        {/* Popular Trades */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-white">
            🔥 Trades brainrot populaires cette semaine
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {popularTrades.map((trade) => (
              <Card
                key={trade.id}
                className="bg-gray-900 border border-gray-800 hover:border-green-500 transition-all duration-300"
              >
                <CardContent className="p-0">
                  <Link href={`/trade/${trade.id}`}>
                    <Image
                      src={trade.image}
                      alt={trade.name}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="p-4">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {trade.name}
                      </h3>
                      <p className="text-sm text-gray-400 mb-2">
                        {trade.creator}
                      </p>
                      <div className="bg-gray-800 border border-gray-700 rounded-lg p-2">
                        <p className="text-sm font-semibold text-green-400">
                          💰 Prix du trade : {trade.price}
                        </p>
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center mb-12">
          <p className="text-xl text-gray-300 mb-4 italic">
            "J'ai trade mon brainrot via le middleman pour 2,50€ ! Aucune
            arnaque, super sécurisé !"
          </p>
          <p className="text-green-400 font-bold">- Lucas, 13 ans</p>
        </div>

        {/* FAQ Section */}
        <FAQ />

        {/* Trust Indicators */}
        <div className="flex justify-center items-center gap-8 mt-12 text-center">
          <div className="flex items-center gap-2 text-green-400">
            <Shield className="h-5 w-5" />
            <span className="font-semibold">Middleman de confiance</span>
          </div>
          <div className="flex items-center gap-2 text-green-400">
            <Shield className="h-5 w-5" />
            <span className="font-semibold">Trades 100% sécurisés</span>
          </div>
          <div className="flex items-center gap-2 text-green-400">
            <Shield className="h-5 w-5" />
            <span className="font-semibold">Zéro arnaque garantie</span>
          </div>
        </div>
      </div>
    </div>
  );
}
