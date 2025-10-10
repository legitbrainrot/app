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
    question: "Comment fonctionne le middleman de confiance ?",
    answer:
      "Notre équipe sécurise chaque trade brainrot. Un seul participant paie 1,99€ (au lieu de 4,99€) à notre middleman avant l'échange pour garantir zéro arnaque.",
  },
  {
    question: "Pourquoi payer 1,99€ pour trader ?",
    answer:
      "Ce paiement garantit que le trade est sérieux et protège contre les arnaques. Le middleman vérifie que le trade se passe bien avant de valider. Un seul trader paie, pas les deux.",
  },
  {
    question: "Que se passe-t-il si l'autre personne ne livre pas ?",
    answer:
      "Notre middleman protège votre paiement. Si l'autre partie ne respecte pas le trade, vous êtes remboursé intégralement.",
  },
  {
    question: "Comment puis-je être sûr que c'est sécurisé ?",
    answer:
      "Nous utilisons un système middleman professionnel. Aucun trade ne se fait directement entre les parties, tout passe par notre équipe de confiance.",
  },
];

interface FAQProps {
  title?: string;
  description?: string;
  className?: string;
}

export function FAQ({
  title = "Questions fréquentes sur les trades",
  description = "Questions courantes sur notre service middleman de confiance",
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
