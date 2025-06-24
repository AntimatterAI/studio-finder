'use client'

import { useEffect, useState } from 'react'

export default function AnimatedMusicBackground() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check initial theme
    const checkTheme = () => {
      const theme = localStorage.getItem('theme')
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const isDarkMode = theme === 'dark' || (!theme && systemDark)
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
        <div className={`absolute top-20 left-20 w-96 h-96 rounded-full blur-3xl animate-float opacity-20 ${
          isDark 
            ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
            : 'bg-gradient-to-r from-blue-200 to-purple-200'
        }`} style={{ animationDelay: '0s', animationDuration: '8s' }} />
        
        <div className={`absolute bottom-20 right-20 w-80 h-80 rounded-full blur-3xl animate-float opacity-15 ${
          isDark 
            ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
            : 'bg-gradient-to-r from-purple-200 to-pink-200'
        }`} style={{ animationDelay: '2s', animationDuration: '10s' }} />
        
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full blur-3xl animate-float opacity-10 ${
          isDark 
            ? 'bg-gradient-to-r from-cyan-600 to-blue-600' 
            : 'bg-gradient-to-r from-cyan-200 to-blue-200'
        }`} style={{ animationDelay: '4s', animationDuration: '12s' }} />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0">
        {/* Musical note shapes */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 rounded-full animate-float opacity-30 ${
              isDark ? 'bg-blue-400' : 'bg-blue-600'
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
            className={`absolute w-1 h-1 rounded-full animate-float opacity-40 ${
              isDark ? 'bg-purple-400' : 'bg-purple-600'
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

      {/* Subtle Grid Pattern */}
      <div className={`absolute inset-0 opacity-5 ${
        isDark ? 'bg-grid-white/[0.02]' : 'bg-grid-black/[0.02]'
      }`} 
      style={{
        backgroundImage: `linear-gradient(rgba(${isDark ? '255,255,255' : '0,0,0'},0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(${isDark ? '255,255,255' : '0,0,0'},0.02) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }} />

      {/* Theme-aware vignette */}
      <div className={`absolute inset-0 ${
        isDark 
          ? 'bg-gradient-radial from-transparent via-transparent to-gray-900/50' 
          : 'bg-gradient-radial from-transparent via-transparent to-gray-100/50'
      }`} />
    </div>
  )
} 