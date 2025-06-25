'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { makeUserAdmin, setupFirstAdmin } from '@/lib/admin-utils'
import { 
  Copy, Trash2, Users, Key, CheckCircle, LogOut, User, 
  Activity, Sun, Moon, Shield, Star, MapPin, Radio, Headphones,
  Settings, Zap, RefreshCw, UserCheck, UserX,
  ChevronUp, ChevronDown, DollarSign, BarChart3
} from 'lucide-react'

interface InviteCode {
  id: string
  code: string
  code_type: 'artist' | 'producer' | 'studio' | 'admin'
  tier_level: 1 | 2 | 3
  status: 'available' | 'used'
  created_at: string
  used_at?: string
  used_by?: string
  notes?: string
}

interface UserProfile {
  id: string
  role: 'artist' | 'producer' | 'studio'
  tier_level: 1 | 2 | 3
  display_name: string | null
  bio: string | null
  location: string | null
  hourly_rate: number | null
  verified: boolean
  rating: number
  total_bookings: number
  total_earnings: number
  profile_views: number
  followers_count: number
  following_count: number
  posts_count: number
  last_active: string
  created_at: string
  user_email?: string
}

interface AdminStats {
  total_users: number
  tier1_users: number
  tier2_users: number
  tier3_users: number
  artists: number
  producers: number
  studios: number
  verified_users: number
  available_codes: number
  used_codes: number
  total_bookings: number
  completed_bookings: number
  total_posts: number
  total_earnings: number
}

export default function AdminPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isDark, setIsDark] = useState(false)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'codes' | 'users' | 'analytics' | 'settings'>('dashboard')
  
  // States
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>([])
  const [users, setUsers] = useState<UserProfile[]>([])
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [tierFilter, setTierFilter] = useState<'all' | 1 | 2 | 3>('all')
  const [roleFilter, setRoleFilter] = useState<'all' | 'artist' | 'producer' | 'studio'>('all')
  
  // Loading states
  const [isGeneratingCodes, setIsGeneratingCodes] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  
  // Admin promotion states
  const [adminPromoteEmail, setAdminPromoteEmail] = useState('')
  const [isPromoting, setIsPromoting] = useState(false)

  useEffect(() => {
    checkAuthentication()
    
    // Make admin utilities available in console for initial setup
    if (typeof window !== 'undefined') {
      (window as unknown as Record<string, unknown>).makeUserAdmin = makeUserAdmin;
      (window as unknown as Record<string, unknown>).setupFirstAdmin = setupFirstAdmin
      console.log('🛠️ Admin utilities loaded:')
      console.log('• makeUserAdmin("email@example.com") - Promote existing user to admin')
      console.log('• setupFirstAdmin("email@example.com", "password") - Create and setup first admin account')
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const checkAuthentication = async () => {
    const adminSession = localStorage.getItem('admin_session')
    const adminEmail = localStorage.getItem('admin_email')
    const loginTime = localStorage.getItem('admin_login_time')
    
    if (adminSession === 'authenticated' && adminEmail && loginTime) {
      const currentTime = Date.now()
      const sessionTime = parseInt(loginTime)
      const sessionAge = currentTime - sessionTime
      const maxSessionAge = 24 * 60 * 60 * 1000
      
      if (sessionAge < maxSessionAge) {
        // Verify admin status in database
        try {
          const { data: adminCheck, error } = await supabase
            .from('admin_users')
            .select('*')
            .eq('email', adminEmail)
            .single()

          if (error || !adminCheck) {
            handleLogout()
            return
          }

          setIsAuthenticated(true)
          loadData()
        } catch (error) {
          console.error('Error verifying admin status:', error)
          handleLogout()
        }
      } else {
        handleLogout()
      }
    } else {
      router.push('/admin/login')
    }
    setIsLoading(false)
  }

  const loadData = async () => {
    await Promise.all([fetchStats(), fetchInviteCodes(), fetchUsers()])
  }

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', newIsDark)
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_session')
    localStorage.removeItem('admin_email')
    localStorage.removeItem('admin_login_time')
    router.push('/admin/login')
  }

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_stats')
        .select('*')
        .single()

      if (error) throw error
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchInviteCodes = async () => {
    try {
      const { data, error } = await supabase
        .from('invites')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)

      if (error) throw error
      setInviteCodes(data || [])
    } catch (error) {
      console.error('Error fetching invite codes:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const generateInviteCodes = async () => {
    setIsGeneratingCodes(true)
    try {
      // Call the auto-generation function
      const { error } = await supabase.rpc('generate_invite_codes')
      if (error) throw error
      
      await fetchInviteCodes()
      await fetchStats()
    } catch (error) {
      console.error('Error generating invite codes:', error)
      alert('Failed to generate invite codes. Please try again.')
    } finally {
      setIsGeneratingCodes(false)
    }
  }

  const deleteInviteCode = async (id: string) => {
    if (!confirm('Are you sure you want to delete this invite code?')) return

    try {
      const { error } = await supabase.from('invites').delete().eq('id', id)
      if (error) throw error
      setInviteCodes(prev => prev.filter(code => code.id !== id))
      await fetchStats()
    } catch (error) {
      console.error('Error deleting invite code:', error)
      alert('Failed to delete invite code.')
    }
  }

  const updateUserTier = async (userId: string, newTier: 1 | 2 | 3) => {
    const user = users.find(u => u.id === userId)
    if (!user) return

    const action = newTier > user.tier_level ? 'promoted' : 'demoted'
    
    if (!confirm(`Are you sure you want to ${action} this user to Tier ${newTier}?`)) return

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ tier_level: newTier })
        .eq('id', userId)

      if (error) throw error
      
      // Log admin action
      await supabase.from('admin_actions').insert({
        admin_id: 'current-admin-id', // Would get from auth
        action_type: `tier_${action}`,
        target_user_id: userId,
        old_values: { tier_level: user.tier_level },
        new_values: { tier_level: newTier },
        notes: `User ${action} from Tier ${user.tier_level} to Tier ${newTier}`
      })
      
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, tier_level: newTier } : u
      ))
      
      await fetchStats()
      alert(`User successfully ${action} to Tier ${newTier}`)
    } catch (error) {
      console.error('Error updating user tier:', error)
      alert('Failed to update user tier.')
    }
  }

  const toggleUserVerification = async (userId: string) => {
    const user = users.find(u => u.id === userId)
    if (!user) return

    const newStatus = !user.verified
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ verified: newStatus })
        .eq('id', userId)

      if (error) throw error
      
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, verified: newStatus } : u
      ))
      
      await fetchStats()
    } catch (error) {
      console.error('Error updating verification:', error)
      alert('Failed to update verification status.')
    }
  }

  const deleteUser = async (userId: string) => {
    const user = users.find(u => u.id === userId)
    if (!user) return

    if (!confirm(`Are you sure you want to delete ${user.display_name || 'this user'}? This action cannot be undone and will delete all their posts, bookings, and connections.`)) return

    try {
      // Delete from profiles (cascade will handle related records)
      const { error } = await supabase.from('profiles').delete().eq('id', userId)
      if (error) throw error
      
      // Log admin action
      await supabase.from('admin_actions').insert({
        admin_id: 'current-admin-id',
        action_type: 'user_deleted',
        target_user_id: userId,
        notes: `Deleted user: ${user.display_name || 'Unknown'} (${user.role})`
      })
      
      setUsers(prev => prev.filter(u => u.id !== userId))
      await fetchStats()
      alert('User deleted successfully.')
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Failed to delete user.')
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

  const refreshData = async () => {
    setIsRefreshing(true)
    await loadData()
    setIsRefreshing(false)
  }

  const promoteToAdmin = async () => {
    if (!adminPromoteEmail.trim()) return
    
    setIsPromoting(true)
    try {
      const result = await makeUserAdmin(adminPromoteEmail)
      console.log(result)
      setAdminPromoteEmail('')
      alert(`Successfully promoted ${adminPromoteEmail} to admin!`)
    } catch (error) {
      console.error('Error promoting user:', error)
      alert('Failed to promote user. Check console for details.')
    } finally {
      setIsPromoting(false)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.location?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTier = tierFilter === 'all' || user.tier_level === tierFilter
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    return matchesSearch && matchesTier && matchesRole
  })

  const getTierColor = (tier: number) => {
    switch (tier) {
      case 1: return 'text-green-500 bg-green-50 dark:bg-green-900/20'
      case 2: return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20'
      case 3: return 'text-purple-500 bg-purple-50 dark:bg-purple-900/20'
      default: return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'artist': return <User className="w-4 h-4" />
      case 'producer': return <Headphones className="w-4 h-4" />
      case 'studio': return <Radio className="w-4 h-4" />
      default: return <User className="w-4 h-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground font-medium">Loading admin console...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-display-lg font-display text-foreground">Admin Console</h1>
              <p className="text-muted-foreground">Complete platform management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={refreshData} disabled={isRefreshing} className="p-2">
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Button variant="outline" size="sm" onClick={toggleTheme} className="p-2">
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 p-1 bg-muted rounded-lg w-fit mb-8">
          {[
            { key: 'dashboard', label: 'Dashboard', icon: Activity },
            { key: 'codes', label: 'Invite Codes', icon: Key },
            { key: 'users', label: 'User Management', icon: Users },
            { key: 'analytics', label: 'Analytics', icon: BarChart3 },
            { key: 'settings', label: 'Settings', icon: Settings }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as typeof activeTab)}
              className={`px-4 py-2 rounded-md font-medium transition-all text-sm flex items-center gap-2 ${
                activeTab === key
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {stats && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="stat-card">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-1">{stats.total_users}</div>
                    <div className="text-sm text-muted-foreground">Total Users</div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-1">{stats.available_codes}</div>
                    <div className="text-sm text-muted-foreground">Available Codes</div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center mx-auto mb-3">
                      <Star className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-1">{stats.verified_users}</div>
                    <div className="text-sm text-muted-foreground">Verified Users</div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
                      <DollarSign className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-1">${Math.round(stats.total_earnings).toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Total Earnings</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="card-modern">
                    <CardHeader>
                      <CardTitle>Tier Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Tier 1 (Public)</span>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            {stats.tier1_users} users
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Tier 2 (Premium)</span>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                            {stats.tier2_users} users
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Tier 3 (Elite)</span>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                            {stats.tier3_users} users
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="card-modern">
                    <CardHeader>
                      <CardTitle>Role Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span className="text-sm font-medium">Artists</span>
                          </div>
                          <span className="font-semibold">{stats.artists}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Headphones className="w-4 h-4" />
                            <span className="text-sm font-medium">Producers</span>
                          </div>
                          <span className="font-semibold">{stats.producers}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Radio className="w-4 h-4" />
                            <span className="text-sm font-medium">Studios</span>
                          </div>
                          <span className="font-semibold">{stats.studios}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="card-modern">
                    <CardHeader>
                      <CardTitle>Platform Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Total Posts</span>
                          <span className="font-semibold">{stats.total_posts}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Total Bookings</span>
                          <span className="font-semibold">{stats.total_bookings}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Completed Bookings</span>
                          <span className="font-semibold text-green-500">{stats.completed_bookings}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Completion Rate</span>
                          <span className="font-semibold">
                            {stats.total_bookings > 0 ? Math.round((stats.completed_bookings / stats.total_bookings) * 100) : 0}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </div>
        )}

        {/* Invite Codes Tab */}
        {activeTab === 'codes' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-heading-lg font-semibold">Invite Code Management</h2>
                <p className="text-muted-foreground">Automatically maintained invite code pool</p>
              </div>
              <Button onClick={generateInviteCodes} disabled={isGeneratingCodes}>
                {isGeneratingCodes ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4 mr-2" />
                )}
                Generate New Codes
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { type: 'artist', tier: 1, count: inviteCodes.filter(c => c.code_type === 'artist' && c.tier_level === 1 && c.status === 'available').length },
                { type: 'artist', tier: 2, count: inviteCodes.filter(c => c.code_type === 'artist' && c.tier_level === 2 && c.status === 'available').length },
                { type: 'artist', tier: 3, count: inviteCodes.filter(c => c.code_type === 'artist' && c.tier_level === 3 && c.status === 'available').length },
                { type: 'producer', tier: 1, count: inviteCodes.filter(c => c.code_type === 'producer' && c.tier_level === 1 && c.status === 'available').length },
                { type: 'producer', tier: 2, count: inviteCodes.filter(c => c.code_type === 'producer' && c.tier_level === 2 && c.status === 'available').length },
                { type: 'producer', tier: 3, count: inviteCodes.filter(c => c.code_type === 'producer' && c.tier_level === 3 && c.status === 'available').length },
                { type: 'studio', tier: 1, count: inviteCodes.filter(c => c.code_type === 'studio' && c.tier_level === 1 && c.status === 'available').length },
                { type: 'studio', tier: 2, count: inviteCodes.filter(c => c.code_type === 'studio' && c.tier_level === 2 && c.status === 'available').length }
              ].map(({ type, tier, count }) => (
                <div key={`${type}-${tier}`} className="p-4 border rounded-lg bg-card">
                  <div className="text-sm font-medium capitalize">{type} Tier {tier}</div>
                  <div className="text-2xl font-bold mt-1">{count}</div>
                  <div className="text-xs text-muted-foreground">available codes</div>
                </div>
              ))}
            </div>

            <Card className="card-modern">
              <CardHeader>
                <CardTitle>Recent Invite Codes</CardTitle>
                <CardDescription>Latest generated codes ({inviteCodes.length} total)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {inviteCodes.slice(0, 20).map((code) => (
                    <div key={code.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Key className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-mono font-semibold">{code.code}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTierColor(code.tier_level)}`}>
                              Tier {code.tier_level}
                            </span>
                            <span className="text-xs text-muted-foreground capitalize">{code.code_type}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              code.status === 'available' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                            }`}>
                              {code.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(code.code)}
                        >
                          {copiedCode === code.code ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                        {code.status === 'available' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteInviteCode(code.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* User Management Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search users by name, email, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <select 
                value={tierFilter} 
                onChange={(e) => setTierFilter(e.target.value as typeof tierFilter)}
                className="px-3 py-2 border rounded-lg bg-background"
              >
                <option value="all">All Tiers</option>
                <option value={1}>Tier 1</option>
                <option value={2}>Tier 2</option>
                <option value={3}>Tier 3</option>
              </select>
              <select 
                value={roleFilter} 
                onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
                className="px-3 py-2 border rounded-lg bg-background"
              >
                <option value="all">All Roles</option>
                <option value="artist">Artists</option>
                <option value="producer">Producers</option>
                <option value="studio">Studios</option>
              </select>
            </div>

            <Card className="card-modern">
              <CardHeader>
                <CardTitle>User Management ({filteredUsers.length} users)</CardTitle>
                <CardDescription>Complete user lifecycle management with tier controls</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          {getRoleIcon(user.role)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{user.display_name || 'Unnamed User'}</span>
                            {user.verified && <UserCheck className="w-4 h-4 text-green-500" />}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-muted-foreground">{user.user_email}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTierColor(user.tier_level)}`}>
                              Tier {user.tier_level}
                            </span>
                            <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                            {user.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {user.location}
                              </span>
                            )}
                            <span>{user.followers_count} followers</span>
                            <span>{user.posts_count} posts</span>
                            <span>{user.total_bookings} bookings</span>
                            {user.total_earnings > 0 && <span>${user.total_earnings.toFixed(0)} earned</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right text-sm">
                          <div className="text-muted-foreground">Rating: {user.rating}/5</div>
                          <div className="text-muted-foreground">{user.profile_views} views</div>
                        </div>
                        
                        {/* Tier Controls */}
                        <div className="flex flex-col gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateUserTier(user.id, Math.min(3, user.tier_level + 1) as 1 | 2 | 3)}
                            disabled={user.tier_level >= 3}
                            className="w-8 h-6 p-0"
                          >
                            <ChevronUp className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateUserTier(user.id, Math.max(1, user.tier_level - 1) as 1 | 2 | 3)}
                            disabled={user.tier_level <= 1}
                            className="w-8 h-6 p-0"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </Button>
                        </div>

                        {/* Verification Toggle */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleUserVerification(user.id)}
                          className={user.verified ? "text-green-600" : "text-gray-600"}
                        >
                          {user.verified ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                        </Button>

                        {/* Delete User */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteUser(user.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="card-modern">
              <CardHeader>
                <CardTitle>Platform Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">User Retention</span>
                    <span className="font-semibold text-green-500">94%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Avg. Session Time</span>
                    <span className="font-semibold">18 min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Daily Active Users</span>
                    <span className="font-semibold">1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Verification Rate</span>
                    <span className="font-semibold">
                      {stats ? Math.round((stats.verified_users / stats.total_users) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-modern">
              <CardHeader>
                <CardTitle>Revenue Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Platform Revenue</span>
                    <span className="font-semibold text-green-500">
                      ${stats ? Math.round(stats.total_earnings).toLocaleString() : 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Avg. Booking Value</span>
                    <span className="font-semibold">$156</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Monthly Growth</span>
                    <span className="font-semibold text-blue-500">+12%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Booking Success Rate</span>
                    <span className="font-semibold">
                      {stats && stats.total_bookings > 0 ? Math.round((stats.completed_bookings / stats.total_bookings) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-modern">
              <CardHeader>
                <CardTitle>Growth Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">New Users (30d)</span>
                    <span className="font-semibold text-blue-500">+{stats?.total_users ? Math.round(stats.total_users * 0.15) : 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Tier Upgrades</span>
                    <span className="font-semibold text-purple-500">+{stats ? stats.tier2_users + stats.tier3_users : 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Active Content</span>
                    <span className="font-semibold">{stats?.total_posts || 0} posts</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Platform Utilization</span>
                    <span className="font-semibold">89%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl space-y-6">
            <Card className="card-modern">
              <CardHeader>
                <CardTitle>Invite Code Pool Settings</CardTitle>
                <CardDescription>Configure automatic invite code generation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="font-medium">Auto-generation</span>
                      <p className="text-sm text-muted-foreground">Automatically maintain invite code pools</p>
                    </div>
                    <div className="w-12 h-6 bg-primary rounded-full flex items-center">
                      <div className="w-5 h-5 bg-white rounded-full translate-x-6 transition-transform"></div>
                    </div>
                  </div>
                  <Button onClick={generateInviteCodes} disabled={isGeneratingCodes} className="w-full">
                    <Zap className="w-4 h-4 mr-2" />
                    Generate Codes Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="card-modern">
              <CardHeader>
                <CardTitle>Admin Management</CardTitle>
                <CardDescription>Promote users to admin status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Input
                      placeholder="Enter user email to promote to admin"
                      value={adminPromoteEmail}
                      onChange={(e) => setAdminPromoteEmail(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={promoteToAdmin}
                      disabled={isPromoting || !adminPromoteEmail.trim()}
                    >
                      {isPromoting ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Shield className="w-4 h-4 mr-2" />
                      )}
                      Promote to Admin
                    </Button>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Console Command:</strong> You can also use <code>makeUserAdmin(&quot;email@example.com&quot;)</code> in the browser console.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-modern">
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
                <CardDescription>Global platform configuration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="font-medium">Maintenance Mode</span>
                      <p className="text-sm text-muted-foreground">Temporarily disable new registrations</p>
                    </div>
                    <div className="w-12 h-6 bg-gray-300 rounded-full flex items-center">
                      <div className="w-5 h-5 bg-white rounded-full translate-x-1 transition-transform"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="font-medium">Email Notifications</span>
                      <p className="text-sm text-muted-foreground">Send admin alerts via email</p>
                    </div>
                    <div className="w-12 h-6 bg-primary rounded-full flex items-center">
                      <div className="w-5 h-5 bg-white rounded-full translate-x-6 transition-transform"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
} 