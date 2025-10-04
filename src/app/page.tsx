import { ArrowRight, Plus, Search, Shield } from "lucide-react";
import Link from "next/link";
import { FAQ } from "@/components/faq";
import { Button } from "@/components/ui/button";

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
                <Search className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                1. Choisis un serveur
              </h3>
              <p className="text-gray-400">
                Parcours les serveurs privés disponibles avec middleman
              </p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                2. Remplis le formulaire
              </h3>
              <p className="text-gray-400">
                Entre ton pseudo Roblox et celui de l'autre trader
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
                Paie via Stripe de façon 100% sécurisée
              </p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                4. Rejoins le serveur
              </h3>
              <p className="text-gray-400">
                Reçois le lien du serveur privé et trade avec le middleman
              </p>
            </div>
          </div>

          <div className="flex gap-6 justify-center">
            <Button
              asChild
              size="lg"
              className="px-8 py-4 text-lg bg-green-600 hover:bg-green-700"
            >
              <Link href="/servers">
                <Search className="h-6 w-6 mr-2" />
                Voir les serveurs
              </Link>
            </Button>
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
