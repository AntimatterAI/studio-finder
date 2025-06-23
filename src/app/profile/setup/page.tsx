'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import { Music, Mic, Plus, X, Instagram, Youtube, ArrowLeft, Check, Upload, Star, Sparkles, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function ProfileSetupPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [role, setRole] = useState<'artist' | 'producer' | null>(null)
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    location: '',
    experience: ''
  })
  const [socialLinks, setSocialLinks] = useState({
    instagram: '',
    soundcloud: '',
    spotify: '',
    youtube: ''
  })

  const totalSteps = 4

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim()) && skills.length < 10) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove))
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSocialChange = (platform: string, value: string) => {
    setSocialLinks(prev => ({ ...prev, [platform]: value }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1: return "Choose Your Role"
      case 2: return "Basic Information"
      case 3: return "Skills & Experience"
      case 4: return "Social Presence"
      default: return ""
    }
  }

  const getStepDescription = (step: number) => {
    switch (step) {
      case 1: return "Tell us what type of creator you are"
      case 2: return "Let's get to know you better"
      case 3: return "Showcase your musical abilities"
      case 4: return "Connect your social profiles"
      default: return ""
    }
  }

  const saveProfile = async () => {
    if (!role || !formData.displayName.trim()) {
      alert('Please complete required fields (role and display name)')
      return
    }

    setIsSaving(true)
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        alert('Authentication error. Please log in again.')
        router.push('/login')
        return
      }

      // Prepare profile data
      const profileData = {
        id: user.id,
        role,
        display_name: formData.displayName,
        skills: skills.length > 0 ? skills : null,
        socials: {
          bio: formData.bio || null,
          location: formData.location || null,
          experience: formData.experience || null,
          ...socialLinks
        },
        profile_complete: true,
        updated_at: new Date().toISOString()
      }

      // Upsert profile data
      const { error } = await supabase
        .from('profiles')
        .upsert(profileData)

      if (error) {
        console.error('Error saving profile:', error)
        alert('Failed to save profile. Please try again.')
        return
      }

      // Success - redirect to dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('An unexpected error occurred. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30 p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 to-transparent opacity-40"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-24 h-24 gradient-primary rounded-full opacity-10 animate-float"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 gradient-accent rounded-full opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <Button 
            variant="outline" 
            size="sm" 
            className="mb-6 glass border-white/20 hover-lift focus-visible" 
            asChild
          >
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-body-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Complete your profile to get better matches
          </div>
          
          <h1 className="text-display-xl font-display text-gradient-primary mb-2">Complete Your Profile</h1>
          <p className="text-body-lg text-slate-600">Tell us about yourself to get better connections</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center justify-between mb-2">
            <span className="text-body-sm font-medium text-slate-700">Step {currentStep} of {totalSteps}</span>
            <span className="text-body-sm text-slate-500">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Main Card */}
        <Card className="glass border-white/20 shadow-2xl animate-scale-in">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-heading-lg font-display">{getStepTitle(currentStep)}</CardTitle>
            <CardDescription className="text-body-md">{getStepDescription(currentStep)}</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Step 1: Role Selection */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRole('artist')}
                    className={`p-6 border-2 rounded-2xl text-left transition-all duration-200 hover-lift group ${
                      role === 'artist'
                        ? 'border-purple-400 bg-purple-50 shadow-lg'
                        : 'border-slate-200 hover:border-purple-300 bg-white/60'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 ${
                        role === 'artist' ? 'gradient-primary' : 'bg-slate-100'
                      }`}>
                        <Mic className={`w-6 h-6 ${role === 'artist' ? 'text-white' : 'text-slate-600'}`} />
                      </div>
                      <div>
                        <h3 className="text-body-lg font-semibold text-slate-800">Artist</h3>
                        <p className="text-body-sm text-slate-600">Vocalist, songwriter, performer</p>
                      </div>
                    </div>
                    {role === 'artist' && (
                      <div className="mt-4 flex items-center gap-2 text-purple-600">
                        <Check className="w-4 h-4" />
                        <span className="text-body-sm font-medium">Selected</span>
                      </div>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setRole('producer')}
                    className={`p-6 border-2 rounded-2xl text-left transition-all duration-200 hover-lift group ${
                      role === 'producer'
                        ? 'border-purple-400 bg-purple-50 shadow-lg'
                        : 'border-slate-200 hover:border-purple-300 bg-white/60'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 ${
                        role === 'producer' ? 'gradient-primary' : 'bg-slate-100'
                      }`}>
                        <Music className={`w-6 h-6 ${role === 'producer' ? 'text-white' : 'text-slate-600'}`} />
                      </div>
                      <div>
                        <h3 className="text-body-lg font-semibold text-slate-800">Producer</h3>
                        <p className="text-body-sm text-slate-600">Beat maker, mixer, engineer</p>
                      </div>
                    </div>
                    {role === 'producer' && (
                      <div className="mt-4 flex items-center gap-2 text-purple-600">
                        <Check className="w-4 h-4" />
                        <span className="text-body-sm font-medium">Selected</span>
                      </div>
                    )}
                  </button>
                </div>
                
                {role && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl animate-slide-up">
                    <div className="flex items-center gap-2 text-green-700">
                      <Check className="w-5 h-5" />
                      <span className="text-body-sm font-medium">
                        Great choice! This helps us match you with the right collaborators.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Basic Information */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="displayName" className="text-body-sm font-medium text-slate-700">
                      Display Name *
                    </Label>
                    <Input
                      id="displayName"
                      placeholder="How should others see your name?"
                      value={formData.displayName}
                      onChange={(e) => handleInputChange('displayName', e.target.value)}
                      className="mt-2 h-12 focus:border-purple-400 transition-colors"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="location" className="text-body-sm font-medium text-slate-700">
                      Location
                    </Label>
                    <Input
                      id="location"
                      placeholder="City, Country"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="mt-2 h-12 focus:border-purple-400 transition-colors"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="bio" className="text-body-sm font-medium text-slate-700">
                      Bio
                    </Label>
                    <textarea
                      id="bio"
                      placeholder="Tell us about your musical journey..."
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      className="mt-2 w-full h-24 px-3 py-2 text-body-md border border-slate-200 rounded-lg focus:border-purple-400 focus:outline-none transition-colors resize-none"
                      maxLength={250}
                    />
                    <div className="text-right mt-1">
                      <span className="text-body-xs text-slate-500">{formData.bio.length}/250</span>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="experience" className="text-body-sm font-medium text-slate-700">
                      Experience Level
                    </Label>
                    <select
                      id="experience"
                      value={formData.experience}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                      className="mt-2 w-full h-12 px-3 text-body-md border border-slate-200 rounded-lg focus:border-purple-400 focus:outline-none transition-colors bg-white"
                    >
                      <option value="">Select your experience level</option>
                      <option value="beginner">Beginner (0-2 years)</option>
                      <option value="intermediate">Intermediate (2-5 years)</option>
                      <option value="advanced">Advanced (5-10 years)</option>
                      <option value="professional">Professional (10+ years)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Skills & Experience */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <Label className="text-body-md font-medium text-slate-700">Skills & Genres</Label>
                  <p className="text-body-sm text-slate-500 mt-1 mb-4">Add up to 10 skills or genres you work with</p>
                  
                  <div className="flex gap-2 mb-4">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill or genre"
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                      className="flex-1 h-12 focus:border-purple-400 transition-colors"
                      maxLength={20}
                    />
                    <Button 
                      type="button" 
                      onClick={addSkill} 
                      className="gradient-primary hover-lift h-12 px-6"
                      disabled={!newSkill.trim() || skills.length >= 10}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {skills.map((skill, index) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-body-sm font-medium animate-scale-in"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="hover:text-purple-900 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="text-body-xs text-slate-500">
                    {skills.length}/10 skills added
                  </div>
                </div>

                {/* Suggested Skills */}
                <div>
                  <Label className="text-body-sm font-medium text-slate-700">Popular Skills</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['Hip Hop', 'Pop', 'R&B', 'Electronic', 'Jazz', 'Rock', 'Indie', 'Classical'].map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => {
                          if (!skills.includes(suggestion) && skills.length < 10) {
                            setSkills([...skills, suggestion])
                          }
                        }}
                        disabled={skills.includes(suggestion) || skills.length >= 10}
                        className="px-3 py-1.5 border border-purple-200 text-purple-600 rounded-full text-body-xs font-medium hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover-scale"
                      >
                        + {suggestion}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Upload Section */}
                <div className="p-6 border-2 border-dashed border-purple-200 rounded-xl text-center bg-purple-50/50">
                  <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-body-md font-medium text-slate-800 mb-2">Upload Your Work</h4>
                  <p className="text-body-sm text-slate-600 mb-4">Share your best tracks to showcase your talent</p>
                  <Button variant="outline" className="hover-lift">
                    Choose Files
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Social Presence */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="instagram" className="text-body-sm font-medium text-slate-700 flex items-center gap-2">
                      <Instagram className="w-4 h-4 text-pink-500" />
                      Instagram
                    </Label>
                    <Input
                      id="instagram"
                      placeholder="@username"
                      value={socialLinks.instagram}
                      onChange={(e) => handleSocialChange('instagram', e.target.value)}
                      className="mt-2 h-12 focus:border-purple-400 transition-colors"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="soundcloud" className="text-body-sm font-medium text-slate-700 flex items-center gap-2">
                      <Music className="w-4 h-4 text-orange-500" />
                      SoundCloud
                    </Label>
                    <Input
                      id="soundcloud"
                      placeholder="Profile URL"
                      value={socialLinks.soundcloud}
                      onChange={(e) => handleSocialChange('soundcloud', e.target.value)}
                      className="mt-2 h-12 focus:border-purple-400 transition-colors"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="spotify" className="text-body-sm font-medium text-slate-700 flex items-center gap-2">
                      <Star className="w-4 h-4 text-green-500" />
                      Spotify
                    </Label>
                    <Input
                      id="spotify"
                      placeholder="Artist profile URL"
                      value={socialLinks.spotify}
                      onChange={(e) => handleSocialChange('spotify', e.target.value)}
                      className="mt-2 h-12 focus:border-purple-400 transition-colors"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="youtube" className="text-body-sm font-medium text-slate-700 flex items-center gap-2">
                      <Youtube className="w-4 h-4 text-red-500" />
                      YouTube
                    </Label>
                    <Input
                      id="youtube"
                      placeholder="Channel URL"
                      value={socialLinks.youtube}
                      onChange={(e) => handleSocialChange('youtube', e.target.value)}
                      className="mt-2 h-12 focus:border-purple-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex items-center gap-2 text-blue-700 mb-2">
                    <Star className="w-5 h-5" />
                    <span className="text-body-sm font-medium">Pro Tip</span>
                  </div>
                  <p className="text-body-sm text-blue-600">
                    Adding your social links helps other musicians discover your work and increases collaboration opportunities by 3x!
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="hover-lift focus-visible"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              )}
              
              <div className="flex-1"></div>
              
              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={currentStep === 1 && !role}
                  className="gradient-primary hover-lift focus-visible shadow-lg"
                >
                  Next Step
                  <Check className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={saveProfile}
                  disabled={isSaving || !formData.displayName.trim()}
                  className="gradient-accent hover-lift focus-visible shadow-lg"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving Profile...
                    </>
                  ) : (
                    <>
                      Complete Profile
                      <Star className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
              
              {currentStep < totalSteps && (
                <Button
                  variant="outline"
                  className="hover-lift focus-visible"
                  asChild
                >
                  <Link href="/dashboard">Skip for Now</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Progress Steps */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  step <= currentStep
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                    : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 