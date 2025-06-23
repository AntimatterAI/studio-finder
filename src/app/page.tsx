import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AnimatedMusicBackground } from '@/components/AnimatedMusicBackground'
import { Music, Users, Star, ArrowRight, Sparkles, Zap, Heart, Play, Headphones, Mic2, Crown, Infinity } from 'lucide-react'

export default function HomePage() {

  return (
    <div className="min-h-screen gradient-hero relative overflow-hidden particle-system">
      <AnimatedMusicBackground />
      
      {/* Advanced Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-80 h-80 gradient-aurora rounded-full blur-3xl animate-aurora"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 gradient-cosmic rounded-full blur-3xl animate-cosmic-float"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] gradient-luxury rounded-full blur-3xl animate-morphing opacity-30"></div>
      </div>
      
      {/* Premium Navigation */}
      <nav className="glass-aurora fixed top-0 left-0 right-0 z-50 border-b border-blue-400/20">
        <div className="container mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5 animate-slide-in-elegant">
              <div className="w-14 h-14 gradient-luxury rounded-3xl flex items-center justify-center shadow-2xl shadow-yellow-400/40 animate-glow-pulse">
                <Music className="w-8 h-8 text-slate-900" />
              </div>
              <h1 className="text-heading-xl font-display text-gradient-aurora">Studio Finder</h1>
            </div>
            <div className="flex items-center gap-6 animate-slide-in-elegant" style={{ animationDelay: '0.2s' }}>
              <Button variant="outline" size="lg" className="hover-aurora focus-luxury border-blue-400/30 text-blue-300 hover:text-blue-200 font-medium" asChild>
                <Link href="/features">Features</Link>
              </Button>
              <Button variant="outline" size="lg" className="hover-aurora focus-luxury border-blue-400/30 text-blue-300 hover:text-blue-200 font-medium" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button size="lg" className="button-aurora text-slate-900 font-bold" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Ultra Premium */}
      <section className="pt-48 pb-32 px-8 overflow-hidden">
        <div className="container mx-auto text-center">
          <div className="max-w-7xl mx-auto animate-fade-in-up">
            {/* Refined Badge */}
            <div className="badge-aurora text-blue-200 mb-12 animate-fade-in-up hover-aurora group cursor-pointer micro-scale" style={{ animationDelay: '0.1s' }}>
              <Crown className="w-5 h-5 group-hover:rotate-12 transition-all duration-300" />
              <span className="font-medium">Redefining Music Collaboration</span>
              <Infinity className="w-5 h-5 animate-aurora" />
            </div>
            
            {/* Premium Headlines */}
            <h2 className="text-display-2xl font-display mb-10 animate-fade-in-up text-white leading-[1.1]" style={{ animationDelay: '0.2s' }}>
              <span className="text-white">Connect with</span>{' '}
              <span className="text-gradient-aurora relative inline-block animate-shimmer">
                Artists
                <div className="absolute -bottom-4 left-0 right-0 h-1 bg-gradient-to-r from-blue-400/60 via-purple-400/60 to-transparent rounded-full animate-aurora"></div>
              </span>
              <br className="hidden sm:block" />
              <span className="text-white">& </span>
              <span className="text-gradient-cosmic relative inline-block animate-shimmer" style={{ animationDelay: '0.5s' }}>
                Producers
                <div className="absolute -bottom-4 left-0 right-0 h-1 bg-gradient-to-r from-purple-400/60 via-pink-400/60 to-transparent rounded-full animate-cosmic-float"></div>
              </span>
            </h2>
            
            {/* Elegant Subtitle */}
            <p className="text-body-lg mb-16 max-w-5xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.3s', color: 'rgba(255, 255, 255, 0.9)' }}>
              Discover your perfect creative partner through our AI-powered matching system. 
              Book premium studios, collaborate with industry professionals, and elevate your music to extraordinary heights.
            </p>
            
            {/* Premium CTA Section */}
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-24 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Button size="lg" className="button-aurora text-slate-900 font-bold text-lg px-12 py-5 hover-elevate group micro-bounce" asChild>
                <Link href="/register">
                  <Play className="w-6 h-6 mr-4 group-hover:scale-110 transition-transform" />
                  Start Your Journey
                  <ArrowRight className="ml-4 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="hover-cosmic focus-luxury group glass-cosmic border-purple-400/30 text-purple-200 hover:text-purple-100 font-semibold text-lg px-12 py-5" asChild>
                <Link href="/login">
                  <Headphones className="w-6 h-6 mr-4" />
                  View Dashboard
                </Link>
              </Button>
            </div>
            
            {/* Luxury Stats */}
            <div className="grid grid-cols-3 gap-16 max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <div className="stat-premium group hover-aurora">
                <div className="text-heading-xl font-display text-gradient-aurora group-hover:scale-110 transition-transform mb-2 micro-glow">25K+</div>
                <div className="text-body-md font-medium" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Active Creators</div>
              </div>
              <div className="stat-premium group hover-cosmic">
                <div className="text-heading-xl font-display text-gradient-cosmic group-hover:scale-110 transition-transform mb-2 micro-glow">150K+</div>
                <div className="text-body-md font-medium" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Collaborations</div>
              </div>
              <div className="stat-premium group hover-aurora">
                <div className="text-heading-xl font-display text-gradient-luxury group-hover:scale-110 transition-transform mb-2 micro-glow">800+</div>
                <div className="text-body-md font-medium" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Premium Studios</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - World Class */}
      <section className="py-32 px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/30 to-transparent"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-24 animate-fade-in-up">
            <h3 className="text-display-lg font-display mb-8 text-gradient-aurora animate-shimmer">
              The Future of Music Creation
            </h3>
            <p className="text-body-lg max-w-4xl mx-auto leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
              Experience the most advanced platform for music collaboration, powered by cutting-edge AI and designed for the modern creator.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-8xl mx-auto">
            <div className="card-aurora group animate-fade-in-up hover-aurora" style={{ animationDelay: '0.1s' }}>
              <div className="text-center">
                <div className="w-24 h-24 gradient-aurora rounded-3xl flex items-center justify-center mx-auto mb-10 group-hover:scale-110 transition-all duration-500 animate-float-gentle shadow-2xl shadow-blue-400/40 micro-scale">
                  <Users className="w-12 h-12 text-slate-900" />
                </div>
                <h4 className="text-heading-md font-display text-white mb-4">AI-Powered Matching</h4>
                <p className="text-body-md mb-6" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Our sophisticated algorithm analyzes your musical DNA to find perfect creative partners
                </p>
                <p className="text-body-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Advanced compatibility scoring based on style, genre, workflow, and creative goals.
                </p>
              </div>
            </div>

            <div className="card-cosmic group animate-fade-in-up hover-cosmic" style={{ animationDelay: '0.2s' }}>
              <div className="text-center">
                <div className="w-24 h-24 gradient-cosmic rounded-3xl flex items-center justify-center mx-auto mb-10 group-hover:scale-110 transition-all duration-500 animate-cosmic-float shadow-2xl shadow-purple-400/40 micro-scale" style={{ animationDelay: '2s' }}>
                  <Mic2 className="w-12 h-12 text-slate-900" />
                </div>
                <h4 className="text-heading-md font-display text-white mb-4">Premium Studios</h4>
                <p className="text-body-md mb-6" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Access to exclusive recording spaces with world-class equipment and acoustics
                </p>
                <p className="text-body-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Vetted studios with professional engineers, flexible booking, and competitive rates.
                </p>
              </div>
            </div>

            <div className="card-aurora group animate-fade-in-up hover-aurora" style={{ animationDelay: '0.3s' }}>
              <div className="text-center">
                <div className="w-24 h-24 gradient-luxury rounded-3xl flex items-center justify-center mx-auto mb-10 group-hover:scale-110 transition-all duration-500 animate-morphing shadow-2xl shadow-yellow-400/40 micro-scale" style={{ animationDelay: '4s' }}>
                  <Star className="w-12 h-12 text-slate-900" />
                </div>
                <h4 className="text-heading-md font-display text-white mb-4">Industry Network</h4>
                <p className="text-body-md mb-6" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Connect with A&R scouts, producers, and industry professionals who can elevate your career
                </p>
                <p className="text-body-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Exclusive access to industry events, collaboration opportunities, and career guidance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof - Elegant */}
      <section className="py-32 px-8 glass-cosmic border-y border-purple-400/20 overflow-hidden">
        <div className="container mx-auto text-center">
          <div className="mb-20 animate-fade-in-up">
            <h3 className="text-display-lg font-display mb-8 text-gradient-cosmic animate-shimmer">Trusted by Industry Leaders</h3>
            <p className="text-body-lg max-w-4xl mx-auto leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
              Join the community where tomorrow&apos;s hits are created today
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-16 items-center">
            {[
              { name: 'Universal Music', delay: '0s' },
              { name: 'Sony Records', delay: '0.1s' },
              { name: 'Warner Bros', delay: '0.2s' },
              { name: 'Atlantic Records', delay: '0.3s' }
            ].map((label) => (
              <div 
                key={label.name} 
                className="text-heading-md font-display animate-slide-in-elegant hover-cosmic transition-all duration-300 cursor-pointer text-purple-200/80 hover:text-purple-100 micro-scale" 
                style={{ animationDelay: label.delay }}
              >
                {label.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Luxurious */}
      <section className="py-32 px-8 gradient-aurora relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
        <div className="absolute inset-0 animate-aurora opacity-30"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-5xl mx-auto animate-fade-in-up">
            <div className="badge-cosmic bg-slate-900/30 text-white mb-10 hover-cosmic micro-bounce">
              <Zap className="w-5 h-5 animate-aurora" />
              <span className="font-semibold">Transform Your Music Career</span>
              <Crown className="w-5 h-5 animate-cosmic-float" />
            </div>
            <h3 className="text-display-lg font-display mb-10 leading-tight text-slate-900 animate-shimmer">Ready to Create Something Extraordinary?</h3>
            <p className="text-body-lg text-slate-800 mb-16 leading-relaxed max-w-4xl mx-auto">
              Join Studio Finder today and step into the future of music collaboration. 
              Connect with the right people, access premium resources, and turn your creative vision into reality.
            </p>
            <Button size="lg" className="button-cosmic shadow-2xl group font-bold text-xl px-16 py-6 micro-bounce" asChild>
              <Link href="/register" className="flex items-center text-white hover:text-blue-100 no-underline">
                <Heart className="w-7 h-7 mr-4 group-hover:scale-110 transition-transform animate-glow-pulse" />
                <span>Start Your Journey</span>
                <Sparkles className="ml-4 w-7 h-7 group-hover:rotate-12 transition-transform animate-shimmer" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer - Refined */}
      <footer className="glass-aurora border-t border-blue-400/20 py-20">
        <div className="container mx-auto px-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16">
            <div className="flex items-center gap-5 mb-10 md:mb-0 animate-slide-in-elegant">
              <div className="w-12 h-12 gradient-luxury rounded-2xl flex items-center justify-center shadow-2xl shadow-yellow-400/40 animate-glow-pulse">
                <Music className="w-7 h-7 text-slate-900" />
              </div>
              <span className="text-heading-lg font-display text-gradient-aurora">Studio Finder</span>
            </div>
            <div className="flex items-center gap-12 animate-slide-in-elegant" style={{ animationDelay: '0.2s' }}>
              {['Features', 'Sign In', 'Register', 'Dashboard'].map((item) => (
                <Link 
                  key={item}
                  href={`/${item.toLowerCase().replace(' ', '')}`} 
                  className="text-blue-200 hover:text-blue-100 transition-colors hover-aurora text-body-md font-medium micro-scale"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
          <div className="border-t border-blue-400/20 pt-10 text-center">
            <p className="text-body-md font-medium text-gradient-aurora animate-shimmer">
              Connecting visionaries worldwide through the power of music ✨
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
