"use client";

import { HelpCircle, Home, LogOut, Plus, Search, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const pathname = usePathname();

  const shouldShow = () => {
    const authPaths = ["/auth/sign-in", "/auth/sign-up"];
    return !authPaths.some((path) => pathname?.startsWith(path));
  };

  if (!shouldShow()) {
    return null;
  }

  const isActive = (path: string) => pathname?.startsWith(path) ?? false;

  return (
    <nav className="sticky top-0 z-50 border-border border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link className="flex items-center gap-2" href="/dashboard">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="font-bold text-primary-foreground text-sm">
                  LB
                </span>
              </div>
              <span className="font-bold text-lg">LegitBrainrot</span>
            </Link>
          </div>

          {/* Main Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            <Link href="/dashboard">
              <Button
                className="gap-2"
                size="sm"
                variant={isActive("/dashboard") ? "secondary" : "ghost"}
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/trades/publish">
              <Button
                className="gap-2"
                size="sm"
                variant={isActive("/trades/publish") ? "secondary" : "ghost"}
              >
                <Plus className="h-4 w-4" />
                Publish
              </Button>
            </Link>
            <Link href="/trades/search">
              <Button
                className="gap-2"
                size="sm"
                variant={isActive("/trades/search") ? "secondary" : "ghost"}
              >
                <Search className="h-4 w-4" />
                Search
              </Button>
            </Link>
            <Link href="/support">
              <Button
                className="gap-2"
                size="sm"
                variant={isActive("/support") ? "secondary" : "ghost"}
              >
                <HelpCircle className="h-4 w-4" />
                Support
              </Button>
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-2">
            {/* User Menu */}
            <Button className="gap-2" size="sm" variant="outline">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </Button>

            <Link href="/auth/sign-in">
              <Button
                className="gap-2 text-muted-foreground"
                size="sm"
                variant="ghost"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
