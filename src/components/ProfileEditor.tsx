'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { User, Music, Upload, Plus, X, Instagram, Youtube, Globe, MapPin, Edit3, Save, Camera } from 'lucide-react'

interface ProfileData {
  displayName: string
  bio: string
  location: string
  role: 'artist' | 'producer'
  genres: string[]
  skills: string[]
  experience: 'beginner' | 'intermediate' | 'advanced' | 'professional'
  socialLinks: {
    website?: string
    instagram?: string
    youtube?: string
    soundcloud?: string
    spotify?: string
  }
  profileImage?: string
  coverImage?: string
  tracks: {
    id: string
    name: string
    url: string
    genre: string
  }[]
  collaborations: {
    id: string
    artist: string
    track: string
    role: string
  }[]
}

export function ProfileEditor() {
  const [isEditing, setIsEditing] = useState(false)
  const [activeSection, setActiveSection] = useState('basic')
  const [profileData, setProfileData] = useState<ProfileData>({
    displayName: 'Alex Producer',
    bio: 'Electronic music producer with a passion for creating atmospheric soundscapes. I love blending organic and synthetic elements to create unique sonic experiences.',
    location: 'Los Angeles, CA',
    role: 'producer',
    genres: ['Electronic', 'Ambient', 'House', 'Techno'],
    skills: ['Music Production', 'Sound Design', 'Mixing', 'Mastering', 'Ableton Live', 'Synthesizers'],
    experience: 'advanced',
    socialLinks: {
      website: 'https://alexproducer.com',
      instagram: '@alexproducer',
      youtube: 'AlexProducerMusic',
      soundcloud: 'alexproducer',
      spotify: 'Alex Producer'
    },
    tracks: [
      { id: '1', name: 'Midnight Drive', url: '', genre: 'Electronic' },
      { id: '2', name: 'Ocean Waves', url: '', genre: 'Ambient' },
      { id: '3', name: 'Club Nights', url: '', genre: 'House' }
    ],
    collaborations: [
      { id: '1', artist: 'Luna Rodriguez', track: 'Summer Vibes', role: 'Producer' },
      { id: '2', artist: 'Aurora Nightingale', track: 'Dreamy Nights', role: 'Co-Producer' }
    ]
  })

  const [newSkill, setNewSkill] = useState('')
  const [newGenre, setNewGenre] = useState('')

  const handleInputChange = (field: keyof ProfileData, value: string | string[]) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
  }

  const handleSocialLinkChange = (platform: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value }
    }))
  }

  const addSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }))
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  const addGenre = () => {
    if (newGenre.trim() && !profileData.genres.includes(newGenre.trim())) {
      setProfileData(prev => ({
        ...prev,
        genres: [...prev.genres, newGenre.trim()]
      }))
      setNewGenre('')
    }
  }

  const removeGenre = (genreToRemove: string) => {
    setProfileData(prev => ({
      ...prev,
      genres: prev.genres.filter(genre => genre !== genreToRemove)
    }))
  }

  const sections = [
    { id: 'basic', name: 'Basic Info', icon: User },
    { id: 'skills', name: 'Skills & Genres', icon: Music },
    { id: 'social', name: 'Social Links', icon: Globe },
    { id: 'media', name: 'Media & Tracks', icon: Upload }
  ]

  const renderBasicInfo = () => (
    <div className="space-y-6">
      {/* Profile Images */}
      <div className="space-y-4">
        <div>
          <Label className="text-white mb-2 block">Profile Picture</Label>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <Button variant="outline" className="hover-glow">
              <Camera className="w-4 h-4 mr-2" />
              Change Photo
            </Button>
          </div>
        </div>
        
        <div>
          <Label className="text-white mb-2 block">Cover Image</Label>
          <div className="h-32 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border-2 border-dashed border-gray-600 flex items-center justify-center">
            <Button variant="outline" className="hover-glow">
              <Upload className="w-4 h-4 mr-2" />
              Upload Cover
            </Button>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-white mb-2 block">Display Name</Label>
          <Input
            value={profileData.displayName}
            onChange={(e) => handleInputChange('displayName', e.target.value)}
            className="bg-background/50 border-border/20"
            disabled={!isEditing}
          />
        </div>
        
        <div>
          <Label className="text-white mb-2 block">Location</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={profileData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="bg-background/50 border-border/20 pl-10"
              disabled={!isEditing}
              placeholder="City, Country"
            />
          </div>
        </div>
      </div>

      <div>
        <Label className="text-white mb-2 block">Role</Label>
        <div className="grid grid-cols-2 gap-3">
          {['artist', 'producer'].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => isEditing && handleInputChange('role', role)}
              disabled={!isEditing}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                profileData.role === role
                  ? 'border-primary bg-primary/10'
                  : 'border-border/20 hover:border-primary/50'
              } ${!isEditing ? 'opacity-60 cursor-not-allowed' : 'hover-lift'}`}
            >
              <div className="text-white font-medium capitalize">{role}</div>
              <div className="text-gray-400 text-sm mt-1">
                {role === 'artist' ? 'Vocalist, songwriter, performer' : 'Beat maker, mixer, engineer'}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-white mb-2 block">Experience Level</Label>
        <select
          value={profileData.experience}
          onChange={(e) => handleInputChange('experience', e.target.value)}
          disabled={!isEditing}
          className="w-full p-3 bg-background/50 border border-border/20 rounded-xl text-white focus:border-primary/50 disabled:opacity-60"
        >
          <option value="beginner">Beginner (0-2 years)</option>
          <option value="intermediate">Intermediate (2-5 years)</option>
          <option value="advanced">Advanced (5-10 years)</option>
          <option value="professional">Professional (10+ years)</option>
        </select>
      </div>

      <div>
        <Label className="text-white mb-2 block">Bio</Label>
        <textarea
          value={profileData.bio}
          onChange={(e) => handleInputChange('bio', e.target.value)}
          disabled={!isEditing}
          className="w-full h-32 p-3 bg-background/50 border border-border/20 rounded-xl text-white focus:border-primary/50 resize-none disabled:opacity-60"
          placeholder="Tell us about your musical journey..."
          maxLength={500}
        />
        <div className="text-right mt-1">
          <span className="text-xs text-gray-400">{profileData.bio.length}/500</span>
        </div>
      </div>
    </div>
  )

  const renderSkillsAndGenres = () => (
    <div className="space-y-6">
      {/* Genres */}
      <div>
        <Label className="text-white mb-2 block">Genres</Label>
        <div className="flex flex-wrap gap-2 mb-3">
          {profileData.genres.map((genre) => (
            <motion.span
              key={genre}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="skill-tag group"
            >
              {genre}
              {isEditing && (
                <button
                  onClick={() => removeGenre(genre)}
                  className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </motion.span>
          ))}
        </div>
        {isEditing && (
          <div className="flex gap-2">
            <Input
              value={newGenre}
              onChange={(e) => setNewGenre(e.target.value)}
              placeholder="Add a genre"
              className="flex-1 bg-background/50 border-border/20"
              onKeyPress={(e) => e.key === 'Enter' && addGenre()}
            />
            <Button onClick={addGenre} disabled={!newGenre.trim()} className="gradient-primary">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Skills */}
      <div>
        <Label className="text-white mb-2 block">Skills</Label>
        <div className="flex flex-wrap gap-2 mb-3">
          {profileData.skills.map((skill) => (
            <motion.span
              key={skill}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="skill-tag group"
            >
              {skill}
              {isEditing && (
                <button
                  onClick={() => removeSkill(skill)}
                  className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </motion.span>
          ))}
        </div>
        {isEditing && (
          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill"
              className="flex-1 bg-background/50 border-border/20"
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            />
            <Button onClick={addSkill} disabled={!newSkill.trim()} className="gradient-primary">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Suggested Skills */}
      {isEditing && (
        <div>
          <Label className="text-white mb-2 block">Popular Skills</Label>
          <div className="flex flex-wrap gap-2">
            {['Logic Pro', 'Ableton Live', 'Mixing', 'Mastering', 'Sound Design', 'Vocals', 'Guitar', 'Piano'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  if (!profileData.skills.includes(suggestion)) {
                    setProfileData(prev => ({
                      ...prev,
                      skills: [...prev.skills, suggestion]
                    }))
                  }
                }}
                disabled={profileData.skills.includes(suggestion)}
                className="px-3 py-1.5 border border-purple-500/30 text-purple-300 rounded-full text-xs hover:bg-purple-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                + {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderSocialLinks = () => (
    <div className="space-y-4">
      {[
        { key: 'website', label: 'Website', icon: Globe, placeholder: 'https://yourwebsite.com' },
        { key: 'instagram', label: 'Instagram', icon: Instagram, placeholder: '@username' },
        { key: 'youtube', label: 'YouTube', icon: Youtube, placeholder: 'Channel name' },
        { key: 'soundcloud', label: 'SoundCloud', icon: Music, placeholder: 'Profile URL' },
        { key: 'spotify', label: 'Spotify', icon: Music, placeholder: 'Artist name' }
      ].map((social) => (
        <div key={social.key}>
          <Label className="text-white mb-2 block flex items-center gap-2">
            <social.icon className="w-4 h-4" />
            {social.label}
          </Label>
          <Input
            value={profileData.socialLinks[social.key as keyof typeof profileData.socialLinks] || ''}
            onChange={(e) => handleSocialLinkChange(social.key, e.target.value)}
            placeholder={social.placeholder}
            className="bg-background/50 border-border/20"
            disabled={!isEditing}
          />
        </div>
      ))}
    </div>
  )

  const renderMediaAndTracks = () => (
    <div className="space-y-6">
      {/* Tracks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <Label className="text-white">Your Tracks</Label>
          {isEditing && (
            <Button size="sm" className="gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Track
            </Button>
          )}
        </div>
        <div className="space-y-3">
          {profileData.tracks.map((track) => (
            <div key={track.id} className="p-4 bg-background/30 rounded-xl border border-border/20">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-white">{track.name}</h4>
                  <p className="text-sm text-gray-400">{track.genre}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Music className="w-4 h-4" />
                  </Button>
                  {isEditing && (
                    <Button size="sm" variant="outline">
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Collaborations */}
      <div>
        <Label className="text-white mb-4 block">Recent Collaborations</Label>
        <div className="space-y-3">
          {profileData.collaborations.map((collab) => (
            <div key={collab.id} className="p-4 bg-background/30 rounded-xl border border-border/20">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-white">{collab.track}</h4>
                  <p className="text-sm text-gray-400">with {collab.artist} • {collab.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-display-lg font-display text-white mb-2">Profile Editor</h2>
          <p className="text-gray-400">Manage your profile information and showcase your work</p>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          className={isEditing ? 'gradient-accent' : 'gradient-primary'}
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation */}
        <div className="lg:col-span-1">
          <Card className="glass-neon">
            <CardHeader>
              <CardTitle className="text-white text-sm">Sections</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full p-3 text-left flex items-center gap-3 transition-colors rounded-lg ${
                      activeSection === section.id
                        ? 'bg-primary/20 text-primary border-l-4 border-l-primary'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <section.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{section.name}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <Card className="glass-neon">
            <CardContent className="p-6">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {activeSection === 'basic' && renderBasicInfo()}
                {activeSection === 'skills' && renderSkillsAndGenres()}
                {activeSection === 'social' && renderSocialLinks()}
                {activeSection === 'media' && renderMediaAndTracks()}
              </motion.div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 