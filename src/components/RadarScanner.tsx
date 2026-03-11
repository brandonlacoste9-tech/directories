// src/components/RadarScanner.tsx
'use client';

import React, { useEffect, useState } from 'react';

export default function RadarScanner({ isScanning = false }: { isScanning?: boolean }) {
  const [blips, setBlips] = useState<{ x: number; y: number; id: number }[]>([]);

  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        setBlips(prev => {
          const newBlip = {
            x: Math.random() * 80 + 10,
            y: Math.random() * 80 + 10,
            id: Date.now()
          };
          return [...prev.slice(-4), newBlip];
        });
      }, 1500);
      return () => {
        clearInterval(interval);
        setBlips([]); 
      };
    }
  }, [isScanning]);

  return (
    <div className="relative w-full aspect-square max-w-[500px] mx-auto bg-black rounded-full border-[12px] border-zinc-900 shadow-[0_0_80px_rgba(0,0,0,0.8),inset_0_0_40px_rgba(220,38,38,0.15)] overflow-hidden group p-4">
      {/* Outer Leather Ring with Red Stitching */}
      <div className="absolute inset-0 rounded-full border-4 border-dashed border-red-600/20 pointer-events-none z-20 m-1" />
      
      {/* Radar HUD Background */}
      <div className="relative w-full h-full rounded-full bg-zinc-950 overflow-hidden shadow-inner">
        {/* Grid System */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-[1px] bg-red-600/30" />
            <div className="h-full w-[1px] bg-red-600/30" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[80%] h-[80%] border border-red-600/10 rounded-full" />
            <div className="w-[60%] h-[60%] border border-red-600/20 rounded-full" />
            <div className="w-[40%] h-[40%] border border-red-600/30 rounded-full" />
            <div className="w-[20%] h-[20%] border border-red-600/40 rounded-full" />
          </div>
        </div>

        {/* Rotating Sweep Line */}
        {isScanning && (
          <div 
            className="absolute inset-0 origin-center z-10"
            style={{ 
              animation: 'radar-sweep 4s linear infinite'
            }}
          >
            <div 
               className="absolute top-1/2 left-1/2 w-1/2 h-[2px] bg-gradient-to-r from-red-500 to-transparent shadow-[0_0_15px_#ef4444]"
               style={{ transform: 'rotate(-90deg)', transformOrigin: 'left' }}
            />
            {/* Sweep Trail */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-transparent"
              style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 20%)' }}
            />
          </div>
        )}

        {/* Tactical Blips */}
        {blips.map(blip => (
          <div 
            key={blip.id}
            className="absolute w-3 h-3 bg-red-500 rounded-full animate-ping z-10 shadow-[0_0_15px_#ef4444]"
            style={{ left: `${blip.x}%`, top: `${blip.y}%` }}
          />
        ))}

        {/* HUD Data Text */}
        <div className="absolute inset-0 p-10 flex flex-col justify-between pointer-events-none z-30 font-mono">
          <div className="flex justify-between text-[9px] text-red-500/50 uppercase tracking-widest">
            <div className="flex flex-col">
              <span className="text-white/40">LAT: 45.5017° N</span>
              <span className="text-white/40">LON: 73.5673° W</span>
            </div>
            <div className="text-right flex flex-col">
              <span className="text-white/40">SYS: {isScanning ? 'ACTIVE' : 'IDLE'}</span>
              <span className="text-red-500/80">THREAT: CALCULATING</span>
            </div>
          </div>
          
          <div className="mt-auto flex flex-col items-center">
             <div className="text-[9px] font-black text-white/20 mb-2 tracking-[0.4em] uppercase">Linguistic_Surveillance_Radar</div>
             <div className={`text-xs font-bold px-4 py-1 border border-red-600/20 bg-red-600/5 rounded ${isScanning ? 'text-red-500 animate-pulse' : 'text-zinc-600'}`}>
                {isScanning ? 'SEARCHING_DOM_METADATA' : 'RADAR_STANDBY'}
             </div>
          </div>
        </div>

        {/* Compass Markers */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] text-red-600 font-black z-30">N</div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-zinc-600 font-bold z-30">S</div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-zinc-600 font-bold z-30">E</div>
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] text-zinc-600 font-bold z-30">W</div>
      </div>

      <style jsx>{`
        @keyframes radar-sweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
