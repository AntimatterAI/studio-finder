'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Eye, EyeOff, AlertCircle, Lock } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simple hardcoded authentication
    if (formData.email === 'paul@antimatterai.com' && formData.password === 'Password123') {
      // Set admin session
      localStorage.setItem('admin_session', 'authenticated')
      localStorage.setItem('admin_email', formData.email)
      localStorage.setItem('admin_login_time', Date.now().toString())
      
      router.push('/admin')
    } else {
      setError('Invalid credentials')
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen gradient-hero relative overflow-hidden flex items-center justify-center p-4">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-32 left-32 w-64 h-64 gradient-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-32 w-64 h-64 gradient-secondary rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <Card className="glass-premium border-white/10 shadow-2xl animate-fade-in-up">
          <CardHeader className="text-center pb-8">
            <div className="w-16 h-16 gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 animate-glow-pulse">
              <Shield className="w-8 h-8 text-slate-900" />
            </div>
            
            <CardTitle className="text-heading-lg font-display text-white mb-2">
              Admin Access
            </CardTitle>
            <CardDescription style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              Authorized personnel only
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 animate-slide-up">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-body-sm">{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-body-sm font-medium" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="h-12 glass-premium border-white/20 text-white placeholder-white/40 focus:border-blue-400/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-body-sm font-medium" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="h-12 glass-premium border-white/20 text-white placeholder-white/40 focus:border-blue-400/50 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full button-premium h-12 text-slate-900 font-bold"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-slate-700 border-t-transparent rounded-full animate-spin mr-2"></div>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5 mr-2" />
                    Access Admin Console
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <p className="text-body-xs" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                This area is restricted to authorized administrators only.
                All access attempts are logged and monitored.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 