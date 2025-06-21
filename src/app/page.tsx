import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Music, Users, Star, ArrowRight, Sparkles, Zap, Heart, Play, Headphones, Mic2 } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      {/* Navigation */}
      <nav className="glass fixed top-0 left-0 right-0 z-50 border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 animate-slide-in-left">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-heading-md font-display text-gradient-primary">Studio Finder</h1>
            </div>
            <div className="flex items-center gap-3 animate-slide-in-right">
              <Button variant="outline" size="sm" className="hover-lift focus-visible" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button size="sm" className="gradient-primary hover-lift focus-visible shadow-lg" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 overflow-hidden">
        <div className="container mx-auto text-center">
          <div className="max-w-5xl mx-auto animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-body-sm font-medium mb-8 animate-slide-up hover-scale">
              <Sparkles className="w-4 h-4" />
              Join the future of music collaboration
            </div>
            
            {/* Main Headline */}
            <h2 className="text-display-2xl font-display mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Connect with{' '}
              <span className="text-gradient-primary relative">
                Artists
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-30"></div>
              </span>
              {' '}&{' '}
              <span className="text-gradient-accent relative">
                Producers
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-30"></div>
              </span>
            </h2>
            
            {/* Subtitle */}
            <p className="text-body-lg text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Find collaborators, book studio time, and grow your music network. 
              Join the community that&apos;s revolutionizing music creation with AI-powered matching.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <Button size="lg" className="gradient-primary hover-lift focus-visible shadow-xl group" asChild>
                <Link href="/register">
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Start Creating Today
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="hover-lift focus-visible group bg-white/50 backdrop-blur-sm" asChild>
                <Link href="/login">
                  <Headphones className="w-5 h-5 mr-2" />
                  Sign In to Dashboard
                </Link>
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="text-center">
                <div className="text-heading-lg font-display text-gradient-primary">10K+</div>
                <div className="text-body-sm text-slate-500">Active Artists</div>
              </div>
              <div className="text-center">
                <div className="text-heading-lg font-display text-gradient-accent">50K+</div>
                <div className="text-body-sm text-slate-500">Collaborations</div>
              </div>
              <div className="text-center">
                <div className="text-heading-lg font-display text-gradient-primary">500+</div>
                <div className="text-body-sm text-slate-500">Studios</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h3 className="text-display-lg font-display mb-4 text-gradient-primary">
              Why Choose Studio Finder?
            </h3>
            <p className="text-body-lg text-slate-600 max-w-2xl mx-auto">
              We make it easy to find the right people and spaces for your music projects with cutting-edge technology
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="hover-lift animate-slide-up glass border-white/20 shadow-xl group" style={{ animationDelay: '0.1s' }}>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 gradient-cool rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform animate-float">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-heading-md font-display">AI-Powered Matching</CardTitle>
                <CardDescription className="text-body-md">
                  Smart algorithms connect you with artists who match your style and vision
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-body-sm text-slate-600 leading-relaxed">
                  Our advanced matching system analyzes your music preferences, genre compatibility, and collaboration history to suggest perfect creative partners.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift animate-slide-up glass border-white/20 shadow-xl group" style={{ animationDelay: '0.2s' }}>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform animate-float" style={{ animationDelay: '2s' }}>
                  <Mic2 className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-heading-md font-display">Premium Studios</CardTitle>
                <CardDescription className="text-body-md">
                  Access professional recording spaces with top-tier equipment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-body-sm text-slate-600 leading-relaxed">
                  Book verified studios with professional equipment, experienced engineers, and flexible scheduling that fits your creative workflow.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift animate-slide-up glass border-white/20 shadow-xl group" style={{ animationDelay: '0.3s' }}>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 gradient-accent rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform animate-float" style={{ animationDelay: '4s' }}>
                  <Star className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-heading-md font-display">Career Growth</CardTitle>
                <CardDescription className="text-body-md">
                  Build your network and unlock new opportunities in the industry
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-body-sm text-slate-600 leading-relaxed">
                  Connect with industry professionals, get discovered by labels, and access exclusive opportunities that accelerate your music career.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-4 bg-slate-900 text-white overflow-hidden">
        <div className="container mx-auto text-center">
          <div className="mb-12 animate-fade-in">
            <h3 className="text-display-lg font-display mb-4">Trusted by Top Artists</h3>
            <p className="text-body-lg text-slate-300 max-w-2xl mx-auto">
              Join thousands of successful musicians who&apos;ve found their creative partners through Studio Finder
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            {['Universal Music', 'Sony Records', 'Warner Bros', 'Atlantic Records'].map((label, index) => (
              <div key={label} className="text-heading-sm font-display animate-slide-in-left hover:opacity-100 transition-opacity" style={{ animationDelay: `${index * 0.1}s` }}>
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 gradient-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-3xl mx-auto animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-body-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Launch your music career today
            </div>
            <h3 className="text-display-lg font-display mb-6">Ready to Start Creating?</h3>
            <p className="text-body-lg text-white/90 mb-10 leading-relaxed">
              Join Studio Finder today and take your music to the next level with the right collaborators, 
              professional studios, and industry connections.
            </p>
            <Button size="lg" variant="secondary" className="hover-lift focus-visible shadow-2xl group bg-white text-purple-600 hover:bg-white/90" asChild>
              <Link href="/register">
                <Heart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Get Your Invite Code & Sign Up
                <Sparkles className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <div className="flex items-center gap-3 mb-6 md:mb-0 animate-slide-in-left">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <Music className="w-5 h-5 text-white" />
              </div>
              <span className="text-heading-sm font-display">Studio Finder</span>
            </div>
            <div className="flex items-center gap-8 animate-slide-in-right">
              <Link href="/login" className="text-slate-400 hover:text-white transition-colors hover-lift text-body-md">
                Sign In
              </Link>
              <Link href="/register" className="text-slate-400 hover:text-white transition-colors hover-lift text-body-md">
                Register
              </Link>
              <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors hover-lift text-body-md">
                Dashboard
              </Link>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center">
            <p className="text-body-sm text-slate-400">
              © 2024 Studio Finder. Built with ❤️ for musicians worldwide. 
              <span className="text-purple-400">Next.js</span> • <span className="text-purple-400">Supabase</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
