import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Music, Users, MessageSquare, Settings } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Studio Finder</h1>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/profile/setup">
                  <Settings className="w-4 h-4 mr-2" />
                  Profile
                </Link>
              </Button>
              <Button variant="outline" size="sm">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Welcome Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Welcome to Studio Finder</CardTitle>
              <CardDescription>
                Connect with artists and producers in your area
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Your dashboard to discover collaborators, book studio time, and grow your music network.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button asChild>
                  <Link href="/search">
                    <Users className="w-4 h-4 mr-2" />
                    Find Collaborators
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/studios">
                    <Music className="w-4 h-4 mr-2" />
                    Browse Studios
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Connections</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Messages</span>
                <span className="font-semibold">5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Projects</span>
                <span className="font-semibold">3</span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Messages */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                    JS
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">John Smith</p>
                    <p className="text-gray-600 text-sm">Hey, interested in collaborating on that track?</p>
                  </div>
                  <span className="text-xs text-gray-500">2h ago</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    MJ
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Mary Johnson</p>
                    <p className="text-gray-600 text-sm">Studio is available next Tuesday if you're free!</p>
                  </div>
                  <span className="text-xs text-gray-500">5h ago</span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                <MessageSquare className="w-4 h-4 mr-2" />
                View All Messages
              </Button>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recommended</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <p className="font-medium text-sm">Alex Producer</p>
                  <p className="text-gray-600 text-xs">Hip-hop producer nearby</p>
                  <Button size="sm" className="w-full mt-2">Connect</Button>
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="font-medium text-sm">Sound Studio LA</p>
                  <p className="text-gray-600 text-xs">Professional recording space</p>
                  <Button size="sm" variant="outline" className="w-full mt-2">View Details</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 