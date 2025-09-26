"use client";

import { ExternalLink, HelpCircle, Shield } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-border border-t bg-muted/50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
                <span className="font-bold text-primary-foreground text-xs">
                  LB
                </span>
              </div>
              <span className="font-semibold">LegitBrainrot</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Secure trading platform for digital collectibles with escrow
              protection.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Quick Links</h3>
            <div className="space-y-2">
              <Link
                className="block text-muted-foreground text-sm hover:text-foreground"
                href="/dashboard"
              >
                Dashboard
              </Link>
              <Link
                className="block text-muted-foreground text-sm hover:text-foreground"
                href="/trades/publish"
              >
                Publish Trade
              </Link>
              <Link
                className="block text-muted-foreground text-sm hover:text-foreground"
                href="/trades/search"
              >
                Search Trades
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
                Help Center
              </Link>
              <button
                className="flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground"
                onClick={() =>
                  window.open("https://discord.gg/yourserver", "_blank")
                }
                type="button"
              >
                <ExternalLink className="h-3 w-3" />
                Discord Support
              </button>
            </div>
          </div>

          {/* Security */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Security</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Shield className="h-3 w-3" />
                Escrow Protected
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-border border-t pt-6 sm:flex-row">
          <p className="text-muted-foreground text-sm">
            © 2024 LegitBrainrot. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              className="text-muted-foreground text-sm hover:text-foreground"
              href="#"
            >
              Terms of Service
            </Link>
            <Link
              className="text-muted-foreground text-sm hover:text-foreground"
              href="#"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
