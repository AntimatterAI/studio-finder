'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Music, ArrowLeft, Mail, Lock, Eye, EyeOff, Sparkles, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Simple validation - in a real app this would be a proper API call
    if (formData.email && formData.password) {
      // Set user session
      localStorage.setItem('user_session', 'authenticated')
      localStorage.setItem('user_email', formData.email)
      localStorage.setItem('user_login_time', Date.now().toString())
      
      // Redirect to dashboard
      router.push('/dashboard')
    } else {
      setError('Please fill in all fields')
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen gradient-hero relative overflow-hidden flex items-center justify-center p-4">
      {/* Electric Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 gradient-primary rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 gradient-electric rounded-full blur-lg animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-20 h-20 gradient-accent rounded-full blur-lg animate-float" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Back Button */}
        <Button 
          variant="outline" 
          size="sm" 
          className="mb-6 glass border-blue-400/20 hover-glow-blue focus-ring text-blue-300 animate-slide-up" 
          asChild
        >
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>

        {/* Main Card */}
        <Card className="glass-card border-blue-400/20 shadow-2xl animate-scale-in">
          <CardHeader className="text-center pb-8">
            {/* Logo */}
            <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
              <Music className="w-8 h-8 text-white" />
            </div>
            
            <CardTitle className="text-display-md font-display text-gradient-primary mb-2">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-body-md text-white/70">
              Sign in to your wavr account and continue creating
            </CardDescription>
            
            {/* Welcome Badge */}
            <div className="badge-modern mt-4">
              <Sparkles className="w-3 h-3" />
              Ready to create music?
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 animate-slide-up">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-body-sm">{error}</span>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <Label htmlFor="email" className="text-body-sm font-medium text-white/80 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="glass border-blue-400/20 text-white placeholder-white/40 focus:border-blue-400/50 h-12 text-body-md"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <Label htmlFor="password" className="text-body-sm font-medium text-white/80 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="glass border-blue-400/20 text-white placeholder-white/40 focus:border-blue-400/50 h-12 pr-12 text-body-md"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80 transition-colors focus-ring"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <Link 
                  href="/admin/login" 
                  className="text-body-sm text-blue-300 hover:text-blue-200 transition-colors hover:underline focus-ring"
                >
                  Admin Login
                </Link>
              </div>

              {/* Sign In Button */}
              <Button 
                type="submit" 
                className="w-full h-12 button-primary font-bold animate-slide-up group shadow-lg"
                style={{ animationDelay: '0.4s' }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  <>
                    Sign In to Dashboard
                    <Music className="ml-2 w-4 h-4 group-hover:scale-110 transition-transform" />
                  </>
                )}
              </Button>

              {/* Sign Up Link */}
              <div className="text-center text-body-sm pt-4 animate-slide-up" style={{ animationDelay: '0.5s' }}>
                <span className="text-white/60">Don&apos;t have an account? </span>
                <Link 
                  href="/register" 
                  className="font-medium text-blue-300 hover:text-blue-200 transition-colors hover:underline focus-ring"
                >
                  Sign up for free
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <p className="text-body-xs text-white/50 mb-3">Trusted by over 25,000+ musicians worldwide</p>
          <div className="flex items-center justify-center gap-6 opacity-60">
            <div className="text-body-xs font-medium text-white/50">256-bit SSL</div>
            <div className="w-1 h-1 bg-white/30 rounded-full"></div>
            <div className="text-body-xs font-medium text-white/50">SOC 2 Compliant</div>
            <div className="w-1 h-1 bg-white/30 rounded-full"></div>
            <div className="text-body-xs font-medium text-white/50">GDPR Ready</div>
          </div>
        </div>
      </div>
    </div>
  )
} 