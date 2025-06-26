'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { 
  ArrowLeft, Camera, Image as ImageIcon, 
  X, Save, User
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface PhotoUpload {
  file: File
  preview: string
  type: 'profile' | 'cover'
}

interface UserProfile {
  id: string
  display_name: string
  role: string
  profile_complete: boolean
}

export default function PhotoUploadPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [photos, setPhotos] = useState<PhotoUpload[]>([])

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
      } catch (error) {
        console.error('Error initializing page:', error)
      } finally {
        setLoading(false)
      }
    }

    initPage()
  }, [router])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'cover') => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload an image file (JPG, PNG, or WebP)')
      return
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB')
      return
    }

    // Create preview
    const preview = URL.createObjectURL(file)
    
    // Remove existing photo of same type
    setPhotos(prev => prev.filter(p => p.type !== type))
    
    // Add new photo
    setPhotos(prev => [...prev, { file, preview, type }])
  }

  const removePhoto = (type: 'profile' | 'cover') => {
    setPhotos(prev => {
      const photo = prev.find(p => p.type === type)
      if (photo) {
        URL.revokeObjectURL(photo.preview)
      }
      return prev.filter(p => p.type !== type)
    })
  }

  const handleSubmit = async () => {
    if (photos.length === 0) {
      alert('Please select at least one photo to upload')
      return
    }

    if (!currentUser) {
      alert('User not authenticated')
      return
    }

    setUploading(true)

    try {
      const uploadPromises = photos.map(async (photo) => {
        const fileExt = photo.file.name.split('.').pop()
        const fileName = `${currentUser.id}-${photo.type}-${Date.now()}.${fileExt}`
        
        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('profile-images')
          .upload(fileName, photo.file)

        if (uploadError) {
          console.error('Upload error:', uploadError)
          throw new Error(`Failed to upload ${photo.type} image`)
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('profile-images')
          .getPublicUrl(fileName)

        return {
          type: photo.type,
          url: urlData.publicUrl
        }
      })

      const uploadedPhotos = await Promise.all(uploadPromises)

      // Update profile with new image URLs
      const updateData: { profile_image_url?: string; cover_image_url?: string } = {}
      uploadedPhotos.forEach(({ type, url }) => {
        if (type === 'profile') {
          updateData.profile_image_url = url
        } else if (type === 'cover') {
          updateData.cover_image_url = url
        }
      })

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', currentUser.id)

      if (updateError) {
        console.error('Profile update error:', updateError)
        throw new Error('Failed to update profile')
      }

      alert('Photos uploaded successfully!')
      router.push('/dashboard')
    } catch (error) {
      console.error('Upload error:', error)
      alert(error instanceof Error ? error.message : 'Failed to upload photos')
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

  const profilePhoto = photos.find(p => p.type === 'profile')
  const coverPhoto = photos.find(p => p.type === 'cover')

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
          
          <h1 className="text-heading-lg font-display text-gradient-primary">Upload Photos</h1>
          
          <div className="w-20" /> {/* Spacer */}
        </div>

        <div className="space-y-6">
          {/* Profile Picture */}
          <Card className="glass-card border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Picture
              </CardTitle>
              <CardDescription>
                Upload your profile picture (recommended: square, 400x400px minimum)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                {/* Upload Area */}
                <div className="flex-1">
                  <div className="relative border-2 border-dashed border-primary/20 rounded-lg p-6 text-center hover:border-primary/40 transition-colors">
                    {profilePhoto ? (
                      <div className="space-y-4">
                        <div className="relative w-32 h-32 mx-auto">
                          <Image
                            src={profilePhoto.preview}
                            alt="Profile preview"
                            fill
                            className="rounded-full object-cover"
                          />
                        </div>
                        <p className="text-foreground font-medium">{profilePhoto.file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(profilePhoto.file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removePhoto('profile')}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Camera className="w-12 h-12 text-muted-foreground mx-auto" />
                        <div>
                          <p className="text-muted-foreground mb-2">
                            Click to upload profile picture
                          </p>
                          <p className="text-sm text-muted-foreground">
                            JPG, PNG, or WebP • Max 10MB
                          </p>
                        </div>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'profile')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Preview */}
                <div className="flex-1">
                  <h4 className="font-medium text-foreground mb-3">Preview</h4>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-muted/20">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                          {profilePhoto ? (
                            <Image
                              src={profilePhoto.preview}
                              alt="Profile preview"
                              width={48}
                              height={48}
                              className="rounded-full object-cover"
                            />
                          ) : (
                            <User className="w-6 h-6 text-muted-foreground" />
                          )}
                        </div>
                                                 <div>
                           <p className="font-medium text-foreground">{currentUser?.display_name}</p>
                           <p className="text-sm text-muted-foreground">
                             {currentUser?.role === 'artist_producer' ? 'Artist/Producer' : 'Studio'}
                           </p>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cover Image */}
          <Card className="glass-card border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Cover Image
              </CardTitle>
              <CardDescription>
                Upload a cover image for your profile (recommended: 1200x400px)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Upload Area */}
                <div className="relative border-2 border-dashed border-primary/20 rounded-lg p-6 text-center hover:border-primary/40 transition-colors">
                  {coverPhoto ? (
                    <div className="space-y-4">
                      <div className="relative w-full h-32 mx-auto">
                        <Image
                          src={coverPhoto.preview}
                          alt="Cover preview"
                          fill
                          className="rounded-lg object-cover"
                        />
                      </div>
                      <p className="text-foreground font-medium">{coverPhoto.file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(coverPhoto.file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removePhoto('cover')}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto" />
                      <div>
                        <p className="text-muted-foreground mb-2">
                          Click to upload cover image
                        </p>
                        <p className="text-sm text-muted-foreground">
                          JPG, PNG, or WebP • Max 10MB
                        </p>
                      </div>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'cover')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>

                {/* Cover Preview */}
                {coverPhoto && (
                  <div>
                    <h4 className="font-medium text-foreground mb-3">Cover Preview</h4>
                    <div className="relative w-full h-40 border rounded-lg overflow-hidden">
                      <Image
                        src={coverPhoto.preview}
                        alt="Cover preview"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-end p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                            {profilePhoto ? (
                              <Image
                                src={profilePhoto.preview}
                                alt="Profile preview"
                                width={48}
                                height={48}
                                className="rounded-full object-cover"
                              />
                            ) : (
                              <User className="w-6 h-6 text-muted-foreground" />
                            )}
                          </div>
                                                   <div>
                           <p className="font-medium text-white">{currentUser?.display_name}</p>
                           <p className="text-sm text-white/80">
                             {currentUser?.role === 'artist_producer' ? 'Artist/Producer' : 'Studio'}
                           </p>
                         </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              onClick={handleSubmit}
              disabled={uploading || photos.length === 0}
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
                  Upload {photos.length} Photo{photos.length !== 1 ? 's' : ''}
                </>
              )}
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard">Cancel</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 