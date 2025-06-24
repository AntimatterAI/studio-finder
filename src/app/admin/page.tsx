'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { Copy, Plus, Trash2, Users, Key, CheckCircle, Crown, LogOut, User, Mail, Calendar, Activity, Sun, Moon, Settings, Shield } from 'lucide-react'

interface InviteCode {
  id: string
  code: string
  code_type: 'artist' | 'producer' | 'studio' | 'admin'
  status: 'approved' | 'used'
  created_at: string
  updated_at: string
}

interface UserProfile {
  id: string
  role: 'artist' | 'producer' | null
  display_name: string | null
  skills: string[] | null
  media_urls: string[] | null
  socials: Record<string, string> | null
  profile_complete: boolean
  created_at: string
  updated_at: string
  user_email?: string
}

export default function AdminPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isDark, setIsDark] = useState(false)
  const [activeTab, setActiveTab] = useState<'codes' | 'users'>('codes')
  
  // Invite Codes State
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [customCode, setCustomCode] = useState('')
  const [codeType, setCodeType] = useState<'artist' | 'producer' | 'studio' | 'admin'>('artist')
  const [generationType, setGenerationType] = useState<'random' | 'custom'>('random')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  
  // Users State
  const [users, setUsers] = useState<UserProfile[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)

  useEffect(() => {
    // Default to light mode unless explicitly set to dark
    if (typeof window !== 'undefined') {
      const theme = localStorage.getItem('theme')
      const isDarkMode = theme === 'dark'
      setIsDark(isDarkMode)
      document.documentElement.classList.toggle('dark', isDarkMode)
    }
    
    const checkAuthentication = () => {
      const adminSession = localStorage.getItem('admin_session')
      const adminEmail = localStorage.getItem('admin_email')
      const loginTime = localStorage.getItem('admin_login_time')
      
      if (adminSession === 'authenticated' && adminEmail === 'paul@antimatterai.com' && loginTime) {
        // Check if session is still valid (24 hours)
        const currentTime = Date.now()
        const sessionTime = parseInt(loginTime)
        const sessionAge = currentTime - sessionTime
        const maxSessionAge = 24 * 60 * 60 * 1000 // 24 hours
        
        if (sessionAge < maxSessionAge) {
          setIsAuthenticated(true)
          fetchInviteCodes()
          fetchUsers()
        } else {
          // Session expired
          handleLogout()
        }
      } else {
        router.push('/admin/login')
      }
      setIsLoading(false)
    }
    
    checkAuthentication()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    document.documentElement.classList.toggle('dark', newIsDark)
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_session')
    localStorage.removeItem('admin_email')
    localStorage.removeItem('admin_login_time')
    router.push('/admin/login')
  }

  const fetchInviteCodes = async () => {
    try {
      const { data, error } = await supabase
        .from('invites')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setInviteCodes(data || [])
    } catch (error) {
      console.error('Error fetching invite codes:', error)
    }
  }

  const fetchUsers = async () => {
    setIsLoadingUsers(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      
      // Get user emails from auth.users (simplified for demo)
      const usersWithEmails = data?.map(profile => ({
        ...profile,
        user_email: `user${profile.id.slice(-4)}@example.com`
      })) || []
      setUsers(usersWithEmails)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setIsLoadingUsers(false)
    }
  }

  const generateRandomCode = (type: string): string => {
    const prefixes = {
      artist: ['ART', 'MUSIC', 'CREATE', 'TALENT'],
      producer: ['PROD', 'BEAT', 'MIX', 'STUDIO'],
      studio: ['SPACE', 'ROOM', 'REC', 'VENUE'],
      admin: ['ADMIN', 'SUPER', 'CTRL', 'MGMT']
    }
    const prefix = prefixes[type as keyof typeof prefixes][Math.floor(Math.random() * 4)]
    const suffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    return `${prefix}${suffix}`
  }

  const generateInviteCode = async () => {
    setIsGenerating(true)
    try {
      const code = generationType === 'custom' ? customCode.toUpperCase() : generateRandomCode(codeType)
      
      const { data, error } = await supabase
        .from('invites')
        .insert([{ code, code_type: codeType, status: 'approved' }])
        .select()
        .single()

      if (error) {
        if (error.code === '23505') {
          alert('This invite code already exists. Please try another one.')
        } else {
          throw error
        }
        return
      }

      setInviteCodes(prev => [data, ...prev])
      setCustomCode('')
      
      await copyToClipboard(code)
    } catch (error) {
      console.error('Error generating invite code:', error)
      alert('Failed to generate invite code. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const deleteInviteCode = async (id: string) => {
    if (!confirm('Are you sure you want to delete this invite code?')) return

    try {
      const { error } = await supabase
        .from('invites')
        .delete()
        .eq('id', id)

      if (error) throw error
      setInviteCodes(prev => prev.filter(code => code.id !== id))
    } catch (error) {
      console.error('Error deleting invite code:', error)
      alert('Failed to delete invite code.')
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'artist': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'producer': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
      case 'studio': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
      case 'used': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  const getRoleColor = (role: string | null) => {
    switch (role) {
      case 'artist': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'producer': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  const stats = {
    totalCodes: inviteCodes.length,
    availableCodes: inviteCodes.filter(code => code.status === 'approved').length,
    usedCodes: inviteCodes.filter(code => code.status === 'used').length,
    totalUsers: users.length,
    artists: users.filter(user => user.role === 'artist').length,
    producers: users.filter(user => user.role === 'producer').length,
    artistCodes: inviteCodes.filter(code => code.code_type === 'artist').length,
    producerCodes: inviteCodes.filter(code => code.code_type === 'producer').length,
    studioCodes: inviteCodes.filter(code => code.code_type === 'studio').length,
    adminCodes: inviteCodes.filter(code => code.code_type === 'admin').length
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground font-medium">Authenticating...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-display-lg font-display text-foreground">Admin Console</h1>
                <p className="text-muted-foreground">
                  Manage users and invite codes
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="p-2"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <Button variant="outline" onClick={handleLogout} className="text-destructive hover:text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 p-1 bg-muted rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('codes')}
              className={`px-4 py-2 rounded-md font-medium transition-all text-sm ${
                activeTab === 'codes'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Key className="w-4 h-4 inline mr-2" />
              Invite Codes
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-md font-medium transition-all text-sm ${
                activeTab === 'users'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Users
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="stat-card">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <Key className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">{stats.totalCodes}</div>
            <div className="text-sm text-muted-foreground">Total Codes</div>
          </div>
          
          <div className="stat-card">
            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">{stats.availableCodes}</div>
            <div className="text-sm text-muted-foreground">Available</div>
          </div>
          
          <div className="stat-card">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center mx-auto mb-3">
              <Users className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">{stats.totalUsers}</div>
            <div className="text-sm text-muted-foreground">Total Users</div>
          </div>
          
          <div className="stat-card">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center mx-auto mb-3">
              <Activity className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">{stats.artists + stats.producers}</div>
            <div className="text-sm text-muted-foreground">Active</div>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'codes' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Generate New Code */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Generate Invite Code
                </CardTitle>
                <CardDescription>
                  Create new invitation codes for different user types
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Code Type Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Code Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'artist', label: 'Artist', icon: User },
                      { value: 'producer', label: 'Producer', icon: Activity },
                      { value: 'studio', label: 'Studio', icon: Settings },
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

                {/* Generation Type */}
                <div className="flex gap-2 p-1 bg-muted rounded-lg">
                  <button
                    onClick={() => setGenerationType('random')}
                    className={`flex-1 px-3 py-2 rounded-md font-medium transition-all text-sm ${
                      generationType === 'random'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Random
                  </button>
                  <button
                    onClick={() => setGenerationType('custom')}
                    className={`flex-1 px-3 py-2 rounded-md font-medium transition-all text-sm ${
                      generationType === 'custom'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Custom
                  </button>
                </div>

                {generationType === 'custom' && (
                  <div className="space-y-2">
                    <Label htmlFor="customCode" className="text-sm font-medium">
                      Custom Code
                    </Label>
                    <Input
                      id="customCode"
                      type="text"
                      placeholder="Enter custom code"
                      value={customCode}
                      onChange={(e) => setCustomCode(e.target.value)}
                      className="h-10"
                    />
                  </div>
                )}

                <Button
                  onClick={generateInviteCode}
                  disabled={isGenerating || (generationType === 'custom' && !customCode)}
                  className="w-full"
                >
                  {isGenerating ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Generate {codeType.charAt(0).toUpperCase() + codeType.slice(1)} Code
                </Button>
              </CardContent>
            </Card>

            {/* Recent Codes */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Recent Invite Codes
                </CardTitle>
                <CardDescription>
                  Latest generated codes ({inviteCodes.length} total)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {inviteCodes.slice(0, 8).map((code) => (
                    <div
                      key={code.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Key className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-mono font-semibold text-foreground">{code.code}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(code.code_type)}`}>
                              {code.code_type}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(code.status)}`}>
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
                          className="h-8 w-8 p-0"
                        >
                          {copiedCode === code.code ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                        {code.status === 'approved' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteInviteCode(code.id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
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
        ) : (
          // User Management Tab
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                User Management
              </CardTitle>
              <CardDescription>
                View and manage registered users ({users.length} total)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingUsers ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                  Loading users...
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No users found
                </div>
              ) : (
                <div className="space-y-3">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">
                            {user.display_name || 'Unnamed User'}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Mail className="w-3 h-3 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{user.user_email}</span>
                            {user.role && (
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                                {user.role}
                              </span>
                            )}
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              user.profile_complete 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                            }`}>
                              {user.profile_complete ? 'Complete' : 'Incomplete'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {new Date(user.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 