'use client'

import React from 'react'

export const AnimatedMusicBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Professional Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-gray-800" />
      
      {/* Subtle Animated Elements - No Glitches */}
      <div className="absolute inset-0 opacity-20">
        {/* Clean Floating Orbs */}
        <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-yellow-400/20 to-orange-400/10 rounded-full blur-xl animate-float" />
        <div className="absolute top-40 right-32 w-32 h-32 bg-gradient-to-br from-amber-400/15 to-yellow-400/10 rounded-full blur-lg animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-32 left-32 w-48 h-48 bg-gradient-to-br from-orange-400/15 to-amber-400/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-20 right-20 w-36 h-36 bg-gradient-to-br from-yellow-400/10 to-orange-400/5 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }} />
        
        {/* Professional Music Notes - Minimal Animation */}
        <div className="absolute top-1/4 left-1/4 opacity-30">
          <div className="w-4 h-4 bg-gradient-to-br from-yellow-400 to-amber-400 rounded-full animate-pulse-slow shadow-lg" />
        </div>
        <div className="absolute top-3/4 right-1/4 opacity-25">
          <div className="w-3 h-3 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full animate-pulse-slow shadow-md" style={{ animationDelay: '3s' }} />
        </div>
        <div className="absolute top-1/2 left-3/4 opacity-20">
          <div className="w-5 h-5 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full animate-pulse-slow shadow-lg" style={{ animationDelay: '1.5s' }} />
        </div>
        
        {/* Elegant Wave Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" preserveAspectRatio="none">
            <defs>
              <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#FBBF24" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#F97316" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <path d="M0,200 Q250,100 500,200 T1000,200 L1000,0 L0,0 Z" fill="url(#wave1)">
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 100,0; 0,0"
                dur="20s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full h-full overflow-hidden opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" preserveAspectRatio="none">
            <defs>
              <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#D97706" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <path d="M0,800 Q250,900 500,800 T1000,800 L1000,1000 L0,1000 Z" fill="url(#wave2)">
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; -100,0; 0,0"
                dur="25s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </div>
      </div>
      
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(251, 191, 36, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(251, 191, 36, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      {/* Professional Light Rays */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-yellow-400/30 via-yellow-400/10 to-transparent"
          style={{ transform: 'rotate(15deg)' }}
        />
        <div 
          className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-amber-400/20 via-amber-400/5 to-transparent"
          style={{ transform: 'rotate(-12deg)' }}
        />
        <div 
          className="absolute top-0 left-2/3 w-px h-full bg-gradient-to-b from-orange-400/15 via-orange-400/5 to-transparent"
          style={{ transform: 'rotate(8deg)' }}
        />
      </div>
    </div>
  )
} 