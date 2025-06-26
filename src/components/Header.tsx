'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { User, LogOut, Sun, Moon } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export default function Header() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    // Check for current user session
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user || null)
      } catch (error) {
        console.error('Error checking user session:', error)
      } finally {
        setIsLoading(false)
      }
    }

    // Check current theme
    const checkTheme = () => {
      const theme = localStorage.getItem('theme')
      const isLightMode = theme === 'light'
      const isDarkMode = !isLightMode // Default to dark
      setIsDark(isDarkMode)
    }

    checkUser()
    checkTheme()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const toggleTheme = () => {
    const newIsDark = !isDark
    const newIsLight = !newIsDark
    setIsDark(newIsDark)
    // Save 'light' only when choosing light mode, 'dark' is default
    localStorage.setItem('theme', newIsLight ? 'light' : 'dark')
    document.documentElement.classList.toggle('dark', newIsDark)
    document.documentElement.classList.toggle('light', newIsLight)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
          <div className="h-8 w-32 dark:block hidden">
            <svg viewBox="0 0 400 120" className="h-full w-full" style={{background: 'transparent'}}>
              <defs>
                <linearGradient id="gradient-dark" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor:'#4F7FFF', stopOpacity:1}} />
                  <stop offset="100%" style={{stopColor:'#9F7FFF', stopOpacity:1}} />
                </linearGradient>
              </defs>
              <circle cx="105" cy="60" r="50" fill="transparent" stroke="url(#gradient-dark)" strokeWidth="6"/>
              <path d="M 70 60 Q 75 45 80 60 Q 85 75 90 60 Q 95 30 100 60 Q 105 90 110 60 Q 115 30 120 60 Q 125 75 130 60 Q 135 45 140 60" 
                    fill="none" stroke="url(#gradient-dark)" strokeWidth="4" strokeLinecap="round"/>
              <text x="185" y="80" fontFamily="Arial, sans-serif" fontSize="48" fontWeight="600" fill="white">wavr</text>
            </svg>
          </div>
          <div className="h-8 w-32 dark:hidden block">
            <svg viewBox="0 0 400 120" className="h-full w-full" style={{background: 'transparent'}}>
              <defs>
                <linearGradient id="gradient-light" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor:'#4F7FFF', stopOpacity:1}} />
                  <stop offset="100%" style={{stopColor:'#9F7FFF', stopOpacity:1}} />
                </linearGradient>
              </defs>
              <circle cx="105" cy="60" r="50" fill="transparent" stroke="url(#gradient-light)" strokeWidth="6"/>
              <path d="M 70 60 Q 75 45 80 60 Q 85 75 90 60 Q 95 30 100 60 Q 105 90 110 60 Q 115 30 120 60 Q 125 75 130 60 Q 135 45 140 60" 
                    fill="none" stroke="url(#gradient-light)" strokeWidth="4" strokeLinecap="round"/>
              <text x="185" y="80" fontFamily="Arial, sans-serif" fontSize="48" fontWeight="600" fill="#1a1a2e">wavr</text>
            </svg>
          </div>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="w-10 h-10 p-0 bg-background/80 backdrop-blur-sm border-border/50"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          {isLoading ? (
            <div className="w-8 h-8 animate-pulse bg-muted rounded-full"></div>
          ) : user ? (
            <div className="flex items-center gap-3">
              {/* Profile Circle */}
              <Link 
                href="/profile" 
                className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground hover:opacity-80 transition-opacity"
                title={user.email}
              >
                <User className="w-4 h-4" />
              </Link>
              
              {/* Logout Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">
                  Sign In
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">
                  Join Free
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
} 