"use client";

import { HelpCircle, Search, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname?.startsWith(path) ?? false;

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800 bg-[#121212]/95 backdrop-blur-xl shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link className="flex items-center gap-2" href="/">
              <Image
                src="/logo.png"
                alt="LegitBrainrot Logo"
                width={36}
                height={36}
                className="rounded-xl sm:w-10 sm:h-10"
              />
              <span className="font-bold text-lg sm:text-xl text-white">
                LegitBrainrot
              </span>
            </Link>
          </div>

          {/* Security Badge */}
          <div className="hidden md:flex items-center gap-1 bg-gradient-to-r from-green-500 to-emerald-600 px-3 py-1.5 rounded-full shadow-lg">
            <Shield className="h-4 w-4 text-white" />
            <span className="text-sm font-medium text-white">
              Middleman de confiance
            </span>
          </div>

          {/* Main Navigation */}
          <div className="hidden items-center gap-3 lg:flex">
            <Link href="/servers">
              <Button
                className="gap-2 text-gray-300 hover:bg-gray-800/80 transition-all"
                size="sm"
                variant={isActive("/servers") ? "default" : "ghost"}
              >
                <Search className="h-4 w-4" />
                Serveurs disponibles
              </Button>
            </Link>
          </div>

          {/* User Menu - Mobile First */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Link className="lg:hidden" href="/servers">
              <Button
                className="gap-1 sm:gap-2 text-gray-300 hover:bg-gray-800/80 transition-all text-xs sm:text-sm px-2 sm:px-3"
                size="sm"
                variant={isActive("/servers") ? "default" : "ghost"}
              >
                <Search className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Serveurs</span>
              </Button>
            </Link>
            <Link href="/support">
              <Button
                className="gap-1 sm:gap-2 text-gray-300 hover:bg-gray-800/80 transition-all text-xs sm:text-sm px-2 sm:px-3"
                size="sm"
                variant="ghost"
              >
                <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Aide</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
