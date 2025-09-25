"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-client"
import { User, Calendar, Shield, Settings } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface UserProfileProps {
  showActions?: boolean
  className?: string
}

export function UserProfile({ showActions = true, className }: UserProfileProps) {
  const { data: session } = useAuth()

  if (!session?.user) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center text-muted-foreground">
            <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Not authenticated</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const user = session.user

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.image} alt={user.name || 'User'} />
            <AvatarFallback>
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold">
              {user.name || 'Roblox User'}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Shield className="h-4 w-4" />
              Verified Roblox Account
            </CardDescription>

            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                Online
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">User ID</p>
            <p className="font-mono text-xs">{user.id}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Member Since</p>
            <p className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {user.createdAt ? formatDistanceToNow(new Date(user.createdAt), { addSuffix: true }) : 'Recently'}
            </p>
          </div>
        </div>

        {user.email && (
          <div>
            <p className="text-muted-foreground text-sm">Email</p>
            <p className="text-sm">{user.email}</p>
          </div>
        )}

        {showActions && (
          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" size="sm" className="flex-1">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Compact version for navbar/headers
export function UserProfileCompact() {
  const { data: session } = useAuth()

  if (!session?.user) {
    return null
  }

  const user = session.user

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src={user.image} alt={user.name || 'User'} />
        <AvatarFallback>
          {user.name?.charAt(0).toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
      <div className="hidden sm:block">
        <p className="text-sm font-medium leading-none">
          {user.name || 'User'}
        </p>
        <p className="text-xs text-muted-foreground">
          Roblox Account
        </p>
      </div>
    </div>
  )
}