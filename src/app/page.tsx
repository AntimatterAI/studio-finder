import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AnimatedMusicBackground } from '@/components/AnimatedMusicBackground'
import { Music, Users, Star, ArrowRight, Sparkles, Zap, Heart, Play, Headphones, Mic2, Award, TrendingUp } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen gradient-hero relative overflow-hidden">
      <AnimatedMusicBackground />
      
      {/* Modern Navigation */}
      <nav className="glass fixed top-0 left-0 right-0 z-50 border-b border-blue-400/20">
        <div className="container mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5 animate-slide-up">
              <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center shadow-lg animate-pulse-glow">
                <Music className="w-6 h-6 text-white font-bold" />
              </div>
              <h1 className="text-heading-xl font-display text-gradient-primary">Studio Finder</h1>
            </div>
            <div className="flex items-center gap-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <Button variant="outline" size="lg" className="hover-glow-blue focus-ring border-blue-400/30 text-blue-300 hover:text-blue-200 font-medium" asChild>
                <Link href="/features">Features</Link>
              </Button>
              <Button variant="outline" size="lg" className="hover-glow-blue focus-ring border-blue-400/30 text-blue-300 hover:text-blue-200 font-medium" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button size="lg" className="button-primary font-bold" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Modern Music Platform */}
      <section className="pt-32 pb-24 px-8">
        <div className="container mx-auto text-center">
          <div className="max-w-6xl mx-auto animate-fade-in">
            {/* Modern Badge */}
            <div className="badge-modern mb-8 animate-scale-in hover-scale cursor-pointer" style={{ animationDelay: '0.1s' }}>
              <Award className="w-4 h-4" />
              <span className="font-medium">Next-Gen Music Collaboration</span>
            </div>
            
            {/* Electric Headlines */}
            <h2 className="text-display-2xl font-display mb-8 animate-slide-up text-white leading-tight" style={{ animationDelay: '0.2s' }}>
              Connect with
              <span className="text-gradient-primary"> Artists</span>
              <br className="hidden sm:block" />
              & <span className="text-gradient-electric">Producers</span>
            </h2>
            
            {/* Modern Subtitle */}
            <p className="text-body-lg mb-12 max-w-4xl mx-auto leading-relaxed animate-slide-up text-white/90" style={{ animationDelay: '0.3s' }}>
              Discover your perfect creative partner through our AI-powered matching system. 
              Book premium studios, collaborate with industry professionals, and elevate your music career.
            </p>
            
            {/* Modern CTA Section */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <Button size="lg" className="button-primary text-lg px-10 py-4 hover-lift group" asChild>
                <Link href="/register">
                  <Play className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                  Start Your Journey
                  <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="button-secondary text-lg px-10 py-4 hover-lift group" asChild>
                <Link href="/login">
                  <Headphones className="w-5 h-5 mr-3" />
                  View Dashboard
                </Link>
              </Button>
            </div>
            
            {/* Modern Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <div className="stat-card group hover-lift">
                <div className="text-heading-xl font-display text-gradient-primary group-hover:scale-105 transition-transform mb-1">25K+</div>
                <div className="text-body-md font-medium text-white/80">Active Creators</div>
              </div>
              <div className="stat-card group hover-lift">
                <div className="text-heading-xl font-display text-gradient-electric group-hover:scale-105 transition-transform mb-1">150K+</div>
                <div className="text-body-md font-medium text-white/80">Collaborations</div>
              </div>
              <div className="stat-card group hover-lift">
                <div className="text-heading-xl font-display text-gradient-accent group-hover:scale-105 transition-transform mb-1">800+</div>
                <div className="text-body-md font-medium text-white/80">Premium Studios</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Modern */}
      <section className="py-24 px-8 relative">
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-20 animate-fade-in">
            <h3 className="text-display-lg font-display mb-6 text-gradient-primary">
              The Future of Music Creation
            </h3>
            <p className="text-body-lg max-w-3xl mx-auto leading-relaxed text-white/90">
              Experience the most advanced platform for music collaboration, powered by cutting-edge AI and designed for the modern creator.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="card-modern group animate-slide-up hover-lift" style={{ animationDelay: '0.1s' }}>
              <div className="text-center">
                <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 animate-float shadow-xl">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-heading-md font-display text-white mb-4">AI-Powered Matching</h4>
                <p className="text-body-md mb-4 text-white/80">
                  Our sophisticated algorithm analyzes your musical DNA to find perfect creative partners
                </p>
                <p className="text-body-sm text-white/70">
                  Advanced compatibility scoring based on style, genre, workflow, and creative goals.
                </p>
              </div>
            </div>

            <div className="card-modern group animate-slide-up hover-lift" style={{ animationDelay: '0.2s' }}>
              <div className="text-center">
                <div className="w-16 h-16 gradient-electric rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 animate-float shadow-xl" style={{ animationDelay: '2s' }}>
                  <Mic2 className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-heading-md font-display text-white mb-4">Premium Studios</h4>
                <p className="text-body-md mb-4 text-white/80">
                  Access to exclusive recording spaces with world-class equipment and acoustics
                </p>
                <p className="text-body-sm text-white/70">
                  Vetted studios with professional engineers, flexible booking, and competitive rates.
                </p>
              </div>
            </div>

            <div className="card-modern group animate-slide-up hover-lift" style={{ animationDelay: '0.3s' }}>
              <div className="text-center">
                <div className="w-16 h-16 gradient-accent rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 animate-float shadow-xl" style={{ animationDelay: '4s' }}>
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-heading-md font-display text-white mb-4">Industry Network</h4>
                <p className="text-body-md mb-4 text-white/80">
                  Connect with A&R scouts, producers, and industry professionals who can elevate your career
                </p>
                <p className="text-body-sm text-white/70">
                  Exclusive access to industry events, collaboration opportunities, and career guidance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof - Modern */}
      <section className="py-24 px-8 glass-card border-y border-blue-400/20">
        <div className="container mx-auto text-center">
          <div className="mb-16 animate-fade-in">
            <h3 className="text-display-lg font-display mb-6 text-gradient-electric">Trusted by Industry Leaders</h3>
            <p className="text-body-lg max-w-3xl mx-auto leading-relaxed text-white/90">
              Join the community where tomorrow&apos;s hits are created today
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 items-center">
            {[
              { name: 'Universal Music', delay: '0s' },
              { name: 'Sony Records', delay: '0.1s' },
              { name: 'Warner Bros', delay: '0.2s' },
              { name: 'Atlantic Records', delay: '0.3s' }
            ].map((label) => (
              <div 
                key={label.name} 
                className="text-heading-md font-display animate-slide-up hover-scale transition-all duration-300 cursor-pointer text-white/70 hover:text-blue-300" 
                style={{ animationDelay: label.delay }}
              >
                {label.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Electric */}
      <section className="py-24 px-8 gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-transparent"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="badge-modern bg-black/30 text-blue-200 mb-8 hover-scale">
              <Zap className="w-5 h-5" />
              <span className="font-semibold">Transform Your Music Career</span>
              <Star className="w-5 h-5" />
            </div>
            <h3 className="text-display-lg font-display mb-8 leading-tight text-white">Ready to Create Something Extraordinary?</h3>
            <p className="text-body-lg text-white/90 mb-12 leading-relaxed max-w-3xl mx-auto">
              Join Studio Finder today and step into the future of music collaboration. 
              Connect with the right people, access premium resources, and turn your creative vision into reality.
            </p>
            <Button size="lg" className="button-secondary shadow-2xl group font-bold text-xl px-12 py-5 bg-black/80 hover:bg-black/90 text-white border-white/30 hover:border-white/50" asChild>
              <Link href="/register" className="flex items-center no-underline">
                <Heart className="w-6 h-6 mr-4 group-hover:scale-110 transition-transform" />
                <span>Start Your Journey</span>
                <Sparkles className="ml-4 w-6 h-6 group-hover:rotate-12 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer - Modern */}
      <footer className="glass border-t border-blue-400/20 py-16">
        <div className="container mx-auto px-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12">
            <div className="flex items-center gap-4 mb-8 md:mb-0 animate-slide-up">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg animate-pulse-glow">
                <Music className="w-5 h-5 text-white" />
              </div>
              <span className="text-heading-lg font-display text-gradient-primary">Studio Finder</span>
            </div>
            <div className="flex items-center gap-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              {['Features', 'Sign In', 'Register', 'Dashboard'].map((item) => (
                <Link 
                  key={item}
                  href={`/${item.toLowerCase().replace(' ', '')}`} 
                  className="text-white/80 hover:text-blue-300 transition-colors hover-scale text-body-md font-medium"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
          <div className="border-t border-blue-400/20 pt-8 text-center">
            <p className="text-body-md font-medium text-gradient-electric">
              Connecting visionaries worldwide through the power of music ✨
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
