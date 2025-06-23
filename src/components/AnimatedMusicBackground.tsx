'use client'

import React from 'react'

export const AnimatedMusicBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Modern Music Platform Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/20" />
      
      {/* Electric Floating Orbs - Smooth Animation */}
      <div className="absolute inset-0 opacity-25">
        {/* Electric Blue Orbs */}
        <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-blue-500/30 to-blue-600/10 rounded-full blur-xl animate-float music-orb" />
        <div className="absolute top-40 right-32 w-32 h-32 bg-gradient-to-br from-purple-500/25 to-purple-600/10 rounded-full blur-lg animate-float music-orb" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-32 left-32 w-48 h-48 bg-gradient-to-br from-cyan-500/20 to-cyan-600/5 rounded-full blur-2xl animate-float music-orb" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-20 right-20 w-36 h-36 bg-gradient-to-br from-blue-400/15 to-purple-500/5 rounded-full blur-xl animate-float music-orb" style={{ animationDelay: '1s' }} />
        
        {/* Additional Electric Elements */}
        <div className="absolute top-1/3 left-1/3 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-500/10 rounded-full blur-lg animate-float music-orb" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-1/3 right-1/3 w-28 h-28 bg-gradient-to-br from-cyan-400/20 to-blue-500/10 rounded-full blur-xl animate-float music-orb" style={{ animationDelay: '5s' }} />
        
        {/* Electric Music Notes - Minimal */}
        <div className="absolute top-1/4 left-1/4 opacity-40">
          <div className="w-4 h-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full animate-pulse-glow shadow-lg" />
        </div>
        <div className="absolute top-3/4 right-1/4 opacity-35">
          <div className="w-3 h-3 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full animate-pulse-glow shadow-md" style={{ animationDelay: '3s' }} />
        </div>
        <div className="absolute top-1/2 left-3/4 opacity-30">
          <div className="w-5 h-5 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full animate-pulse-glow shadow-lg" style={{ animationDelay: '1.5s' }} />
        </div>
        <div className="absolute top-2/3 left-1/5 opacity-25">
          <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full animate-pulse-glow shadow-lg" style={{ animationDelay: '4s' }} />
        </div>
        
        {/* Modern Wave Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-15">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" preserveAspectRatio="none">
            <defs>
              <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#EC4899" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <path d="M0,200 Q250,100 500,200 T1000,200 L1000,0 L0,0 Z" fill="url(#wave1)">
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 100,0; 0,0"
                dur="25s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full h-full overflow-hidden opacity-15">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" preserveAspectRatio="none">
            <defs>
              <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <path d="M0,800 Q250,900 500,800 T1000,800 L1000,1000 L0,1000 Z" fill="url(#wave2)">
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; -100,0; 0,0"
                dur="30s"
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
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>
      
      {/* Electric Light Rays */}
      <div className="absolute inset-0 opacity-8">
        <div 
          className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-blue-400/30 via-blue-500/10 to-transparent"
          style={{ transform: 'rotate(15deg)' }}
        />
        <div 
          className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-purple-400/25 via-purple-500/8 to-transparent"
          style={{ transform: 'rotate(-12deg)' }}
        />
        <div 
          className="absolute top-0 left-2/3 w-px h-full bg-gradient-to-b from-cyan-400/20 via-cyan-500/6 to-transparent"
          style={{ transform: 'rotate(8deg)' }}
        />
        <div 
          className="absolute top-0 right-1/5 w-px h-full bg-gradient-to-b from-pink-400/15 via-pink-500/5 to-transparent"
          style={{ transform: 'rotate(-8deg)' }}
        />
      </div>
      
      {/* Electric Particles */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/6 left-1/6 w-1 h-1 bg-blue-400/60 rounded-full animate-pulse-glow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-purple-400/60 rounded-full animate-pulse-glow" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-cyan-400/60 rounded-full animate-pulse-glow" style={{ animationDelay: '6s' }} />
        <div className="absolute bottom-1/6 right-1/5 w-1.5 h-1.5 bg-pink-400/60 rounded-full animate-pulse-glow" style={{ animationDelay: '8s' }} />
        <div className="absolute top-2/3 left-1/5 w-1 h-1 bg-blue-300/60 rounded-full animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/5 right-2/3 w-1 h-1 bg-purple-300/60 rounded-full animate-pulse-glow" style={{ animationDelay: '3s' }} />
      </div>
    </div>
  )
} 