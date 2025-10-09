import { ArrowRight, Clock, Shield, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAvailableServers } from "@/lib/mock-data";

export default function ServersPage() {
  const servers = getAvailableServers();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#121212] to-[#1a1a1a] text-white">
      <div className="container mx-auto px-4 py-8 md:py-16 max-w-6xl">
        {/* Hero Section - Mobile First */}
        <div className="text-center mb-8 md:mb-12">
          {/* Urgency Badge */}
          <div className="flex justify-center items-center mb-4 md:mb-6">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg animate-pulse-subtle">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">
                {servers.length} serveurs disponibles maintenant
              </span>
              <span className="sm:hidden">
                {servers.length} serveurs dispos
              </span>
            </div>
          </div>

          <h1 className="font-bold mb-4 md:mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight px-2">
            Serveurs Privés Disponibles
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 px-4">
            Choisis ton serveur et commence à trader en toute sécurité pour
            seulement 0,99€
          </p>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto mb-8 px-4">
            <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-lg p-3">
              <Shield className="h-5 w-5 text-green-400 mx-auto mb-1" />
              <p className="text-xs text-gray-400">100% Sécurisé</p>
            </div>
            <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-lg p-3">
              <Users className="h-5 w-5 text-blue-400 mx-auto mb-1" />
              <p className="text-xs text-gray-400">Middleman vérifié</p>
            </div>
            <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-lg p-3">
              <Clock className="h-5 w-5 text-purple-400 mx-auto mb-1" />
              <p className="text-xs text-gray-400">Trade rapide</p>
            </div>
          </div>
        </div>

        {servers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg sm:text-xl text-gray-400 mb-4">
              Aucun serveur disponible pour le moment
            </p>
            <p className="text-sm sm:text-base text-gray-500">
              Reviens plus tard pour découvrir de nouveaux serveurs !
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {servers.map((server) => (
              <Card
                key={server.id}
                className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-green-500 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl sm:text-2xl text-white flex items-center gap-2">
                    <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
                    {server.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Price Display */}
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-4">
                      <p className="text-xs sm:text-sm text-gray-400 mb-1">
                        Prix du service
                      </p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl sm:text-3xl font-bold text-green-400">
                          {server.price.toFixed(2)}€
                        </p>
                        <p className="text-xs text-gray-500 line-through">
                          1,99€
                        </p>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Button
                      asChild
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-sm sm:text-base py-5 sm:py-6 shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <Link href={`/servers/${server.id}/request`}>
                        Sécuriser mon trade (0,99€)
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-12 text-center bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3">
            Pas encore décidé ?
          </h2>
          <p className="text-sm sm:text-base text-gray-400 mb-6">
            Tous nos serveurs sont 100% sécurisés avec middleman vérifié.
            Satisfait ou remboursé !
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white"
            >
              <Link href="/support">
                <Shield className="h-5 w-5 mr-2" />
                En savoir plus
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
