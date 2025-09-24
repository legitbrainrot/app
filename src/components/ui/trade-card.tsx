import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card"
import { Button } from "./button"
import { Badge } from "./badge"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { formatDistanceToNow } from "date-fns"

export interface TradeCardProps {
  id: string
  itemName: string
  itemImage: string
  description?: string
  price: number
  status: 'ACTIVE' | 'UNDER_REVIEW' | 'COMPLETED' | 'CANCELLED'
  createdAt: string | Date
  creator: {
    id: string
    username: string
    avatarUrl?: string
  }
  participantCount: number
  messageCount: number
  onJoin?: () => void
  onView?: () => void
  isCreator?: boolean
  className?: string
}

export function TradeCard({
  id,
  itemName,
  itemImage,
  description,
  price,
  status,
  createdAt,
  creator,
  participantCount,
  messageCount,
  onJoin,
  onView,
  isCreator,
  className
}: TradeCardProps) {
  const statusColors = {
    ACTIVE: 'bg-green-500',
    UNDER_REVIEW: 'bg-yellow-500',
    COMPLETED: 'bg-blue-500',
    CANCELLED: 'bg-red-500'
  }

  const statusLabels = {
    ACTIVE: 'Active',
    UNDER_REVIEW: 'Under Review',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled'
  }

  return (
    <Card className={`w-full max-w-sm hover:shadow-lg transition-shadow ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={creator.avatarUrl} alt={creator.username} />
              <AvatarFallback>{creator.username?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{creator.username}</span>
          </div>
          <Badge
            variant="secondary"
            className={`${statusColors[status]} text-white border-0`}
          >
            {statusLabels[status]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="aspect-square mb-3 overflow-hidden rounded-md bg-muted">
          <img
            src={itemImage}
            alt={itemName}
            className="h-full w-full object-cover transition-transform hover:scale-105"
            loading="lazy"
          />
        </div>

        <CardTitle className="text-lg font-semibold leading-tight mb-2 line-clamp-2">
          {itemName}
        </CardTitle>

        {description && (
          <CardDescription className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {description}
          </CardDescription>
        )}

        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold text-primary">
            ${price.toFixed(2)}
          </span>
          <div className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>{participantCount} participant{participantCount !== 1 ? 's' : ''}</span>
          <span>{messageCount} message{messageCount !== 1 ? 's' : ''}</span>
        </div>
      </CardContent>

      <CardFooter className="pt-0 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onView}
          className="flex-1"
        >
          View Details
        </Button>

        {!isCreator && status === 'ACTIVE' && (
          <Button
            size="sm"
            onClick={onJoin}
            className="flex-1"
          >
            Join Trade
          </Button>
        )}

        {isCreator && (
          <Badge variant="outline" className="px-2 py-1">
            Your Trade
          </Badge>
        )}
      </CardFooter>
    </Card>
  )
}