'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'
import { 
  ArrowLeft, Users, Heart, MessageSquare, 
  Search, UserPlus, UserMinus, Star, MapPin,
  Headphones, Radio, User
} from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/Header'

interface Connection {
  id: string
  connected_user_id: string
  status: 'pending' | 'accepted' | 'blocked'
  created_at: string
  user_profile: {
    id: string
    display_name: string
    role: string
    tier_level: number
    location: string | null
    bio: string | null
    offers_production_services: boolean
    hourly_rate: number | null
  }
}

// interface UserProfile {
//   id: string
//   display_name: string
//   role: string
//   profile_complete: boolean
// }

export default function ConnectionsPage() {
  const router = useRouter()
  // const [currentUser, setCurrentUser] = useState<UserProfile | null>(null) // TODO: Use for future features
  const [connections, setConnections] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<'all' | 'artists' | 'producers' | 'studios'>('all')

  useEffect(() => {
    const initPage = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
          router.push('/login')
          return
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (!profile || !profile.profile_complete) {
          router.push('/profile/setup')
          return
        }

        // setCurrentUser(profile) // TODO: Use for future features
        await loadConnections(user.id)
      } catch (error) {
        console.error('Error initializing page:', error)
      } finally {
        setLoading(false)
      }
    }

    initPage()
  }, [router])

  const loadConnections = async (userId: string) => {
    try {
      // For now, simulate connections data since we don't have a connections table yet
      // In a real app, you would query a connections table
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', userId)
        .eq('profile_complete', true)
        .limit(10)

      // Simulate connection data structure
      const mockConnections = profiles?.map(profile => ({
        id: `conn_${profile.id}`,
        connected_user_id: profile.id,
        status: 'accepted' as const,
        created_at: new Date().toISOString(),
        user_profile: {
          id: profile.id,
          display_name: profile.display_name,
          role: profile.role,
          tier_level: profile.tier_level,
          location: profile.location,
          bio: profile.bio,
          offers_production_services: profile.offers_production_services,
          hourly_rate: profile.hourly_rate
        }
      })) || []

      setConnections(mockConnections)
    } catch (error) {
      console.error('Error loading connections:', error)
    }
  }

  const filteredConnections = connections.filter(connection => {
    const matchesSearch = connection.user_profile.display_name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase())
    
    const matchesFilter = filter === 'all' || 
      (filter === 'artists' && connection.user_profile.role === 'artist_producer' && !connection.user_profile.offers_production_services) ||
      (filter === 'producers' && connection.user_profile.role === 'artist_producer' && connection.user_profile.offers_production_services) ||
      (filter === 'studios' && connection.user_profile.role === 'studio')

    return matchesSearch && matchesFilter
  })

  const getRoleIcon = (role: string, offersServices: boolean) => {
    if (role === 'artist_producer') {
      return offersServices ? <Headphones className="w-4 h-4" /> : <User className="w-4 h-4" />
    }
    return <Radio className="w-4 h-4" />
  }

  const getRoleColor = (role: string, offersServices: boolean) => {
    if (role === 'artist_producer') {
      return offersServices ? 'text-purple-400' : 'text-blue-400'
    }
    return 'text-green-400'
  }

  const getRoleLabel = (role: string, offersServices: boolean) => {
    if (role === 'artist_producer') {
      return offersServices ? 'Producer' : 'Artist'
    }
    return 'Studio'
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen gradient-hero pt-20">
          <div className="container mx-auto px-6 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading connections...</p>
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
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="glass-card border-primary/20 hover-lift" 
                asChild
              >
                <Link href="/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
              
              <div>
                <h1 className="text-heading-xl font-display text-gradient-primary">
                  My Connections
                </h1>
                <p className="text-muted-foreground">
                  {filteredConnections.length} connections • Manage your network
                </p>
              </div>
            </div>

            <Button asChild className="gradient-primary">
              <Link href="/discover">
                <UserPlus className="w-4 h-4 mr-2" />
                Find More
              </Link>
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search connections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 glass-card border-primary/20"
              />
            </div>
            
            <div className="flex gap-2">
              {[
                { key: 'all', label: 'All', icon: Users },
                { key: 'artists', label: 'Artists', icon: User },
                { key: 'producers', label: 'Producers', icon: Headphones },
                { key: 'studios', label: 'Studios', icon: Radio }
              ].map(({ key, label, icon: Icon }) => (
                <Button
                  key={key}
                  variant={filter === key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(key as typeof filter)}
                  className={filter === key ? 'gradient-primary' : 'glass-card border-primary/20'}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Connections Grid */}
          {filteredConnections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredConnections.map((connection) => (
                <Card key={connection.id} className="glass-card border-primary/20 hover-lift">
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-bold text-lg">
                          {connection.user_profile.display_name?.charAt(0) || '?'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-heading-sm font-semibold text-foreground">
                          {connection.user_profile.display_name}
                        </h3>
                        <div className={`flex items-center gap-2 ${getRoleColor(connection.user_profile.role, connection.user_profile.offers_production_services)} mb-1`}>
                          {getRoleIcon(connection.user_profile.role, connection.user_profile.offers_production_services)}
                          <span className="text-sm font-medium">
                            {getRoleLabel(connection.user_profile.role, connection.user_profile.offers_production_services)}
                          </span>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            Tier {connection.user_profile.tier_level}
                          </span>
                        </div>
                        {connection.user_profile.location && (
                          <div className="flex items-center gap-1 text-muted-foreground text-sm">
                            <MapPin className="w-3 h-3" />
                            {connection.user_profile.location}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bio */}
                    {connection.user_profile.bio && (
                      <div className="mb-4">
                        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                          {connection.user_profile.bio}
                        </p>
                      </div>
                    )}

                    {/* Production Services */}
                    {connection.user_profile.offers_production_services && connection.user_profile.hourly_rate && (
                      <div className="mb-4 p-2 bg-green-500/10 rounded-lg border border-green-500/20">
                        <div className="flex items-center gap-2 text-green-400 text-sm">
                          <Star className="w-3 h-3" />
                          <span>Production Services: ${connection.user_profile.hourly_rate}/hr</span>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-border">
                      <Button size="sm" variant="outline" className="flex-1">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                      <Button size="sm" variant="outline">
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <UserMinus className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Connected Since */}
                    <div className="pt-3 text-center">
                      <p className="text-xs text-muted-foreground">
                        Connected {new Date(connection.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-heading-md font-semibold text-foreground mb-2">
                {searchTerm || filter !== 'all' ? 'No Matches Found' : 'No Connections Yet'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || filter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Start connecting with artists, producers, and studios!'
                }
              </p>
              <Button asChild className="gradient-primary">
                <Link href="/discover">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Discover Creators
                </Link>
              </Button>
            </div>
          )}

          {/* Stats */}
          {filteredConnections.length > 0 && (
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="glass-card border-primary/20">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {connections.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Connections</div>
                </CardContent>
              </Card>
              
              <Card className="glass-card border-primary/20">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">
                    {connections.filter(c => c.user_profile.role === 'artist_producer' && !c.user_profile.offers_production_services).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Artists</div>
                </CardContent>
              </Card>

              <Card className="glass-card border-primary/20">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400 mb-1">
                    {connections.filter(c => c.user_profile.role === 'artist_producer' && c.user_profile.offers_production_services).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Producers</div>
                </CardContent>
              </Card>

              <Card className="glass-card border-primary/20">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    {connections.filter(c => c.user_profile.role === 'studio').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Studios</div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  )
} 