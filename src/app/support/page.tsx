"use client";

import {
  AlertTriangle,
  Clock,
  ExternalLink,
  HelpCircle,
  MessageSquare,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const faqItems = [
  {
    question: "How does the escrow system work?",
    answer:
      "Our escrow system holds both parties' payments until the trade is validated by a middleman. This ensures both traders are protected throughout the transaction.",
  },
  {
    question: "What happens if the other trader doesn't pay?",
    answer:
      "If one party fails to pay within the designated time window, the trade is automatically cancelled and any payments are refunded.",
  },
  {
    question: "How long do trades typically take?",
    answer:
      "Most trades are completed within 24 hours. The payment window is typically 1 hour, and middleman validation usually takes 2-4 hours.",
  },
  {
    question: "What fees are charged?",
    answer:
      "We charge a 5% fee on completed trades, split between both parties. There are no fees for cancelled or failed trades.",
  },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 font-bold text-3xl">Support Center</h1>
          <p className="text-muted-foreground">
            Get help with your trading experience
          </p>
        </div>

        {/* Quick Help */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Need Help?
            </CardTitle>
            <CardDescription>
              Join our Discord server and open a support ticket for personalized
              assistance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                className="btn-primary flex-1"
                onClick={() =>
                  window.open("https://discord.gg/yourserver", "_blank")
                }
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Join Discord Server
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
              <Button
                className="flex-1"
                onClick={() =>
                  window.open("https://discord.gg/yourserver", "_blank")
                }
                variant="outline"
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Open Support Ticket
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <p className="mt-4 text-muted-foreground text-sm">
              Our support team typically responds within 30 minutes during
              business hours (9 AM - 9 PM EST).
            </p>
          </CardContent>
        </Card>

        {/* Support Categories */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="transition-colors hover:border-primary/50">
            <CardHeader className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                <AlertTriangle className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Trade Issues</CardTitle>
              <CardDescription>
                Problems with payments, disputes, or trade progression
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Payment not received</li>
                <li>• Trade stuck in progress</li>
                <li>• Escrow problems</li>
                <li>• Middleman delays</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="transition-colors hover:border-primary/50">
            <CardHeader className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Account & Security</CardTitle>
              <CardDescription>
                Account access, security concerns, and verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Forgot password</li>
                <li>• Account verification</li>
                <li>• Security questions</li>
                <li>• Suspicious activity</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="transition-colors hover:border-primary/50">
            <CardHeader className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                <HelpCircle className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">General Questions</CardTitle>
              <CardDescription>
                How-to guides, platform features, and general inquiries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• How to trade</li>
                <li>• Platform features</li>
                <li>• Fee structure</li>
                <li>• Best practices</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Frequently Asked Questions
            </CardTitle>
            <CardDescription>
              Common questions and answers about our platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {faqItems.map((item) => (
                <div
                  className="border-border border-b pb-6 last:border-b-0 last:pb-0"
                  key={item.question}
                >
                  <h3 className="mb-2 font-semibold">{item.question}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle>Still Need Help?</CardTitle>
            <CardDescription>
              Multiple ways to reach our support team
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">Response Time</div>
                  <div className="text-muted-foreground text-sm">
                    Usually within 30 minutes
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">Available 24/7</div>
                  <div className="text-muted-foreground text-sm">
                    Emergency trade support
                  </div>
                </div>
              </div>
            </div>

            <div className="border-border border-t pt-4">
              <p className="mb-4 text-muted-foreground text-sm">
                For the fastest support, please join our Discord server and
                create a support ticket with:
              </p>
              <ul className="ml-4 space-y-1 text-muted-foreground text-sm">
                <li>• Your username and trade ID (if applicable)</li>
                <li>• Detailed description of your issue</li>
                <li>• Screenshots if relevant</li>
                <li>• Steps you've already tried</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
