"use client";

import { Plus, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const allTrades = [
  {
    id: "1",
    name: "Skibidi Toilet",
    creator: "@toiletmaster",
    image:
      "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=300&h=200&fit=crop",
  },
  {
    id: "2",
    name: "Ohio Sigma",
    creator: "@sigmachad",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
  },
  {
    id: "3",
    name: "Gyatt Rizz",
    creator: "@rizzgod",
    image:
      "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=300&h=200&fit=crop",
  },
  {
    id: "4",
    name: "Mewing Master",
    creator: "@jawlinegod",
    image:
      "https://images.unsplash.com/photo-1520350094754-f0fdcac35c1c?w=300&h=200&fit=crop",
  },
  {
    id: "5",
    name: "Sigma Grindset",
    creator: "@grindtime",
    image:
      "https://images.unsplash.com/photo-1487528278747-ba99ed528ebc?w=300&h=200&fit=crop",
  },
  {
    id: "6",
    name: "Chad Energy",
    creator: "@alphamale",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
  },
];

export default function TradePage() {
  const [filter, setFilter] = useState("");

  const filteredTrades = allTrades.filter((trade) =>
    trade.name.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              🎮 Tous les trades brainrot
            </h1>
            <p className="text-gray-400">
              Trouve le contenu parfait à trader avec notre middleman sécurisé !
            </p>
          </div>
          <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
            <Link href="/trade/publish">
              <Plus className="h-5 w-5 mr-2" />
              Publier mon brainrot
            </Link>
          </Button>
        </div>

        {/* Security Banner */}
        <div className="bg-gray-900 border border-green-500 rounded-lg p-4 mb-8 flex items-center gap-3">
          <Shield className="h-5 w-5 text-green-400" />
          <p className="text-green-400 font-medium">
            🛡️ Tous les trades sont protégés par notre middleman de confiance -
            Zéro arnaque garantie
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <Input
            placeholder="🔍 Recherche par nom de brainrot..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-md bg-gray-900 border-2 border-gray-700 focus:border-green-500 text-lg py-3 text-white"
          />
        </div>

        {/* Trades Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrades.map((trade) => (
            <Card
              key={trade.id}
              className="bg-gray-900 border border-gray-800 hover:border-green-500 transition-all duration-300"
            >
              <CardContent className="p-0">
                <Link href={`/trade/${trade.id}`}>
                  <div className="relative">
                    <Image
                      src={trade.image}
                      alt={trade.name}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {trade.name}
                    </h3>
                    <p className="text-sm text-gray-400">{trade.creator}</p>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredTrades.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">😢</div>
            <p className="text-xl text-gray-300 mb-4">
              Aucun brainrot trouvé pour "{filter}"
            </p>
            <p className="text-gray-400 mb-6">Essaie avec un autre nom !</p>
          </div>
        )}

        {/* Trust Footer */}
        <div className="mt-16 bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="text-center">
            <h3 className="text-lg font-bold text-white mb-4">
              🛡️ Pourquoi nous faire confiance ?
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="flex items-center gap-2 justify-center">
                <Shield className="h-4 w-4 text-green-400" />
                <span className="text-gray-300">Middleman de confiance</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <Shield className="h-4 w-4 text-green-400" />
                <span className="text-gray-300">Trades sécurisés 2,50€</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <Shield className="h-4 w-4 text-green-400" />
                <span className="text-gray-300">Support anti-arnaque 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
