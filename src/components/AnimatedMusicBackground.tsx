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

      {/* Floating Elements */}
      <div className="absolute inset-0">
        {/* Musical note shapes */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 rounded-full animate-float opacity-20 ${
              isDark ? 'bg-blue-400' : 'bg-blue-500'
            }`}
            style={{
              left: `${10 + (i * 12)}%`,
              top: `${20 + (i * 8)}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${6 + (i % 3)}s`
            }}
          />
        ))}
        
        {/* Larger floating elements */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={`large-${i}`}
            className={`absolute w-1 h-1 rounded-full animate-float opacity-25 ${
              isDark ? 'bg-purple-400' : 'bg-purple-500'
            }`}
            style={{
              right: `${5 + (i * 15)}%`,
              top: `${30 + (i * 10)}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${8 + (i % 2)}s`
            }}
          />
        ))}
      </div>

      {/* Animated Music Waves */}
      <div className="absolute inset-0 opacity-5">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
          {/* Wave 1 - Low frequency */}
          <path
            d="M0,400 Q150,300 300,400 T600,400 T900,400 T1200,400 V800 H0 Z"
            fill={isDark ? 'rgba(96, 165, 250, 0.03)' : 'rgba(59, 130, 246, 0.03)'}
            className="animate-wave-1"
          />
          {/* Wave 2 - Medium frequency */}
          <path
            d="M0,450 Q100,350 200,450 T400,450 T600,450 T800,450 T1000,450 T1200,450 V800 H0 Z"
            fill={isDark ? 'rgba(139, 92, 246, 0.025)' : 'rgba(147, 51, 234, 0.025)'}
            className="animate-wave-2"
          />
          {/* Wave 3 - High frequency */}
          <path
            d="M0,350 Q75,280 150,350 T300,350 T450,350 T600,350 T750,350 T900,350 T1050,350 T1200,350 V800 H0 Z"
            fill={isDark ? 'rgba(168, 85, 247, 0.02)' : 'rgba(139, 92, 246, 0.02)'}
            className="animate-wave-3"
          />
          {/* Wave 4 - Very high frequency (subtle) */}
          <path
            d="M0,380 Q50,340 100,380 T200,380 T300,380 T400,380 T500,380 T600,380 T700,380 T800,380 T900,380 T1000,380 T1100,380 T1200,380 V800 H0 Z"
            fill={isDark ? 'rgba(59, 130, 246, 0.015)' : 'rgba(96, 165, 250, 0.015)'}
            className="animate-wave-4"
          />
        </svg>
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