'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, Calendar, Clock, Users, MapPin } from 'lucide-react'
import Link from 'next/link'

export default function SchedulePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initPage = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
          router.push('/login')
          return
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (!profile || !profile.profile_complete) {
          router.push('/profile/setup')
          return
        }

        // Profile loaded successfully
      } catch (error) {
        console.error('Error initializing page:', error)
      } finally {
        setLoading(false)
      }
    }

    initPage()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-hero p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            className="glass-card border-primary/20 hover-lift" 
            asChild
          >
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Link>
          </Button>
          
          <h1 className="text-heading-lg font-display text-gradient-primary">Schedule Session</h1>
          
          <div className="w-20" /> {/* Spacer */}
        </div>

        <Card className="glass-card border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Coming Soon
            </CardTitle>
            <CardDescription>
              Studio booking and session scheduling features are in development
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-heading-md font-semibold text-foreground mb-2">
                Session Booking
              </h3>
                             <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                 We&apos;re working on an amazing booking system where you can schedule studio sessions, 
                 invite collaborators, and manage your recording time.
               </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto mb-6 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Time slot management</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>Invite collaborators</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>Studio location details</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Calendar integration</span>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  In the meantime, use the <strong>Find Collaborators</strong> feature to connect with studios and other creators.
                </p>
                <Button asChild className="gradient-primary">
                  <Link href="/discover">
                    <Users className="w-4 h-4 mr-2" />
                    Find Collaborators
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 