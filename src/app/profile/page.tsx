'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { User, Settings, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Profile {
  id: string
  role: 'artist_producer' | 'studio'
  tier_level: number
  display_name: string | null
  bio: string | null
  location: string | null
  profile_complete: boolean
  created_at: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
          router.push('/login')
          return
        }

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError) {
          console.error('Profile error:', profileError)
          setError('Failed to load profile')
          setLoading(false)
          return
        }

        setProfile(profileData)
      } catch (error) {
        console.error('Error loading profile:', error)
        setError('An unexpected error occurred')
      } finally {
        setLoading(false)
      }
    }

    getProfile()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
        <Card className="glass-card border-red-500/20 max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="text-red-400 mb-4">Error loading profile</div>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => router.push('/dashboard')} className="gradient-primary">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!profile?.profile_complete) {
    router.push('/profile/setup')
    return null
  }

  return (
    <div className="min-h-screen gradient-hero p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Button 
            variant="outline" 
            size="sm" 
            className="mb-6 glass-card border-primary/20 hover-lift focus-visible" 
            asChild
          >
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          
          <h1 className="text-display-xl font-display text-gradient-primary mb-2">Your Profile</h1>
          <p className="text-body-lg text-muted-foreground">Manage your wavr profile and settings</p>
        </div>

        {/* Profile Card */}
        <Card className="glass-card border-primary/20 shadow-2xl animate-scale-in">
          <CardHeader className="text-center pb-6">
            <div className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-heading-lg font-display">
              {profile?.display_name || 'Your Profile'}
            </CardTitle>
            <CardDescription className="text-body-md">
              {profile?.role === 'artist_producer' ? 'Artist/Producer' : 'Studio'} • Tier {profile?.tier_level}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-body-lg font-semibold text-foreground mb-2">Display Name</h3>
                <p className="text-muted-foreground">{profile?.display_name || 'Not set'}</p>
              </div>
              
              <div>
                <h3 className="text-body-lg font-semibold text-foreground mb-2">Location</h3>
                <p className="text-muted-foreground">{profile?.location || 'Not set'}</p>
              </div>
            </div>

            {profile?.bio && (
              <div>
                <h3 className="text-body-lg font-semibold text-foreground mb-2">Bio</h3>
                <p className="text-muted-foreground">{profile.bio}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-body-lg font-semibold text-foreground mb-2">Role</h3>
                <p className="text-muted-foreground capitalize">
                  {profile?.role === 'artist_producer' ? 'Artist/Producer' : 'Studio'}
                </p>
              </div>
              
              <div>
                <h3 className="text-body-lg font-semibold text-foreground mb-2">Tier Level</h3>
                <p className="text-muted-foreground">Level {profile?.tier_level}</p>
              </div>
            </div>

            <div>
              <h3 className="text-body-lg font-semibold text-foreground mb-2">Member Since</h3>
              <p className="text-muted-foreground">
                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
              <Button 
                className="gradient-primary hover-lift focus-visible shadow-lg"
                asChild
              >
                <Link href="/profile/setup">
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Profile
                </Link>
              </Button>
              
              <Button 
                variant="outline"
                className="hover-lift focus-visible"
                asChild
              >
                <Link href="/dashboard">
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 