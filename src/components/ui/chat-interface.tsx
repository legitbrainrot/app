import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card"
import { Button } from "./button"
import { Input } from "./input"
import { ScrollArea } from "./scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { Send, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export interface ChatMessage {
  id: string
  userId: string
  content: string
  timestamp: string | Date
  user: {
    id: string
    username: string
    avatarUrl?: string
  }
}

export interface ChatInterfaceProps {
  messages: ChatMessage[]
  currentUserId: string
  onSendMessage: (content: string) => Promise<void>
  onTypingStart?: () => void
  onTypingStop?: () => void
  typingUsers?: string[]
  isLoading?: boolean
  placeholder?: string
  className?: string
}

export function ChatInterface({
  messages,
  currentUserId,
  onSendMessage,
  onTypingStart,
  onTypingStop,
  typingUsers = [],
  isLoading = false,
  placeholder = "Type your message...",
  className
}: ChatInterfaceProps) {
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!newMessage.trim() || isSending) return

    const messageContent = newMessage.trim()
    setNewMessage('')
    setIsSending(true)

    try {
      await onSendMessage(messageContent)
      inputRef.current?.focus()
    } catch (error) {
      console.error('Failed to send message:', error)
      // Restore message on error
      setNewMessage(messageContent)
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)

    // Handle typing indicators
    if (onTypingStart && e.target.value && !typingTimeoutRef.current) {
      onTypingStart()
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      if (onTypingStop) {
        onTypingStop()
      }
      typingTimeoutRef.current = undefined
    }, 1000)
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [])

  return (
    <Card className={`flex flex-col h-[500px] ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Trade Chat</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden px-0">
        <ScrollArea className="h-full px-6">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <p>No messages yet</p>
                <p className="text-sm">Start the conversation!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.userId === currentUserId ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={message.user.avatarUrl} alt={message.user.username} />
                    <AvatarFallback>
                      {message.user.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div
                    className={`flex flex-col max-w-[70%] ${
                      message.userId === currentUserId ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-muted-foreground">
                        {message.user.username}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                      </span>
                    </div>

                    <div
                      className={`rounded-lg px-3 py-2 text-sm ${
                        message.userId === currentUserId
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Typing indicator */}
            {typingUsers.length > 0 && (
              <div className="flex gap-3 items-center text-muted-foreground">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
                <span className="text-xs">
                  {typingUsers.length === 1
                    ? `${typingUsers[0]} is typing...`
                    : `${typingUsers.length} people are typing...`
                  }
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="pt-3">
        <div className="flex gap-2 w-full">
          <Input
            ref={inputRef}
            value={newMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={isSending || isLoading}
            className="flex-1"
            maxLength={500}
          />
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim() || isSending || isLoading}
            size="icon"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        {newMessage.length > 0 && (
          <div className="text-xs text-muted-foreground mt-1">
            {newMessage.length}/500 characters
          </div>
        )}
      </CardFooter>
    </Card>
  )
}