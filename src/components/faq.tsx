import { HelpCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const faqItems = [
  {
    question: "Comment fonctionnent les serveurs modérés ?",
    answer:
      "Nos serveurs privés Roblox sont surveillés par des modérateurs professionnels. Un seul participant paie 1,99€ (au lieu de 4,99€) pour accéder au serveur modéré et jouer en toute tranquillité.",
  },
  {
    question: "Pourquoi payer 1,99€ pour rejoindre un serveur ?",
    answer:
      "Ce paiement te donne accès à un serveur privé avec modération active. Les modérateurs assurent un environnement sécurisé pour tous les joueurs. Un seul participant paie pour l'accès.",
  },
  {
    question: "Comment puis-je être sûr que c'est sécurisé ?",
    answer:
      "Nous utilisons des serveurs privés avec modération professionnelle. Tous les joueurs bénéficient de la surveillance de notre équipe de confiance.",
  },
];

interface FAQProps {
  title?: string;
  description?: string;
  className?: string;
}

export function FAQ({
  title = "Questions fréquentes",
  description = "Questions courantes sur nos serveurs privés modérés",
  className = "",
}: FAQProps) {
  return (
    <Card className={`mb-8 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {faqItems.map((item) => (
            <div
              className="border-border border-b pb-6 last:border-b-0 last:pb-0"
              key={item.question}
            >
              <h3 className="mb-2 font-semibold text-base md:text-lg">
                {item.question}
              </h3>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
