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
      {/* Enhanced Gradient Orbs */}
      <div className="absolute inset-0">
        {/* Large ambient orbs with better positioning */}
        <div className={`absolute top-10 left-10 w-[500px] h-[500px] rounded-full blur-3xl animate-float opacity-12 ${
          isDark 
            ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30' 
            : 'bg-gradient-to-r from-blue-200/40 to-purple-200/40'
        }`} style={{ animationDelay: '0s', animationDuration: '8s' }} />
        
        <div className={`absolute bottom-10 right-10 w-[400px] h-[400px] rounded-full blur-3xl animate-float opacity-10 ${
          isDark 
            ? 'bg-gradient-to-r from-purple-500/25 to-pink-500/25' 
            : 'bg-gradient-to-r from-purple-200/35 to-pink-200/35'
        }`} style={{ animationDelay: '2s', animationDuration: '10s' }} />
        
        <div className={`absolute top-1/3 right-1/3 w-[350px] h-[350px] rounded-full blur-3xl animate-float opacity-8 ${
          isDark 
            ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20' 
            : 'bg-gradient-to-r from-cyan-200/30 to-blue-200/30'
        }`} style={{ animationDelay: '4s', animationDuration: '12s' }} />
        
        {/* Additional smaller orbs for depth */}
        <div className={`absolute bottom-1/3 left-1/4 w-[250px] h-[250px] rounded-full blur-2xl animate-float opacity-6 ${
          isDark 
            ? 'bg-gradient-to-r from-indigo-500/15 to-purple-500/15' 
            : 'bg-gradient-to-r from-indigo-200/25 to-purple-200/25'
        }`} style={{ animationDelay: '6s', animationDuration: '14s' }} />
      </div>

      {/* Enhanced Musical Staff Lines */}
      <div className="absolute inset-0 opacity-12">
        {/* Top staff */}
        {[...Array(5)].map((_, i) => (
          <div
            key={`staff-top-${i}`}
            className={`absolute w-full h-px animate-pulse ${
              isDark ? 'bg-blue-300/15' : 'bg-gray-400/20'
            }`}
            style={{
              top: `${15 + i * 3}%`,
              transform: `translateY(${Math.sin(i) * 3}px)`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '4s'
            }}
          />
        ))}
        
        {/* Bottom staff */}
        {[...Array(5)].map((_, i) => (
          <div
            key={`staff-bottom-${i}`}
            className={`absolute w-full h-px animate-pulse ${
              isDark ? 'bg-purple-300/12' : 'bg-gray-400/18'
            }`}
            style={{
              top: `${70 + i * 3}%`,
              transform: `translateY(${Math.sin(i + 2) * 3}px)`,
              animationDelay: `${i * 0.5 + 2}s`,
              animationDuration: '5s'
            }}
          />
        ))}
      </div>

      {/* Enhanced Sound Wave Visualizer */}
      <div className="absolute inset-0 flex items-center justify-center opacity-15">
        <div className="flex items-end space-x-1">
          {[...Array(60)].map((_, i) => (
            <div
              key={`wave-bar-${i}`}
              className={`w-1.5 rounded-t-full animate-sound-wave ${
                isDark ? 'bg-gradient-to-t from-blue-400/60 to-purple-400/60' : 'bg-gradient-to-t from-blue-500/70 to-purple-500/70'
              }`}
              style={{
                height: `${15 + Math.sin(i * 0.3) * 20 + Math.cos(i * 0.1) * 10}px`,
                animationDelay: `${i * 0.05}s`,
                animationDuration: `${1.2 + (i % 4) * 0.3}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Enhanced Floating Musical Notes */}
      <div className="absolute inset-0">
        {/* Musical Note Symbols with better variety */}
        {[...Array(20)].map((_, i) => {
          const notes = ['♪', '♫', '♬', '♩', '♯', '♭', '𝄞', '𝄢', '♮', '𝄐']
          const note = notes[i % notes.length]
          return (
            <div
              key={`note-${i}`}
              className={`absolute text-2xl animate-float font-bold ${
                isDark ? 'text-blue-300/20' : 'text-blue-600/25'
              }`}
              style={{
                left: `${(i * 5) % 95 + 2}%`,
                top: `${(i * 6) % 90 + 5}%`,
                animationDelay: `${i * 0.6}s`,
                animationDuration: `${6 + (i % 5)}s`,
                fontSize: `${14 + (i % 4) * 6}px`,
                transform: `rotate(${(i % 3 - 1) * 15}deg)`,
              }}
            >
              {note}
            </div>
          )
        })}
      </div>

      {/* Enhanced Frequency Visualization */}
      <div className="absolute inset-0 opacity-8">
        <svg className="w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
          {/* Multiple layered sound waves */}
          <path
            d="M0,300 Q125,220 250,300 T500,300 T750,300 T1000,300"
            stroke={isDark ? 'rgba(96, 165, 250, 0.15)' : 'rgba(59, 130, 246, 0.15)'}
            strokeWidth="3"
            fill="none"
            className="animate-wave-draw"
          />
          <path
            d="M0,320 Q75,250 150,320 T300,320 T450,320 T600,320 T750,320 T900,320 T1000,320"
            stroke={isDark ? 'rgba(139, 92, 246, 0.12)' : 'rgba(147, 51, 234, 0.12)'}
            strokeWidth="2"
            fill="none"
            className="animate-wave-draw-2"
          />
          <path
            d="M0,280 Q100,200 200,280 T400,280 T600,280 T800,280 T1000,280"
            stroke={isDark ? 'rgba(168, 85, 247, 0.10)' : 'rgba(139, 92, 246, 0.10)'}
            strokeWidth="2"
            fill="none"
            className="animate-wave-draw-3"
          />
          <path
            d="M0,340 Q50,290 100,340 T200,340 T300,340 T400,340 T500,340 T600,340 T700,340 T800,340 T900,340 T1000,340"
            stroke={isDark ? 'rgba(59, 130, 246, 0.08)' : 'rgba(96, 165, 250, 0.08)'}
            strokeWidth="1.5"
            fill="none"
            className="animate-wave-draw-4"
          />
        </svg>
      </div>

      {/* Enhanced Clef Symbols */}
      <div className={`absolute top-1/5 right-1/5 text-7xl opacity-8 animate-float ${
        isDark ? 'text-purple-300/25' : 'text-purple-500/30'
      }`} style={{ animationDuration: '12s', transform: 'rotate(-10deg)' }}>
        𝄞
      </div>

      <div className={`absolute bottom-1/4 left-1/6 text-6xl opacity-6 animate-float ${
        isDark ? 'text-blue-300/20' : 'text-blue-500/25'
      }`} style={{ animationDuration: '15s', animationDelay: '3s', transform: 'rotate(8deg)' }}>
        𝄢
      </div>

      {/* New: Alto Clef */}
      <div className={`absolute top-1/2 left-1/2 text-5xl opacity-4 animate-float ${
        isDark ? 'text-cyan-300/15' : 'text-cyan-500/20'
      }`} style={{ animationDuration: '18s', animationDelay: '6s', transform: 'rotate(-5deg) translate(-50%, -50%)' }}>
        𝄡
      </div>

      {/* Musical Sparkles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className={`absolute w-1 h-1 rounded-full animate-pulse ${
              isDark ? 'bg-white/20' : 'bg-yellow-400/30'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Theme-aware vignette */}
      <div className={`absolute inset-0 ${
        isDark 
          ? 'bg-gradient-radial from-transparent via-transparent to-gray-900/40' 
          : 'bg-gradient-radial from-transparent via-transparent to-gray-50/40'
      }`} />
    </div>
  )
} 