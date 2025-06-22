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
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/20">
      {/* Header */}
      <header className="glass fixed top-0 left-0 right-0 z-50 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 animate-slide-in-left">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-heading-md font-display text-gradient-primary">Studio Finder</h1>
            </div>
            <div className="flex items-center gap-3 animate-slide-in-right">
              <Button variant="outline" size="sm" className="hover-lift focus-visible relative" asChild>
                <Link href="/notifications">
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">2</span>
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="hover-lift focus-visible" asChild>
                <Link href="/profile/setup">
                  <Settings className="w-4 h-4 mr-2" />
                  Profile
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="hover-lift focus-visible">
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
            <h2 className="text-display-lg font-display mb-2">Welcome back, Alex! 👋</h2>
            <p className="text-body-lg text-slate-600">Ready to create some amazing music today?</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Button 
              className="h-20 gradient-primary hover-lift focus-visible shadow-lg group animate-slide-up" 
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
              className="h-20 hover-lift focus-visible group bg-white/60 backdrop-blur-sm animate-slide-up" 
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
              className="h-20 hover-lift focus-visible group bg-white/60 backdrop-blur-sm animate-slide-up" 
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
              className="h-20 hover-lift focus-visible group bg-white/60 backdrop-blur-sm animate-slide-up" 
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
              <Card className="glass border-white/20 shadow-lg hover-lift animate-slide-up" style={{ animationDelay: '0.5s' }}>
                <CardHeader>
                  <CardTitle className="text-heading-md font-display flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    Your Activity
                  </CardTitle>
                  <CardDescription>Your music journey this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 gradient-cool rounded-xl flex items-center justify-center mx-auto mb-2">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-heading-sm font-display text-gradient-primary">12</div>
                      <div className="text-body-xs text-slate-500">New Connections</div>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 gradient-primary rounded-xl flex items-center justify-center mx-auto mb-2">
                        <MessageSquare className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-heading-sm font-display text-gradient-accent">24</div>
                      <div className="text-body-xs text-slate-500">Messages Sent</div>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 gradient-accent rounded-xl flex items-center justify-center mx-auto mb-2">
                        <Play className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-heading-sm font-display text-gradient-primary">3</div>
                      <div className="text-body-xs text-slate-500">Active Projects</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Messages */}
              <Card className="glass border-white/20 shadow-lg hover-lift animate-slide-up" style={{ animationDelay: '0.6s' }}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-heading-md font-display flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-purple-600" />
                      Recent Messages
                    </CardTitle>
                    <Button variant="outline" size="sm" className="hover-lift">
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover-lift cursor-pointer group">
                    <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center text-white text-body-sm font-bold group-hover:scale-110 transition-transform">
                      JS
                    </div>
                    <div className="flex-1">
                      <p className="text-body-md font-medium text-slate-800">John Smith</p>
                      <p className="text-body-sm text-slate-600">Hey, interested in collaborating on that track?</p>
                    </div>
                    <div className="text-right">
                      <span className="text-body-xs text-slate-500">2h ago</span>
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-1 ml-auto"></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl hover-lift cursor-pointer group">
                    <div className="w-12 h-12 gradient-accent rounded-xl flex items-center justify-center text-white text-body-sm font-bold group-hover:scale-110 transition-transform">
                      MJ
                    </div>
                    <div className="flex-1">
                      <p className="text-body-md font-medium text-slate-800">Mary Johnson</p>
                      <p className="text-body-sm text-slate-600">Studio is available next Tuesday if you&apos;re free!</p>
                    </div>
                    <div className="text-right">
                      <span className="text-body-xs text-slate-500">5h ago</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover-lift cursor-pointer group">
                    <div className="w-12 h-12 gradient-cool rounded-xl flex items-center justify-center text-white text-body-sm font-bold group-hover:scale-110 transition-transform">
                      AB
                    </div>
                    <div className="flex-1">
                      <p className="text-body-md font-medium text-slate-800">Alex Brown</p>
                      <p className="text-body-sm text-slate-600">Love your latest track! Want to discuss a remix?</p>
                    </div>
                    <div className="text-right">
                      <span className="text-body-xs text-slate-500">1d ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Projects */}
              <Card className="glass border-white/20 shadow-lg hover-lift animate-slide-up" style={{ animationDelay: '0.7s' }}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-heading-md font-display flex items-center gap-2">
                      <Headphones className="w-5 h-5 text-purple-600" />
                      Active Projects
                    </CardTitle>
                    <Button variant="outline" size="sm" className="hover-lift">
                      <Plus className="w-4 h-4 mr-2" />
                      New Project
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border border-purple-200 rounded-xl hover-lift cursor-pointer group bg-gradient-to-r from-purple-50/50 to-transparent">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-body-md font-medium text-slate-800">Summer Vibes EP</h4>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-body-xs font-medium">Active</span>
                    </div>
                    <p className="text-body-sm text-slate-600 mb-3">Collaborating with John Smith and Sarah Davis</p>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 bg-slate-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                      <span className="text-body-xs font-medium text-slate-600">75%</span>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-indigo-200 rounded-xl hover-lift cursor-pointer group bg-gradient-to-r from-indigo-50/50 to-transparent">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-body-md font-medium text-slate-800">Midnight Sessions</h4>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-body-xs font-medium">In Review</span>
                    </div>
                    <p className="text-body-sm text-slate-600 mb-3">Solo project with featured vocalist</p>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 bg-slate-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                      </div>
                      <span className="text-body-xs font-medium text-slate-600">90%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card className="glass border-white/20 shadow-lg hover-lift animate-slide-up" style={{ animationDelay: '0.8s' }}>
                <CardHeader>
                  <CardTitle className="text-heading-sm font-display">Profile Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-body-sm text-slate-600">Profile Views</span>
                    <span className="text-body-md font-semibold text-purple-600">156</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-body-sm text-slate-600">Track Plays</span>
                    <span className="text-body-md font-semibold text-pink-600">1.2K</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-body-sm text-slate-600">Followers</span>
                    <span className="text-body-md font-semibold text-indigo-600">89</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-body-sm text-slate-600">Collaborations</span>
                    <span className="text-body-md font-semibold text-green-600">12</span>
                  </div>
                </CardContent>
              </Card>

              {/* Recommended Connections */}
              <Card className="glass border-white/20 shadow-lg hover-lift animate-slide-up" style={{ animationDelay: '0.9s' }}>
                <CardHeader>
                  <CardTitle className="text-heading-sm font-display flex items-center gap-2">
                    <Star className="w-4 h-4 text-purple-600" />
                    Recommended
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 border border-purple-200 rounded-xl hover-lift cursor-pointer group bg-gradient-to-r from-purple-50/50 to-transparent">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center text-white text-body-xs font-bold">
                        AP
                      </div>
                      <div>
                        <p className="text-body-sm font-medium text-slate-800">Alex Producer</p>
                        <p className="text-body-xs text-slate-500">Hip-hop • 2.1k followers</p>
                      </div>
                    </div>
                    <Button size="sm" className="w-full gradient-primary hover-lift">
                      Connect
                    </Button>
                  </div>
                  
                  <div className="p-3 border border-pink-200 rounded-xl hover-lift cursor-pointer group bg-gradient-to-r from-pink-50/50 to-transparent">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 gradient-accent rounded-lg flex items-center justify-center text-white text-body-xs font-bold">
                        SL
                      </div>
                      <div>
                        <p className="text-body-sm font-medium text-slate-800">Sound Studio LA</p>
                        <p className="text-body-xs text-slate-500">Professional space • $80/hr</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full hover-lift">
                      View Details
                    </Button>
                  </div>
                  
                  <div className="p-3 border border-indigo-200 rounded-xl hover-lift cursor-pointer group bg-gradient-to-r from-indigo-50/50 to-transparent">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 gradient-cool rounded-lg flex items-center justify-center text-white text-body-xs font-bold">
                        MV
                      </div>
                      <div>
                        <p className="text-body-sm font-medium text-slate-800">Maya Vocalist</p>
                        <p className="text-body-xs text-slate-500">R&B • Available now</p>
                      </div>
                    </div>
                    <Button size="sm" className="w-full gradient-cool hover-lift">
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Sessions */}
              <Card className="glass border-white/20 shadow-lg hover-lift animate-slide-up" style={{ animationDelay: '1s' }}>
                <CardHeader>
                  <CardTitle className="text-heading-sm font-display flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    Upcoming
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-body-sm font-medium text-slate-800">Studio Session</p>
                      <span className="text-body-xs text-purple-600 font-medium">Tomorrow</span>
                    </div>
                    <p className="text-body-xs text-slate-600">Sound Studio LA • 2:00 PM</p>
                  </div>
                  
                  <div className="p-3 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-body-sm font-medium text-slate-800">Collab Meeting</p>
                      <span className="text-body-xs text-indigo-600 font-medium">Friday</span>
                    </div>
                    <p className="text-body-xs text-slate-600">With John Smith • Virtual</p>
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