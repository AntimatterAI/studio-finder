import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AnimatedMusicBackground } from '@/components/AnimatedMusicBackground'
import { Music, Users, Star, ArrowRight, Sparkles, Zap, Heart, Play, Headphones, Mic2 } from 'lucide-react'
// import type { Metadata } from 'next'

// export const metadata: Metadata = {
//   title: 'Home - Music Collaboration Platform',
//   description: 'Connect with artists and producers, book studio time, and grow your music network. Join Studio Finder today.',
// }

export default function HomePage() {
  return (
    <div className="min-h-screen gradient-hero relative overflow-hidden">
      <AnimatedMusicBackground />
      
      {/* Navigation */}
      <nav className="glass fixed top-0 left-0 right-0 z-50 border-b border-cyan-400/20">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 animate-slide-in-left">
              <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-400/30">
                <Music className="w-7 h-7 text-slate-900" />
              </div>
              <h1 className="text-heading-lg font-display text-gradient-primary">Studio Finder</h1>
            </div>
            <div className="flex items-center gap-4 animate-slide-in-right">
              <Button variant="outline" size="lg" className="hover-glow focus-visible border-cyan-400/30 text-cyan-300 hover:text-cyan-200" asChild>
                <Link href="/features">Features</Link>
              </Button>
              <Button variant="outline" size="lg" className="hover-glow focus-visible border-cyan-400/30 text-cyan-300 hover:text-cyan-200" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button size="lg" className="gradient-primary hover-lift focus-visible shadow-xl shadow-cyan-400/30 text-slate-900 font-semibold" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 overflow-hidden">
        <div className="container mx-auto text-center">
          <div className="max-w-6xl mx-auto animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 glass-neon text-emerald-300 border border-emerald-400/30 backdrop-blur-sm rounded-full text-body-md font-semibold mb-10 animate-slide-up hover-neon group">
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Join the future of music collaboration
            </div>
            
            {/* Main Headline */}
            <h2 className="text-display-2xl font-display mb-8 animate-slide-up text-white leading-tight" style={{ animationDelay: '0.1s' }}>
              <span className="text-white">Connect with</span>{' '}
              <span className="text-gradient-primary relative">
                Artists
                <div className="absolute -bottom-3 left-0 right-0 h-2 bg-gradient-to-r from-cyan-400/40 to-emerald-400/40 rounded-full blur-sm"></div>
              </span>
              {' '}<span className="text-white">&</span>{' '}
              <span className="text-gradient-accent relative">
                Producers
                <div className="absolute -bottom-3 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400/40 to-orange-400/40 rounded-full blur-sm"></div>
              </span>
            </h2>
            
            {/* Subtitle */}
            <p className="text-body-lg text-cyan-100 mb-12 max-w-4xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Find collaborators, book studio time, and grow your music network. 
              Join the community that&apos;s revolutionizing music creation with AI-powered matching and premium studios.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <Button size="lg" className="gradient-primary hover-lift focus-visible shadow-2xl shadow-cyan-400/40 group text-slate-900 font-bold text-lg px-8 py-4" asChild>
                <Link href="/register">
                  <Play className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                  Start Creating Today
                  <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="hover-glow focus-visible group glass-warm border-orange-400/40 text-orange-300 hover:text-orange-200 font-semibold text-lg px-8 py-4" asChild>
                <Link href="/login">
                  <Headphones className="w-6 h-6 mr-3" />
                  Sign In to Dashboard
                </Link>
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-12 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="text-center group">
                <div className="text-heading-xl font-display text-gradient-primary group-hover:scale-110 transition-transform">10K+</div>
                <div className="text-body-md text-cyan-300/80 mt-1">Active Artists</div>
              </div>
              <div className="text-center group">
                <div className="text-heading-xl font-display text-gradient-accent group-hover:scale-110 transition-transform">50K+</div>
                <div className="text-body-md text-emerald-300/80 mt-1">Collaborations</div>
              </div>
              <div className="text-center group">
                <div className="text-heading-xl font-display text-gradient-neon group-hover:scale-110 transition-transform">500+</div>
                <div className="text-body-md text-orange-300/80 mt-1">Studios</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-20 animate-fade-in">
            <h3 className="text-display-lg font-display mb-6 text-gradient-electric">
              Why Choose Studio Finder?
            </h3>
            <p className="text-body-lg text-cyan-200 max-w-3xl mx-auto leading-relaxed">
              We make it easy to find the right people and spaces for your music projects with cutting-edge technology and premium experiences
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
            <Card className="hover-lift animate-slide-up glass border-cyan-400/25 shadow-2xl shadow-cyan-400/10 group rounded-3xl overflow-hidden" style={{ animationDelay: '0.1s' }}>
              <CardHeader className="text-center pb-6 pt-8">
                <div className="w-20 h-20 gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform animate-float shadow-xl shadow-cyan-400/30">
                  <Users className="w-10 h-10 text-slate-900" />
                </div>
                <CardTitle className="text-heading-md font-display text-cyan-100">AI-Powered Matching</CardTitle>
                <CardDescription className="text-body-md text-cyan-300/80 mt-2">
                  Smart algorithms connect you with artists who match your style and vision
                </CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <p className="text-body-sm text-cyan-200/70 leading-relaxed">
                  Our advanced matching system analyzes your music preferences, genre compatibility, and collaboration history to suggest perfect creative partners.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift animate-slide-up glass-neon border-emerald-400/25 shadow-2xl shadow-emerald-400/10 group rounded-3xl overflow-hidden" style={{ animationDelay: '0.2s' }}>
              <CardHeader className="text-center pb-6 pt-8">
                <div className="w-20 h-20 gradient-accent rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform animate-float shadow-xl shadow-emerald-400/30" style={{ animationDelay: '2s' }}>
                  <Mic2 className="w-10 h-10 text-slate-900" />
                </div>
                <CardTitle className="text-heading-md font-display text-emerald-100">Premium Studios</CardTitle>
                <CardDescription className="text-body-md text-emerald-300/80 mt-2">
                  Access professional recording spaces with top-tier equipment
                </CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <p className="text-body-sm text-emerald-200/70 leading-relaxed">
                  Book verified studios with professional equipment, experienced engineers, and flexible scheduling that fits your creative workflow.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-lift animate-slide-up glass-warm border-orange-400/25 shadow-2xl shadow-orange-400/10 group rounded-3xl overflow-hidden" style={{ animationDelay: '0.3s' }}>
              <CardHeader className="text-center pb-6 pt-8">
                <div className="w-20 h-20 gradient-secondary rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform animate-float shadow-xl shadow-orange-400/30" style={{ animationDelay: '4s' }}>
                  <Star className="w-10 h-10 text-slate-900" />
                </div>
                <CardTitle className="text-heading-md font-display text-orange-100">Career Growth</CardTitle>
                <CardDescription className="text-body-md text-orange-300/80 mt-2">
                  Build your network and unlock new opportunities in the industry
                </CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <p className="text-body-sm text-orange-200/70 leading-relaxed">
                  Connect with industry professionals, get discovered by labels, and access exclusive opportunities that accelerate your music career.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 px-6 glass-neon border-y border-emerald-400/20 overflow-hidden">
        <div className="container mx-auto text-center">
          <div className="mb-16 animate-fade-in">
            <h3 className="text-display-lg font-display mb-6 text-gradient-electric">Trusted by Top Artists</h3>
            <p className="text-body-lg text-emerald-200 max-w-3xl mx-auto leading-relaxed">
              Join thousands of successful musicians who&apos;ve found their creative partners through Studio Finder
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 items-center">
            {['Universal Music', 'Sony Records', 'Warner Bros', 'Atlantic Records'].map((label, index) => (
              <div key={label} className="text-heading-md font-display animate-slide-in-left hover:text-emerald-300 transition-all hover:scale-110 text-emerald-400/80 cursor-pointer" style={{ animationDelay: `${index * 0.1}s` }}>
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 gradient-electric text-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-30"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto animate-slide-up">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-900/20 backdrop-blur-sm rounded-full text-body-md font-semibold mb-8">
              <Zap className="w-5 h-5" />
              Launch your music career today
            </div>
            <h3 className="text-display-lg font-display mb-8 leading-tight">Ready to Start Creating?</h3>
            <p className="text-body-lg text-slate-100 mb-12 leading-relaxed max-w-3xl mx-auto">
              Join Studio Finder today and take your music to the next level with the right collaborators, 
              professional studios, and industry connections.
            </p>
            <Button size="lg" variant="secondary" className="hover-lift focus-visible shadow-2xl group bg-slate-900 text-cyan-300 hover:bg-slate-800 border-none font-bold text-lg px-10 py-5" asChild>
              <Link href="/register" className="flex items-center text-cyan-300 hover:text-cyan-200 no-underline">
                <Heart className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                <span>Get Your Invite Code & Sign Up</span>
                <Sparkles className="ml-3 w-6 h-6 group-hover:rotate-12 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass border-t border-cyan-400/20 py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12">
            <div className="flex items-center gap-4 mb-8 md:mb-0 animate-slide-in-left">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg shadow-cyan-400/30">
                <Music className="w-6 h-6 text-slate-900" />
              </div>
              <span className="text-heading-md font-display text-gradient-primary">Studio Finder</span>
            </div>
            <div className="flex items-center gap-10 animate-slide-in-right">
              <Link href="/features" className="text-cyan-300 hover:text-cyan-200 transition-colors hover-lift text-body-md font-medium">
                Features
              </Link>
              <Link href="/login" className="text-cyan-300 hover:text-cyan-200 transition-colors hover-lift text-body-md font-medium">
                Sign In
              </Link>
              <Link href="/register" className="text-cyan-300 hover:text-cyan-200 transition-colors hover-lift text-body-md font-medium">
                Register
              </Link>
              <Link href="/dashboard" className="text-cyan-300 hover:text-cyan-200 transition-colors hover-lift text-body-md font-medium">
                Dashboard
              </Link>
            </div>
          </div>
          <div className="border-t border-cyan-400/20 pt-8 text-center">
            <p className="text-body-md text-cyan-300/60 font-medium">
              Connecting artists worldwide through music ✨
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
