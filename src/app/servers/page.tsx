import { Shield, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAvailableServers } from "@/lib/mock-data";

export default function ServersPage() {
  const servers = getAvailableServers();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Serveurs Privés Disponibles
          </h1>
          <p className="text-xl text-gray-300">
            Choisis ton serveur et commence à trader en toute sécurité
          </p>
        </div>

        {servers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400 mb-4">
              Aucun serveur disponible pour le moment
            </p>
            <p className="text-gray-500">
              Reviens plus tard pour découvrir de nouveaux serveurs !
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servers.map((server) => (
              <Card
                key={server.id}
                className="bg-gray-900 border border-gray-800 hover:border-green-500 transition-all duration-300"
              >
                <CardHeader>
                  <CardTitle className="text-2xl text-white flex items-center gap-2">
                    <Shield className="h-6 w-6 text-green-500" />
                    {server.name}
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    {server.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                      <p className="text-sm text-gray-400 mb-1">
                        Prix du service
                      </p>
                      <p className="text-2xl font-bold text-green-400">
                        {server.price.toFixed(2)}€
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Users className="h-4 w-4" />
                      <span>Middleman vérifié</span>
                    </div>

                    <Button
                      asChild
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <Link href={`/servers/${server.id}/request`}>
                        Demander un trade
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
