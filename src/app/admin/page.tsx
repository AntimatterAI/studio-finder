'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { Copy, Plus, Trash2, Users, Key, CheckCircle, Sparkles, Crown, BarChart3, LogOut, User, Mail, Calendar, Activity, Eye } from 'lucide-react'
import Link from 'next/link'

interface InviteCode {
  id: string
  code: string
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
  const [activeTab, setActiveTab] = useState<'codes' | 'users'>('codes')
  
  // Invite Codes State
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [customCode, setCustomCode] = useState('')
  const [generationType, setGenerationType] = useState<'random' | 'custom'>('random')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  
  // Users State
  const [users, setUsers] = useState<UserProfile[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)

  useEffect(() => {
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
      
      // Get user emails from auth.users
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
      
      if (!authError && authUsers?.users) {
        const usersWithEmails = data?.map(profile => ({
          ...profile,
          user_email: authUsers.users.find(user => user.id === profile.id)?.email || 'N/A'
        })) || []
        setUsers(usersWithEmails)
      } else {
        setUsers(data || [])
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setIsLoadingUsers(false)
    }
  }

  const generateRandomCode = (): string => {
    const prefixes = ['STUDIO', 'MUSIC', 'ARTIST', 'PRODUCER', 'BEATS', 'SOUND', 'TRACK', 'MIX']
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
    const suffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    return `${prefix}${suffix}`
  }

  const generateInviteCode = async () => {
    setIsGenerating(true)
    try {
      const code = generationType === 'custom' ? customCode.toUpperCase() : generateRandomCode()
      
      const { data, error } = await supabase
        .from('invites')
        .insert([{ code, status: 'approved' }])
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-emerald-600 bg-emerald-50 border-emerald-200'
      case 'used': return 'text-slate-600 bg-slate-50 border-slate-200'
      default: return 'text-slate-600 bg-slate-50 border-slate-200'
    }
  }

  const getRoleColor = (role: string | null) => {
    switch (role) {
      case 'artist': return 'text-purple-600 bg-purple-50 border-purple-200'
      case 'producer': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-slate-600 bg-slate-50 border-slate-200'
    }
  }

  const stats = {
    totalCodes: inviteCodes.length,
    availableCodes: inviteCodes.filter(code => code.status === 'approved').length,
    usedCodes: inviteCodes.filter(code => code.status === 'used').length,
    totalUsers: users.length,
    artists: users.filter(user => user.role === 'artist').length,
    producers: users.filter(user => user.role === 'producer').length,
    completedProfiles: users.filter(user => user.profile_complete).length
  }

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-medium">Authenticating...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen gradient-hero relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 gradient-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 gradient-secondary rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 gradient-accent rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-8 py-12 relative z-10">
        {/* Header */}
        <div className="mb-12 animate-fade-in-up">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 gradient-luxury rounded-3xl flex items-center justify-center shadow-2xl shadow-yellow-400/30 animate-glow-pulse">
                <Crown className="w-9 h-9 text-slate-900" />
              </div>
              <div>
                <h1 className="text-display-xl font-display text-gradient-luxury mb-2">Admin Console</h1>
                <p className="text-body-lg" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Welcome back, Paul
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" className="hover-glow-elegant focus-luxury border-blue-400/30 text-blue-300" asChild>
                <Link href="/dashboard">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
              <Button variant="outline" onClick={handleLogout} className="hover:border-red-400/50 hover:text-red-400 border-slate-600 text-slate-400">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 p-1 glass-premium rounded-2xl w-fit">
            <button
              onClick={() => setActiveTab('codes')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'codes'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              <Key className="w-4 h-4 inline mr-2" />
              Invite Codes
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'users'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              User Management
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="stat-premium group animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Key className="w-6 h-6 text-slate-900" />
            </div>
            <div className="text-heading-lg font-display text-gradient-primary mb-1">{stats.totalCodes}</div>
            <div className="text-body-md font-medium" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Total Codes</div>
          </div>
          
          <div className="stat-premium group animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="w-12 h-12 gradient-accent rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-slate-900" />
            </div>
            <div className="text-heading-lg font-display text-gradient-accent mb-1">{stats.totalUsers}</div>
            <div className="text-body-md font-medium" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Total Users</div>
          </div>
          
          <div className="stat-premium group animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="w-12 h-12 gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6 text-slate-900" />
            </div>
            <div className="text-heading-lg font-display text-gradient-luxury mb-1">{stats.artists}</div>
            <div className="text-body-md font-medium" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Artists</div>
          </div>
          
          <div className="stat-premium group animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="w-12 h-12 gradient-luxury rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <CheckCircle className="w-6 h-6 text-slate-900" />
            </div>
            <div className="text-heading-lg font-display text-gradient-primary mb-1">{stats.producers}</div>
            <div className="text-body-md font-medium" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Producers</div>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'codes' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Generate New Code */}
            <Card className="card-premium animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 gradient-primary rounded-2xl flex items-center justify-center">
                    <Plus className="w-5 h-5 text-slate-900" />
                  </div>
                  <div>
                    <CardTitle className="text-heading-md font-display text-white">Generate Invite Code</CardTitle>
                    <CardDescription style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      Create new invitation codes for platform access
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-2 p-1 glass-premium rounded-2xl">
                  <button
                    onClick={() => setGenerationType('random')}
                    className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                      generationType === 'random'
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'text-blue-200 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 inline mr-2" />
                    Random
                  </button>
                  <button
                    onClick={() => setGenerationType('custom')}
                    className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                      generationType === 'custom'
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'text-blue-200 hover:text-white'
                    }`}
                  >
                    <Key className="w-4 h-4 inline mr-2" />
                    Custom
                  </button>
                </div>

                {generationType === 'custom' && (
                  <div className="space-y-2">
                    <Label htmlFor="customCode" className="text-body-sm font-medium" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      Custom Code
                    </Label>
                    <Input
                      id="customCode"
                      type="text"
                      placeholder="Enter custom code (e.g., VIPPROD2024)"
                      value={customCode}
                      onChange={(e) => setCustomCode(e.target.value)}
                      className="h-12 glass-premium border-blue-400/30 text-white placeholder-blue-200/50"
                    />
                  </div>
                )}

                <Button
                  onClick={generateInviteCode}
                  disabled={isGenerating || (generationType === 'custom' && !customCode)}
                  className="w-full button-premium h-12 text-slate-900 font-bold"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-slate-700 border-t-transparent rounded-full animate-spin mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 mr-2" />
                      Generate {generationType === 'custom' ? 'Custom' : 'Random'} Code
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Existing Codes */}
            <Card className="card-premium animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 gradient-accent rounded-2xl flex items-center justify-center">
                    <Key className="w-5 h-5 text-slate-900" />
                  </div>
                  <div>
                    <CardTitle className="text-heading-md font-display text-white">Recent Invite Codes</CardTitle>
                    <CardDescription style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      Latest generated codes
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {inviteCodes.slice(0, 6).map((code) => (
                    <div
                      key={code.id}
                      className="flex items-center justify-between p-4 glass-premium rounded-2xl hover-glow-elegant transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                          <Key className="w-4 h-4 text-slate-900" />
                        </div>
                        <div>
                          <div className="font-mono font-bold text-white text-lg">{code.code}</div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(code.status)}`}>
                              {code.status}
                            </span>
                            <span className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                              {new Date(code.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(code.code)}
                          className="hover-glow-elegant border-blue-400/30 text-blue-300"
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
                            className="hover:border-red-400/50 hover:text-red-400 border-slate-600 text-slate-400"
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
          <div className="space-y-8">
            <Card className="card-premium animate-fade-in-up">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 gradient-accent rounded-2xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-slate-900" />
                  </div>
                  <div>
                    <CardTitle className="text-heading-md font-display text-white">User Management</CardTitle>
                    <CardDescription style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      Manage registered users and their activity
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingUsers ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : users.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-blue-400/50 mx-auto mb-4" />
                    <p className="text-body-md" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      No users registered yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-6 glass-premium rounded-2xl hover-glow-elegant transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center">
                            <User className="w-6 h-6 text-slate-900" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-white text-lg">
                                {user.display_name || 'Unnamed User'}
                              </h3>
                              {user.role && (
                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                                  {user.role}
                                </span>
                              )}
                              {user.profile_complete && (
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                                  Complete
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                              <div className="flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                {user.user_email}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(user.created_at).toLocaleDateString()}
                              </div>
                              {user.skills && user.skills.length > 0 && (
                                <div className="flex items-center gap-1">
                                  <Activity className="w-4 h-4" />
                                  {user.skills.slice(0, 2).join(', ')}
                                  {user.skills.length > 2 && ` +${user.skills.length - 2}`}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="hover-glow-elegant border-blue-400/30 text-blue-300"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Profile
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
} 