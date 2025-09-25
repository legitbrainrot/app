"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LoginButton } from "@/components/auth/login-button"
import { UserProfileCompact } from "@/components/auth/user-profile"
import { useAuth } from "@/lib/auth-client"
import { Shield, Plus, Search, User } from "lucide-react"

export function Navbar() {
  const { data: session, isPending } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Shield className="h-6 w-6 text-primary" />
          <span className="hidden sm:inline">RobloxTrade</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Browse Trades
          </Link>
          {session?.user && (
            <>
              <Link
                href="/create-trade"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Create Listing
              </Link>
              <Link
                href="/profile"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                My Trades
              </Link>
            </>
          )}
          <Link
            href="/how-it-works"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            How It Works
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Create Trade Button (mobile) */}
          {session?.user && (
            <Link href="/create-trade" className="md:hidden">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </Link>
          )}

          {/* Create Trade Button (desktop) */}
          {session?.user && (
            <Link href="/create-trade" className="hidden md:block">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Listing
              </Button>
            </Link>
          )}

          {/* User Profile or Login */}
          {isPending ? (
            <Button variant="ghost" size="sm" disabled>
              <User className="h-4 w-4 mr-2" />
              Loading...
            </Button>
          ) : session?.user ? (
            <div className="flex items-center gap-2">
              <UserProfileCompact />
              <LoginButton variant="ghost" size="sm" />
            </div>
          ) : (
            <LoginButton size="sm" />
          )}
        </div>

        {/* Mobile Navigation Menu */}
        <div className="md:hidden">
          {/* This would be a mobile menu toggle - simplified for now */}
        </div>
      </div>
    </header>
  )
}