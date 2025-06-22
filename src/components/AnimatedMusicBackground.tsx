'use client'

import React from 'react'

export function AnimatedMusicBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
      {/* Record Player Dials */}
      <div className="absolute top-20 left-10 w-16 h-16 border-2 border-purple-300 rounded-full animate-spin-slow">
        <div className="absolute inset-2 border border-purple-200 rounded-full">
          <div className="absolute inset-2 bg-purple-100 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
          </div>
        </div>
      </div>
      
      <div className="absolute top-40 right-20 w-12 h-12 border-2 border-pink-300 rounded-full animate-spin-reverse">
        <div className="absolute inset-1 border border-pink-200 rounded-full">
          <div className="absolute inset-1 bg-pink-100 rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-pink-400 rounded-full"></div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-32 left-1/4 w-20 h-20 border-2 border-indigo-300 rounded-full animate-spin-slow">
        <div className="absolute inset-2 border border-indigo-200 rounded-full">
          <div className="absolute inset-3 bg-indigo-100 rounded-full flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full"></div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-20 right-1/3 w-14 h-14 border-2 border-purple-300 rounded-full animate-spin-reverse">
        <div className="absolute inset-2 border border-purple-200 rounded-full">
          <div className="absolute inset-2 bg-purple-100 rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Music Notes */}
      <div className="absolute top-32 left-1/3 text-purple-300 text-2xl animate-float">♪</div>
      <div className="absolute top-48 right-1/4 text-pink-300 text-lg animate-float-delayed">♫</div>
      <div className="absolute bottom-48 left-1/5 text-indigo-300 text-xl animate-float">♪</div>
      <div className="absolute bottom-36 right-1/5 text-purple-300 text-lg animate-float-delayed">♫</div>
      <div className="absolute top-1/2 left-16 text-pink-300 text-sm animate-float">♪</div>
      <div className="absolute top-1/3 right-12 text-indigo-300 text-sm animate-float-delayed">♫</div>
      
      {/* Equalizer Bars */}
      <div className="absolute top-60 left-1/2 flex items-end gap-1">
        <div className="w-1 bg-purple-300 animate-equalizer-1" style={{ height: '20px' }}></div>
        <div className="w-1 bg-pink-300 animate-equalizer-2" style={{ height: '30px' }}></div>
        <div className="w-1 bg-indigo-300 animate-equalizer-3" style={{ height: '15px' }}></div>
        <div className="w-1 bg-purple-300 animate-equalizer-4" style={{ height: '25px' }}></div>
        <div className="w-1 bg-pink-300 animate-equalizer-5" style={{ height: '18px' }}></div>
      </div>
      
      <div className="absolute bottom-60 right-1/2 flex items-end gap-1">
        <div className="w-1 bg-indigo-300 animate-equalizer-2" style={{ height: '22px' }}></div>
        <div className="w-1 bg-purple-300 animate-equalizer-4" style={{ height: '16px' }}></div>
        <div className="w-1 bg-pink-300 animate-equalizer-1" style={{ height: '28px' }}></div>
        <div className="w-1 bg-indigo-300 animate-equalizer-5" style={{ height: '12px' }}></div>
      </div>

      {/* Sound Waves */}
      <div className="absolute top-1/4 right-8 w-8 h-8">
        <div className="absolute inset-0 border-2 border-purple-200 rounded-full animate-ping"></div>
        <div className="absolute inset-2 border border-purple-300 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
      </div>
      
      <div className="absolute bottom-1/4 left-8 w-6 h-6">
        <div className="absolute inset-0 border-2 border-pink-200 rounded-full animate-ping"></div>
        <div className="absolute inset-1 border border-pink-300 rounded-full animate-ping" style={{ animationDelay: '0.3s' }}></div>
      </div>
    </div>
  )
} 