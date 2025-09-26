import { ArrowRight, Shield, Users, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative px-4 py-20">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text font-bold text-5xl text-transparent md:text-7xl">
            LegitBrainrot
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-gray-400 text-xl md:text-2xl">
            The most secure platform for trading digital collectibles with
            escrow protection
          </p>

          <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild className="btn-primary px-8 py-3 text-lg" size="lg">
              <Link href="/auth/sign-up">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              className="border-gray-600 px-8 py-3 text-lg text-white hover:bg-gray-800"
              size="lg"
              variant="outline"
            >
              <Link href="/auth/sign-in">Sign In</Link>
            </Button>
          </div>

          <div className="text-center text-gray-500" />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-b from-black to-gray-900 px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <h2 className="mb-12 text-center font-bold text-3xl md:text-4xl">
            Why Choose LegitBrainrot?
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-gray-800 bg-gray-900 transition-all duration-300 hover:border-primary/50">
              <CardHeader className="text-center">
                <Shield className="mx-auto mb-4 h-12 w-12 text-primary" />
                <CardTitle className="text-white">Secure Escrow</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-400">
                  Your transactions are protected by our advanced escrow system.
                  Funds are held safely until both parties confirm the trade.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-gray-800 bg-gray-900 transition-all duration-300 hover:border-primary/50">
              <CardHeader className="text-center">
                <Users className="mx-auto mb-4 h-12 w-12 text-primary" />
                <CardTitle className="text-white">Community Trust</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-400">
                  Community-driven trust system with verified traders and
                  reputation tracking for safe trading.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-gray-800 bg-gray-900 transition-all duration-300 hover:border-primary/50">
              <CardHeader className="text-center">
                <Zap className="mx-auto mb-4 h-12 w-12 text-primary" />
                <CardTitle className="text-white">Fast Trades</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-400">
                  Complete your trades quickly with our streamlined process.
                  Most transactions are completed within minutes.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-8 text-center md:grid-cols-4">
            <div>
              <h3 className="mb-2 font-bold text-3xl text-primary">10K+</h3>
              <p className="text-gray-400">Successful Trades</p>
            </div>
            <div>
              <h3 className="mb-2 font-bold text-3xl text-primary">99.8%</h3>
              <p className="text-gray-400">Success Rate</p>
            </div>
            <div>
              <h3 className="mb-2 font-bold text-3xl text-primary">5K+</h3>
              <p className="text-gray-400">Active Users</p>
            </div>
            <div>
              <h3 className="mb-2 font-bold text-3xl text-primary">24/7</h3>
              <p className="text-gray-400">Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-gray-900 to-black px-4 py-20">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="mb-6 font-bold text-3xl md:text-4xl">
            Ready to Start Trading?
          </h2>
          <p className="mb-8 text-gray-400 text-xl">
            Join thousands of users who trust LegitBrainrot for their digital
            collectible trades
          </p>
          <Button asChild className="btn-primary px-8 py-3 text-lg" size="lg">
            <Link href="/auth/sign-up">
              Create Account <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
