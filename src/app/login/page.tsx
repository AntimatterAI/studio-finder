'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Music, ArrowLeft, Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate loading
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 to-transparent opacity-40"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 gradient-primary rounded-full opacity-10 animate-float"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 gradient-accent rounded-full opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Back Button */}
        <Button 
          variant="outline" 
          size="sm" 
          className="mb-6 glass border-white/20 hover-lift focus-visible animate-slide-in-left" 
          asChild
        >
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>

        {/* Main Card */}
        <Card className="glass border-white/20 shadow-2xl animate-scale-in">
          <CardHeader className="text-center pb-8">
            {/* Logo */}
            <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 animate-float">
              <Music className="w-8 h-8 text-white" />
            </div>
            
            <CardTitle className="text-display-md font-display text-gradient-primary mb-2">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-body-md text-slate-600">
              Sign in to your Studio Finder account and continue creating
            </CardDescription>
            
            {/* Welcome Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-body-xs font-medium mt-4">
              <Sparkles className="w-3 h-3" />
              Ready to create music?
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <Label htmlFor="email" className="text-body-sm font-medium text-slate-700 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className="focus-visible border-purple-200 focus:border-purple-400 transition-colors h-12 text-body-md"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <Label htmlFor="password" className="text-body-sm font-medium text-slate-700 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="focus-visible border-purple-200 focus:border-purple-400 transition-colors h-12 pr-12 text-body-md"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors focus-visible"
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
                  href="/forgot-password" 
                  className="text-body-sm text-purple-600 hover:text-purple-700 transition-colors hover:underline focus-visible"
                >
                  Forgot your password?
                </Link>
              </div>

              {/* Sign In Button */}
              <Button 
                type="submit" 
                className={`w-full h-12 gradient-primary hover-lift focus-visible shadow-lg animate-slide-up group ${isLoading ? 'loading' : ''}`}
                style={{ animationDelay: '0.4s' }}
                disabled={isLoading}
              >
                {isLoading ? (
                  'Signing In...'
                ) : (
                  <>
                    Sign In to Dashboard
                    <Music className="ml-2 w-4 h-4 group-hover:scale-110 transition-transform" />
                  </>
                )}
              </Button>

              {/* Divider */}
              <div className="relative animate-slide-up" style={{ animationDelay: '0.5s' }}>
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-body-xs uppercase">
                  <span className="bg-white px-4 text-slate-500 font-medium">Or continue with</span>
                </div>
              </div>

              {/* Social Login Options */}
              <div className="grid grid-cols-2 gap-3 animate-slide-up" style={{ animationDelay: '0.6s' }}>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="h-12 hover-lift focus-visible bg-white/50 backdrop-blur-sm border-slate-200"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="h-12 hover-lift focus-visible bg-white/50 backdrop-blur-sm border-slate-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.225.083.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.747 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.624 0 11.99-5.367 11.99-11.986C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                  Apple
                </Button>
              </div>

              {/* Sign Up Link */}
              <div className="text-center text-body-sm pt-4 animate-slide-up" style={{ animationDelay: '0.7s' }}>
                <span className="text-slate-600">Don&apos;t have an account? </span>
                <Link 
                  href="/register" 
                  className="font-medium text-purple-600 hover:text-purple-700 transition-colors hover:underline focus-visible"
                >
                  Sign up for free
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <p className="text-body-xs text-slate-500 mb-3">Trusted by over 10,000+ musicians worldwide</p>
          <div className="flex items-center justify-center gap-6 opacity-60">
            <div className="text-body-xs font-medium">256-bit SSL</div>
            <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
            <div className="text-body-xs font-medium">SOC 2 Compliant</div>
            <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
            <div className="text-body-xs font-medium">GDPR Ready</div>
          </div>
        </div>
      </div>
    </div>
  )
} 