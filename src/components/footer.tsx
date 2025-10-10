"use client";

import { ExternalLink, HelpCircle, Search, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-border border-t bg-muted/50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Marque */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Logo LegitBrainrot"
                width={24}
                height={24}
                className="rounded"
              />
              <span className="font-semibold">LegitBrainrot</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Plateforme sécurisée d'échange de brainrot avec protection
              middleman.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Navigation</h3>
            <div className="space-y-2">
              <Link
                className="flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground"
                href="/servers"
              >
                <Search className="h-3 w-3" />
                Rechercher serveur privé
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Support</h3>
            <div className="space-y-2">
              <Link
                className="flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground"
                href="/support"
              >
                <HelpCircle className="h-3 w-3" />
                Centre d'aide
              </Link>
              <button
                className="flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground"
                onClick={() =>
                  window.open("https://discord.gg/ATeHhkte", "_blank")
                }
                type="button"
              >
                <ExternalLink className="h-3 w-3" />
                Support Discord
              </button>
            </div>
          </div>

          {/* Sécurité */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Sécurité</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Shield className="h-3 w-3" />
                Protection Middleman
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-border border-t pt-6 sm:flex-row">
          <p className="text-muted-foreground text-sm">
            © 2025 LegitBrainrot. Tous droits réservés.
          </p>
          <div className="flex gap-4">
            <Link
              className="text-muted-foreground text-sm hover:text-foreground"
              href="#"
            >
              Conditions d'utilisation
            </Link>
            <Link
              className="text-muted-foreground text-sm hover:text-foreground"
              href="#"
            >
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
