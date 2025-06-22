'use client'

import React, { useState } from 'react'
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Heart, X, Music, MapPin, Star, Play, Headphones } from 'lucide-react'

interface Artist {
  id: string
  name: string
  role: 'artist' | 'producer'
  location: string
  image: string
  bio: string
  genres: string[]
  rating: number
  trackCount: number
  collaborations: number
}

interface SwipeCardProps {
  artist: Artist
  onSwipe: (direction: 'left' | 'right', artist: Artist) => void
  onAction: (action: 'like' | 'pass' | 'listen', artist: Artist) => void
}

export function SwipeCard({ artist, onSwipe, onAction }: SwipeCardProps) {
  const [exitX, setExitX] = useState(0)
  
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-25, 25])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100) {
      setExitX(200)
      onSwipe('right', artist)
    } else if (info.offset.x < -100) {
      setExitX(-200)
      onSwipe('left', artist)
    }
  }

  const swipeLeft = () => {
    setExitX(-200)
    onSwipe('left', artist)
  }

  const swipeRight = () => {
    setExitX(200)
    onSwipe('right', artist)
  }

  return (
    <motion.div
      className="absolute inset-0 swipe-card cursor-grab active:cursor-grabbing"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      style={{ x, rotate, opacity }}
      whileDrag={{ scale: 0.95 }}
      onDragEnd={handleDragEnd}
      animate={exitX ? { x: exitX, opacity: 0 } : {}}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card className="glass-neon border-2 border-purple-500/20 h-full overflow-hidden">
        {/* Header Image/Avatar */}
        <div className="relative h-48 gradient-electric">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              artist.role === 'artist' 
                ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30' 
                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
            }`}>
              {artist.role === 'artist' ? '🎤 Artist' : '🎛️ Producer'}
            </span>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-2xl font-bold text-white mb-1">{artist.name}</h3>
            <div className="flex items-center text-white/80 text-sm">
              <MapPin className="w-4 h-4 mr-1" />
              {artist.location}
            </div>
          </div>
        </div>

        <CardContent className="p-6 space-y-4">
          {/* Bio */}
          <p className="text-gray-300 text-sm leading-relaxed">{artist.bio}</p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <span className="text-white font-semibold">{artist.rating}</span>
              </div>
              <p className="text-xs text-gray-400">Rating</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Music className="w-4 h-4 text-purple-400 mr-1" />
                <span className="text-white font-semibold">{artist.trackCount}</span>
              </div>
              <p className="text-xs text-gray-400">Tracks</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Headphones className="w-4 h-4 text-pink-400 mr-1" />
                <span className="text-white font-semibold">{artist.collaborations}</span>
              </div>
              <p className="text-xs text-gray-400">Collabs</p>
            </div>
          </div>

          {/* Genres */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-300">Genres & Skills</h4>
            <div className="flex flex-wrap gap-2">
              {artist.genres.map((genre) => (
                <span key={genre} className="skill-tag text-xs">
                  {genre}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center items-center gap-4 pt-4">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full w-16 h-16 border-2 border-red-500/30 hover:border-red-500 hover:bg-red-500/10 hover-neon"
              onClick={swipeLeft}
            >
              <X className="w-6 h-6 text-red-400" />
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="rounded-full w-12 h-12 border-2 border-blue-500/30 hover:border-blue-500 hover:bg-blue-500/10"
              onClick={() => onAction('listen', artist)}
            >
              <Play className="w-5 h-5 text-blue-400" />
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="rounded-full w-16 h-16 border-2 border-green-500/30 hover:border-green-500 hover:bg-green-500/10 hover-glow"
              onClick={swipeRight}
            >
              <Heart className="w-6 h-6 text-green-400" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Swipe Indicators */}
      <motion.div
        className="absolute top-20 left-8 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-xl"
        style={{ opacity: useTransform(x, [0, -100], [0, 1]) }}
      >
        <span className="text-red-300 font-bold text-lg">PASS</span>
      </motion.div>
      
      <motion.div
        className="absolute top-20 right-8 px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-xl"
        style={{ opacity: useTransform(x, [0, 100], [0, 1]) }}
      >
        <span className="text-green-300 font-bold text-lg">LIKE</span>
      </motion.div>
    </motion.div>
  )
}

export function SwipeStack() {
  const [artists] = useState<Artist[]>([
    {
      id: '1',
      name: 'Luna Rodriguez',
      role: 'artist',
      location: 'Los Angeles, CA',
      image: '',
      bio: 'Bilingual pop artist with R&B influences. Looking for producers who can blend electronic and organic sounds.',
      genres: ['Pop', 'R&B', 'Electronic'],
      rating: 4.8,
      trackCount: 23,
      collaborations: 12
    },
    {
      id: '2',
      name: 'Marcus "Waves" Johnson',
      role: 'producer',
      location: 'Atlanta, GA',
      image: '',
      bio: 'Hip-hop producer with 10+ years experience. Worked with major labels. Specializing in trap and melodic rap.',
      genres: ['Hip-Hop', 'Trap', 'R&B'],
      rating: 4.9,
      trackCount: 156,
      collaborations: 45
    },
    {
      id: '3',
      name: 'Aurora Nightingale',
      role: 'artist',
      location: 'Nashville, TN',
      image: '',
      bio: 'Singer-songwriter with indie folk roots. Seeking collaboration for dreamy, atmospheric productions.',
      genres: ['Indie Folk', 'Dream Pop', 'Alternative'],
      rating: 4.7,
      trackCount: 18,
      collaborations: 8
    }
  ])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [matches, setMatches] = useState<Artist[]>([])

  const handleSwipe = (direction: 'left' | 'right', artist: Artist) => {
    if (direction === 'right') {
      setMatches(prev => [...prev, artist])
    }
    
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1)
    }, 300)
  }

  const handleAction = (action: 'like' | 'pass' | 'listen', artist: Artist) => {
    if (action === 'like') {
      handleSwipe('right', artist)
    } else if (action === 'pass') {
      handleSwipe('left', artist)
    } else if (action === 'listen') {
      // Handle listen action
      console.log('Listen to', artist.name)
    }
  }

  if (currentIndex >= artists.length) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mb-4">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">That&apos;s everyone for now!</h3>
        <p className="text-gray-400 mb-4">You have {matches.length} new matches</p>
        <Button 
          className="gradient-primary"
          onClick={() => setCurrentIndex(0)}
        >
          Start Over
        </Button>
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-sm mx-auto h-[600px]">
      {artists.slice(currentIndex, currentIndex + 2).map((artist, index) => (
        <motion.div
          key={artist.id}
          initial={{ scale: index === 0 ? 1 : 0.95, y: index * 4 }}
          animate={{ scale: index === 0 ? 1 : 0.95, y: index * 4 }}
          style={{ zIndex: artists.length - index }}
          className={index === 0 ? '' : 'pointer-events-none'}
        >
          <SwipeCard
            artist={artist}
            onSwipe={handleSwipe}
            onAction={handleAction}
          />
        </motion.div>
      ))}
    </div>
  )
} 