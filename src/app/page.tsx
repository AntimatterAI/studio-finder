'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowRight, Music, Users, Calendar, Star, Sun, Moon, Sparkles, Headphones, Mic, Radio } from 'lucide-react'
import AnimatedMusicBackground from '@/components/AnimatedMusicBackground'

export default function HomePage() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Default to light mode unless explicitly set to dark
    const checkTheme = () => {
      const theme = localStorage.getItem('theme')
      const isDarkMode = theme === 'dark'
      setIsDark(isDarkMode)
      document.documentElement.classList.toggle('dark', isDarkMode)
    }
    
    checkTheme()
  }, [])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', newIsDark)
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Animation */}
      <AnimatedMusicBackground />
      
      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleTheme}
          className="w-10 h-10 p-0 bg-background/80 backdrop-blur-sm border-border/50"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
      </div>
      
      <div className="container mx-auto px-6 py-16 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Music className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-display-2xl font-display text-foreground">
              Studio Finder
            </h1>
          </div>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Connect with talented artists, producers, and studios. 
            Collaborate, create, and grow your music together.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="button-primary" asChild>
              <Link href="/register">
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="button-secondary" asChild>
              <Link href="/login">
                Sign In
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <Card className="card-modern hover-lift">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <CardTitle className="text-heading-md">Find Collaborators</CardTitle>
              <CardDescription>
                Connect with artists and producers who share your musical vision and style.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="card-modern hover-lift">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-green-500" />
              </div>
              <CardTitle className="text-heading-md">Book Studio Time</CardTitle>
              <CardDescription>
                Discover and book professional studios with the equipment you need.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="card-modern hover-lift">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-purple-500" />
              </div>
              <CardTitle className="text-heading-md">Showcase Your Work</CardTitle>
              <CardDescription>
                Share your music, build your reputation, and attract new opportunities.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="text-center mb-20">
          <h2 className="text-display-lg font-display text-foreground mb-12">
            Join Our Growing Community
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="stat-card">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">500+</div>
              <div className="text-sm text-muted-foreground">Active Members</div>
            </div>
            
            <div className="stat-card">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">1,200+</div>
              <div className="text-sm text-muted-foreground">Collaborations</div>
            </div>
            
            <div className="stat-card">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                <Radio className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">50+</div>
              <div className="text-sm text-muted-foreground">Studios</div>
            </div>
            
            <div className="stat-card">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                <Mic className="w-5 h-5 text-purple-500" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">10k+</div>
              <div className="text-sm text-muted-foreground">Tracks Created</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto card-modern">
            <CardContent className="p-12">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-display-md font-display text-foreground mb-4">
                Ready to Create?
              </h3>
              <p className="text-body-lg text-muted-foreground mb-8">
                Join Studio Finder today and start building your music network.
              </p>
              <Button size="lg" className="button-primary" asChild>
                <Link href="/register">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
