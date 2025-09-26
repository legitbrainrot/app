"use client";

import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  Clock,
  DollarSign,
  Send,
  Shield,
  User,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const mockMessages = [
  {
    id: "1",
    sender: "SkibidiMaster",
    message: "Hey! Interested in trading for my Ohio Gyat Rizz Supreme?",
    timestamp: "2:34 PM",
    isCurrentUser: false,
  },
  {
    id: "2",
    sender: "You",
    message:
      "Yes! I've been looking for this everywhere. What's your asking price?",
    timestamp: "2:35 PM",
    isCurrentUser: true,
  },
  {
    id: "3",
    sender: "SkibidiMaster",
    message: "2500 Robux seems fair. I'll initiate the escrow process now.",
    timestamp: "2:36 PM",
    isCurrentUser: false,
  },
  {
    id: "4",
    sender: "You",
    message: "Sounds good! Let me know when the payment window opens.",
    timestamp: "2:38 PM",
    isCurrentUser: true,
  },
];

const tradeStages = [
  { label: "Negotiation", status: "completed" },
  { label: "Payment Window", status: "current" },
  { label: "Escrow Secured", status: "pending" },
  { label: "Middleman Review", status: "pending" },
  { label: "Trade Complete", status: "pending" },
];

const getStageStatusClass = (status: string) => {
  if (status === "completed") {
    return "bg-primary";
  }
  if (status === "current") {
    return "animate-pulse bg-yellow-500";
  }
  return "bg-muted";
};

const getStageTextClass = (status: string) => {
  if (status === "current") {
    return "font-semibold text-foreground";
  }
  if (status === "completed") {
    return "text-muted-foreground line-through";
  }
  return "text-muted-foreground";
};

export default function TradeRoomPage({ params }: { params: { id: string } }) {
  const InitialTime = 3600; // 1 hour in seconds
  const TimerInterval = 1000; // 1 second
  const SecondsPerHour = 3600;
  const SecondsPerMinute = 60;

  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState(mockMessages);
  const [timeLeft, setTimeLeft] = useState(InitialTime);
  const [hasPaid, setHasPaid] = useState(false);
  const [otherUserPaid, setOtherUserPaid] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, TimerInterval);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / SecondsPerHour);
    const mins = Math.floor((seconds % SecondsPerHour) / SecondsPerMinute);
    const secs = seconds % SecondsPerMinute;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) {
      return;
    }

    const message = {
      id: Date.now().toString(),
      sender: "You",
      message: newMessage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isCurrentUser: true,
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const handlePayment = () => {
    setHasPaid(true);
    // Simulate other user payment after delay
    const PaymentDelay = 5000;
    setTimeout(() => setOtherUserPaid(true), PaymentDelay);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <Link
            className="mb-4 inline-flex items-center text-muted-foreground hover:text-foreground"
            href="/trades/search"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Search
          </Link>
          <h1 className="mb-2 font-bold text-3xl">Trade Room</h1>
          <p className="text-muted-foreground">
            Ohio Gyat Rizz Supreme - 2500 R$
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Trade Status */}
          <div className="space-y-6 lg:col-span-1">
            {/* Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Trade Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {tradeStages.map((stage, _index) => (
                  <div className="flex items-center gap-3" key={stage.label}>
                    <div
                      className={`h-3 w-3 rounded-full ${getStageStatusClass(stage.status)}`}
                    />
                    <span
                      className={`text-sm ${getStageTextClass(stage.status)}`}
                    >
                      {stage.label}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Payment Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Payment Window
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="mb-2 font-bold text-2xl text-primary">
                    {formatTime(timeLeft)}
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Time remaining
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Your payment:</span>
                    <div className="flex items-center gap-2">
                      {hasPaid ? (
                        <CheckCircle className="h-4 w-4 text-primary" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      )}
                      <span className="font-medium text-sm">
                        {hasPaid ? "Paid" : "Pending"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Other user:</span>
                    <div className="flex items-center gap-2">
                      {otherUserPaid ? (
                        <CheckCircle className="h-4 w-4 text-primary" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      )}
                      <span className="font-medium text-sm">
                        {otherUserPaid ? "Paid" : "Pending"}
                      </span>
                    </div>
                  </div>
                </div>

                {!hasPaid && (
                  <Button
                    className="btn-primary w-full"
                    onClick={handlePayment}
                  >
                    <DollarSign className="mr-2 h-4 w-4" />
                    Pay 2500 R$
                  </Button>
                )}

                {hasPaid && otherUserPaid && (
                  <div className="rounded-md bg-primary/20 p-4 text-center">
                    <CheckCircle className="mx-auto mb-2 h-6 w-6 text-primary" />
                    <p className="font-medium text-sm">
                      Escrow Secured! Middleman notified.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Trade Details */}
            <Card>
              <CardHeader>
                <CardTitle>Trade Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Item:</span>
                  <span className="font-medium text-sm">
                    Ohio Gyat Rizz Supreme
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">
                    Creator:
                  </span>
                  <span className="font-medium text-sm">SkibidiMaster</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Price:</span>
                  <span className="font-medium text-primary text-sm">
                    2500 R$
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">
                    Trade ID:
                  </span>
                  <span className="font-mono text-sm">#{params.id}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat */}
          <div className="lg:col-span-2">
            <Card className="flex h-[600px] flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Trade Chat
                </CardTitle>
                <CardDescription>
                  Communicate securely with the other trader
                </CardDescription>
              </CardHeader>

              <CardContent className="flex min-h-0 flex-1 flex-col">
                {/* Messages */}
                <div className="mb-4 flex-1 space-y-4 overflow-y-auto">
                  {messages.map((message) => (
                    <div
                      className={`flex ${message.isCurrentUser ? "justify-end" : "justify-start"}`}
                      key={message.id}
                    >
                      <div
                        className={`max-w-xs rounded-lg px-4 py-2 lg:max-w-md ${
                          message.isCurrentUser
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <div className="text-sm">{message.message}</div>
                        <div
                          className={`mt-1 text-xs ${
                            message.isCurrentUser
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          }`}
                        >
                          {message.isCurrentUser ? "You" : message.sender} •{" "}
                          {message.timestamp}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <form className="flex gap-2" onSubmit={handleSendMessage}>
                  <Input
                    className="flex-1"
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    value={newMessage}
                  />
                  <Button className="btn-primary" type="submit">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
