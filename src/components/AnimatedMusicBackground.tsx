'use client'

import React from 'react'

export function AnimatedMusicBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-10 blur-[0.5px]">
      {/* Record Player Dials */}
      <div className="absolute top-20 left-10 w-12 h-12 border border-purple-500/30 rounded-full animate-spin-slow">
        <div className="absolute inset-2 border border-purple-400/20 rounded-full">
          <div className="absolute inset-2 bg-purple-500/10 rounded-full flex items-center justify-center">
            <div className="w-1 h-1 bg-purple-400/40 rounded-full"></div>
          </div>
        </div>
      </div>
      
      <div className="absolute top-40 right-20 w-8 h-8 border border-pink-500/30 rounded-full animate-spin-reverse">
        <div className="absolute inset-1 border border-pink-400/20 rounded-full">
          <div className="absolute inset-1 bg-pink-500/10 rounded-full flex items-center justify-center">
            <div className="w-0.5 h-0.5 bg-pink-400/40 rounded-full"></div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-32 left-1/4 w-16 h-16 border border-indigo-500/30 rounded-full animate-spin-slow">
        <div className="absolute inset-2 border border-indigo-400/20 rounded-full">
          <div className="absolute inset-3 bg-indigo-500/10 rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-indigo-400/40 rounded-full"></div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-20 right-1/3 w-10 h-10 border border-purple-500/30 rounded-full animate-spin-reverse">
        <div className="absolute inset-2 border border-purple-400/20 rounded-full">
          <div className="absolute inset-2 bg-purple-500/10 rounded-full flex items-center justify-center">
            <div className="w-1 h-1 bg-purple-400/40 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Music Notes */}
      <div className="absolute top-32 left-1/3 text-purple-400/30 text-lg animate-float">♪</div>
      <div className="absolute top-48 right-1/4 text-pink-400/30 text-sm animate-float-delayed">♫</div>
      <div className="absolute bottom-48 left-1/5 text-indigo-400/30 text-base animate-float">♪</div>
      <div className="absolute bottom-36 right-1/5 text-purple-400/30 text-sm animate-float-delayed">♫</div>
      <div className="absolute top-1/2 left-16 text-pink-400/30 text-xs animate-float">♪</div>
      <div className="absolute top-1/3 right-12 text-indigo-400/30 text-xs animate-float-delayed">♫</div>
      
      {/* Equalizer Bars */}
      <div className="absolute top-60 left-1/2 flex items-end gap-0.5">
        <div className="w-0.5 bg-purple-400/20 animate-equalizer-1" style={{ height: '12px' }}></div>
        <div className="w-0.5 bg-pink-400/20 animate-equalizer-2" style={{ height: '18px' }}></div>
        <div className="w-0.5 bg-indigo-400/20 animate-equalizer-3" style={{ height: '8px' }}></div>
        <div className="w-0.5 bg-purple-400/20 animate-equalizer-4" style={{ height: '15px' }}></div>
        <div className="w-0.5 bg-pink-400/20 animate-equalizer-5" style={{ height: '10px' }}></div>
      </div>
      
      <div className="absolute bottom-60 right-1/2 flex items-end gap-0.5">
        <div className="w-0.5 bg-indigo-400/20 animate-equalizer-2" style={{ height: '14px' }}></div>
        <div className="w-0.5 bg-purple-400/20 animate-equalizer-4" style={{ height: '9px' }}></div>
        <div className="w-0.5 bg-pink-400/20 animate-equalizer-1" style={{ height: '16px' }}></div>
        <div className="w-0.5 bg-indigo-400/20 animate-equalizer-5" style={{ height: '7px' }}></div>
      </div>

      {/* Sound Waves */}
      <div className="absolute top-1/4 right-8 w-6 h-6">
        <div className="absolute inset-0 border border-purple-400/10 rounded-full animate-ping"></div>
        <div className="absolute inset-2 border border-purple-400/20 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
      </div>
      
      <div className="absolute bottom-1/4 left-8 w-4 h-4">
        <div className="absolute inset-0 border border-pink-400/10 rounded-full animate-ping"></div>
        <div className="absolute inset-1 border border-pink-400/20 rounded-full animate-ping" style={{ animationDelay: '0.3s' }}></div>
      </div>
    </div>
  )
} 