import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/layout/navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Roblox Trading Platform - Secure Item Trading with Escrow",
  description: "Trade Roblox items safely with our escrow service. Authenticate via Roblox OAuth, browse listings, chat with traders, and complete secure transactions with human middleman supervision.",
  keywords: ["roblox", "trading", "escrow", "items", "marketplace", "secure"],
  authors: [{ name: "Roblox Trading Platform" }],
  openGraph: {
    title: "Roblox Trading Platform",
    description: "Secure Roblox item trading with escrow protection",
    type: "website",
  },
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 3,
    },
  },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}
      >
        <QueryClientProvider client={queryClient}>
          <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1">
              {children}
            </main>

            <footer className="border-t bg-muted/50">
              <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                  <p>
                    © 2025 Roblox Trading Platform. All rights reserved.
                  </p>
                  <div className="flex gap-6">
                    <a href="/terms" className="hover:text-foreground transition-colors">
                      Terms of Service
                    </a>
                    <a href="/privacy" className="hover:text-foreground transition-colors">
                      Privacy Policy
                    </a>
                    <a href="/support" className="hover:text-foreground transition-colors">
                      Support
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          </div>

          <Toaster />
        </QueryClientProvider>
      </body>
    </html>
  );
}
