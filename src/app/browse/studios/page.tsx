'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { 
  Radio, MapPin, 
  Heart, MessageSquare, ArrowRight, DollarSign, Clock
} from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/Header'

interface Studio {
  id: string
  role: string
  tier_level: number
  display_name: string
  bio: string | null
  location: string | null
  hourly_rate: number | null
  equipment: string[] | null
  created_at: string
}

export default function BrowseStudiosPage() {
  const [studios, setStudios] = useState<Studio[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'tier1'>('tier1')

  const loadStudios = useCallback(async () => {
    try {
      let query = supabase
        .from('profiles')
        .select('*')
        .eq('role', 'studio')
        .eq('profile_complete', true)
        .order('created_at', { ascending: false })

      // Filter by tier level for public browsing
      if (filter === 'tier1') {
        query = query.eq('tier_level', 1)
      }

      const { data, error } = await query.limit(50)

      if (error) {
        console.error('Error loading studios:', error)
        return
      }

      setStudios(data || [])
    } catch (error) {
      console.error('Error loading studios:', error)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    loadStudios()
  }, [loadStudios])

  const handleConnect = (studioId: string) => {
    // Redirect to login/register for public users
    window.location.href = `/register?redirect=/profile/${studioId}`
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen gradient-hero pt-20">
          <div className="container mx-auto px-6 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading studios...</p>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen gradient-hero pt-20">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-heading-xl font-display text-gradient-primary mb-4">
              Browse Studios
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find professional recording studios for your next project. 
              Sign up to book sessions and connect with these studio owners.
            </p>
          </div>

          {/* Filter */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex bg-muted/20 rounded-lg p-1">
              <button
                onClick={() => setFilter('tier1')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  filter === 'tier1'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Tier 1 (Public)
              </button>
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  filter === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                All Tiers
              </button>
            </div>
          </div>

          {/* Studios Grid */}
          {studios.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {studios.map((studio) => (
                <Card key={studio.id} className="glass-card border-primary/20 hover-lift">
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                        <span className="text-green-500 font-bold text-lg">
                          {studio.display_name?.charAt(0) || '?'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-heading-sm font-semibold text-foreground">
                          {studio.display_name}
                        </h3>
                        <div className="flex items-center gap-2 text-green-400 mb-1">
                          <Radio className="w-4 h-4" />
                          <span className="text-sm font-medium">Recording Studio</span>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            Tier {studio.tier_level}
                          </span>
                        </div>
                        {studio.location && (
                          <div className="flex items-center gap-1 text-muted-foreground text-sm">
                            <MapPin className="w-3 h-3" />
                            {studio.location}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bio */}
                    {studio.bio && (
                      <div className="mb-4">
                        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                          {studio.bio}
                        </p>
                      </div>
                    )}

                    {/* Details */}
                    <div className="space-y-3 mb-4">
                      {/* Hourly Rate */}
                      {studio.hourly_rate && (
                        <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-primary" />
                            <span className="text-primary font-bold">
                              ${studio.hourly_rate}/hour
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>Professional recording rates</span>
                          </div>
                        </div>
                      )}

                      {/* Equipment */}
                      {studio.equipment && studio.equipment.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-2">Equipment & Features</h4>
                          <div className="flex flex-wrap gap-1">
                            {studio.equipment.slice(0, 4).map((item, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 rounded-full text-xs"
                              >
                                {item}
                              </span>
                            ))}
                            {studio.equipment.length > 4 && (
                              <span className="px-2 py-1 bg-muted rounded-full text-xs text-muted-foreground">
                                +{studio.equipment.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-border">
                      <Button
                        size="sm"
                        className="flex-1 gradient-primary"
                        onClick={() => handleConnect(studio.id)}
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        Book Studio
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleConnect(studio.id)}
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Member Since */}
                    <div className="pt-3 text-center">
                      <p className="text-xs text-muted-foreground">
                        Studio partner since {new Date(studio.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Radio className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-heading-md font-semibold text-foreground mb-2">
                No Studios Found
              </h3>
              <p className="text-muted-foreground mb-4">
                Be the first studio to join our platform!
              </p>
              <Button asChild className="gradient-primary">
                <Link href="/register">
                  List Your Studio
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          )}

          {/* CTA */}
          <div className="text-center mt-12">
            <div className="max-w-md mx-auto glass-card border-primary/20 p-6 rounded-lg">
              <h3 className="text-heading-md font-semibold text-foreground mb-2">
                Need Studio Time?
              </h3>
              <p className="text-muted-foreground mb-4">
                Join wavr to book sessions and access professional recording studios.
              </p>
              <div className="flex gap-3">
                <Button asChild className="flex-1 gradient-primary">
                  <Link href="/register">
                    Join Free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/login">
                    Sign In
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 