'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Send, Paperclip, Mic, MoreVertical, Phone, Video, Music, Check, CheckCheck } from 'lucide-react'

interface Message {
  id: string
  senderId: string
  content: string
  timestamp: Date
  type: 'text' | 'audio' | 'file' | 'collaboration'
  status: 'sent' | 'delivered' | 'read'
  attachments?: {
    type: 'audio' | 'image' | 'file'
    url: string
    name: string
  }[]
}

interface Chat {
  id: string
  name: string
  avatar: string
  role: 'artist' | 'producer'
  isOnline: boolean
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
}

interface ChatSystemProps {
  currentUserId: string
}

export function ChatSystem({ currentUserId }: ChatSystemProps) {
  const [chats] = useState<Chat[]>([
    {
      id: '1',
      name: 'Luna Rodriguez',
      avatar: '🎤',
      role: 'artist',
      isOnline: true,
      lastMessage: 'Sounds great! When can we start?',
      lastMessageTime: new Date(Date.now() - 5 * 60 * 1000),
      unreadCount: 2
    },
    {
      id: '2',
      name: 'Marcus "Waves" Johnson',
      avatar: '🎛️',
      role: 'producer',
      isOnline: false,
      lastMessage: 'I have some ideas for the hook',
      lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      unreadCount: 0
    },
    {
      id: '3',
      name: 'Aurora Nightingale',
      avatar: '🎵',
      role: 'artist',
      isOnline: true,
      lastMessage: 'Love the new beat!',
      lastMessageTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
      unreadCount: 1
    }
  ])

  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: '1',
      content: 'Hey! I listened to your tracks and I love your style. Would you be interested in collaborating on a new project?',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      type: 'text',
      status: 'read'
    },
    {
      id: '2',
      senderId: currentUserId,
      content: 'Absolutely! I\'ve been looking for an artist with your vibe. What genre are you thinking?',
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      type: 'text',
      status: 'read'
    },
    {
      id: '3',
      senderId: '1',
      content: 'I was thinking something with R&B influences but with modern production. Something fresh!',
      timestamp: new Date(Date.now() - 20 * 60 * 1000),
      type: 'text',
      status: 'read'
    },
    {
      id: '4',
      senderId: currentUserId,
      content: 'Perfect! I have some beats that would work great. Let me send you a demo.',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      type: 'text',
      status: 'delivered'
    },
    {
      id: '5',
      senderId: '1',
      content: 'Sounds great! When can we start?',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      type: 'text',
      status: 'sent'
    }
  ])

  const [newMessage, setNewMessage] = useState('')
  const [isTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = () => {
    if (!newMessage.trim() || !activeChat) return

    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      content: newMessage.trim(),
      timestamp: new Date(),
      type: 'text',
      status: 'sent'
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')

    // Simulate message delivery
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === message.id 
            ? { ...msg, status: 'delivered' }
            : msg
        )
      )
    }, 1000)
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return 'now'
    if (diffMins < 60) return `${diffMins}m`
    if (diffHours < 24) return `${diffHours}h`
    return `${diffDays}d`
  }

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sent':
        return <Check className="w-3 h-3 text-gray-400" />
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-gray-400" />
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-400" />
    }
  }

  if (!activeChat) {
    return (
      <div className="h-full flex">
        {/* Chat List */}
        <div className="w-80 border-r border-border/20">
          <CardHeader>
            <CardTitle className="text-lg text-white">Messages</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-2">
              {chats.map((chat) => (
                <motion.div
                  key={chat.id}
                  className="p-4 hover:bg-white/5 cursor-pointer border-b border-border/10 transition-colors"
                  onClick={() => setActiveChat(chat.id)}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center text-xl">
                        {chat.avatar}
                      </div>
                      {chat.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-white truncate">{chat.name}</h4>
                        <span className="text-xs text-gray-400">
                          {formatTime(chat.lastMessageTime)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-400 truncate">{chat.lastMessage}</p>
                        {chat.unreadCount > 0 && (
                          <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center text-center">
          <div>
            <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Music className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Select a conversation</h3>
            <p className="text-gray-400">Choose a chat to start collaborating</p>
          </div>
        </div>
      </div>
    )
  }

  const selectedChat = chats.find(chat => chat.id === activeChat)

  return (
    <div className="h-full flex">
      {/* Chat List */}
      <div className="w-80 border-r border-border/20">
        <CardHeader>
          <CardTitle className="text-lg text-white">Messages</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-2">
            {chats.map((chat) => (
              <motion.div
                key={chat.id}
                className={`p-4 cursor-pointer border-b border-border/10 transition-colors ${
                  activeChat === chat.id ? 'bg-primary/10 border-l-4 border-l-primary' : 'hover:bg-white/5'
                }`}
                onClick={() => setActiveChat(chat.id)}
                whileHover={{ x: activeChat === chat.id ? 0 : 4 }}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center text-xl">
                      {chat.avatar}
                    </div>
                    {chat.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-white truncate">{chat.name}</h4>
                      <span className="text-xs text-gray-400">
                        {formatTime(chat.lastMessageTime)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-400 truncate">{chat.lastMessage}</p>
                      {chat.unreadCount > 0 && (
                        <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="glass-neon p-4 border-b border-border/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center">
                  {selectedChat?.avatar}
                </div>
                {selectedChat?.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-background"></div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-white">{selectedChat?.name}</h3>
                <p className="text-xs text-gray-400">
                  {selectedChat?.isOnline ? 'Online' : 'Last seen 2h ago'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="hover-glow">
                <Phone className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" className="hover-glow">
                <Video className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" className="hover-glow">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] ${
                    message.senderId === currentUserId
                      ? 'chat-bubble-sent'
                      : 'chat-bubble-received'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <div className={`flex items-center gap-1 mt-1 ${
                    message.senderId === currentUserId ? 'justify-end' : 'justify-start'
                  }`}>
                    <span className="text-xs opacity-60">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {message.senderId === currentUserId && getStatusIcon(message.status)}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="chat-bubble-received">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="glass-neon p-4 border-t border-border/20">
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="hover-glow">
              <Paperclip className="w-4 h-4" />
            </Button>
            <div className="flex-1 relative">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="pr-20 bg-background/50 border-border/20 focus:border-primary/50"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Mic className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <Button 
              size="sm" 
              className="gradient-primary hover-glow"
              onClick={sendMessage}
              disabled={!newMessage.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 