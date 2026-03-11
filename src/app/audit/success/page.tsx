'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function SuccessContent() {
  const searchParams = useSearchParams();
  const businessId = searchParams.get('businessId');

  return (
    <div className="max-w-4xl w-full text-center relative p-12 lg:p-20 overflow-hidden">
      {/* Verification Certificate Look */}
      <div className="absolute inset-0 border-[20px] border-double border-emerald-500/10 pointer-events-none rounded-[60px]" />
      <div className="absolute top-10 left-10 text-[8px] font-black tracking-widest text-emerald-500/20 uppercase">LOI96_OFFICIAL_CHANNEL_ENCRYPTED</div>
      <div className="absolute bottom-10 right-10 text-[8px] font-black tracking-widest text-white/5 uppercase select-none">AUTHORIZED_BY_MAX_AGENT_ZERO</div>
      
      <div className="mb-16 relative inline-block">
        <div className="w-48 h-48 rounded-full border-[10px] border-emerald-500/10 flex items-center justify-center relative overflow-hidden bg-black/40 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent animate-pulse" />
          <span className="text-8xl drop-shadow-[0_0_30px_rgba(16,185,129,0.5)]">🛡️</span>
        </div>
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-black px-8 py-2 rounded-full uppercase tracking-[0.4em] shadow-[0_0_25px_rgba(16,185,129,0.5)] border border-white/20">
          SHIELD_ACTIVE
        </div>
      </div>

      <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-8 italic text-gradient-gold">
        VERIFIED
      </h1>
      
      <div className="space-y-6 mb-16">
        <p className="text-neutral-400 text-xl max-w-2xl mx-auto leading-relaxed uppercase font-light tracking-tight">
          Linguistic forensics complete for <br />
          <span className="text-white font-black text-2xl tracking-widest">NEQ_{businessId || '721X_BETA'}</span>
        </p>
        <div className="h-1 w-24 bg-gold-primary mx-auto rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-3xl mx-auto">
        <div className="p-8 bg-zinc-950/80 backdrop-blur-md border border-white/5 rounded-[40px] text-left relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="text-4xl font-black">01</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">Digital Asset Protection</p>
          <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-tight">Linguistic Registry Seal</h3>
          <p className="text-[10px] text-neutral-500 uppercase font-bold leading-relaxed">Your profile now features the High-Fidelity Gold Verified Seal, signaling full compliance to OQLF auditors.</p>
        </div>
        <div className="p-8 bg-zinc-950/80 backdrop-blur-md border border-white/5 rounded-[40px] text-left relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="text-4xl font-black">02</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">24/7 Agent Oversight</p>
          <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-tight">Forensic Meta Monitoring</h3>
          <p className="text-[10px] text-neutral-500 uppercase font-bold leading-relaxed">Max Agent-Zero will monitor your site dictionary 24/7, providing real-time alerts for drift detection.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
        <Link 
          href={`/directory`} 
          className="bg-white text-black px-12 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-gold-primary hover:text-white transition-all shadow-2xl flex items-center gap-2 group"
        >
          <span>Return To Registry</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
        <Link 
          href="/" 
          className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.4em] hover:text-white transition-colors border-b border-white/5 pb-1"
        >
          Download Certificate (PDF)
        </Link>
      </div>
    </div>
  );
}

export default function AuditSuccessPage() {
  return (
    <main className="min-h-screen leather-bg flex items-center justify-center px-6">
       {/* Background Decal */}
       <div className="absolute top-0 left-0 p-20 opacity-10 blur-[100px] pointer-events-none">
          <div className="w-[800px] h-[800px] rounded-full bg-emerald-500" />
       </div>
       
       <Suspense fallback={<div className="text-white font-black uppercase tracking-widest">LOADING_SECURE_DATA...</div>}>
          <SuccessContent />
       </Suspense>
    </main>
  );
}
