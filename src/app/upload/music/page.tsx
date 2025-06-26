'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import { 
  Upload, ArrowLeft, Music, Clock, Key, 
  Headphones, Users, Link as LinkIcon, Save, X
} from 'lucide-react'
import Link from 'next/link'

const GENRES = [
  'Hip Hop', 'R&B', 'Pop', 'Rock', 'Electronic', 'Jazz', 'Blues', 'Country',
  'Reggae', 'Reggaeton', 'Latin', 'Afrobeats', 'Gospel', 'Classical', 'Folk',
  'Punk', 'Metal', 'Alternative', 'Indie', 'Trap', 'Drill', 'House', 'Techno',
  'Ambient', 'Lo-fi', 'Experimental', 'Other'
]

const KEYS = [
  'C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B'
]

const ROLES = [
  'Lead Artist', 'Featured Artist', 'Producer', 'Co-Producer', 'Engineer', 
  'Mixer', 'Mastering Engineer', 'Songwriter', 'Composer', 'Arranger',
  'Session Musician', 'Backing Vocals', 'Instrumentalist'
]

interface TrackData {
  title: string
  artist_name: string
  genre: string
  bpm: number | null
  key: string
  description: string
  spotify_link: string
  soundcloud_link: string
  youtube_link: string
  other_links: string
}

interface Collaborator {
  id?: string
  user_id?: string
  name: string
  role: string
  confirmed?: boolean
}

interface UserProfile {
  id: string
  display_name: string
  role: string
  profile_complete: boolean
}

export default function MusicUploadPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  
  const [trackData, setTrackData] = useState<TrackData>({
    title: '',
    artist_name: '',
    genre: '',
    bpm: null,
    key: '',
    description: '',
    spotify_link: '',
    soundcloud_link: '',
    youtube_link: '',
    other_links: ''
  })

  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [newCollaborator, setNewCollaborator] = useState<Collaborator>({
    name: '',
    role: ''
  })
  const [audioFile, setAudioFile] = useState<File | null>(null)

  useEffect(() => {
    const initPage = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
          router.push('/login')
          return
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (!profile || !profile.profile_complete) {
          router.push('/profile/setup')
          return
        }

        setCurrentUser(profile)
        
        // Pre-fill artist name
        setTrackData(prev => ({
          ...prev,
          artist_name: profile.display_name || ''
        }))
      } catch (error) {
        console.error('Error initializing page:', error)
      } finally {
        setLoading(false)
      }
    }

    initPage()
  }, [router])

  const handleTrackDataChange = (field: keyof TrackData, value: string | number | null) => {
    setTrackData(prev => ({ ...prev, [field]: value }))
  }

  const addCollaborator = () => {
    if (!newCollaborator.name || !newCollaborator.role) return
    
    setCollaborators(prev => [...prev, { ...newCollaborator }])
    setNewCollaborator({ name: '', role: '' })
  }

  const removeCollaborator = (index: number) => {
    setCollaborators(prev => prev.filter((_, i) => i !== index))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file type
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/m4a']
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|m4a)$/i)) {
      alert('Please upload an audio file (MP3, WAV, or M4A)')
      return
    }

    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert('File size must be less than 50MB')
      return
    }

    setAudioFile(file)
  }

  const handleSubmit = async () => {
    if (!trackData.title || !trackData.artist_name || !trackData.genre) {
      alert('Please fill in the required fields (Title, Artist, Genre)')
      return
    }

    if (!currentUser) {
      alert('User not authenticated')
      return
    }

    setUploading(true)

    try {
      let audioUrl = null

      // Upload audio file if provided
      if (audioFile) {
        const fileExt = audioFile.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('tracks')
          .upload(fileName, audioFile)

        if (uploadError) {
          console.error('Upload error:', uploadError)
          alert('Failed to upload audio file')
          return
        }

        const { data: urlData } = supabase.storage
          .from('tracks')
          .getPublicUrl(fileName)
        
        audioUrl = urlData.publicUrl
      }

      // Save track data
      const { error: trackError } = await supabase
        .from('tracks')
        .insert({
          user_id: currentUser.id,
          title: trackData.title,
          artist_name: trackData.artist_name,
          genre: trackData.genre,
          bpm: trackData.bpm,
          key: trackData.key,
          description: trackData.description,
          audio_url: audioUrl,
          spotify_link: trackData.spotify_link || null,
          soundcloud_link: trackData.soundcloud_link || null,
          youtube_link: trackData.youtube_link || null,
          other_links: trackData.other_links || null
        })

      if (trackError) {
        console.error('Track save error:', trackError)
        alert('Failed to save track')
        return
      }

      alert('Track uploaded successfully!')
      router.push('/dashboard')
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload track')
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-hero p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            className="glass-card border-primary/20 hover-lift" 
            asChild
          >
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Link>
          </Button>
          
          <h1 className="text-heading-lg font-display text-gradient-primary">Upload Music</h1>
          
          <div className="w-20" /> {/* Spacer */}
        </div>

        <Card className="glass-card border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="w-5 h-5" />
              Add New Track
            </CardTitle>
            <CardDescription>
              Upload your music and share it with the wavr community
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={trackData.title}
                  onChange={(e) => handleTrackDataChange('title', e.target.value)}
                  placeholder="Track title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="artist">Artist Name *</Label>
                <Input
                  id="artist"
                  value={trackData.artist_name}
                  onChange={(e) => handleTrackDataChange('artist_name', e.target.value)}
                  placeholder="Artist name"
                />
              </div>
            </div>

            {/* Genre and Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="genre">Genre *</Label>
                <select
                  id="genre"
                  className="w-full p-2 border rounded-lg bg-background text-foreground"
                  value={trackData.genre}
                  onChange={(e) => handleTrackDataChange('genre', e.target.value)}
                >
                  <option value="">Select genre</option>
                  {GENRES.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bpm" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  BPM
                </Label>
                <Input
                  id="bpm"
                  type="number"
                  value={trackData.bpm || ''}
                  onChange={(e) => handleTrackDataChange('bpm', e.target.value ? Number(e.target.value) : null)}
                  placeholder="120"
                  min="60"
                  max="200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="key" className="flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  Key
                </Label>
                <select
                  id="key"
                  className="w-full p-2 border rounded-lg bg-background text-foreground"
                  value={trackData.key}
                  onChange={(e) => handleTrackDataChange('key', e.target.value)}
                >
                  <option value="">Select key</option>
                  {KEYS.map(key => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                className="w-full p-3 border rounded-lg bg-background text-foreground"
                rows={3}
                value={trackData.description}
                onChange={(e) => handleTrackDataChange('description', e.target.value)}
                placeholder="Tell us about this track..."
              />
            </div>

            {/* Audio File Upload */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Headphones className="w-4 h-4" />
                Audio File
              </Label>
              <div className="border-2 border-dashed border-primary/20 rounded-lg p-6 text-center">
                {audioFile ? (
                  <div className="space-y-2">
                    <Music className="w-8 h-8 text-primary mx-auto" />
                    <p className="text-foreground font-medium">{audioFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAudioFile(null)}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground">
                      Click to upload audio file (MP3, WAV, M4A)
                    </p>
                    <p className="text-sm text-muted-foreground">Max size: 50MB</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* Streaming Links */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2 text-base font-semibold">
                <LinkIcon className="w-4 h-4" />
                Streaming Links
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="spotify">Spotify</Label>
                  <Input
                    id="spotify"
                    value={trackData.spotify_link}
                    onChange={(e) => handleTrackDataChange('spotify_link', e.target.value)}
                    placeholder="https://open.spotify.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="soundcloud">SoundCloud</Label>
                  <Input
                    id="soundcloud"
                    value={trackData.soundcloud_link}
                    onChange={(e) => handleTrackDataChange('soundcloud_link', e.target.value)}
                    placeholder="https://soundcloud.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtube">YouTube</Label>
                  <Input
                    id="youtube"
                    value={trackData.youtube_link}
                    onChange={(e) => handleTrackDataChange('youtube_link', e.target.value)}
                    placeholder="https://youtube.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="other">Other Links</Label>
                  <Input
                    id="other"
                    value={trackData.other_links}
                    onChange={(e) => handleTrackDataChange('other_links', e.target.value)}
                    placeholder="Apple Music, Bandcamp, etc."
                  />
                </div>
              </div>
            </div>

            {/* Collaborators */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2 text-base font-semibold">
                <Users className="w-4 h-4" />
                Collaborators
              </Label>
              
              {/* Add Collaborator */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/20">
                <Input
                  value={newCollaborator.name}
                  onChange={(e) => setNewCollaborator(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Collaborator name"
                />
                <select
                  className="w-full p-2 border rounded-lg bg-background text-foreground"
                  value={newCollaborator.role}
                  onChange={(e) => setNewCollaborator(prev => ({ ...prev, role: e.target.value }))}
                >
                  <option value="">Select role</option>
                  {ROLES.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                <Button onClick={addCollaborator} size="sm">
                  Add
                </Button>
              </div>

              {/* Collaborator List */}
              {collaborators.length > 0 && (
                <div className="space-y-2">
                  {collaborators.map((collab, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{collab.name}</p>
                        <p className="text-sm text-muted-foreground">{collab.role}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeCollaborator(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleSubmit}
                disabled={uploading}
                className="flex-1 gradient-primary"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Upload Track
                  </>
                )}
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard">Cancel</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 