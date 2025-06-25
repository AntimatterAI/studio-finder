'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SwipeStack } from '@/components/SwipeCard'
import { ChatSystem } from '@/components/ChatSystem'
import { BookingSystem } from '@/components/BookingSystem'
import { ProfileEditor } from '@/components/ProfileEditor'
import { Heart, MessageSquare, Calendar, User, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function FeaturesPage() {
  const features = [
    {
      id: 'swipe',
      name: 'Artist Matching',
      description: 'Swipe through artists and producers to find your perfect collaboration partner',
      icon: Heart,
      color: 'from-pink-500 to-purple-600'
    },
    {
      id: 'chat',
      name: 'Chat System',
      description: 'Real-time messaging with artists, file sharing, and collaboration tools',
      icon: MessageSquare,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'booking',
      name: 'Studio Booking',
      description: 'Find and book professional recording studios with real-time availability',
      icon: Calendar,
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'profile',
      name: 'Profile Editor',
      description: 'Comprehensive profile management with portfolio showcase and social integration',
      icon: User,
      color: 'from-purple-500 to-pink-600'
    }
  ]

  const [activeFeature, setActiveFeature] = React.useState<string | null>(null)

  const renderFeatureDemo = () => {
    switch (activeFeature) {
      case 'swipe':
        return (
          <div className="max-w-md mx-auto">
            <SwipeStack />
          </div>
        )
      case 'chat':
        return (
          <div className="h-[600px]">
            <ChatSystem currentUserId="current-user" />
          </div>
        )
      case 'booking':
        return <BookingSystem />
      case 'profile':
        return <ProfileEditor />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Button variant="outline" className="mb-6 hover-lift" asChild>
            <Link href="/">
              ← Back to Home
            </Link>
          </Button>
          <h1 className="text-display-2xl font-display text-white mb-4">wavr Features</h1>
          <p className="text-body-lg text-gray-400 max-w-2xl mx-auto">
            Explore our powerful suite of tools designed to revolutionize music collaboration and studio booking
          </p>
        </div>

        {/* Feature Demo */}
        {activeFeature ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-display-lg font-display text-white">
                {features.find(f => f.id === activeFeature)?.name}
              </h2>
              <Button
                variant="outline"
                onClick={() => setActiveFeature(null)}
                className="hover-lift"
              >
                View All Features
              </Button>
            </div>
            <div className="animate-fade-in">
              {renderFeatureDemo()}
            </div>
          </div>
        ) : (
          <>
            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {features.map((feature) => (
                <Card
                  key={feature.id}
                  className="glass-neon hover-glow cursor-pointer group"
                  onClick={() => setActiveFeature(feature.id)}
                >
                  <CardHeader>
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-white text-xl">{feature.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 mb-4 leading-relaxed">{feature.description}</p>
                    <Button className="w-full gradient-primary hover-glow group">
                      Try Feature
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Technology Stack */}
            <Card className="glass-neon">
              <CardHeader>
                <CardTitle className="text-white text-center">Built with Modern Technology</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  <div>
                    <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold">⚛️</span>
                    </div>
                    <h4 className="text-white font-medium">React 19</h4>
                    <p className="text-gray-400 text-sm">Modern UI framework</p>
                  </div>
                  <div>
                    <div className="w-12 h-12 gradient-secondary rounded-xl flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold">🎨</span>
                    </div>
                    <h4 className="text-white font-medium">Framer Motion</h4>
                    <p className="text-gray-400 text-sm">Smooth animations</p>
                  </div>
                  <div>
                    <div className="w-12 h-12 gradient-accent rounded-xl flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold">💎</span>
                    </div>
                    <h4 className="text-white font-medium">Shadcn/ui</h4>
                    <p className="text-gray-400 text-sm">Beautiful components</p>
                  </div>
                  <div>
                    <div className="w-12 h-12 gradient-neon rounded-xl flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold">🔥</span>
                    </div>
                    <h4 className="text-white font-medium">Supabase</h4>
                    <p className="text-gray-400 text-sm">Real-time backend</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
} 