"use client";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Clock,
  DollarSign,
  ExternalLink,
  Send,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  sender: "creator" | "buyer" | "system";
  content: string;
  timestamp: Date;
}

interface TradeRoomProps {
  params: {
    id: string;
  };
}

export default function TradeRoomPage({ params: _ }: TradeRoomProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "system",
      content:
        "Trade room created. Both parties must complete payment before the deadline.",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: "2",
      sender: "creator",
      content:
        "Hey! Thanks for your interest in my Sigma Grindset compilation. Ready to make this trade?",
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
    },
    {
      id: "3",
      sender: "buyer",
      content: "Absolutely! This looks amazing. What's the next step?",
      timestamp: new Date(Date.now() - 1000 * 60 * 20),
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [paymentStatus, setPaymentStatus] = useState({
    creator: false,
    buyer: false,
    bothApproved: false,
  });
  const [escrowStatus, setEscrowStatus] = useState<
    "waiting" | "secured" | "link_available"
  >("waiting");
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 hours in seconds
  const [showPrivateLink, setShowPrivateLink] = useState(false);

  // Simulate payment updates
  useEffect(() => {
    const timer = setTimeout(() => {
      setPaymentStatus((prev) => ({ ...prev, creator: true }));
    }, 3000);

    const timer2 = setTimeout(() => {
      setPaymentStatus((prev) => ({
        ...prev,
        buyer: true,
        bothApproved: true,
      }));
      setEscrowStatus("secured");
    }, 6000);

    const timer3 = setTimeout(() => {
      setEscrowStatus("link_available");
    }, 9000);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!paymentStatus.bothApproved) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [paymentStatus.bothApproved]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: "buyer", // Simulate current user as buyer
      content: newMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getEscrowStatusInfo = () => {
    switch (escrowStatus) {
      case "waiting":
        return {
          icon: <AlertCircle className="h-5 w-5 text-orange-500" />,
          text: "Waiting for both payments",
          color: "border-orange-200 bg-orange-50",
        };
      case "secured":
        return {
          icon: <Shield className="h-5 w-5 text-green-500" />,
          text: "Escrow Secured",
          color: "border-green-200 bg-green-50",
        };
      case "link_available":
        return {
          icon: <CheckCircle className="h-5 w-5 text-blue-500" />,
          text: "Private server link available",
          color: "border-blue-200 bg-blue-50",
        };
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/trade/search">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </Link>
        </Button>

        <h1 className="text-3xl font-bold tracking-tight mb-2">Trade Room</h1>
        <p className="text-muted-foreground">
          Sigma Grindset Compilation - Trading with AlphaMale2024
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg">Chat</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "buyer"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-3 py-2 ${
                        message.sender === "buyer"
                          ? "bg-primary text-primary-foreground"
                          : message.sender === "system"
                            ? "bg-muted text-muted-foreground text-sm italic"
                            : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
                <Button onClick={sendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Panel */}
        <div className="space-y-6">
          {/* Payment Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Payment Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Creator</span>
                {paymentStatus.creator ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Clock className="h-5 w-5 text-orange-500" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">You</span>
                {paymentStatus.buyer ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Clock className="h-5 w-5 text-orange-500" />
                )}
              </div>
              {!paymentStatus.buyer && (
                <Button
                  className="w-full"
                  onClick={() =>
                    setPaymentStatus((prev) => ({ ...prev, buyer: true }))
                  }
                >
                  Complete Payment
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Escrow Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Escrow Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`p-4 rounded-lg border ${getEscrowStatusInfo().color}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {getEscrowStatusInfo().icon}
                  <span className="font-medium text-sm">
                    {getEscrowStatusInfo().text}
                  </span>
                </div>
                {escrowStatus === "link_available" && (
                  <div className="mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => setShowPrivateLink(!showPrivateLink)}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {showPrivateLink
                        ? "Hide Link"
                        : "Show Private Server Link"}
                    </Button>
                    {showPrivateLink && (
                      <div className="mt-2 p-2 bg-background rounded border text-xs font-mono">
                        discord.gg/middleman-xyz123
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Countdown Timer */}
          {paymentStatus.bothApproved && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Time Remaining
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-mono font-bold mb-2">
                    {formatTime(timeLeft)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Until trade expires
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
