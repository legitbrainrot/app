"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-client"
import { LogIn, LogOut, User } from "lucide-react"

interface LoginButtonProps {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  className?: string
}

export function LoginButton({ variant = "default", size = "default", className }: LoginButtonProps) {
  const { data: session, isPending } = useAuth()

  const handleLogin = () => {
    window.location.href = "/api/auth/signin/roblox"
  }

  const handleLogout = async () => {
    await fetch("/api/auth/signout", {
      method: "POST",
    })
    window.location.reload()
  }

  if (isPending) {
    return (
      <Button variant={variant} size={size} className={className} disabled>
        <User className="h-4 w-4 mr-2" />
        Loading...
      </Button>
    )
  }

  if (session?.user) {
    return (
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Sign Out
      </Button>
    )
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleLogin}
    >
      <LogIn className="h-4 w-4 mr-2" />
      Sign in with Roblox
    </Button>
  )
}