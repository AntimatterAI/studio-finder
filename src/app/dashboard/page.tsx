'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Music, Users, Camera, MapPin, DollarSign, 
  Plus, Copy, Sun, Moon, LogOut, Crown, User, Heart, MessageSquare,
  Instagram, Twitter, Youtube, Upload, Star, Calendar,
  Radio, Headphones, Edit3, Save, X, CheckCircle
} from 'lucide-react'
import Link from 'next/link'
// import type { Metadata } from 'next'

// export const metadata: Metadata = {
//   title: 'Dashboard',
//   description: 'Your Studio Finder dashboard - manage your music collaborations, projects, and connections.',
// }

interface UserProfile {
  id: string
  role: 'artist' | 'producer' | 'studio' | null
  display_name: string | null
  bio: string | null
  location: string | null
  hourly_rate: number | null
  skills: string[] | null
  influences: string[] | null
  media_urls: string[] | null
  socials: Record<string, string> | null
  profile_complete: boolean
  availability: string | null
  equipment: string[] | null
}

export default function DashboardPage() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({})

  // Admin states
  const [inviteCode, setInviteCode] = useState('')
  const [codeType, setCodeType] = useState<'artist' | 'producer' | 'studio' | 'admin'>('artist')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const checkAuth = async () => {
    // Check if user is authenticated
    const userSession = localStorage.getItem('user_session')
    
    if (!userSession || userSession !== 'authenticated') {
      router.push('/login')
      return
    }
    
    // Check if admin
    const adminEmail = localStorage.getItem('admin_email')
    const adminSession = localStorage.getItem('admin_session')
    const isUserAdmin = adminSession === 'authenticated' && adminEmail === 'paul@antimatterai.com'
    setIsAdmin(isUserAdmin)

    if (!isUserAdmin) {
      // Load user profile for regular users
      await loadUserProfile()
    }
    
    setIsLoading(false)
  }

  useEffect(() => {
    checkAuth()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const loadUserProfile = async () => {
    try {
      // For demo purposes, we'll create a mock profile
      // In real app, this would fetch from Supabase based on user ID
      const mockProfile: UserProfile = {
        id: '1',
        role: 'artist',
        display_name: 'Alex Thompson',
        bio: 'Independent artist specializing in indie rock and alternative music. Always looking for new collaborators!',
        location: 'Los Angeles, CA',
        hourly_rate: 50,
        skills: ['Vocals', 'Guitar', 'Songwriting'],
        influences: ['Radiohead', 'Arctic Monkeys', 'Tame Impala'],
        media_urls: [],
        socials: {
          instagram: '@alexthompsonmusic',
          twitter: '@alexmusic',
          youtube: 'Alex Thompson Music'
        },
        profile_complete: true,
        availability: 'Available weekends',
        equipment: ['Fender Stratocaster', 'Marshall Amp', 'Pro Tools']
      }
      setProfile(mockProfile)
      setEditedProfile(mockProfile)
    } catch (error) {
      console.error('Error loading profile:', error)
    }
  }

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', newIsDark)
  }

  const handleLogout = () => {
    localStorage.removeItem('user_session')
    localStorage.removeItem('user_email')
    localStorage.removeItem('user_login_time')
    if (isAdmin) {
      localStorage.removeItem('admin_session')
      localStorage.removeItem('admin_email')
      localStorage.removeItem('admin_login_time')
    }
    router.push('/')
  }

  const generateInviteCode = async () => {
    setIsGenerating(true)
    try {
      const prefixes = {
        artist: ['ART', 'MUSIC', 'CREATE', 'TALENT'],
        producer: ['PROD', 'BEAT', 'MIX', 'STUDIO'],
        studio: ['SPACE', 'ROOM', 'REC', 'VENUE'],
        admin: ['ADMIN', 'SUPER', 'CTRL', 'MGMT']
      }
      const prefix = prefixes[codeType][Math.floor(Math.random() * 4)]
      const suffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
      const code = `${prefix}${suffix}`
      
      setInviteCode(code)
      await copyToClipboard(code)
    } catch (error) {
      console.error('Error generating code:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(code)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const saveProfile = async () => {
    try {
      // In real app, this would update Supabase
      setProfile(prev => ({ ...prev, ...editedProfile } as UserProfile))
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving profile:', error)
    }
  }

  const updateField = (field: keyof UserProfile, value: string | number | string[] | Record<string, string> | boolean | null) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Admin Dashboard
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8">
          {/* Admin Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Crown className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-display-lg font-display text-foreground">Admin Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, Paul</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={toggleTheme} className="p-2">
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Generate Invite Code
                </CardTitle>
                <CardDescription>Create invite codes for new users</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Code Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'artist', label: 'Artist', icon: User },
                      { value: 'producer', label: 'Producer', icon: Headphones },
                      { value: 'studio', label: 'Studio', icon: Radio },
                      { value: 'admin', label: 'Admin', icon: Crown }
                    ].map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => setCodeType(value as typeof codeType)}
                        className={`p-3 rounded-lg border text-sm font-medium transition-all flex items-center gap-2 ${
                          codeType === value
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                
                <Button onClick={generateInviteCode} disabled={isGenerating} className="w-full">
                  {isGenerating ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Generate {codeType.charAt(0).toUpperCase() + codeType.slice(1)} Code
                </Button>

                {inviteCode && (
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-mono font-bold text-lg">{inviteCode}</p>
                        <p className="text-sm text-muted-foreground">Share this code with new {codeType}s</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(inviteCode)}
                      >
                        {copiedCode === inviteCode ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Quick Stats
                </CardTitle>
                <CardDescription>Platform overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">127</div>
                    <div className="text-sm text-muted-foreground">Total Users</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-500">45</div>
                    <div className="text-sm text-muted-foreground">Active Codes</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-500">23</div>
                    <div className="text-sm text-muted-foreground">New This Week</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-500">89%</div>
                    <div className="text-sm text-muted-foreground">Completion Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/admin">
                <Crown className="w-4 h-4 mr-2" />
                Open Full Admin Console
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Regular User Dashboard
  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Complete Your Profile</CardTitle>
            <CardDescription>Set up your profile to start collaborating</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/profile/setup">
                <User className="w-4 h-4 mr-2" />
                Set Up Profile
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getRoleIcon = () => {
    switch (profile.role) {
      case 'artist': return <User className="w-6 h-6" />
      case 'producer': return <Headphones className="w-6 h-6" />
      case 'studio': return <Radio className="w-6 h-6" />
      default: return <Music className="w-6 h-6" />
    }
  }

  const getRoleColor = () => {
    switch (profile.role) {
      case 'artist': return 'text-blue-500'
      case 'producer': return 'text-purple-500'
      case 'studio': return 'text-green-500'
      default: return 'text-primary'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Music className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-display-lg font-display text-foreground">Studio Finder</h1>
              <p className="text-muted-foreground">Welcome back, {profile.display_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={toggleTheme} className="p-2">
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="card-modern">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <div className={`w-6 h-6 ${getRoleColor()}`}>
                      {getRoleIcon()}
                    </div>
                    My Profile
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? (
                      <>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Display Name</Label>
                    {isEditing ? (
                      <Input
                        value={editedProfile.display_name || ''}
                        onChange={(e) => updateField('display_name', e.target.value)}
                        placeholder="Your display name"
                      />
                    ) : (
                      <p className="text-foreground font-medium">{profile.display_name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <p className={`font-medium capitalize ${getRoleColor()}`}>{profile.role}</p>
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label>Bio</Label>
                  {isEditing ? (
                    <textarea
                      className="w-full p-3 border rounded-lg bg-background"
                      rows={3}
                      value={editedProfile.bio || ''}
                      onChange={(e) => updateField('bio', e.target.value)}
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-muted-foreground">{profile.bio}</p>
                  )}
                </div>

                {/* Location & Rate */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Location
                    </Label>
                    {isEditing ? (
                      <Input
                        value={editedProfile.location || ''}
                        onChange={(e) => updateField('location', e.target.value)}
                        placeholder="Your location"
                      />
                    ) : (
                      <p className="text-foreground">{profile.location}</p>
                    )}
                  </div>
                  {profile.role !== 'artist' && (
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Hourly Rate
                      </Label>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={editedProfile.hourly_rate || ''}
                          onChange={(e) => updateField('hourly_rate', Number(e.target.value))}
                          placeholder="0"
                        />
                      ) : (
                        <p className="text-foreground">${profile.hourly_rate}/hour</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Skills */}
                <div className="space-y-2">
                  <Label>Skills</Label>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills?.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Influences */}
                <div className="space-y-2">
                  <Label>Influences</Label>
                  <div className="flex flex-wrap gap-2">
                    {profile.influences?.map((influence, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm"
                      >
                        {influence}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div className="space-y-2">
                  <Label>Social Links</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {profile.socials && Object.entries(profile.socials).map(([platform, handle]) => (
                      <div key={platform} className="flex items-center gap-2">
                        {platform === 'instagram' && <Instagram className="w-4 h-4" />}
                        {platform === 'twitter' && <Twitter className="w-4 h-4" />}
                        {platform === 'youtube' && <Youtube className="w-4 h-4" />}
                        <span className="text-sm">{handle}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-3">
                    <Button onClick={saveProfile}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Camera className="w-4 h-4 mr-2" />
                  Upload Photos
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Add Music
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Find Collaborators
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Session
                </Button>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle>Your Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Profile Views</span>
                  <span className="font-semibold">24</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Connections</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Projects</span>
                  <span className="font-semibold">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-semibold">4.8</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span>2 new followers</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                  <span>3 new messages</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Music className="w-4 h-4 text-purple-500" />
                  <span>Tagged in &quot;Summer Vibes&quot;</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 