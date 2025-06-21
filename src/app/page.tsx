import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Music, Users, Star, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900">Studio Finder</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Connect with <span className="text-primary">Artists</span> & <span className="text-primary">Producers</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Find collaborators, book studio time, and grow your music network. 
            Join the community that's revolutionizing music creation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/register">
                Join Studio Finder
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Sign In to Dashboard</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Studio Finder?</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We make it easy to find the right people and spaces for your music projects
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Find Collaborators</CardTitle>
              <CardDescription>
                Connect with artists and producers who match your style and vision
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Browse profiles, listen to samples, and reach out to potential collaborators in your area.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Music className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Book Studio Time</CardTitle>
              <CardDescription>
                Find and reserve professional recording spaces near you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Discover studios with the equipment you need and book sessions that fit your schedule.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Build Your Network</CardTitle>
              <CardDescription>
                Grow your professional music network and career opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Create lasting professional relationships and expand your reach in the music industry.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Start Creating?</h3>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join Studio Finder today and take your music to the next level with the right collaborators and spaces.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/register">Get Your Invite Code & Sign Up</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Music className="w-6 h-6" />
              <span className="text-lg font-semibold">Studio Finder</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/login" className="text-gray-400 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link href="/register" className="text-gray-400 hover:text-white transition-colors">
                Register
              </Link>
              <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                Dashboard
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-6 pt-6 text-center text-gray-400 text-sm">
            © 2024 Studio Finder. Built with Next.js and Supabase.
          </div>
        </div>
      </footer>
    </div>
  )
}
