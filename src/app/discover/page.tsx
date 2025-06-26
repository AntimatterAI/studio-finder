'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { 
  Heart, X, MapPin, DollarSign, Music, 
  ArrowLeft, Users, Headphones, Radio, Zap, Filter
} from 'lucide-react'
import Link from 'next/link'

interface Profile {
  id: string
  role: 'artist_producer' | 'studio'
  tier_level: number
  display_name: string
  bio: string | null
  location: string | null
  hourly_rate: number | null
  offers_production_services: boolean
  musical_styles: string[] | null
  created_at: string
}

export default function DiscoverPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<Profile | null>(null)
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [swiping, setSwiping] = useState(false)
  const [filter, setFilter] = useState<'all' | 'artist_producer' | 'studio'>('all')

  const loadProfiles = useCallback(async (currentUserId: string | null) => {
    try {
      let query = supabase
        .from('profiles')
        .select('*')
        .eq('profile_complete', true)
        .order('created_at', { ascending: false })

      // Exclude current user if authenticated
      if (currentUserId) {
        query = query.neq('id', currentUserId)
      } else {
        // Public users only see Tier 1 profiles
        query = query.eq('tier_level', 1)
      }

      if (filter !== 'all') {
        query = query.eq('role', filter)
      }

      const { data, error } = await query.limit(20)

      if (error) {
        console.error('Error loading profiles:', error)
        return
      }

      setProfiles(data || [])
      setCurrentIndex(0)
    } catch (error) {
      console.error('Error loading profiles:', error)
    }
  }, [filter])

  useEffect(() => {
    const initPage = async () => {
      try {
        // Check auth
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (user && !userError) {
          // User is authenticated - get their profile
          const { data: userProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

          if (userProfile && userProfile.profile_complete) {
            setCurrentUser(userProfile)
            await loadProfiles(userProfile.id)
          } else {
            // Redirect to profile setup if incomplete
            router.push('/profile/setup')
            return
          }
        } else {
          // Public user - load Tier 1 profiles only
          setCurrentUser(null)
          await loadProfiles(null)
        }
      } catch (error) {
        console.error('Error initializing discover page:', error)
        // For public users, still load profiles
        setCurrentUser(null)
        await loadProfiles(null)
      } finally {
        setLoading(false)
      }
    }

    initPage()
  }, [router, filter, loadProfiles])

  const handleSwipe = async (direction: 'like' | 'pass') => {
    if (swiping || currentIndex >= profiles.length) return

    setSwiping(true)
    const currentProfile = profiles[currentIndex]

    // In a real app, you'd save the like/pass to database
    console.log(`${direction} on profile:`, currentProfile.display_name)

    // Move to next profile
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1)
      setSwiping(false)
    }, 300)
  }



  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'artist_producer': return <Headphones className="w-4 h-4" />
      case 'studio': return <Radio className="w-4 h-4" />
      default: return <Music className="w-4 h-4" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'artist_producer': return 'text-purple-400'
      case 'studio': return 'text-green-400'
      default: return 'text-primary'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profiles...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-hero p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            className="glass-card border-primary/20 hover-lift" 
            asChild
          >
            <Link href={currentUser ? "/dashboard" : "/"}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {currentUser ? "Dashboard" : "Home"}
            </Link>
          </Button>
          
          <div className="text-center">
            <h1 className="text-heading-lg font-display text-gradient-primary">Discover</h1>
            {!currentUser && (
              <p className="text-xs text-muted-foreground">Tier 1 Creators</p>
            )}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="glass-card border-primary/20 hover-lift"
            onClick={() => {
              const filters = ['all', 'artist_producer', 'studio'] as const
              const nextFilter = filters[(filters.indexOf(filter) + 1) % filters.length]
              setFilter(nextFilter)
            }}
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {/* Filter Info */}
        <div className="text-center mb-6">
          <p className="text-muted-foreground">
            {filter === 'all' ? 'All Creators' : 
             filter === 'artist_producer' ? 'Artists & Producers' : 'Studios'}
          </p>
        </div>

        {/* Cards Stack */}
        <div className="relative h-[600px] mb-8">
          {currentIndex >= profiles.length ? (
            // No more profiles
            <Card className="glass-card border-primary/20 h-full flex items-center justify-center">
              <CardContent className="text-center">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-heading-md font-semibold text-foreground mb-2">No More Profiles</h3>
                <p className="text-muted-foreground mb-4">
                  You&apos;ve seen all available profiles. Check back later for new creators!
                </p>
                <Button 
                  onClick={() => currentUser?.id && loadProfiles(currentUser.id)}
                  className="gradient-primary"
                >
                  Refresh
                </Button>
              </CardContent>
            </Card>
          ) : (
            // Profile Cards
            profiles.slice(currentIndex, currentIndex + 2).map((profile, index) => (
              <Card
                key={profile.id}
                className={`absolute inset-0 glass-card border-primary/20 transition-all duration-300 ${
                  index === 0 ? 'z-20' : 'z-10 scale-95 opacity-50'
                } ${swiping && index === 0 ? 'scale-95 opacity-50' : ''}`}
              >
                <CardContent className="p-6 h-full flex flex-col">
                  {/* Profile Header */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xl">
                        {profile.display_name?.charAt(0) || '?'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-heading-md font-semibold text-foreground">
                        {profile.display_name}
                      </h3>
                      <div className={`flex items-center gap-2 ${getRoleColor(profile.role)} mb-1`}>
                        {getRoleIcon(profile.role)}
                        <span className="text-sm font-medium capitalize">
                          {profile.role === 'artist_producer' ? 'Artist/Producer' : 'Studio'}
                        </span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          Tier {profile.tier_level}
                        </span>
                      </div>
                      {profile.location && (
                        <div className="flex items-center gap-1 text-muted-foreground text-sm">
                          <MapPin className="w-3 h-3" />
                          {profile.location}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  {profile.bio && (
                    <div className="mb-6">
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {profile.bio}
                      </p>
                    </div>
                  )}

                  {/* Details */}
                  <div className="space-y-4 flex-1">
                    {/* Production Services */}
                    {profile.role === 'artist_producer' && profile.offers_production_services && (
                      <div className="flex items-center gap-2 text-green-400">
                        <Zap className="w-4 h-4" />
                        <span className="text-sm font-medium">Offers Production Services</span>
                        {profile.hourly_rate && (
                          <span className="text-primary">
                            ${profile.hourly_rate}/hr
                          </span>
                        )}
                      </div>
                    )}

                    {/* Studio Rate */}
                    {profile.role === 'studio' && profile.hourly_rate && (
                      <div className="flex items-center gap-2 text-green-400">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-sm">
                          ${profile.hourly_rate}/hour
                        </span>
                      </div>
                    )}

                    {/* Musical Styles */}
                    {profile.musical_styles && profile.musical_styles.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-2">Styles</h4>
                        <div className="flex flex-wrap gap-2">
                          {profile.musical_styles.slice(0, 6).map((style, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
                            >
                              {style}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Member Since */}
                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      Member since {new Date(profile.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Action Buttons */}
        {currentIndex < profiles.length && (
          <div className="flex justify-center gap-6">
            {currentUser ? (
              // Authenticated user - show swipe buttons
              <>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-16 h-16 rounded-full border-red-500/20 hover:border-red-500/50 hover:bg-red-500/10"
                  onClick={() => handleSwipe('pass')}
                  disabled={swiping}
                >
                  <X className="w-6 h-6 text-red-400" />
                </Button>
                <Button
                  size="lg"
                  className="w-16 h-16 rounded-full gradient-primary"
                  onClick={() => handleSwipe('like')}
                  disabled={swiping}
                >
                  <Heart className="w-6 h-6 text-white" />
                </Button>
              </>
            ) : (
              // Public user - show sign up buttons
              <div className="flex flex-col items-center gap-4">
                <div className="flex gap-4">
                  <Button asChild className="gradient-primary">
                    <Link href="/register">
                      Sign Up to Connect
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/login">
                      Sign In
                    </Link>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Join wavr to connect with creators and book sessions
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground text-sm">
            {currentUser 
              ? "Swipe right to connect • Swipe left to pass"
              : "Sign up to connect with creators and access all features"
            }
          </p>
        </div>
      </div>
    </div>
  )
} 