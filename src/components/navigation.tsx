"use client";

import { HelpCircle, Search, Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname?.startsWith(path) ?? false;

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800 bg-black/95 backdrop-blur shadow-sm">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link className="flex items-center gap-2" href="/">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600">
                <span className="font-bold text-white text-sm">🧠</span>
              </div>
              <span className="font-bold text-xl text-white">
                LegitBrainrot
              </span>
            </Link>
          </div>

          {/* Security Badge */}
          <div className="hidden md:flex items-center gap-1 bg-green-500 px-3 py-1 rounded-full">
            <Shield className="h-4 w-4 text-white" />
            <span className="text-sm font-medium text-white">
              Middleman de confiance
            </span>
          </div>

          {/* Main Navigation */}
          <div className="hidden items-center gap-3 lg:flex">
            <Link href="/servers">
              <Button
                className="gap-2 text-gray-300 hover:bg-gray-800"
                size="sm"
                variant={isActive("/servers") ? "default" : "ghost"}
              >
                <Search className="h-4 w-4" />
                Serveurs disponibles
              </Button>
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-2">
            <Link href="/support">
              <Button
                className="gap-2 text-gray-300 hover:bg-gray-800"
                size="sm"
                variant="ghost"
              >
                <HelpCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Aide</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
