'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { 
  User, Star, MapPin, Music, 
  Heart, MessageSquare, ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/Header'

interface Artist {
  id: string
  role: string
  tier_level: number
  display_name: string
  bio: string | null
  location: string | null
  hourly_rate: number | null
  offers_production_services: boolean
  musical_styles: string[] | null
  influences: string[] | null
  instruments: string[] | null
  created_at: string
}

export default function BrowseArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'tier1' | 'producers'>('tier1')

  const loadArtists = useCallback(async () => {
    try {
      let query = supabase
        .from('profiles')
        .select('*')
        .eq('role', 'artist_producer')
        .eq('profile_complete', true)
        .order('created_at', { ascending: false })

      // Filter by tier level for public browsing
      if (filter === 'tier1') {
        query = query.eq('tier_level', 1)
      }

      const { data, error } = await query.limit(50)

      if (error) {
        console.error('Error loading artists:', error)
        return
      }

      setArtists(data || [])
    } catch (error) {
      console.error('Error loading artists:', error)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    loadArtists()
  }, [loadArtists])

  const handleConnect = (artistId: string) => {
    // Redirect to login/register for public users
    window.location.href = `/register?redirect=/profile/${artistId}`
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen gradient-hero pt-20">
          <div className="container mx-auto px-6 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading artists...</p>
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
              Browse Artists & Producers
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover talented artists and producers in our community. 
              Sign up to connect and collaborate with these creators.
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

          {/* Artists Grid */}
          {artists.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {artists.map((artist) => (
                <Card key={artist.id} className="glass-card border-primary/20 hover-lift">
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-bold text-lg">
                          {artist.display_name?.charAt(0) || '?'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-heading-sm font-semibold text-foreground">
                          {artist.display_name}
                        </h3>
                        <div className="flex items-center gap-2 text-purple-400 mb-1">
                          <User className="w-4 h-4" />
                          <span className="text-sm font-medium">Artist/Producer</span>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            Tier {artist.tier_level}
                          </span>
                        </div>
                        {artist.location && (
                          <div className="flex items-center gap-1 text-muted-foreground text-sm">
                            <MapPin className="w-3 h-3" />
                            {artist.location}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bio */}
                    {artist.bio && (
                      <div className="mb-4">
                        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                          {artist.bio}
                        </p>
                      </div>
                    )}

                    {/* Details */}
                    <div className="space-y-3 mb-4">
                      {/* Production Services */}
                      {artist.offers_production_services && (
                        <div className="flex items-center gap-2 text-green-400">
                          <Star className="w-4 h-4" />
                          <span className="text-sm font-medium">Offers Production Services</span>
                          {artist.hourly_rate && (
                            <span className="text-primary ml-auto">
                              ${artist.hourly_rate}/hr
                            </span>
                          )}
                        </div>
                      )}

                      {/* Musical Styles */}
                      {artist.musical_styles && artist.musical_styles.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-2">Styles</h4>
                          <div className="flex flex-wrap gap-1">
                            {artist.musical_styles.slice(0, 4).map((style, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
                              >
                                {style}
                              </span>
                            ))}
                            {artist.musical_styles.length > 4 && (
                              <span className="px-2 py-1 bg-muted rounded-full text-xs text-muted-foreground">
                                +{artist.musical_styles.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Instruments */}
                      {artist.instruments && artist.instruments.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-2">Instruments</h4>
                          <div className="flex flex-wrap gap-1">
                            {artist.instruments.slice(0, 3).map((instrument, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 rounded-full text-xs"
                              >
                                {instrument}
                              </span>
                            ))}
                            {artist.instruments.length > 3 && (
                              <span className="px-2 py-1 bg-muted rounded-full text-xs text-muted-foreground">
                                +{artist.instruments.length - 3} more
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
                        onClick={() => handleConnect(artist.id)}
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        Connect
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleConnect(artist.id)}
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Member Since */}
                    <div className="pt-3 text-center">
                      <p className="text-xs text-muted-foreground">
                        Member since {new Date(artist.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Music className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-heading-md font-semibold text-foreground mb-2">
                No Artists Found
              </h3>
              <p className="text-muted-foreground mb-4">
                Be the first artist to join our community!
              </p>
              <Button asChild className="gradient-primary">
                <Link href="/register">
                  Join as Artist
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          )}

          {/* CTA */}
          <div className="text-center mt-12">
            <div className="max-w-md mx-auto glass-card border-primary/20 p-6 rounded-lg">
              <h3 className="text-heading-md font-semibold text-foreground mb-2">
                Ready to Connect?
              </h3>
              <p className="text-muted-foreground mb-4">
                Join wavr to connect and collaborate with these talented artists.
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