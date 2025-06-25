'use client'

import { useEffect, useState } from 'react'

export default function AnimatedMusicBackground() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Default to light mode unless explicitly set to dark
    const checkTheme = () => {
      const theme = localStorage.getItem('theme')
      const isDarkMode = theme === 'dark'
      setIsDark(isDarkMode)
    }
    
    checkTheme()
    
    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDark(document.documentElement.classList.contains('dark'))
        }
      })
    })
    
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    
    return () => observer.disconnect()
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Subtle Gradient Orbs */}
      <div className="absolute inset-0">
        {/* Large ambient orbs */}
        <div className={`absolute top-20 left-20 w-96 h-96 rounded-full blur-3xl animate-float opacity-15 ${
          isDark 
            ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
            : 'bg-gradient-to-r from-blue-100 to-purple-100'
        }`} style={{ animationDelay: '0s', animationDuration: '8s' }} />
        
        <div className={`absolute bottom-20 right-20 w-80 h-80 rounded-full blur-3xl animate-float opacity-10 ${
          isDark 
            ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
            : 'bg-gradient-to-r from-purple-100 to-pink-100'
        }`} style={{ animationDelay: '2s', animationDuration: '10s' }} />
        
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full blur-3xl animate-float opacity-8 ${
          isDark 
            ? 'bg-gradient-to-r from-cyan-600 to-blue-600' 
            : 'bg-gradient-to-r from-cyan-100 to-blue-100'
        }`} style={{ animationDelay: '4s', animationDuration: '12s' }} />
      </div>

      {/* Musical Staff Lines */}
      <div className="absolute inset-0 opacity-8">
        {[...Array(5)].map((_, i) => (
          <div
            key={`staff-${i}`}
            className={`absolute w-full h-px ${
              isDark ? 'bg-blue-300/10' : 'bg-gray-300/15'
            }`}
            style={{
              top: `${20 + i * 4}%`,
              transform: `translateY(${Math.sin(i) * 2}px)`,
            }}
          />
        ))}
        {[...Array(5)].map((_, i) => (
          <div
            key={`staff-bottom-${i}`}
            className={`absolute w-full h-px ${
              isDark ? 'bg-purple-300/8' : 'bg-gray-300/12'
            }`}
            style={{
              top: `${60 + i * 4}%`,
              transform: `translateY(${Math.sin(i + 2) * 2}px)`,
            }}
          />
        ))}
      </div>

      {/* Sound Wave Visualizer */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div className="flex items-end space-x-1">
          {[...Array(40)].map((_, i) => (
            <div
              key={`wave-bar-${i}`}
              className={`w-2 ${
                isDark ? 'bg-blue-400' : 'bg-blue-500'
              } animate-sound-wave`}
              style={{
                height: `${20 + Math.sin(i * 0.5) * 15}px`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${1.5 + (i % 3) * 0.5}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Floating Musical Notes */}
      <div className="absolute inset-0">
        {/* Musical Note Symbols */}
        {[...Array(12)].map((_, i) => {
          const notes = ['♪', '♫', '♬', '♩', '♯', '♭']
          const note = notes[i % notes.length]
          return (
            <div
              key={`note-${i}`}
              className={`absolute text-2xl animate-float opacity-15 ${
                isDark ? 'text-blue-300' : 'text-blue-600'
              }`}
              style={{
                left: `${(i * 8) % 90 + 5}%`,
                top: `${(i * 7) % 80 + 10}%`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: `${8 + (i % 4)}s`,
                fontSize: `${16 + (i % 3) * 4}px`,
              }}
            >
              {note}
            </div>
          )
        })}
      </div>

      {/* Frequency Visualization */}
      <div className="absolute inset-0 opacity-6">
        <svg className="w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
          {/* Sound Wave 1 - Low Frequency */}
          <path
            d="M0,300 Q100,250 200,300 T400,300 T600,300 T800,300"
            stroke={isDark ? 'rgba(96, 165, 250, 0.1)' : 'rgba(59, 130, 246, 0.1)'}
            strokeWidth="2"
            fill="none"
            className="animate-wave-draw"
          />
          {/* Sound Wave 2 - High Frequency */}
          <path
            d="M0,320 Q50,280 100,320 T200,320 T300,320 T400,320 T500,320 T600,320 T700,320 T800,320"
            stroke={isDark ? 'rgba(139, 92, 246, 0.08)' : 'rgba(147, 51, 234, 0.08)'}
            strokeWidth="1.5"
            fill="none"
            className="animate-wave-draw-2"
          />
          {/* Sound Wave 3 - Medium Frequency */}
          <path
            d="M0,280 Q75,240 150,280 T300,280 T450,280 T600,280 T750,280 T800,280"
            stroke={isDark ? 'rgba(168, 85, 247, 0.06)' : 'rgba(139, 92, 246, 0.06)'}
            strokeWidth="1"
            fill="none"
            className="animate-wave-draw-3"
          />
        </svg>
      </div>

      {/* Treble Clef */}
      <div className={`absolute top-1/4 right-1/4 text-6xl opacity-5 animate-float ${
        isDark ? 'text-purple-300' : 'text-purple-500'
      }`} style={{ animationDuration: '12s' }}>
        𝄞
      </div>

      {/* Bass Clef */}
      <div className={`absolute bottom-1/3 left-1/5 text-5xl opacity-4 animate-float ${
        isDark ? 'text-blue-300' : 'text-blue-500'
      }`} style={{ animationDuration: '15s', animationDelay: '3s' }}>
        𝄢
      </div>

      {/* Theme-aware vignette */}
      <div className={`absolute inset-0 ${
        isDark 
          ? 'bg-gradient-radial from-transparent via-transparent to-gray-900/30' 
          : 'bg-gradient-radial from-transparent via-transparent to-gray-50/30'
      }`} />
    </div>
  )
} 