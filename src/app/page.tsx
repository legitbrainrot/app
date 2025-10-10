import {
  ArrowRight,
  CheckCircle,
  Clock,
  Plus,
  Search,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { FAQ } from "@/components/faq";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#121212] to-[#1a1a1a] text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8 md:py-16 max-w-6xl">
        <div className="text-center mb-12 md:mb-16">
          {/* Urgency Banner */}
          <div className="flex justify-center items-center mb-6 animate-fade-in">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg animate-pulse-subtle">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">
                Offre de lancement: -60% (4,99€ → 1,99€)
              </span>
              <span className="sm:hidden">Promo: -60% → 1,99€</span>
            </div>
          </div>
          {/* Trust Badge */}
          <div className="flex justify-center items-center gap-2 mb-6">
            <div className="bg-green-500/20 border border-green-500 text-green-400 px-3 py-1 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
            </div>
          </div>
          100% Sécurisé
          <h1 className="font-bold mb-6 md:mb-8 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight px-2">
            LegitBrainrot
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-4 font-medium px-4">
            Échange ton brainrot en toute sécurité avec nos middlemen de
            confiance !
          </p>
          <p className="text-sm sm:text-base md:text-lg text-gray-400 mb-8 max-w-2xl mx-auto px-4">
            Fini les arnaques ! Notre équipe protège chaque échange brainrot
            (seulement 1,99€) grâce à notre service middleman vérifié.
          </p>
          {/* Primary CTA - Above the fold */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 px-4">
            <Button
              asChild
              size="lg"
              className="px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg bg-green-600 hover:bg-green-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 w-full sm:w-auto"
            >
              <Link href="/servers">
                <Search className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                <span>Voir les serveurs</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Why Choose Our Middleman Section */}
        <div className="container mx-auto px-4 py-12 md:py-16 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Pourquoi choisir nos middlemen ?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4 leading-relaxed">
              Faites vos échanges en toute confiance. Nos Middlemen sont des
              intermédiaires neutres et vérifiés dont la mission est simple :
              superviser chaque trade pour qu'il se déroule sans accroc —
              rapidement, proprement et en toute transparence.
            </p>
          </div>

          {/* 4-Step Process - Mobile Optimized */}
          <div className="mb-12">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-green-500 rounded-xl p-6 transition-all duration-300 hover:scale-105">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Search className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-white mb-2">
                  1. Choisissez votre serveur
                </h4>
                <p className="text-sm sm:text-base text-gray-400">
                  Vous et l’autre trader devez sélectionner le même serveur
                  privé Roblox avec middleman.
                </p>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-green-500 rounded-xl p-6 transition-all duration-300 hover:scale-105">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Plus className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-white mb-2">
                  2. Remplissez le formulaire
                </h4>
                <p className="text-sm sm:text-base text-gray-400">
                  Chacun entre son pseudo Roblox et celui de l’autre trader pour
                  valider le trade.
                </p>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-green-500 rounded-xl p-6 transition-all duration-300 hover:scale-105">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Shield className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-white mb-2">
                  3. Payez pour sécuriser le trade
                </h4>
                <p className="text-sm sm:text-base text-gray-400">
                  Un seul d'entre vous paie 1,99 € pour activer le middleman et
                  sécuriser le trade.
                </p>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-green-500 rounded-xl p-6 transition-all duration-300 hover:scale-105">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <ArrowRight className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-white mb-2">
                  4. Rejoignez le serveur
                </h4>
                <p className="text-sm sm:text-base text-gray-400">
                  Rejoignez le lien du serveur privé reçu. Le middleman vous
                  attend pour sécuriser votre trade ⚔️
                </p>
              </div>
            </div>
          </div>

          {/* Security & Guarantees */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-bold mb-6 text-green-400 flex items-center gap-2">
                <span className="text-2xl">🔒</span>
                Sécurité & garanties
              </h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm sm:text-base">
                    <span className="font-semibold text-white">
                      Aucun partage de mot de passe :
                    </span>{" "}
                    vous ne communiquez jamais vos identifiants Roblox.
                  </span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm sm:text-base">
                    <span className="font-semibold text-white">
                      Comptes dédiés :
                    </span>{" "}
                    les Middlemen n'utilisent jamais leur compte personnel.
                  </span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm sm:text-base">
                    <span className="font-semibold text-white">
                      Remboursement automatique
                    </span>{" "}
                    Si l’autre joueur ne vient pas 💸 on te rembourse direct.
                    Pas de stress. — transparence garantie, pas de frais cachés.
                  </span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm sm:text-base">
                    <span className="font-semibold text-white">
                      Preuves enregistrées :
                    </span>{" "}
                    toutes les étapes sont tracées via tickets et captures.
                  </span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm sm:text-base">
                    <span className="font-semibold text-white">
                      Paiement sécurisé
                    </span>{" "}
                    via Stripe (conformité PCI).
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-bold mb-6 text-green-400 flex items-center gap-2">
                <span className="text-2xl">🛡️</span>
                Confiance et conformité
              </h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm sm:text-base">
                    Chaque Middleman a passé une{" "}
                    <span className="font-semibold text-white">
                      vérification d'identité
                    </span>{" "}
                    et signé une déclaration de neutralité.
                  </span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm sm:text-base">
                    Nos procédures garantissent{" "}
                    <span className="font-semibold text-white">
                      neutralité, confidentialité et responsabilité
                    </span>
                    .
                  </span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm sm:text-base">
                    En cas de problème, notre support intervient avec{" "}
                    <span className="font-semibold text-white">
                      l'historique complet du ticket
                    </span>{" "}
                    pour une résolution rapide.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mb-12">
            <p className="text-base sm:text-lg text-gray-200 mb-6 font-medium">
              Prêt à sécuriser votre prochain trade ?
            </p>
            <Button
              asChild
              size="lg"
              className="px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg bg-green-600 hover:bg-green-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <Link href="/servers">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                Demander un Middleman
                <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 ml-2" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Multiple Testimonials - Mobile Optimized */}
        <div className="mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-8 text-center">
            Ce que disent nos clients
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
              <p className="text-sm sm:text-base text-gray-300 mb-4 italic">
                "J'ai trade mon brainrot via le middleman pour 1,99€ ! Aucune
                arnaque, super sécurisé !"
              </p>
              <p className="text-green-400 font-bold text-sm">
                - Lucas, 13 ans
              </p>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
              <p className="text-sm sm:text-base text-gray-300 mb-4 italic">
                "Enfin un service fiable ! Le middleman a vérifié tout le trade
                avant de valider. Je recommande à 100% !"
              </p>
              <p className="text-green-400 font-bold text-sm">- Emma, 14 ans</p>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
              <p className="text-sm sm:text-base text-gray-300 mb-4 italic">
                "Trop stylé ! J'ai eu mon brainrot en 10 minutes, tout s'est
                super bien passé. Merci LegitBrainrot !"
              </p>
              <p className="text-green-400 font-bold text-sm">- Noah, 12 ans</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <FAQ />
      </div>
    </div>
  );
}
