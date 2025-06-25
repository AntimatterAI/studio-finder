'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { User, LogOut } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function Header() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

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

    checkUser()

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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
          <img 
            src="/wavr_logo_dark.svg" 
            alt="wavr" 
            className="h-8 w-auto dark:block hidden"
          />
          <img 
            src="/wavr_logo_light.svg" 
            alt="wavr" 
            className="h-8 w-auto dark:hidden block"
          />
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-4">
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