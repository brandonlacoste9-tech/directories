// src/components/SkeuoDossier.tsx
'use client';

import React from 'react';
import Image from 'next/image';

interface DossierProps {
  businessName: string;
  neq: string;
  riskScore: number | string;
  violations: string[];
  auditDate?: string;
}

export function Badge({ children, variant = 'default' }: { children: React.ReactNode, variant?: string }) {
  const styles: Record<string, string> = {
    critical: 'bg-red-600 text-white font-black shadow-[0_0_15px_rgba(220,38,38,0.5)]',
    high: 'bg-orange-600 text-white font-black',
    moderate: 'bg-yellow-600 text-black font-black',
    low: 'bg-green-600 text-white font-black',
    default: 'bg-zinc-800 text-white font-bold',
  };
  return (
    <span className={`px-4 py-1.5 rounded-sm text-[10px] uppercase tracking-[0.2em] shadow-sm ${styles[variant.toLowerCase()] || styles.default}`}>
      {children}
    </span>
  );
}

export default function SkeuoDossier({ businessName, neq, riskScore, violations, auditDate }: DossierProps) {
  const scoreNum = typeof riskScore === 'number' ? riskScore : (riskScore === 'CRITICAL' ? 85 : 50);
  const getLevel = (s: number) => {
    if (s > 80) return 'CRITICAL';
    if (s > 50) return 'HIGH';
    if (s > 20) return 'MODERATE';
    return 'LOW';
  };
  const level = getLevel(scoreNum);

  const [reportHash, setReportHash] = React.useState('');
  
  React.useEffect(() => {
    setReportHash(Math.random().toString(16).substring(2, 10).toUpperCase());
  }, []);

  return (
    <div className="relative max-w-4xl mx-auto p-16 bg-[#faf9f6] border-l-[40px] border-[#3d0a0a] shadow-[0_50px_100px_rgba(0,0,0,0.5),20px_0_40px_rgba(0,0,0,0.2)] skew-y-[-0.2deg] font-heading text-neutral-900 overflow-hidden ring-1 ring-black/10">
      {/* High Fidelity Paper Texture */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cardboard-flat.png')]" />
      
      {/* Confidential Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="text-[180px] font-black text-black/[0.03] uppercase rotate-[-35deg] tracking-[0.5em] whitespace-nowrap">
          CONFIDENTIEL
        </span>
      </div>

      {/* Skeuomorphic Staples / Holes */}
      <div className="absolute top-12 left-[-25px] w-10 h-1.5 bg-gradient-to-r from-zinc-500 to-zinc-400 rounded-full shadow-lg rotate-[25deg] z-20" />
      <div className="absolute top-24 left-[-25px] w-10 h-1.5 bg-gradient-to-r from-zinc-500 to-zinc-400 rounded-full shadow-lg rotate-[-15deg] z-20" />
      <div className="absolute bottom-12 left-[-25px] w-10 h-1.5 bg-gradient-to-r from-zinc-500 to-zinc-400 rounded-full shadow-lg rotate-[5deg] z-20" />

      {/* Forensic Subject ID Photo (Paperclipped) */}
      <div className="absolute top-10 right-20 w-32 h-40 bg-white p-2 shadow-2xl rotate-[3deg] ring-1 ring-black/5 z-30">
        <div className="w-full h-full bg-slate-200 overflow-hidden relative grayscale opacity-70">
           <Image 
             src="/forensic_subject_photo.png" 
             alt="Subject ID" 
             fill
             className="object-cover"
           />
           <div className="absolute inset-0 bg-orange-950/5 mix-blend-multiply" />
        </div>
        {/* Paperclip */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-6 h-12 border-[3px] border-zinc-400 rounded-full opacity-80" />
      </div>

      {/* Coffee Stain */}
      <div className="absolute top-[20%] right-[-50px] w-64 h-64 opacity-[0.03] pointer-events-none rotate-[45deg] bg-[url('https://www.transparenttextures.com/patterns/dust.png')] border-[30px] border-orange-900/50 rounded-full blur-2xl" />

      {/* Official Red Wax Seal (Simulated) */}
      <div className="absolute bottom-16 right-16 w-32 h-32 opacity-20 pointer-events-none rotate-[-10deg]">
         <div className="w-full h-full border-[8px] border-double border-red-700 rounded-full flex items-center justify-center text-center p-4">
            <span className="text-red-700 font-black text-[10px] leading-tight uppercase">Bureau de <br /> Vérification <br /> Zyeuté</span>
         </div>
      </div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start border-b-[8px] border-slate-900 pb-12 mb-12">
          <div>
            <div className="inline-block px-2 py-0.5 bg-red-700 text-white text-[8px] font-black uppercase tracking-widest mb-4">Dossier_Restreint</div>
            <h2 className="text-5xl font-black uppercase tracking-tighter leading-none mb-6">
              Rapport Forensique
            </h2>
            <div className="flex items-center gap-4 text-[11px]">
               <p className="text-slate-600 font-black uppercase tracking-[0.3em]">NEQ: <span className="text-slate-900 underline decoration-slate-300 underline-offset-4">{neq}</span></p>
               <span className="text-slate-300">|</span>
               <p className="text-slate-500 font-bold uppercase tracking-widest">{businessName}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={level.toLowerCase()}>RESPONSABILITÉ {level === 'CRITICAL' ? 'CRITIQUE' : level === 'HIGH' ? 'ÉLEVÉE' : level === 'MODERATE' ? 'MODÉRÉE' : 'FAIBLE'}</Badge>
            <span className="text-[8px] font-mono text-slate-400">HASH: {reportHash}</span>
          </div>
        </div>

        {/* Liability Progress Bar - Skeuomorphic "Ink" look */}
        <div className="mb-16 p-10 bg-white/50 backdrop-blur-sm rounded-3xl border border-black/5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-end mb-6">
            <div className="flex flex-col">
               <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 mb-1">Spectre d&apos;Intensité du Risque</span>
               <span className="text-[8px] font-mono text-slate-300">MESURÉ_VIA_RADAR_AGENTIQUE_V4.2</span>
            </div>
            <span className="text-5xl font-black text-slate-900 tabular-nums tracking-tighter">
              {scoreNum}<span className="text-2xl opacity-20">%</span>
            </span>
          </div>
          <div className="h-4 bg-slate-200/50 rounded-full border-2 border-slate-900 overflow-hidden p-0.5">
             <div 
               className={`h-full rounded-full transition-all duration-[2000ms] shadow-sm ${scoreNum > 80 ? 'bg-red-700' : scoreNum > 50 ? 'bg-orange-600' : 'bg-emerald-600'}`} 
               style={{ width: `${scoreNum}%` }}
             />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
           <div className="space-y-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 border-b-2 border-slate-100 pb-3">Extraction de Métadonnées</h4>
              <div className="space-y-4 font-mono text-[10px] uppercase text-slate-600">
                 <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="opacity-50">Nœud Linguistique :</span>
                    <span className="text-slate-900 font-bold">MONTRÉAL_HQ_01</span>
                 </div>
                 <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="opacity-50">Horodatage :</span>
                    <span className="text-slate-900 font-bold">{auditDate || '2026-03-10T11:42:00'}</span>
                 </div>
                 <div className="flex justify-between border-b border-slate-50 pb-2">
                    <span className="opacity-50">Protocole :</span>
                    <span className="text-emerald-700 font-black tracking-widest">GRAVITY_CLAW_AUTO</span>
                 </div>
              </div>

              {/* Signature Area */}
              <div className="pt-8 opacity-60">
                 <div className="text-[8px] font-black text-slate-400 mb-1 uppercase tracking-widest">Autorisé Par</div>
                 <div className="text-2xl font-serif italic text-slate-800 tracking-tighter border-b border-slate-300 pb-2 border-double">
                    Max Agent Zero
                 </div>
              </div>
           </div>

           <div className="p-10 bg-[#fff] border-[4px] border-double border-red-600/20 rounded-2xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                 <span className="text-6xl font-black">!</span>
              </div>
              <p className="text-red-700 text-[10px] font-black mb-8 tracking-[0.3em] flex items-center gap-2">
                 <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                 VIOLATIONS_CRITIQUES :
              </p>
              <ul className="space-y-4 list-none m-0 p-0 text-[11px] font-bold tracking-tight text-slate-800 leading-snug">
                {violations.map((v, i) => (
                  <li key={i} className="flex gap-4 items-start border-l-2 border-red-600/20 pl-4 py-1 hover:border-red-600 transition-colors">
                    {v}
                  </li>
                ))}
              </ul>
           </div>
        </div>
        
        <div className="text-center py-20 bg-slate-100/30 rounded-[40px] border border-black/5 shadow-inner">
          <p className="mb-12">
            <span className="text-slate-400 text-[10px] font-black tracking-[0.6em] block mb-6">RESPONSABILITÉ MANDATOIRE :</span>
            <span className="text-8xl font-black text-red-700 leading-none tracking-tighter drop-shadow-md font-mono">
              30 000<span className="text-2xl opacity-40">$</span>
            </span>
            <span className="block text-[8px] text-red-600 font-bold mt-4 tracking-widest">PAR JOUR OUVRABLE DE NON-CONFORMITÉ</span>
          </p>
          
          <button className="group relative bg-[#1a1a1a] text-white px-20 py-10 font-black text-2xl uppercase tracking-[0.4em] shadow-[20px_20px_0px_rgba(220,38,38,0.1)] hover:shadow-[10px_10px_0px_rgba(220,38,38,0.3)] hover:-translate-x-1 hover:-translate-y-1 transition-all">
            <span className="relative z-10">PROTÉGER LE COMPTE</span>
            <div className="absolute inset-0 bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>

      {/* Forensic Report Footer */}
      <div className="mt-12 pt-8 border-t border-slate-200 text-[8px] text-slate-400 text-center tracking-[0.8em] font-black uppercase opacity-30">
        SUITE FORENSIQUE ZYEUTÉ // GRAVITYCLAW ORCHESTRATOR // NE PAS DUPLIQUER
      </div>
    </div>
  );
}
