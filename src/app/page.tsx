'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

import { ArrowRight, Music, Users, Calendar, Star, Sparkles, Headphones, Mic, Radio, MapPin, CheckCircle } from 'lucide-react'
import AnimatedMusicBackground from '@/components/AnimatedMusicBackground'
import { supabase } from '@/lib/supabase'

interface TierOneProfile {
  id: string
  role: 'artist' | 'producer' | 'studio'
  display_name: string
  bio: string
  location: string
  hourly_rate: number | null
  rating: number
  total_bookings: number
  verified: boolean
  equipment: string[]
  skills: string[]
}

export default function HomePage() {
  const [tierOneProfiles, setTierOneProfiles] = useState<TierOneProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // INVERTED LOGIC: Default to dark mode, only light if explicitly chosen
    const checkTheme = () => {
      const theme = localStorage.getItem('theme')
      const isLightMode = theme === 'light'  // Only light if explicitly set to 'light'
      const isDarkMode = !isLightMode        // Dark mode is the default (inverted)
      document.documentElement.classList.toggle('dark', isDarkMode)
      document.documentElement.classList.toggle('light', isLightMode)
    }
    
    checkTheme()
    fetchTierOneProfiles()
  }, [])

  const fetchTierOneProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('tier_level', 1)
        .eq('profile_complete', true)
        .order('rating', { ascending: false })
        .limit(6)

      if (error) {
        console.error('Error fetching tier 1 profiles:', error)
        // If the error is due to missing table, show a friendly message
        if (error.message?.includes('relation "public.profiles" does not exist')) {
          console.log('Database not set up yet - this is normal for new installations')
        }
      } else {
        setTierOneProfiles(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }



  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'artist': return <Mic className="w-5 h-5" />
      case 'producer': return <Headphones className="w-5 h-5" />
      case 'studio': return <Radio className="w-5 h-5" />
      default: return <Music className="w-5 h-5" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'artist': return 'text-blue-500 bg-blue-500/10'
      case 'producer': return 'text-purple-500 bg-purple-500/10'
      case 'studio': return 'text-green-500 bg-green-500/10'
      default: return 'text-primary bg-primary/10'
    }
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Animation */}
      <AnimatedMusicBackground />
      

      
      <div className="container mx-auto px-6 py-16 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-16 w-64 dark:block hidden">
              <svg viewBox="0 0 400 120" className="h-full w-full" style={{background: 'transparent'}}>
                <defs>
                  <linearGradient id="hero-gradient-dark" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor:'#4F7FFF', stopOpacity:1}} />
                    <stop offset="100%" style={{stopColor:'#9F7FFF', stopOpacity:1}} />
                  </linearGradient>
                </defs>
                <circle cx="105" cy="60" r="50" fill="transparent" stroke="url(#hero-gradient-dark)" strokeWidth="6"/>
                <path d="M 70 60 Q 75 45 80 60 Q 85 75 90 60 Q 95 30 100 60 Q 105 90 110 60 Q 115 30 120 60 Q 125 75 130 60 Q 135 45 140 60" 
                      fill="none" stroke="url(#hero-gradient-dark)" strokeWidth="4" strokeLinecap="round"/>
                <text x="185" y="80" fontFamily="Arial, sans-serif" fontSize="48" fontWeight="600" fill="white">wavr</text>
              </svg>
            </div>
            <div className="h-16 w-64 dark:hidden block">
              <svg viewBox="0 0 400 120" className="h-full w-full" style={{background: 'transparent'}}>
                <defs>
                  <linearGradient id="hero-gradient-light" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor:'#4F7FFF', stopOpacity:1}} />
                    <stop offset="100%" style={{stopColor:'#9F7FFF', stopOpacity:1}} />
                  </linearGradient>
                </defs>
                <circle cx="105" cy="60" r="50" fill="transparent" stroke="url(#hero-gradient-light)" strokeWidth="6"/>
                <path d="M 70 60 Q 75 45 80 60 Q 85 75 90 60 Q 95 30 100 60 Q 105 90 110 60 Q 115 30 120 60 Q 125 75 130 60 Q 135 45 140 60" 
                      fill="none" stroke="url(#hero-gradient-light)" strokeWidth="4" strokeLinecap="round"/>
                <text x="185" y="80" fontFamily="Arial, sans-serif" fontSize="48" fontWeight="600" fill="#1a1a2e">wavr</text>
              </svg>
            </div>
          </div>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Connect with talented artists, producers, and studios. 
            Collaborate, create, and grow your music together.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="button-primary" asChild>
              <Link href="/register">
                Join as Tier 1 - Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="button-secondary" asChild>
              <Link href="/login">
                Sign In
              </Link>
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mt-4">
            Browse our community below • No sign up required
          </p>
        </div>

        {/* Featured Tier 1 Members */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full text-sm font-medium mb-4">
              <Star className="w-4 h-4" />
              Tier 1 Community
            </div>
            <h2 className="text-display-lg font-display text-foreground mb-4">
              Discover Our Members
            </h2>
            <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
              Browse our community of talented artists, producers, and studios. 
              Sign up to connect and collaborate with these creators.
            </p>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="card-modern">
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="w-12 h-12 bg-muted rounded-xl mb-4"></div>
                      <div className="h-5 bg-muted rounded mb-2"></div>
                      <div className="h-4 bg-muted rounded w-2/3 mb-4"></div>
                      <div className="h-3 bg-muted rounded w-full mb-2"></div>
                      <div className="h-3 bg-muted rounded w-3/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : tierOneProfiles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tierOneProfiles.map((profile) => (
                <Card key={profile.id} className="card-modern hover-lift group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getRoleColor(profile.role)}`}>
                        {getRoleIcon(profile.role)}
                      </div>
                      <div className="flex items-center gap-1">
                        {profile.verified && <CheckCircle className="w-4 h-4 text-green-500" />}
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{profile.rating}</span>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
                      {profile.display_name}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <span className="capitalize font-medium">{profile.role}</span>
                      {profile.location && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {profile.location}
                          </div>
                        </>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {profile.bio}
                    </p>
                    
                    {profile.hourly_rate && (
                      <div className="text-sm font-medium text-foreground mb-3">
                        ${profile.hourly_rate}/hour
                      </div>
                    )}
                    
                    {(profile.skills?.length > 0 || profile.equipment?.length > 0) && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {(profile.role === 'artist' ? profile.skills : profile.equipment)?.slice(0, 3).map((item) => (
                          <span key={item} className="px-2 py-1 bg-muted rounded text-xs">
                            {item}
                          </span>
                        ))}
                        {(profile.role === 'artist' ? profile.skills : profile.equipment)?.length > 3 && (
                          <span className="px-2 py-1 bg-muted rounded text-xs">
                            +{(profile.role === 'artist' ? profile.skills : profile.equipment).length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div className="text-xs text-muted-foreground">
                      {profile.total_bookings} completed sessions
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No members yet</h3>
              <p className="text-muted-foreground">Be the first to join our community!</p>
            </div>
          )}
          
          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link href="/register">
                View All Members - Join Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <Card className="card-modern hover-lift">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <CardTitle className="text-heading-md">Find Collaborators</CardTitle>
              <CardDescription>
                Connect with artists and producers who share your musical vision and style.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="card-modern hover-lift">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-green-500" />
              </div>
              <CardTitle className="text-heading-md">Book Studio Time</CardTitle>
              <CardDescription>
                Discover and book professional studios with the equipment you need.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="card-modern hover-lift">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-purple-500" />
              </div>
              <CardTitle className="text-heading-md">Showcase Your Work</CardTitle>
              <CardDescription>
                Share your music, build your reputation, and attract new opportunities.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Tier Information */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-display-lg font-display text-foreground mb-4">
              Membership Tiers
            </h2>
            <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
              Start with Tier 1 for free, or get invited to higher tiers for exclusive access.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-modern border-green-200 dark:border-green-800">
              <CardHeader>
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center mb-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <CardTitle className="text-heading-md text-green-700 dark:text-green-300">Tier 1 - Public</CardTitle>
                <CardDescription>Free for everyone</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Connect with other Tier 1 members
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Book Tier 1 studios and producers
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Share your music and portfolio
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Public profile visibility
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="card-modern border-blue-200 dark:border-blue-800">
              <CardHeader>
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3">
                  <Star className="w-5 h-5 text-blue-500" />
                </div>
                <CardTitle className="text-heading-md text-blue-700 dark:text-blue-300">Tier 2 - Premium</CardTitle>
                <CardDescription>Invite only</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    Access to Tier 1 & 2 networks
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    Priority booking and features
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    Advanced collaboration tools
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    Exclusive events and opportunities
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="card-modern border-purple-200 dark:border-purple-800">
              <CardHeader>
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center mb-3">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                </div>
                <CardTitle className="text-heading-md text-purple-700 dark:text-purple-300">Tier 3 - Elite</CardTitle>
                <CardDescription>Invitation only</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-500" />
                    Full platform access
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-500" />
                    Direct industry connections
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-500" />
                    Premium studio partnerships
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-500" />
                    Concierge booking services
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <div className="text-center mb-20">
          <h2 className="text-display-lg font-display text-foreground mb-12">
            Join Our Growing Community
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="stat-card">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">500+</div>
              <div className="text-sm text-muted-foreground">Active Members</div>
            </div>
            
            <div className="stat-card">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">1,200+</div>
              <div className="text-sm text-muted-foreground">Collaborations</div>
            </div>
            
            <div className="stat-card">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                <Radio className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">50+</div>
              <div className="text-sm text-muted-foreground">Studios</div>
            </div>
            
            <div className="stat-card">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                <Mic className="w-5 h-5 text-purple-500" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">10k+</div>
              <div className="text-sm text-muted-foreground">Tracks Created</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto card-modern">
            <CardContent className="p-12">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-display-md font-display text-foreground mb-4">
                Ready to Create?
              </h3>
              <p className="text-body-lg text-muted-foreground mb-8">
                Join wavr today and start building your music network.
              </p>
              <Button size="lg" className="button-primary" asChild>
                <Link href="/register">
                  Start Your Journey - Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
