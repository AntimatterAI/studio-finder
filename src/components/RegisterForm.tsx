'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import { AlertCircle, Eye, EyeOff, Check, X, Mail, Lock, Key, CheckCircle, Loader2, User, Headphones, Radio } from 'lucide-react'

export function RegisterForm() {
  const router = useRouter()
  const [registrationMode, setRegistrationMode] = useState<'public' | 'invite'>('public')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    inviteCode: '',
    role: 'artist_producer' as 'artist_producer' | 'studio'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isValidatingCode, setIsValidatingCode] = useState(false)
  const [codeValidated, setCodeValidated] = useState(false)
  const [inviteCodeData, setInviteCodeData] = useState<{
    id: string
    code: string
    code_type: 'artist_producer' | 'studio' | 'admin'
    tier_level: 1 | 2 | 3
    status: 'available' | 'used'
  } | null>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error and success messages when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
    if (success) {
      setSuccess('')
    }
    
    // Real-time validation for invite code
    if (field === 'inviteCode' && value.length >= 6 && registrationMode === 'invite') {
      validateInviteCodeReal(value)
    }
  }

  const validateInviteCodeReal = async (code: string) => {
    if (code.length < 6) return
    setIsValidatingCode(true)
    try {
      const { isValid, data } = await validateInviteCode(code)
      setCodeValidated(isValid)
      setInviteCodeData(data)
      if (!isValid) {
        setErrors(prev => ({ ...prev, inviteCode: 'Invalid invite code' }))
      }
    } catch (error) {
      console.error('Code validation error:', error)
    } finally {
      setIsValidatingCode(false)
    }
  }

  const getPasswordStrength = (password: string) => {
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[a-z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[^A-Za-z\d]/.test(password)) score++
    
    if (score < 2) return { strength: 'weak', color: 'bg-red-500', text: 'Weak' }
    if (score < 4) return { strength: 'medium', color: 'bg-yellow-500', text: 'Medium' }
    return { strength: 'strong', color: 'bg-green-500', text: 'Strong' }
  }

  const passwordStrength = getPasswordStrength(formData.password)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    // Only validate invite code if in invite mode
    if (registrationMode === 'invite') {
      if (!formData.inviteCode) {
        newErrors.inviteCode = 'Invite code is required'
      } else if (!codeValidated) {
        newErrors.inviteCode = 'Please enter a valid invite code'
      }
    }

    // Validate role selection for public registration
    if (registrationMode === 'public' && !formData.role) {
      newErrors.role = 'Please select your role'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateInviteCode = async (code: string): Promise<{ 
    isValid: boolean; 
    data: {
      id: string
      code: string
      code_type: 'artist_producer' | 'studio' | 'admin'
      tier_level: 1 | 2 | 3
      status: 'available' | 'used'
    } | null 
  }> => {
    try {
      const { data, error } = await supabase
        .from('invites')
        .select('*')
        .eq('code', code)
        .eq('status', 'available')
        .single()

      if (error || !data) {
        return { isValid: false, data: null }
      }

      return { isValid: true, data }
    } catch (error) {
      console.error('Error validating invite code:', error)
      return { isValid: false, data: null }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Determine role and tier based on registration mode
      const role = registrationMode === 'public' ? formData.role : inviteCodeData?.code_type
      const tierLevel = registrationMode === 'public' ? 1 : inviteCodeData?.tier_level

      // Sign up the user with email confirmation
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/login`,
          data: {
            invite_code: registrationMode === 'invite' ? formData.inviteCode : null,
            role: role,
            tier_level: tierLevel,
            registration_mode: registrationMode
          }
        }
      })

      if (error) {
        setErrors({ general: error.message })
        setIsLoading(false)
        return
      }

      if (data.user) {
        // Check if user needs email confirmation
        if (!data.session) {
          // Store registration data for when they confirm email
          localStorage.setItem('pending_registration', JSON.stringify({
            role: role,
            tier_level: tierLevel,
            email: formData.email,
            registration_mode: registrationMode,
            invite_code: registrationMode === 'invite' ? formData.inviteCode : null,
            invite_data: inviteCodeData
          }))

          // Show success message about email confirmation (styled as success, not error)
          setSuccess(`✅ Account created! Please check your email (${formData.email}) and click the confirmation link to complete your registration. Then return to sign in.`)
          setIsLoading(false)
          return
        }

        // If session exists (should not happen with email confirmation enabled)
        if (role && tierLevel) {
          // Mark invite code as used if in invite mode
          if (registrationMode === 'invite' && inviteCodeData) {
            await supabase
              .from('invites')
              .update({ 
                status: 'used', 
                used_by: data.user.id,
                used_at: new Date().toISOString()
              })
              .eq('code', formData.inviteCode)
          }

          // Create initial profile
          await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              role: role,
              tier_level: tierLevel,
              display_name: null,
              profile_complete: false
            })

          // Store registration data in localStorage for profile setup
          localStorage.setItem('registration_data', JSON.stringify({
            role: role,
            tier_level: tierLevel,
            email: formData.email,
            registration_mode: registrationMode
          }))

          // Redirect to profile setup
          router.push('/profile/setup')
        }
      }
    } catch (error) {
      console.error('Registration error:', error)
      setErrors({ general: 'An unexpected error occurred. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'artist_producer': return <Headphones className="w-4 h-4" />
      case 'studio': return <Radio className="w-4 h-4" />
      default: return <User className="w-4 h-4" />
    }
  }

  // If registration was successful, only show the email confirmation message
  if (success) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 p-6 bg-green-50 border border-green-200 rounded-xl text-green-700 animate-slide-up text-center">
          <CheckCircle className="w-6 h-6 flex-shrink-0 text-green-500" />
          <div className="flex-1">
            <div className="font-medium text-green-800 mb-1">Check Your Email!</div>
            <div className="text-green-600 text-sm leading-relaxed">
              We&apos;ve sent a confirmation link to <strong>{formData.email}</strong>. 
              Click the link to verify your account, then return here to sign in.
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Button
            onClick={() => {
              // Reset form and go to login
              setSuccess('')
              window.location.href = '/login'
            }}
            className="gradient-accent hover-lift"
          >
            Go to Sign In
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Registration Mode Selector */}
      <div className="space-y-3">
        <Label className="text-body-sm font-medium text-foreground">Registration Type</Label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setRegistrationMode('public')
              setCodeValidated(false)
              setInviteCodeData(null)
              setFormData(prev => ({ ...prev, inviteCode: '' }))
              setErrors({})
            }}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              registrationMode === 'public'
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Public Tier 1</span>
              </div>
              <p className="text-sm opacity-80">Join as a Tier 1 member for free</p>
            </div>
          </button>
          
          <button
            type="button"
            onClick={() => {
              setRegistrationMode('invite')
              setFormData(prev => ({ ...prev, role: 'artist_producer' }))
              setErrors({})
            }}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              registrationMode === 'invite'
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                <span className="font-medium">Invite Code</span>
              </div>
              <p className="text-sm opacity-80">Join with an exclusive invite code</p>
            </div>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.general && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 animate-slide-up">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-body-sm">{errors.general}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-3 p-4 bg-primary/10 border border-primary/20 rounded-xl text-primary animate-slide-up">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-body-sm">{success}</span>
          </div>
        )}

        {/* Role Selection for Public Registration */}
        {registrationMode === 'public' && (
          <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <Label className="text-body-sm font-medium text-foreground">Your Role</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'artist_producer', label: 'Artist/Producer', description: 'Musician, songwriter, beat maker, engineer' },
                { value: 'studio', label: 'Studio', description: 'Recording facility, rehearsal space' }
              ].map(({ value, label, description }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: value as typeof formData.role }))}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    formData.role === value
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex justify-center">
                      {getRoleIcon(value)}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{label}</div>
                      <div className="text-xs opacity-70">{description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {errors.role && (
              <p className="text-red-500 text-body-xs flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.role}
              </p>
            )}
          </div>
        )}

        {/* Invite Code Field (Only for invite mode) */}
        {registrationMode === 'invite' && (
          <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <Label htmlFor="inviteCode" className="text-body-sm font-medium text-foreground flex items-center gap-2">
              <Key className="w-4 h-4" />
              Invite Code
            </Label>
            <div className="relative">
              <Input
                id="inviteCode"
                type="text"
                placeholder="Enter your invite code"
                value={formData.inviteCode}
                onChange={(e) => handleInputChange('inviteCode', e.target.value)}
                className={`focus-visible h-12 pr-12 text-body-md transition-all duration-200 ${
                  errors.inviteCode 
                    ? 'border-red-300 focus:border-red-400' 
                    : codeValidated 
                    ? 'border-green-300 focus:border-green-400' 
                    : 'border-purple-200 focus:border-purple-400'
                }`}
                required
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {isValidatingCode ? (
                  <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
                ) : codeValidated ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : formData.inviteCode && !codeValidated ? (
                  <X className="w-5 h-5 text-red-500" />
                ) : null}
              </div>
            </div>
            {errors.inviteCode && (
              <p className="text-red-500 text-body-xs flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.inviteCode}
              </p>
            )}
            {codeValidated && inviteCodeData && (
              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div className="flex-1">
                  <p className="text-green-700 text-body-sm font-medium">Valid invite code!</p>
                  <p className="text-green-600 text-body-xs">
                    Role: <span className="font-medium capitalize">{inviteCodeData.code_type}</span> • 
                    Tier: <span className="font-medium">Level {inviteCodeData.tier_level}</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Email Field */}
        <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Label htmlFor="email" className="text-body-sm font-medium text-foreground flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`focus-visible h-12 text-body-md transition-colors ${
              errors.email ? 'border-red-300 focus:border-red-400' : 'border-purple-200 focus:border-purple-400'
            }`}
            required
          />
          {errors.email && (
            <p className="text-red-500 text-body-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <Label htmlFor="password" className="text-body-sm font-medium text-foreground flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a strong password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`focus-visible h-12 pr-12 text-body-md transition-colors ${
                errors.password ? 'border-red-300 focus:border-red-400' : 'border-purple-200 focus:border-purple-400'
              }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus-visible"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          
          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${passwordStrength.color} transition-all duration-300`}
                    style={{ width: `${(passwordStrength.strength === 'weak' ? 33 : passwordStrength.strength === 'medium' ? 66 : 100)}%` }}
                  />
                </div>
                <span className={`text-body-xs font-medium ${
                  passwordStrength.strength === 'weak' ? 'text-red-500' : 
                  passwordStrength.strength === 'medium' ? 'text-yellow-500' : 'text-green-500'
                }`}>
                  {passwordStrength.text}
                </span>
              </div>
            </div>
          )}
          
          {errors.password && (
            <p className="text-red-500 text-body-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.password}
            </p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <Label htmlFor="confirmPassword" className="text-body-sm font-medium text-foreground flex items-center gap-2">
            <Check className="w-4 h-4" />
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className={`focus-visible h-12 pr-12 text-body-md transition-colors ${
                errors.confirmPassword ? 'border-red-300 focus:border-red-400' : 
                formData.confirmPassword && formData.password === formData.confirmPassword ? 'border-green-300 focus:border-green-400' :
                'border-purple-200 focus:border-purple-400'
              }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus-visible"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {formData.confirmPassword && formData.password === formData.confirmPassword && (
            <p className="text-green-500 text-body-xs flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Passwords match
            </p>
          )}
          {errors.confirmPassword && (
            <p className="text-red-500 text-body-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button 
          type="submit" 
          className={`w-full h-12 gradient-accent hover-lift focus-visible shadow-lg animate-slide-up group ${isLoading ? 'loading' : ''}`}
          style={{ animationDelay: '0.5s' }}
          disabled={isLoading || (registrationMode === 'invite' && !codeValidated)}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Creating Account...
            </>
          ) : (
            <>
              {registrationMode === 'public' ? 'Join as Tier 1' : 'Create Account'}
              <CheckCircle className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
            </>
          )}
        </Button>

        {/* Info Note */}
        {registrationMode === 'public' && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-blue-700 text-body-sm font-medium mb-1">Tier 1 Membership Benefits</p>
                <ul className="text-blue-600 text-body-xs space-y-1">
                  <li>• Browse and connect with other Tier 1 members</li>
                  <li>• Book Tier 1 studios and producers</li>
                  <li>• Share your music and get discovered</li>
                  <li>• Join the wavr community</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Terms */}
        <p className="text-body-xs text-muted-foreground text-center leading-relaxed animate-slide-up" style={{ animationDelay: '0.6s' }}>
          By creating an account, you agree to our{' '}
          <a href="/terms" className="text-primary hover:text-primary/80 underline">Terms of Service</a>
          {' '}and{' '}
          <a href="/privacy" className="text-primary hover:text-primary/80 underline">Privacy Policy</a>
        </p>
      </form>
    </div>
  )
} 