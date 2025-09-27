"use client";

import { ArrowLeft, MessageCircle, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const tradeData = {
  "1": {
    name: "Skibidi Toilet",
    creator: "@toiletmaster",
    image:
      "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=600&h=400&fit=crop",
  },
  "2": {
    name: "Ohio Sigma",
    creator: "@sigmachad",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
  },
  "3": {
    name: "Gyatt Rizz",
    creator: "@rizzgod",
    image:
      "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=600&h=400&fit=crop",
  },
  "4": {
    name: "Mewing Master",
    creator: "@jawlinegod",
    image:
      "https://images.unsplash.com/photo-1520350094754-f0fdcac35c1c?w=600&h=400&fit=crop",
  },
  "5": {
    name: "Sigma Grindset",
    creator: "@grindtime",
    image:
      "https://images.unsplash.com/photo-1487528278747-ba99ed528ebc?w=600&h=400&fit=crop",
  },
  "6": {
    name: "Chad Energy",
    creator: "@alphamale",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
  },
};

interface TradeDetailPageProps {
  params: { id: string };
}

export default function TradeDetailPage({ params }: TradeDetailPageProps) {
  const [chatOpen, setChatOpen] = useState(false);
  const trade = tradeData[params.id as keyof typeof tradeData];

  if (!trade) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center bg-gray-900 border border-gray-800 p-8 rounded-xl">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold mb-4 text-white">
            Échange introuvable
          </h1>
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link href="/trade">Retour aux trades</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <Button
          variant="ghost"
          asChild
          className="mb-6 text-gray-400 hover:bg-gray-800"
        >
          <Link href="/trade">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux trades
          </Link>
        </Button>

        {/* Security Banner */}
        <div className="bg-gray-900 border border-green-500 rounded-lg p-4 mb-8 flex items-center gap-3">
          <Shield className="h-5 w-5 text-green-600" />
          <p className="text-green-400 font-medium">
            🛡️ Ce trade est protégé par notre middleman de confiance - Paiement
            sécurisé 2,50€ chacun
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Image Section */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-900 border border-gray-800">
              <CardContent className="p-0">
                <div className="relative">
                  <Image
                    src={trade.image}
                    alt={trade.name}
                    width={800}
                    height={500}
                    className="w-full h-96 object-cover rounded-t-lg"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <Card className="bg-gray-900 border border-gray-800">
              <CardContent className="p-6">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {trade.name}
                </h1>
                <p className="text-lg text-gray-400 mb-6">
                  par {trade.creator}
                </p>

                {/* Security Badge */}
                <div className="bg-gray-800 border border-green-500 rounded-lg p-3 mb-6">
                  <div className="flex items-center gap-2 text-green-400">
                    <Shield className="h-4 w-4" />
                    <span className="text-sm font-bold">
                      Trade protégé par middleman
                    </span>
                  </div>
                </div>

                {/* Chat Button */}
                <Button
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700 text-lg py-4"
                  onClick={() => setChatOpen(true)}
                >
                  <MessageCircle className="h-6 w-6 mr-2" />
                  Commencer le trade sécurisé
                </Button>

                {/* Security Info */}
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-green-400">
                      <Shield className="h-4 w-4" />
                      <span>Middleman de confiance</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-400">
                      <Shield className="h-4 w-4" />
                      <span>Paiement sécurisé 2,50€</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-400">
                      <Shield className="h-4 w-4" />
                      <span>Zéro arnaque garantie</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {chatOpen && (
        <ChatWidget trade={trade} onClose={() => setChatOpen(false)} />
      )}
    </div>
  );
}

function ChatWidget({
  trade,
  onClose,
}: {
  trade: (typeof tradeData)[keyof typeof tradeData];
  onClose: () => void;
}) {
  const [step, setStep] = useState<"chat" | "payment" | "success">("chat");
  const [messages, setMessages] = useState([
    {
      sender: trade.creator,
      text: `Salut ! Tu veux trader ${trade.name} via le middleman pour 2,50€ ?`,
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, { sender: "Toi", text: newMessage }]);
    setNewMessage("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: trade.creator,
          text: "Super ! Prêt pour le paiement sécurisé 2,50€ via le middleman ?",
        },
      ]);
    }, 1000);
  };

  const handlePayment = () => {
    setStep("success");
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-gray-900 border-2 border-green-500 rounded-xl shadow-2xl flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-green-600 text-white rounded-t-xl">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          <h3 className="font-semibold">Chat avec {trade.creator}</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-white hover:bg-white/20"
        >
          ×
        </Button>
      </div>

      {step === "chat" && (
        <>
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-800">
            {messages.map((msg) => (
              <div
                key={msg.text}
                className={`flex ${msg.sender === "Toi" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-3 rounded-2xl text-sm ${
                    msg.sender === "Toi"
                      ? "bg-green-600 text-white"
                      : "bg-gray-700 text-gray-100 border border-gray-600"
                  }`}
                >
                  <div className="font-semibold text-xs mb-1 opacity-75">
                    {msg.sender}
                  </div>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-700 bg-gray-900">
            <div className="flex gap-2 mb-3">
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Écris ton message..."
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-sm text-white focus:border-green-500 focus:outline-none"
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              />
              <Button
                size="sm"
                onClick={sendMessage}
                className="bg-green-600 hover:bg-green-700"
              >
                Envoyer
              </Button>
            </div>
            <Button
              size="sm"
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => setStep("payment")}
            >
              ✅ Accepter le trade (2,50€)
            </Button>
          </div>
        </>
      )}

      {step === "payment" && (
        <div className="flex-1 p-6 flex flex-col justify-center text-center bg-gray-800">
          <div className="text-4xl mb-4">💳</div>
          <h4 className="font-bold text-xl mb-4 text-white">
            Paiement via middleman
          </h4>
          <p className="text-sm text-gray-300 mb-4">
            Chaque participant paie 2,50€ à notre middleman de confiance
          </p>
          <Button
            className="w-full mb-3 bg-green-600 hover:bg-green-700 text-lg py-3"
            onClick={handlePayment}
          >
            💳 Payer 2,50€ (sécurisé)
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setStep("chat")}
          >
            Retour au chat
          </Button>
        </div>
      )}

      {step === "success" && (
        <div className="flex-1 p-6 flex flex-col justify-center text-center bg-gray-800">
          <div className="text-4xl mb-4">🎉</div>
          <h4 className="font-bold text-xl mb-4 text-white">
            Trade sécurisé réussi !
          </h4>
          <p className="text-sm text-gray-300 mb-6">
            Les 2 paiements de 2,50€ ont été reçus par le middleman. Le brainrot
            peut maintenant être échangé en toute sécurité !
          </p>
          <Button className="w-full mb-3 bg-green-600 hover:bg-green-700 text-lg py-3">
            ✅ Trade complété
          </Button>
          <Button variant="outline" className="w-full" onClick={onClose}>
            Fermer
          </Button>
        </div>
      )}
    </div>
  );
}
