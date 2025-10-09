"use client";

import {
  AlertTriangle,
  Clock,
  ExternalLink,
  HelpCircle,
  MessageSquare,
  Shield,
} from "lucide-react";
import { FAQ } from "@/components/faq";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SupportPage() {
  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 font-bold text-3xl">
            Centre d'aide - Trades sécurisés
          </h1>
          <p className="text-muted-foreground">
            Assistance pour tes trades brainrot avec middleman de confiance
          </p>
        </div>

        {/* Quick Help */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Besoin d'aide pour tes trades ?
            </CardTitle>
            <CardDescription>
              Rejoins notre Discord et ouvre un ticket pour une assistance
              personnalisée sur les trades sécurisés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                className="btn-primary flex-1"
                onClick={() =>
                  window.open("https://discord.gg/ATeHhkte", "_blank")
                }
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Rejoindre Discord
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
              <Button
                className="flex-1"
                onClick={() =>
                  window.open("https://discord.gg/ATeHhkte", "_blank")
                }
                variant="outline"
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Ouvrir un ticket
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <p className="mt-4 text-muted-foreground text-sm">
              Notre équipe middleman répond généralement en 30 minutes pour
              protéger tes trades (9h - 21h).
            </p>
          </CardContent>
        </Card>

        {/* Support Categories */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="transition-colors hover:border-primary/50">
            <CardHeader className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Sécurité des trades</CardTitle>
              <CardDescription>
                Protection par middleman, paiements sécurisés et vérification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Problèmes de paiement 2,50€</li>
                <li>• Vérification de middleman</li>
                <li>• Sécurité des trades</li>
                <li>• Signaler une arnaque</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="transition-colors hover:border-primary/50">
            <CardHeader className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                <HelpCircle className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Questions générales</CardTitle>
              <CardDescription>
                Comment trader, publier du brainrot et utiliser le middleman
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Comment publier un brainrot</li>
                <li>• Fonctionnement du trade</li>
                <li>• Utiliser le middleman</li>
                <li>• Meilleures pratiques</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <FAQ />

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle>Encore besoin d'aide ?</CardTitle>
            <CardDescription>
              Plusieurs façons de contacter notre équipe middleman
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">Temps de réponse</div>
                  <div className="text-muted-foreground text-sm">
                    Généralement en 30 minutes
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">Protection 24/7</div>
                  <div className="text-muted-foreground text-sm">
                    Middleman d'urgence disponible
                  </div>
                </div>
              </div>
            </div>

            <div className="border-border border-t pt-4">
              <p className="mb-4 text-muted-foreground text-sm">
                Pour le support le plus rapide, rejoins notre Discord et crée un
                ticket avec :
              </p>
              <ul className="ml-4 space-y-1 text-muted-foreground text-sm">
                <li>• Ton nom d'utilisateur et infos de trade</li>
                <li>• Description détaillée de ton problème</li>
                <li>• Captures d'écran si pertinentes</li>
                <li>• Étapes déjà essayées</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
