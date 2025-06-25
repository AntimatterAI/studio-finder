import React from 'react'
import Link from 'next/link'
import { RegisterForm } from '@/components/RegisterForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Music, ArrowLeft, Sparkles, Users, Shield, Zap } from 'lucide-react'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 to-transparent opacity-40"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 right-20 w-32 h-32 gradient-accent rounded-full opacity-10 animate-float"></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 gradient-primary rounded-full opacity-10 animate-float" style={{ animationDelay: '3s' }}></div>
      
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
          <CardHeader className="text-center pb-6">
            {/* Logo */}
            <div className="w-16 h-16 gradient-accent rounded-2xl flex items-center justify-center mx-auto mb-6 animate-float">
              <Music className="w-8 h-8 text-white" />
            </div>
            
            <CardTitle className="text-display-md font-display text-gradient-accent mb-2">
              Join wavr
            </CardTitle>
            <CardDescription className="text-body-md text-slate-600 leading-relaxed">
              Create your account to connect with artists and producers worldwide
            </CardDescription>
            
            {/* Welcome Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-pink-100 text-pink-700 rounded-full text-body-xs font-medium mt-4">
              <Sparkles className="w-3 h-3" />
              Start your music journey
            </div>
          </CardHeader>
          
          <CardContent className="pb-6">
            <RegisterForm />
            
            {/* Sign In Link */}
            <div className="text-center text-body-sm pt-6 animate-slide-up" style={{ animationDelay: '0.8s' }}>
              <span className="text-slate-600">Already have an account? </span>
              <Link 
                href="/login" 
                className="font-medium text-purple-600 hover:text-purple-700 transition-colors hover:underline focus-visible"
              >
                Sign in here
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <div className="mt-8 space-y-4 animate-fade-in" style={{ animationDelay: '0.9s' }}>
          <div className="text-center mb-4">
            <p className="text-body-sm font-medium text-slate-700">What you&apos;ll get:</p>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-3 p-3 glass border-white/20 rounded-xl hover-lift">
              <div className="w-8 h-8 gradient-cool rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-body-sm font-medium text-slate-700">AI-Powered Matching</p>
                <p className="text-body-xs text-slate-500">Find perfect collaborators instantly</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 glass border-white/20 rounded-xl hover-lift">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-body-sm font-medium text-slate-700">Verified Studios</p>
                <p className="text-body-xs text-slate-500">Access to premium recording spaces</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 glass border-white/20 rounded-xl hover-lift">
              <div className="w-8 h-8 gradient-accent rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-body-sm font-medium text-slate-700">Career Growth</p>
                <p className="text-body-xs text-slate-500">Connect with industry professionals</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: '1s' }}>
          <p className="text-body-xs text-slate-500 mb-3">Join 10,000+ musicians who trust wavr</p>
          <div className="flex items-center justify-center gap-6 opacity-60">
            <div className="text-body-xs font-medium">Invite Only</div>
            <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
            <div className="text-body-xs font-medium">Secure</div>
            <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
            <div className="text-body-xs font-medium">Professional</div>
          </div>
        </div>
      </div>
    </div>
  )
} 