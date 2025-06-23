'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Music, Users, MessageSquare, Settings, Search, TrendingUp, Calendar, Star, Bell, Plus, Play, Headphones, Mic2 } from 'lucide-react'
import Link from 'next/link'
// import type { Metadata } from 'next'

// export const metadata: Metadata = {
//   title: 'Dashboard',
//   description: 'Your Studio Finder dashboard - manage your music collaborations, projects, and connections.',
// }

export default function DashboardPage() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState('')
  const [userName, setUserName] = useState('')

  useEffect(() => {
    // Check authentication
    const userSession = localStorage.getItem('user_session')
    const email = localStorage.getItem('user_email')
    
    if (!userSession || userSession !== 'authenticated') {
      router.push('/login')
      return
    }
    
    if (email) {
      setUserEmail(email)
      // Extract name from email (simple approach)
      const name = email.split('@')[0].split('.').map(part => 
        part.charAt(0).toUpperCase() + part.slice(1)
      ).join(' ')
      setUserName(name)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user_session')
    localStorage.removeItem('user_email')
    localStorage.removeItem('user_login_time')
    router.push('/')
  }

  if (!userEmail) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <header className="glass fixed top-0 left-0 right-0 z-50 border-b border-blue-400/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 animate-slide-up">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center animate-pulse-glow">
                <Music className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-heading-md font-display text-gradient-primary">Studio Finder</h1>
            </div>
            <div className="flex items-center gap-3 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <Button variant="outline" size="sm" className="hover-glow-blue focus-ring relative border-blue-400/30 text-blue-300" asChild>
                <Link href="/notifications">
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">2</span>
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="hover-glow-blue focus-ring border-blue-400/30 text-blue-300" asChild>
                <Link href="/profile/setup">
                  <Settings className="w-4 h-4 mr-2" />
                  Profile
                </Link>
              </Button>
              <Button 
                onClick={handleLogout}
                variant="outline" 
                size="sm" 
                className="hover-glow-blue focus-ring border-blue-400/30 text-blue-300"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8 animate-fade-in">
            <h2 className="text-display-lg font-display mb-2 text-white">Welcome back, {userName}! 👋</h2>
            <p className="text-body-lg text-white/80">Ready to create some amazing music today?</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Button 
              className="h-20 button-primary hover-lift focus-ring shadow-lg group animate-slide-up" 
              style={{ animationDelay: '0.1s' }} 
              asChild
            >
              <Link href="/search">
                <div className="text-center">
                  <Search className="w-6 h-6 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-body-sm font-medium">Find Artists</span>
                </div>
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 hover-glow-blue focus-ring group glass-card border-blue-400/20 text-white animate-slide-up" 
              style={{ animationDelay: '0.2s' }} 
              asChild
            >
              <Link href="/studios">
                <div className="text-center">
                  <Mic2 className="w-6 h-6 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-body-sm font-medium">Book Studio</span>
                </div>
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 hover-glow-purple focus-ring group glass-card border-purple-400/20 text-white animate-slide-up" 
              style={{ animationDelay: '0.3s' }} 
              asChild
            >
              <Link href="/projects">
                <div className="text-center">
                  <Plus className="w-6 h-6 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-body-sm font-medium">New Project</span>
                </div>
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 hover-glow-blue focus-ring group glass-card border-cyan-400/20 text-white animate-slide-up" 
              style={{ animationDelay: '0.4s' }} 
              asChild
            >
              <Link href="/events">
                <div className="text-center">
                  <Calendar className="w-6 h-6 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-body-sm font-medium">Events</span>
                </div>
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Activity Overview */}
              <Card className="card-modern hover-lift animate-slide-up" style={{ animationDelay: '0.5s' }}>
                <CardHeader>
                  <CardTitle className="text-heading-md font-display flex items-center gap-2 text-white">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    Your Activity
                  </CardTitle>
                  <CardDescription className="text-white/70">Your music journey this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 gradient-electric rounded-xl flex items-center justify-center mx-auto mb-2 animate-pulse-glow">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-heading-sm font-display text-gradient-primary">12</div>
                      <div className="text-body-xs text-white/60">New Connections</div>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 gradient-primary rounded-xl flex items-center justify-center mx-auto mb-2 animate-pulse-glow" style={{ animationDelay: '1s' }}>
                        <MessageSquare className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-heading-sm font-display text-gradient-electric">24</div>
                      <div className="text-body-xs text-white/60">Messages Sent</div>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 gradient-accent rounded-xl flex items-center justify-center mx-auto mb-2 animate-pulse-glow" style={{ animationDelay: '2s' }}>
                        <Play className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-heading-sm font-display text-gradient-accent">3</div>
                      <div className="text-body-xs text-white/60">Active Projects</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Messages */}
              <Card className="card-modern hover-lift animate-slide-up" style={{ animationDelay: '0.6s' }}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-heading-md font-display flex items-center gap-2 text-white">
                      <MessageSquare className="w-5 h-5 text-blue-400" />
                      Recent Messages
                    </CardTitle>
                    <Button variant="outline" size="sm" className="hover-glow-blue border-blue-400/30 text-blue-300">
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 p-4 glass border border-blue-400/20 rounded-xl hover-glow-blue cursor-pointer group">
                    <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center text-white text-body-sm font-bold group-hover:scale-110 transition-transform">
                      JS
                    </div>
                    <div className="flex-1">
                      <p className="text-body-md font-medium text-white">John Smith</p>
                      <p className="text-body-sm text-white/70">Hey, interested in collaborating on that track?</p>
                    </div>
                    <div className="text-right">
                      <span className="text-body-xs text-white/50">2h ago</span>
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 ml-auto"></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 glass border border-purple-400/20 rounded-xl hover-glow-purple cursor-pointer group">
                    <div className="w-12 h-12 gradient-accent rounded-xl flex items-center justify-center text-white text-body-sm font-bold group-hover:scale-110 transition-transform">
                      MJ
                    </div>
                    <div className="flex-1">
                      <p className="text-body-md font-medium text-white">Mary Johnson</p>
                      <p className="text-body-sm text-white/70">Studio is available next Tuesday if you&apos;re free!</p>
                    </div>
                    <div className="text-right">
                      <span className="text-body-xs text-white/50">5h ago</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 glass border border-cyan-400/20 rounded-xl hover-glow-blue cursor-pointer group">
                    <div className="w-12 h-12 gradient-electric rounded-xl flex items-center justify-center text-white text-body-sm font-bold group-hover:scale-110 transition-transform">
                      AB
                    </div>
                    <div className="flex-1">
                      <p className="text-body-md font-medium text-white">Alex Brown</p>
                      <p className="text-body-sm text-white/70">Love your latest track! Want to discuss a remix?</p>
                    </div>
                    <div className="text-right">
                      <span className="text-body-xs text-white/50">1d ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Projects */}
              <Card className="card-modern hover-lift animate-slide-up" style={{ animationDelay: '0.7s' }}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-heading-md font-display flex items-center gap-2 text-white">
                      <Headphones className="w-5 h-5 text-blue-400" />
                      Active Projects
                    </CardTitle>
                    <Button variant="outline" size="sm" className="hover-glow-blue border-blue-400/30 text-blue-300">
                      <Plus className="w-4 h-4 mr-2" />
                      New Project
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 glass border border-blue-400/20 rounded-xl hover-glow-blue cursor-pointer group">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-body-md font-medium text-white">Summer Vibes EP</h4>
                      <span className="badge-modern bg-green-500/20 text-green-300 border-green-400/30">Active</span>
                    </div>
                    <p className="text-body-sm text-white/70 mb-3">Collaborating with John Smith and Sarah Davis</p>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 bg-white/20 rounded-full h-2">
                        <div className="gradient-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                      <span className="text-body-xs font-medium text-white/80">75%</span>
                    </div>
                  </div>
                  
                  <div className="p-4 glass border border-purple-400/20 rounded-xl hover-glow-purple cursor-pointer group">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-body-md font-medium text-white">Midnight Sessions</h4>
                      <span className="badge-modern bg-yellow-500/20 text-yellow-300 border-yellow-400/30">In Review</span>
                    </div>
                    <p className="text-body-sm text-white/70 mb-3">Solo project with featured vocalist</p>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 bg-white/20 rounded-full h-2">
                        <div className="gradient-electric h-2 rounded-full" style={{ width: '90%' }}></div>
                      </div>
                      <span className="text-body-xs font-medium text-white/80">90%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card className="card-modern hover-lift animate-slide-up" style={{ animationDelay: '0.8s' }}>
                <CardHeader>
                  <CardTitle className="text-heading-sm font-display text-white">Profile Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-body-sm text-white/70">Profile Views</span>
                    <span className="text-body-md font-semibold text-blue-400">156</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-body-sm text-white/70">Track Plays</span>
                    <span className="text-body-md font-semibold text-purple-400">1.2K</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-body-sm text-white/70">Followers</span>
                    <span className="text-body-md font-semibold text-cyan-400">89</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-body-sm text-white/70">Collaborations</span>
                    <span className="text-body-md font-semibold text-green-400">12</span>
                  </div>
                </CardContent>
              </Card>

              {/* Recommended Connections */}
              <Card className="card-modern hover-lift animate-slide-up" style={{ animationDelay: '0.9s' }}>
                <CardHeader>
                  <CardTitle className="text-heading-sm font-display flex items-center gap-2 text-white">
                    <Star className="w-4 h-4 text-blue-400" />
                    Recommended
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 glass border border-blue-400/20 rounded-xl hover-glow-blue cursor-pointer group">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center text-white text-body-xs font-bold">
                        AP
                      </div>
                      <div>
                        <p className="text-body-sm font-medium text-white">Alex Producer</p>
                        <p className="text-body-xs text-white/60">Hip-hop • 2.1k followers</p>
                      </div>
                    </div>
                    <Button size="sm" className="w-full button-primary">
                      Connect
                    </Button>
                  </div>
                  
                  <div className="p-3 glass border border-purple-400/20 rounded-xl hover-glow-purple cursor-pointer group">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 gradient-accent rounded-lg flex items-center justify-center text-white text-body-xs font-bold">
                        SL
                      </div>
                      <div>
                        <p className="text-body-sm font-medium text-white">Sound Studio LA</p>
                        <p className="text-body-xs text-white/60">Professional space • $80/hr</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full hover-glow-purple border-purple-400/30 text-purple-300">
                      View Details
                    </Button>
                  </div>
                  
                  <div className="p-3 glass border border-cyan-400/20 rounded-xl hover-glow-blue cursor-pointer group">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 gradient-electric rounded-lg flex items-center justify-center text-white text-body-xs font-bold">
                        MV
                      </div>
                      <div>
                        <p className="text-body-sm font-medium text-white">Maya Vocalist</p>
                        <p className="text-body-xs text-white/60">R&B • Available now</p>
                      </div>
                    </div>
                    <Button size="sm" className="w-full button-secondary">
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Sessions */}
              <Card className="card-modern hover-lift animate-slide-up" style={{ animationDelay: '1s' }}>
                <CardHeader>
                  <CardTitle className="text-heading-sm font-display flex items-center gap-2 text-white">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    Upcoming
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 glass border border-blue-400/20 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-body-sm font-medium text-white">Studio Session</p>
                      <span className="text-body-xs text-blue-400 font-medium">Tomorrow</span>
                    </div>
                    <p className="text-body-xs text-white/60">Sound Studio LA • 2:00 PM</p>
                  </div>
                  
                  <div className="p-3 glass border border-purple-400/20 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-body-sm font-medium text-white">Collab Meeting</p>
                      <span className="text-body-xs text-purple-400 font-medium">Friday</span>
                    </div>
                    <p className="text-body-xs text-white/60">With John Smith • Virtual</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 