'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the email confirmation callback
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          router.push('/login?error=auth_failed')
          return
        }

        // Check if this is from email confirmation
        const accessToken = searchParams.get('access_token')
        const refreshToken = searchParams.get('refresh_token')
        const next = searchParams.get('next') || '/login'

        if (accessToken && refreshToken) {
          // This is an email confirmation - set the session
          const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          })

          if (sessionError) {
            console.error('Session error:', sessionError)
            router.push('/login?error=session_failed')
            return
          }

          if (sessionData.session) {
            // Check if we have pending registration data
            const pendingRegistration = localStorage.getItem('pending_registration')
            
            if (pendingRegistration) {
              // Complete the registration process
              const registrationData = JSON.parse(pendingRegistration)
              
              try {
                // Create the profile
                const { error: profileError } = await supabase
                  .from('profiles')
                  .insert({
                    id: sessionData.session.user.id,
                    role: registrationData.role,
                    tier_level: registrationData.tier_level,
                    display_name: null,
                    profile_complete: false
                  })

                if (profileError) {
                  console.error('Profile creation error:', profileError)
                }

                // Mark invite code as used if it was an invite registration
                if (registrationData.registration_mode === 'invite' && registrationData.invite_data) {
                  await supabase
                    .from('invites')
                    .update({ 
                      status: 'used', 
                      used_by: sessionData.session.user.id,
                      used_at: new Date().toISOString()
                    })
                    .eq('code', registrationData.invite_code)
                }

                // Clear pending registration
                localStorage.removeItem('pending_registration')
                
                // Store registration data for profile setup
                localStorage.setItem('registration_data', JSON.stringify({
                  role: registrationData.role,
                  tier_level: registrationData.tier_level,
                  email: registrationData.email,
                  registration_mode: registrationData.registration_mode
                }))

                // Redirect to profile setup
                router.push('/profile/setup')
                return
              } catch (error) {
                console.error('Registration completion error:', error)
              }
            }
          }
        }

        // Default redirect
        if (data.session) {
          router.push(next + '?confirmed=true')
        } else {
          router.push(next)
        }
      } catch (error) {
        console.error('Callback handling error:', error)
        router.push('/login?error=callback_failed')
      }
    }

    handleAuthCallback()
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Confirming your email...</p>
      </div>
    </div>
  )
} 