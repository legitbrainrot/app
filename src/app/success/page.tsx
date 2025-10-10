import { Camera, CheckCircle, ExternalLink } from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getServerById } from "@/lib/mock-data";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{
    server_id?: string;
    buyer?: string;
    seller?: string;
  }>;
}) {
  const params = await searchParams;
  const { server_id, buyer, seller } = params;

  if (!server_id || !buyer || !seller) {
    redirect("/servers");
  }

  const server = getServerById(server_id);

  if (!server) {
    redirect("/servers");
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-green-500 rounded-full p-4">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Paiement Réussi !
          </h1>
          <p className="text-xl text-gray-300">
            Ton trade est maintenant en cours
          </p>
        </div>

        <Card className="bg-gray-900 border border-gray-800 mb-6">
          <CardHeader>
            <CardTitle className="text-2xl text-white">
              Détails du Trade
            </CardTitle>
            <CardDescription className="text-gray-400">
              Informations sur ton trade sécurisé
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-2">Serveur</p>
              <p className="text-lg font-semibold text-white">{server.name}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-2">Acheteur</p>
                <p className="text-lg font-semibold text-white">{buyer}</p>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-2">Vendeur</p>
                <p className="text-lg font-semibold text-white">{seller}</p>
              </div>
            </div>
            {/*}
            <div className="bg-green-900/20 border border-green-500 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-2">
                Lien du Serveur Privé
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-gray-800 text-green-400 p-2 rounded text-sm font-mono break-all">
                  {server.serverLink}
                </code>
                <Button
                  asChild
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <a
                    href={server.serverLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
*/}
            <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
              <p className="text-sm font-semibold text-blue-400 mb-2">
                📧 Email envoyé au middleman
              </p>
              <p className="text-sm text-gray-300">
                Le middleman a été notifié et vous attend sur le serveur privé
                pour faciliter l'échange entre{" "}
                <span className="font-semibold">{buyer}</span> et{" "}
                <span className="font-semibold">{seller}</span>.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Important Screenshot Notice */}
        <Card className="bg-gradient-to-br from-orange-900/40 to-yellow-900/40 border-2 border-orange-500 mb-6 animate-pulse-subtle">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-shrink-0">
                <div className="bg-orange-500 rounded-full p-3">
                  <Camera className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-orange-400 mb-2">
                  📸 IMPORTANT : Prends une capture d'écran !
                </h3>
                <p className="text-sm sm:text-base text-gray-200 mb-3">
                  <span className="font-semibold text-white">
                    Avant de rejoindre le serveur, fais une capture d'écran de
                    cette page
                  </span>{" "}
                  et envoie-la à l'autre trader pour lui prouver que le paiement
                  est réussi et que le trade est sécurisé.
                </p>
                <p className="text-xs sm:text-sm text-orange-300">
                  ✓ Cela rassure l'autre trader et accélère le trade
                  <br />✓ C'est la preuve que tu as bien payé le service
                  middleman
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center space-y-4">
          <Button
            asChild
            size="lg"
            className="text-xl w-full bg-green-600 hover:bg-green-700"
          >
            <a
              href={server.serverLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl"
            >
              <ExternalLink className="h-8 w-8 mr-2" />
              Rejoindre le serveur maintenant
            </a>
          </Button>

          <p className="text-sm text-gray-500">
            Garde ce lien en sécurité. Tu peux revenir sur cette page à tout
            moment.
          </p>
        </div>
      </div>
    </div>
  );
}
