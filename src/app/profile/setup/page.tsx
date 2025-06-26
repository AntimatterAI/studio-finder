'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import { Music, Plus, X, Instagram, Youtube, ArrowLeft, Check, Upload, Star, Sparkles, Loader2, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function ProfileSetupPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [role, setRole] = useState<'artist_producer' | 'studio' | null>(null)
  const [tierLevel, setTierLevel] = useState<1 | 2 | 3>(1)
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    location: '',
    experience: '',
    hourlyRate: '',
    offersProduction: ''
  })
  const [socialLinks, setSocialLinks] = useState({
    instagram: '',
    soundcloud: '',
    spotify: '',
    youtube: ''
  })
  const [rooms, setRooms] = useState<Array<{
    name: string
    capacity: number
    hourlyRate: string
    equipment: string[]
  }>>([])
  const [newRoom, setNewRoom] = useState({
    name: '',
    capacity: 1,
    hourlyRate: '',
    equipment: [] as string[]
  })
  const [newEquipment, setNewEquipment] = useState('')

  // Load registration data on component mount
  React.useEffect(() => {
    const registrationData = localStorage.getItem('registration_data')
    if (registrationData) {
      try {
        const data = JSON.parse(registrationData)
        setRole(data.role)
        setTierLevel(data.tier_level)
      } catch (error) {
        console.error('Error loading registration data:', error)
      }
    }
  }, [])

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

  const addRoom = () => {
    if (newRoom.name.trim() && !rooms.find(r => r.name === newRoom.name.trim())) {
      setRooms([...rooms, {
        ...newRoom,
        name: newRoom.name.trim(),
        equipment: [...newRoom.equipment]
      }])
      setNewRoom({
        name: '',
        capacity: 1,
        hourlyRate: '',
        equipment: []
      })
    }
  }

  const removeRoom = (roomName: string) => {
    setRooms(rooms.filter(room => room.name !== roomName))
  }

  const addEquipmentToRoom = () => {
    if (newEquipment.trim() && !newRoom.equipment.includes(newEquipment.trim())) {
      setNewRoom(prev => ({
        ...prev,
        equipment: [...prev.equipment, newEquipment.trim()]
      }))
      setNewEquipment('')
    }
  }

  const removeEquipmentFromRoom = (equipment: string) => {
    setNewRoom(prev => ({
      ...prev,
      equipment: prev.equipment.filter(e => e !== equipment)
    }))
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

  const skipProfile = async () => {
    if (!role) {
      alert('Please select your role first')
      return
    }

    setIsSaving(true)
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        alert('Authentication error. Please log in again.')
        router.push('/login')
        return
      }

      // Set minimal profile data
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: formData.displayName || 'User',
          profile_complete: false, // Mark as incomplete for later
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) {
        console.error('Error skipping profile:', error)
        alert('Failed to skip profile. Please try again.')
        return
      }

      // Clear registration data
      localStorage.removeItem('registration_data')
      
      // Redirect to dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('Error skipping profile:', error)
      alert('An unexpected error occurred. Please try again.')
    } finally {
      setIsSaving(false)
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

      // Prepare profile data using new schema
      const profileData = {
        display_name: formData.displayName,
        bio: formData.bio || null,
        location: formData.location || null,
        hourly_rate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : null,
        
        // New schema fields for artist/producer
        offers_production_services: role === 'artist_producer' ? (formData.offersProduction === 'true') : false,
        musical_styles: role === 'artist_producer' && skills.length > 0 ? skills : null,
        production_skills: role === 'artist_producer' && formData.offersProduction === 'true' && skills.length > 0 ? skills : null,
        instruments: null, // Can be added later
        influences: null, // Can be added later
        
        // Studio-specific fields
        studio_equipment: role === 'studio' && skills.length > 0 ? skills : null,
        studio_rooms: role === 'studio' && rooms.length > 0 ? rooms.map(room => ({
          name: room.name,
          capacity: room.capacity,
          hourly_rate: room.hourlyRate ? parseFloat(room.hourlyRate) : null,
          equipment: room.equipment
        })) : null,
        
        // Social and other data
        socials: {
          experience: formData.experience || null,
          instagram: socialLinks.instagram || null,
          soundcloud: socialLinks.soundcloud || null,
          spotify: socialLinks.spotify || null,
          youtube: socialLinks.youtube || null
        },
        
        profile_complete: true,
        updated_at: new Date().toISOString()
      }

      // Update profile data (don't upsert since it should already exist from registration)
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id)

      if (error) {
        console.error('Error saving profile:', error)
        alert('Failed to save profile. Please try again.')
        return
      }

      // Clear registration data from localStorage
      localStorage.removeItem('registration_data')

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
    <div className="min-h-screen gradient-hero p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-40"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-24 h-24 gradient-primary rounded-full opacity-10 animate-float"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 gradient-accent rounded-full opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <Button 
            variant="outline" 
            size="sm" 
            className="mb-6 glass-card border-primary/20 hover-lift focus-visible" 
            asChild
          >
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-body-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Complete your profile to get better matches
            </div>
            {role && tierLevel && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 rounded-full text-body-sm font-medium">
                <Check className="w-4 h-4" />
                {role.charAt(0).toUpperCase() + role.slice(1)} • Tier {tierLevel}
              </div>
            )}
          </div>
          
          <h1 className="text-display-xl font-display text-gradient-primary mb-2">Complete Your Profile</h1>
          <p className="text-body-lg text-muted-foreground">Tell us about yourself to get better connections</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center justify-between mb-2">
            <span className="text-body-sm font-medium text-foreground">Step {currentStep} of {totalSteps}</span>
            <span className="text-body-sm text-muted-foreground">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div 
              className="gradient-primary h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Main Card */}
        <Card className="glass-card border-primary/20 shadow-2xl animate-scale-in">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-heading-lg font-display">{getStepTitle(currentStep)}</CardTitle>
            <CardDescription className="text-body-md">{getStepDescription(currentStep)}</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Step 1: Role Selection */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                {role ? (
                  <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Check className="w-6 h-6 text-green-400" />
                      <div>
                        <h3 className="text-body-lg font-semibold text-green-400">Role Set from Invite Code</h3>
                        <p className="text-body-sm text-green-300">
                          Your role was automatically set to <span className="font-medium capitalize">{role}</span> based on your invite code.
                          You can continue with this setup or contact admin to change your role.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <button
                      type="button"
                      onClick={() => setRole('artist_producer')}
                      className={`p-6 border-2 rounded-2xl text-left transition-all duration-200 hover-lift group ${
                        role === 'artist_producer'
                          ? 'border-primary bg-primary/10 shadow-lg'
                          : 'border-border hover:border-primary/50 glass-card'
                      }`}
                    >
                      <div className="flex flex-col items-center text-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 ${
                          role === 'artist_producer' ? 'gradient-primary' : 'bg-muted'
                        }`}>
                          <Music className={`w-6 h-6 ${role === 'artist_producer' ? 'text-white' : 'text-muted-foreground'}`} />
                        </div>
                        <div>
                          <h3 className="text-body-lg font-semibold text-foreground">Artist/Producer</h3>
                          <p className="text-body-sm text-muted-foreground">Musician, songwriter, beat maker, engineer</p>
                        </div>
                      </div>
                      {role === 'artist_producer' && (
                        <div className="mt-4 flex items-center justify-center gap-2 text-purple-600">
                          <Check className="w-4 h-4" />
                          <span className="text-body-sm font-medium">Selected</span>
                        </div>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setRole('studio')}
                      className={`p-6 border-2 rounded-2xl text-left transition-all duration-200 hover-lift group ${
                        role === 'studio'
                          ? 'border-primary bg-primary/10 shadow-lg'
                          : 'border-border hover:border-primary/50 glass-card'
                      }`}
                    >
                      <div className="flex flex-col items-center text-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 ${
                          role === 'studio' ? 'gradient-primary' : 'bg-muted'
                        }`}>
                          <Star className={`w-6 h-6 ${role === 'studio' ? 'text-white' : 'text-muted-foreground'}`} />
                        </div>
                        <div>
                          <h3 className="text-body-lg font-semibold text-foreground">Studio</h3>
                          <p className="text-body-sm text-muted-foreground">Recording space, venue, facility</p>
                        </div>
                      </div>
                      {role === 'studio' && (
                        <div className="mt-4 flex items-center justify-center gap-2 text-purple-600">
                          <Check className="w-4 h-4" />
                          <span className="text-body-sm font-medium">Selected</span>
                        </div>
                      )}
                    </button>
                  </div>
                )}
                
                {role && (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl animate-slide-up">
                    <div className="flex items-center gap-2 text-green-400">
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
                    <Label htmlFor="displayName" className="text-body-sm font-medium text-foreground">
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
                    <Label htmlFor="location" className="text-body-sm font-medium text-foreground">
                      Location *
                    </Label>
                    <Input
                      id="location"
                      placeholder={role === 'studio' ? 'Full address (clients will visit)' : 'City, Country'}
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="mt-2 h-12 focus:border-purple-400 transition-colors"
                    />
                    {role === 'studio' && (
                      <p className="text-body-xs text-muted-foreground mt-1">
                        Provide your full studio address as clients will need to visit
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="bio" className="text-body-sm font-medium text-slate-700">
                      {role === 'studio' ? 'Studio Description' : 'Bio'}
                    </Label>
                    <textarea
                      id="bio"
                      placeholder={
                        role === 'studio' 
                          ? 'Describe your studio, atmosphere, and what makes it special...'
                          : 'Tell us about your musical journey...'
                      }
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
                  
                  {role === 'artist_producer' && (
                    <div>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-body-sm font-medium text-slate-700">Do you offer production services?</Label>
                          <p className="text-body-xs text-slate-500 mt-1">This includes mixing, mastering, beat making, recording, etc.</p>
                          <div className="flex gap-4 mt-2">
                            <button
                              type="button"
                              onClick={() => handleInputChange('offersProduction', 'true')}
                              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                                formData.offersProduction === 'true'
                                  ? 'border-purple-400 bg-purple-50 text-purple-700'
                                  : 'border-slate-200 hover:border-purple-300'
                              }`}
                            >
                              Yes, I offer services
                            </button>
                            <button
                              type="button"
                              onClick={() => handleInputChange('offersProduction', 'false')}
                              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                                formData.offersProduction === 'false'
                                  ? 'border-purple-400 bg-purple-50 text-purple-700'
                                  : 'border-slate-200 hover:border-purple-300'
                              }`}
                            >
                              No, I just create music
                            </button>
                          </div>
                        </div>
                        
                        {formData.offersProduction === 'true' && (
                          <div>
                            <Label htmlFor="hourlyRate" className="text-body-sm font-medium text-slate-700">
                              Hourly Rate (USD)
                            </Label>
                            <Input
                              id="hourlyRate"
                              type="number"
                              min="0"
                              step="5"
                              placeholder="e.g., 75"
                              value={formData.hourlyRate}
                              onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                              className="mt-2 h-12 focus:border-purple-400 transition-colors"
                            />
                            <p className="text-body-xs text-slate-500 mt-1">
                              Your rate for production services. This helps clients understand your pricing.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {role === 'studio' && (
                    <div>
                      <Label htmlFor="hourlyRate" className="text-body-sm font-medium text-slate-700">
                        Base Hourly Rate (USD) (Optional)
                      </Label>
                      <Input
                        id="hourlyRate"
                        type="number"
                        min="0"
                        step="5"
                        placeholder="e.g., 150"
                        value={formData.hourlyRate}
                        onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                        className="mt-2 h-12 focus:border-purple-400 transition-colors"
                      />
                      <p className="text-body-xs text-slate-500 mt-1">
                        Base rate for your studio. Individual rooms can have different rates.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Skills & Experience */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                {/* Skills for Artist/Producers */}
                {role === 'artist_producer' && (
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
                )}

                {/* Equipment for all roles */}
                <div>
                  <Label className="text-body-md font-medium text-slate-700">
                    {role === 'studio' ? 'General Equipment' : 'Equipment'}
                  </Label>
                  <p className="text-body-sm text-slate-500 mt-1 mb-4">
                    {role === 'studio' 
                      ? 'List general studio equipment available to all rooms'
                      : 'Equipment you own or have access to (instruments, software, hardware)'
                    }
                  </p>
                  
                  <div className="flex gap-2 mb-4">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder={
                        role === 'studio' ? 'e.g., Pro Tools, SSL Console' :
                        'e.g., Logic Pro, Yamaha HS8, Guitar, Microphone'
                      }
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                      className="flex-1 h-12 focus:border-purple-400 transition-colors"
                      maxLength={30}
                    />
                    <Button 
                      type="button" 
                      onClick={addSkill} 
                      className="gradient-primary hover-lift h-12 px-6"
                      disabled={!newSkill.trim() || skills.length >= 15}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {skills.map((item, index) => (
                        <span
                          key={item}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-body-sm font-medium animate-scale-in"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          {item}
                          <button
                            type="button"
                            onClick={() => removeSkill(item)}
                            className="hover:text-blue-900 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="text-body-xs text-slate-500">
                    {skills.length}/{role === 'studio' ? 15 : 10} items added
                  </div>
                </div>

                {/* Room Management for Studios */}
                {role === 'studio' && (
                  <div>
                    <Label className="text-body-md font-medium text-slate-700">Studio Rooms</Label>
                    <p className="text-body-sm text-slate-500 mt-1 mb-4">Set up your studio rooms with specific rates and equipment</p>
                    
                    {/* Add New Room */}
                    <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl space-y-4">
                      <h4 className="font-medium">Add New Room</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Room Name</Label>
                          <Input
                            value={newRoom.name}
                            onChange={(e) => setNewRoom(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="e.g., Studio A, Booth 1"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Capacity</Label>
                          <Input
                            type="number"
                            min="1"
                            max="20"
                            value={newRoom.capacity}
                            onChange={(e) => setNewRoom(prev => ({ ...prev, capacity: Number(e.target.value) }))}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Hourly Rate (Optional)</Label>
                          <Input
                            type="number"
                            min="0"
                            step="5"
                            value={newRoom.hourlyRate}
                            onChange={(e) => setNewRoom(prev => ({ ...prev, hourlyRate: e.target.value }))}
                            placeholder="Override base rate"
                            className="mt-1"
                          />
                        </div>
                      </div>
                      
                      {/* Room Equipment */}
                      <div>
                        <Label>Room-Specific Equipment</Label>
                        <div className="flex gap-2 mt-2">
                          <Input
                            value={newEquipment}
                            onChange={(e) => setNewEquipment(e.target.value)}
                            placeholder="Add equipment to this room"
                            onKeyPress={(e) => e.key === 'Enter' && addEquipmentToRoom()}
                            className="flex-1"
                          />
                          <Button 
                            type="button" 
                            onClick={addEquipmentToRoom}
                            variant="outline"
                            disabled={!newEquipment.trim()}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        {newRoom.equipment.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {newRoom.equipment.map((item) => (
                              <span
                                key={item}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-sm"
                              >
                                {item}
                                <button
                                  type="button"
                                  onClick={() => removeEquipmentFromRoom(item)}
                                  className="hover:text-red-600"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <Button 
                        type="button" 
                        onClick={addRoom}
                        disabled={!newRoom.name.trim()}
                        className="w-full"
                      >
                        Add Room
                      </Button>
                    </div>
                    
                    {/* Existing Rooms */}
                    {rooms.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-medium">Your Rooms ({rooms.length})</h4>
                        {rooms.map((room) => (
                          <div key={room.name} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium">{room.name}</h5>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeRoom(room.name)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                              <div>Capacity: {room.capacity} people</div>
                              <div>Rate: ${room.hourlyRate || 'Base rate'}/hr</div>
                              <div>Equipment: {room.equipment.length} items</div>
                            </div>
                            {room.equipment.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {room.equipment.map((item) => (
                                  <span key={item} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                                    {item}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Suggested Skills for Artist/Producers */}
                {role === 'artist_producer' && (
                  <div>
                    <Label className="text-body-sm font-medium text-slate-700">Popular Genres & Skills</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {['Hip Hop', 'Pop', 'R&B', 'Electronic', 'Jazz', 'Rock', 'Indie', 'Classical', 'Mixing', 'Mastering', 'Beat Making', 'Recording', 'Vocal Production', 'Sound Design'].map((suggestion) => (
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
                )}

                {/* Upload Section */}
                <div className="p-6 border-2 border-dashed border-purple-200 rounded-xl text-center bg-purple-50/50">
                  <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-body-md font-medium text-slate-800 mb-2">
                    {role === 'studio' ? 'Upload Studio Photos' : 'Upload Your Work'}
                  </h4>
                  <p className="text-body-sm text-slate-600 mb-4">
                    {role === 'studio' 
                      ? 'Show potential clients what your studio looks like'
                      : 'Share your best tracks to showcase your talent'
                    }
                  </p>
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
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
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
                <div className="flex gap-4">
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
                  
                  <Button
                    variant="outline"
                    className="hover-lift focus-visible"
                    onClick={skipProfile}
                    disabled={isSaving || !role}
                  >
                    Skip for Now
                  </Button>
                </div>
              )}
              
              {currentStep < totalSteps && (
                <Button
                  variant="outline"
                  className="hover-lift focus-visible"
                  onClick={skipProfile}
                  disabled={isSaving || !role}
                >
                  Skip for Now
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