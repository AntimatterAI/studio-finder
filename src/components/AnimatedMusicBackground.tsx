'use client'

import React from 'react'

export function AnimatedMusicBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-40">
      {/* Record Player Dials - Made much more vibrant */}
      <div className="absolute top-20 left-10 w-16 h-16 border-2 border-cyan-400/60 rounded-full animate-spin-slow shadow-lg shadow-cyan-400/20">
        <div className="absolute inset-3 border-2 border-cyan-300/40 rounded-full">
          <div className="absolute inset-2 bg-gradient-to-br from-cyan-400/30 to-cyan-600/20 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-cyan-300/80 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
      
      <div className="absolute top-40 right-20 w-12 h-12 border-2 border-emerald-400/60 rounded-full animate-spin-reverse shadow-lg shadow-emerald-400/20">
        <div className="absolute inset-2 border border-emerald-300/40 rounded-full">
          <div className="absolute inset-1 bg-gradient-to-br from-emerald-400/30 to-emerald-600/20 rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-emerald-300/80 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-32 left-1/4 w-20 h-20 border-2 border-orange-400/60 rounded-full animate-spin-slow shadow-lg shadow-orange-400/20">
        <div className="absolute inset-3 border-2 border-orange-300/40 rounded-full">
          <div className="absolute inset-3 bg-gradient-to-br from-orange-400/30 to-orange-600/20 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-orange-300/80 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-20 right-1/3 w-14 h-14 border-2 border-violet-400/60 rounded-full animate-spin-reverse shadow-lg shadow-violet-400/20">
        <div className="absolute inset-3 border border-violet-300/40 rounded-full">
          <div className="absolute inset-2 bg-gradient-to-br from-violet-400/30 to-violet-600/20 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-violet-300/80 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Music Notes - Made larger and more colorful */}
      <div className="absolute top-32 left-1/3 text-cyan-400/70 text-3xl animate-float drop-shadow-lg">♪</div>
      <div className="absolute top-48 right-1/4 text-emerald-400/70 text-2xl animate-float-delayed drop-shadow-lg">♫</div>
      <div className="absolute bottom-48 left-1/5 text-orange-400/70 text-2xl animate-float drop-shadow-lg">♪</div>
      <div className="absolute bottom-36 right-1/5 text-violet-400/70 text-xl animate-float-delayed drop-shadow-lg">♫</div>
      <div className="absolute top-1/2 left-16 text-cyan-400/70 text-lg animate-float drop-shadow-lg">♪</div>
      <div className="absolute top-1/3 right-12 text-emerald-400/70 text-lg animate-float-delayed drop-shadow-lg">♫</div>
      
      {/* Equalizer Bars - Made taller and more colorful */}
      <div className="absolute top-60 left-1/2 flex items-end gap-1">
        <div className="w-1.5 bg-gradient-to-t from-cyan-500/40 to-cyan-300/60 animate-equalizer-1 rounded-t-sm shadow-sm shadow-cyan-400/40" style={{ height: '24px' }}></div>
        <div className="w-1.5 bg-gradient-to-t from-emerald-500/40 to-emerald-300/60 animate-equalizer-2 rounded-t-sm shadow-sm shadow-emerald-400/40" style={{ height: '36px' }}></div>
        <div className="w-1.5 bg-gradient-to-t from-orange-500/40 to-orange-300/60 animate-equalizer-3 rounded-t-sm shadow-sm shadow-orange-400/40" style={{ height: '16px' }}></div>
        <div className="w-1.5 bg-gradient-to-t from-violet-500/40 to-violet-300/60 animate-equalizer-4 rounded-t-sm shadow-sm shadow-violet-400/40" style={{ height: '30px' }}></div>
        <div className="w-1.5 bg-gradient-to-t from-cyan-500/40 to-cyan-300/60 animate-equalizer-5 rounded-t-sm shadow-sm shadow-cyan-400/40" style={{ height: '20px' }}></div>
      </div>
      
      <div className="absolute bottom-60 right-1/2 flex items-end gap-1">
        <div className="w-1.5 bg-gradient-to-t from-emerald-500/40 to-emerald-300/60 animate-equalizer-2 rounded-t-sm shadow-sm shadow-emerald-400/40" style={{ height: '28px' }}></div>
        <div className="w-1.5 bg-gradient-to-t from-orange-500/40 to-orange-300/60 animate-equalizer-4 rounded-t-sm shadow-sm shadow-orange-400/40" style={{ height: '18px' }}></div>
        <div className="w-1.5 bg-gradient-to-t from-violet-500/40 to-violet-300/60 animate-equalizer-1 rounded-t-sm shadow-sm shadow-violet-400/40" style={{ height: '32px' }}></div>
        <div className="w-1.5 bg-gradient-to-t from-cyan-500/40 to-cyan-300/60 animate-equalizer-5 rounded-t-sm shadow-sm shadow-cyan-400/40" style={{ height: '14px' }}></div>
      </div>

      {/* Sound Waves - Enhanced with colors */}
      <div className="absolute top-1/4 right-8 w-8 h-8">
        <div className="absolute inset-0 border-2 border-cyan-400/30 rounded-full animate-ping"></div>
        <div className="absolute inset-2 border-2 border-cyan-400/50 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute inset-4 border border-cyan-400/70 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="absolute bottom-1/4 left-8 w-6 h-6">
        <div className="absolute inset-0 border-2 border-emerald-400/30 rounded-full animate-ping"></div>
        <div className="absolute inset-1 border-2 border-emerald-400/50 rounded-full animate-ping" style={{ animationDelay: '0.3s' }}></div>
        <div className="absolute inset-2 border border-emerald-400/70 rounded-full animate-ping" style={{ animationDelay: '0.6s' }}></div>
      </div>

      {/* Additional floating geometric shapes */}
      <div className="absolute top-1/3 left-1/2 w-4 h-4 bg-gradient-to-br from-orange-400/30 to-orange-600/20 rotate-45 animate-float-delayed shadow-lg"></div>
      <div className="absolute bottom-1/3 right-1/4 w-6 h-6 bg-gradient-to-br from-violet-400/30 to-violet-600/20 rounded-full animate-float shadow-lg"></div>
      <div className="absolute top-2/3 left-1/5 w-3 h-8 bg-gradient-to-t from-cyan-400/30 to-cyan-600/20 rounded-full animate-float-delayed shadow-lg"></div>
    </div>
  )
} 