'use client'

import React from 'react'

export function AnimatedMusicBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
      {/* Premium Record Player Dials */}
      <div className="absolute top-24 left-12 w-20 h-20 border-2 border-blue-400/40 rounded-full animate-record-spin shadow-2xl shadow-blue-400/20">
        <div className="absolute inset-4 border border-blue-300/30 rounded-full">
          <div className="absolute inset-3 bg-gradient-to-br from-blue-400/20 to-blue-600/10 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-blue-300/70 rounded-full animate-glow-pulse"></div>
          </div>
        </div>
      </div>
      
      <div className="absolute top-48 right-24 w-16 h-16 border-2 border-teal-400/40 rounded-full animate-record-spin-reverse shadow-2xl shadow-teal-400/20">
        <div className="absolute inset-3 border border-teal-300/30 rounded-full">
          <div className="absolute inset-2 bg-gradient-to-br from-teal-400/20 to-teal-600/10 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-teal-300/70 rounded-full animate-glow-pulse"></div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-40 left-1/4 w-24 h-24 border-2 border-yellow-400/40 rounded-full animate-record-spin shadow-2xl shadow-yellow-400/20">
        <div className="absolute inset-4 border border-yellow-300/30 rounded-full">
          <div className="absolute inset-4 bg-gradient-to-br from-yellow-400/20 to-yellow-600/10 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-yellow-300/70 rounded-full animate-glow-pulse"></div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-24 right-1/3 w-18 h-18 border-2 border-purple-400/40 rounded-full animate-record-spin-reverse shadow-2xl shadow-purple-400/20">
        <div className="absolute inset-3 border border-purple-300/30 rounded-full">
          <div className="absolute inset-2 bg-gradient-to-br from-purple-400/20 to-purple-600/10 rounded-full flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-purple-300/70 rounded-full animate-glow-pulse"></div>
          </div>
        </div>
      </div>

      {/* Elegant Floating Music Notes */}
      <div className="absolute top-36 left-1/3 text-blue-400/60 text-4xl animate-float-gentle drop-shadow-lg">♪</div>
      <div className="absolute top-56 right-1/4 text-teal-400/60 text-3xl animate-float-gentle drop-shadow-lg" style={{ animationDelay: '2s' }}>♫</div>
      <div className="absolute bottom-56 left-1/5 text-yellow-400/60 text-3xl animate-float-gentle drop-shadow-lg" style={{ animationDelay: '4s' }}>♪</div>
      <div className="absolute bottom-44 right-1/5 text-purple-400/60 text-2xl animate-float-gentle drop-shadow-lg" style={{ animationDelay: '6s' }}>♫</div>
      <div className="absolute top-1/2 left-20 text-blue-400/60 text-xl animate-float-gentle drop-shadow-lg" style={{ animationDelay: '1s' }}>♪</div>
      <div className="absolute top-1/3 right-16 text-teal-400/60 text-xl animate-float-gentle drop-shadow-lg" style={{ animationDelay: '3s' }}>♫</div>
      
      {/* Premium Equalizer Bars */}
      <div className="absolute top-64 left-1/2 flex items-end gap-1.5">
        <div className="w-2 bg-gradient-to-t from-blue-500/50 to-blue-300/70 animate-equalizer-premium-1 rounded-t-md shadow-lg shadow-blue-400/30" style={{ height: '32px' }}></div>
        <div className="w-2 bg-gradient-to-t from-teal-500/50 to-teal-300/70 animate-equalizer-premium-2 rounded-t-md shadow-lg shadow-teal-400/30" style={{ height: '48px' }}></div>
        <div className="w-2 bg-gradient-to-t from-yellow-500/50 to-yellow-300/70 animate-equalizer-premium-3 rounded-t-md shadow-lg shadow-yellow-400/30" style={{ height: '24px' }}></div>
        <div className="w-2 bg-gradient-to-t from-purple-500/50 to-purple-300/70 animate-equalizer-premium-4 rounded-t-md shadow-lg shadow-purple-400/30" style={{ height: '40px' }}></div>
        <div className="w-2 bg-gradient-to-t from-blue-500/50 to-blue-300/70 animate-equalizer-premium-5 rounded-t-md shadow-lg shadow-blue-400/30" style={{ height: '28px' }}></div>
        <div className="w-2 bg-gradient-to-t from-teal-500/50 to-teal-300/70 animate-equalizer-premium-1 rounded-t-md shadow-lg shadow-teal-400/30" style={{ height: '36px' }}></div>
      </div>
      
      <div className="absolute bottom-64 right-1/2 flex items-end gap-1.5">
        <div className="w-2 bg-gradient-to-t from-teal-500/50 to-teal-300/70 animate-equalizer-premium-3 rounded-t-md shadow-lg shadow-teal-400/30" style={{ height: '36px' }}></div>
        <div className="w-2 bg-gradient-to-t from-yellow-500/50 to-yellow-300/70 animate-equalizer-premium-5 rounded-t-md shadow-lg shadow-yellow-400/30" style={{ height: '24px' }}></div>
        <div className="w-2 bg-gradient-to-t from-purple-500/50 to-purple-300/70 animate-equalizer-premium-2 rounded-t-md shadow-lg shadow-purple-400/30" style={{ height: '44px' }}></div>
        <div className="w-2 bg-gradient-to-t from-blue-500/50 to-blue-300/70 animate-equalizer-premium-4 rounded-t-md shadow-lg shadow-blue-400/30" style={{ height: '20px' }}></div>
        <div className="w-2 bg-gradient-to-t from-teal-500/50 to-teal-300/70 animate-equalizer-premium-1 rounded-t-md shadow-lg shadow-teal-400/30" style={{ height: '32px' }}></div>
      </div>

      {/* Sophisticated Sound Waves */}
      <div className="absolute top-1/4 right-12 w-10 h-10">
        <div className="absolute inset-0 border-2 border-blue-400/20 rounded-full animate-ping"></div>
        <div className="absolute inset-2 border-2 border-blue-400/30 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute inset-4 border border-blue-400/40 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        <div className="absolute inset-6 border border-blue-400/50 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
      </div>
      
      <div className="absolute bottom-1/4 left-12 w-8 h-8">
        <div className="absolute inset-0 border-2 border-teal-400/20 rounded-full animate-ping"></div>
        <div className="absolute inset-1 border-2 border-teal-400/30 rounded-full animate-ping" style={{ animationDelay: '0.3s' }}></div>
        <div className="absolute inset-2 border border-teal-400/40 rounded-full animate-ping" style={{ animationDelay: '0.6s' }}></div>
        <div className="absolute inset-3 border border-teal-400/50 rounded-full animate-ping" style={{ animationDelay: '0.9s' }}></div>
      </div>

      {/* Luxury Floating Geometric Elements */}
      <div className="absolute top-1/3 left-1/2 w-6 h-6 bg-gradient-to-br from-yellow-400/20 to-yellow-600/10 rotate-45 animate-float-gentle shadow-xl shadow-yellow-400/20" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-1/3 right-1/4 w-8 h-8 bg-gradient-to-br from-purple-400/20 to-purple-600/10 rounded-full animate-float-gentle shadow-xl shadow-purple-400/20" style={{ animationDelay: '3s' }}></div>
      <div className="absolute top-2/3 left-1/5 w-4 h-12 bg-gradient-to-t from-blue-400/20 to-blue-600/10 rounded-full animate-float-gentle shadow-xl shadow-blue-400/20" style={{ animationDelay: '5s' }}></div>
      
      {/* Premium Ambient Particles */}
      <div className="absolute top-20 right-1/3 w-1 h-1 bg-blue-300/50 rounded-full animate-float-gentle" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-1.5 h-1.5 bg-teal-300/50 rounded-full animate-float-gentle" style={{ animationDelay: '4s' }}></div>
      <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-yellow-300/50 rounded-full animate-float-gentle" style={{ animationDelay: '6s' }}></div>
      <div className="absolute bottom-20 right-1/5 w-1.5 h-1.5 bg-purple-300/50 rounded-full animate-float-gentle" style={{ animationDelay: '8s' }}></div>
    </div>
  )
} 