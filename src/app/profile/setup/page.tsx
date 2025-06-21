'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Music, Mic, Plus, X } from 'lucide-react'
import Link from 'next/link'

export default function ProfileSetupPage() {
  const [role, setRole] = useState<'artist' | 'producer' | null>(null)
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState('')
  const [socialLinks, setSocialLinks] = useState({
    instagram: '',
    soundcloud: '',
    spotify: '',
    youtube: ''
  })

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove))
  }

  const handleSocialChange = (platform: string, value: string) => {
    setSocialLinks(prev => ({ ...prev, [platform]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Profile</h1>
          <p className="text-gray-600 mt-2">Tell us about yourself to get better connections</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Setup</CardTitle>
            <CardDescription>
              This information will help others find and connect with you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-3">
              <Label className="text-base font-medium">I am a...</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('artist')}
                  className={`p-4 border-2 rounded-lg text-left transition-colors ${
                    role === 'artist'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Mic className="w-6 h-6" />
                    <div>
                      <h3 className="font-medium">Artist</h3>
                      <p className="text-sm text-gray-600">Vocalist, songwriter, performer</p>
                    </div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('producer')}
                  className={`p-4 border-2 rounded-lg text-left transition-colors ${
                    role === 'producer'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Music className="w-6 h-6" />
                    <div>
                      <h3 className="font-medium">Producer</h3>
                      <p className="text-sm text-gray-600">Beat maker, mixer, engineer</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Display Name */}
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                placeholder="How should others see your name?"
              />
            </div>

            {/* Skills */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Skills & Genres</Label>
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill or genre"
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
                <Button type="button" onClick={addSkill} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="hover:text-primary/70"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Social Media (Optional)</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    placeholder="@username"
                    value={socialLinks.instagram}
                    onChange={(e) => handleSocialChange('instagram', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="soundcloud">SoundCloud</Label>
                  <Input
                    id="soundcloud"
                    placeholder="Profile URL"
                    value={socialLinks.soundcloud}
                    onChange={(e) => handleSocialChange('soundcloud', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spotify">Spotify</Label>
                  <Input
                    id="spotify"
                    placeholder="Artist profile URL"
                    value={socialLinks.spotify}
                    onChange={(e) => handleSocialChange('spotify', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtube">YouTube</Label>
                  <Input
                    id="youtube"
                    placeholder="Channel URL"
                    value={socialLinks.youtube}
                    onChange={(e) => handleSocialChange('youtube', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button className="flex-1">
                Complete Profile
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard">Skip for Now</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 