'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import { AlertCircle, Eye, EyeOff, Check, X, Mail, Lock, Key, CheckCircle, Loader2 } from 'lucide-react'

export function RegisterForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    inviteCode: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isValidatingCode, setIsValidatingCode] = useState(false)
  const [codeValidated, setCodeValidated] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
    
    // Real-time validation for invite code
    if (field === 'inviteCode' && value.length >= 6) {
      validateInviteCodeReal(value)
    }
  }

  const validateInviteCodeReal = async (code: string) => {
    if (code.length < 6) return
    setIsValidatingCode(true)
    try {
      const isValid = await validateInviteCode(code)
      setCodeValidated(isValid)
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

    if (!formData.inviteCode) {
      newErrors.inviteCode = 'Invite code is required'
    } else if (!codeValidated) {
      newErrors.inviteCode = 'Please enter a valid invite code'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateInviteCode = async (code: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('invites')
        .select('*')
        .eq('code', code)
        .eq('status', 'approved')
        .single()

      if (error || !data) {
        return false
      }

      return true
    } catch (error) {
      console.error('Error validating invite code:', error)
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            invite_code: formData.inviteCode
          }
        }
      })

      if (error) {
        setErrors({ general: error.message })
        setIsLoading(false)
        return
      }

      if (data.user) {
        // Mark invite code as used
        await supabase
          .from('invites')
          .update({ status: 'used' })
          .eq('code', formData.inviteCode)

        // Redirect to profile setup
        router.push('/profile/setup')
      }
    } catch (error) {
      console.error('Registration error:', error)
      setErrors({ general: 'An unexpected error occurred. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 animate-slide-up">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-body-sm">{errors.general}</span>
        </div>
      )}

      {/* Invite Code Field */}
      <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <Label htmlFor="inviteCode" className="text-body-sm font-medium text-slate-700 flex items-center gap-2">
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
      </div>

      {/* Email Field */}
      <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <Label htmlFor="email" className="text-body-sm font-medium text-slate-700 flex items-center gap-2">
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
        <Label htmlFor="password" className="text-body-sm font-medium text-slate-700 flex items-center gap-2">
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
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors focus-visible"
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
              <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
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
        <Label htmlFor="confirmPassword" className="text-body-sm font-medium text-slate-700 flex items-center gap-2">
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
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors focus-visible"
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
        disabled={isLoading || !codeValidated}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Creating Account...
          </>
        ) : (
          <>
            Create Account
            <CheckCircle className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
          </>
        )}
      </Button>

      {/* Terms */}
      <p className="text-body-xs text-slate-500 text-center leading-relaxed animate-slide-up" style={{ animationDelay: '0.6s' }}>
        By creating an account, you agree to our{' '}
        <a href="/terms" className="text-purple-600 hover:text-purple-700 underline">Terms of Service</a>
        {' '}and{' '}
        <a href="/privacy" className="text-purple-600 hover:text-purple-700 underline">Privacy Policy</a>
      </p>
    </form>
  )
} 