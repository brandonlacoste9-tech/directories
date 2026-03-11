'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import RadarScanner from '@/components/RadarScanner';
import SkeuoDossier from '@/components/SkeuoDossier';

interface ScanResult {
  businessName: string;
  neq: string;
  riskScore: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  violations: string[];
}

interface SystemStatus {
  status: string;
  audits_completed: number;
  openclaw_link?: {
    active: boolean;
    version?: string;
    error?: string;
  };
}

export default function AuditPage() {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [url, setUrl] = useState('');
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);

  React.useEffect(() => {
    fetch('http://localhost:8000/api/status')
      .then(res => res.json())
      .then(setSystemStatus)
      .catch(console.error);
  }, []);

  const [logs, setLogs] = useState<string[]>([
    "[SYSTEM]: SENTINELLE_96 Initialized.",
    "[SYSTEM]: Handshake with Antigravity Node complete.",
    "[SYSTEM]: Awaiting target acquisition..."
  ]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-9), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const startScan = async (targetUrl: string) => {
    if (!targetUrl) return;
    setIsScanning(true);
    setScanResult(null);
    addLog(`RADAR: Target acquired - ${targetUrl}`);
    addLog("CLAWBAR: Extracting linguistic markers...");
    
    try {
      const response = await fetch('http://localhost:8000/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: targetUrl,
          business_name: "Audit Target",
          neq: "PENDING_SCAN" 
        }),
      });

      if (!response.ok) throw new Error('Agent Connection Lost');
      const auditData = await response.json();
      
      addLog("ANTIGRAVITY: Analyzing meta-structure...");
      addLog("AGENT_ZERO: Liability scoring initiated.");
      
      setScanResult({
        businessName: auditData.businessName,
        neq: auditData.neq,
        riskScore: auditData.riskScore,
        violations: auditData.violations
      });

      addLog("SYSTEM: Report generated.");
    } catch (error) {
       addLog("ERROR: Signal interference. Agent offline.");
       console.error("Radar Interference:", error);
       alert("🚨 AGENT_OFFLINE: Please ensure the Python FastAPI bridge is running on port 8000.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-900 font-sans text-white py-12 px-6 lg:px-20">
      
      {/* Header Portal Info */}
      <div className="flex justify-between items-center mb-12 border-b border-white/5 pb-8">
        <div>
          <Link href="/" className="flex items-center gap-4">
            <Image src="/bill96-logo.png" alt="Loi 96 Logo" width={48} height={48} className="rounded-sm shadow-2xl brightness-110" />
            <h1 className="text-4xl font-black tracking-tighter uppercase text-gradient-gold">LOI 96 <span className="font-light text-white">RÉPERTOIRE</span></h1>
          </Link>
          <p className="text-xs text-neutral-500 uppercase font-black tracking-widest mt-2">Opérateur : MAX-AGENT-ZERO | Division Québec/Alberta</p>
        </div>
        <div className="text-right flex flex-col items-end gap-2">
          <div className="flex gap-4">
            <Link href="/swarm" className="text-xs font-bold text-red-500 hover:text-red-400 uppercase tracking-widest border border-red-900 bg-red-950/20 px-3 py-1 rounded-full flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              Centre Swarm
            </Link>
            <Link href="/" className="text-xs font-bold text-gold-400 hover:underline uppercase tracking-widest px-3 py-1">
              ← Accueil du Registre
            </Link>
          </div>
          <div className="mt-2 flex gap-4 text-[10px] text-emerald-500 font-mono">
            <span>Uptime: 24/7/365</span>
            <span>Signal: ACTIVE</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12 max-w-7xl mx-auto">
        
        {/* Radar Scanner Section (Bento Style) */}
        <section className="leather-bg rounded-[40px] p-12 border-4 border-zinc-900 shadow-2xl overflow-hidden relative group">
           {/* Red Stitching Border */}
           <div className="absolute inset-4 border-2 border-dashed border-red-600/30 rounded-[30px] pointer-events-none" />
           
           <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
              <span className="text-8xl font-black text-white/5 uppercase select-none">SCANNER</span>
           </div>
           
           <h2 className="text-3xl font-serif mb-8 text-white relative z-10 flex items-center gap-4">
              <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse shadow-[0_0_15px_#dc2626]" />
              RADAR LINGUISTIQUE
           </h2>
           
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start relative z-10">
              <div className="lg:col-span-2">
                 <div className={isScanning ? 'opacity-100 scale-100 transition-all duration-500' : 'opacity-40 scale-[0.98] transition-all grayscale'}>
                    <RadarScanner isScanning={isScanning} />
                 </div>

                 {/* Forensic Terminal Overlay */}
                 <div className="mt-8 bg-black/80 backdrop-blur-md rounded-2xl border border-white/10 p-6 font-mono text-[10px] text-emerald-500/80 shadow-2xl overflow-hidden h-40">
                    <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                       <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Journaux_Agent_Actifs</span>
                       <div className="flex gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500/30" />
                          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/30" />
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/30" />
                       </div>
                    </div>
                    <div className="space-y-1">
                       {logs.map((log, i) => (
                         <div key={i} className={i === logs.length - 1 ? 'text-emerald-400 animate-pulse' : ''}>{log}</div>
                       ))}
                    </div>
                 </div>
              </div>
              
              <div className="space-y-8 h-full flex flex-col justify-center">
                 <div className="p-8 bg-zinc-900 shadow-[inset_0_2px_10px_rgba(0,0,0,1)] border-b-4 border-red-600">
                    <h3 className="text-sm font-black uppercase text-gold-primary mb-4 tracking-widest">Acquisition de la Cible</h3>
                    <div className="space-y-6">
                       <div className="relative">
                          <input 
                            type="text" 
                            className="w-full bg-black/60 border-2 border-zinc-800 rounded-xl p-5 text-lg font-bold placeholder:text-zinc-600 focus:border-red-600 outline-none transition-all shadow-inner text-white"
                            placeholder="https://votre-entreprise.qc.ca"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            disabled={isScanning}
                          />
                          <div className="absolute top-4 right-4 animate-pulse">
                             <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]" />
                          </div>
                       </div>
                       
                       <button 
                         className={`w-full py-6 rounded-xl text-xl font-black transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl ${isScanning ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed' : 'bg-gradient-to-tr from-gold-primary to-gold-dark text-black hover:scale-[1.02]'}`}
                         onClick={() => startScan(url)}
                         disabled={isScanning}
                       >
                         {isScanning ? (
                            <>
                              <div className="w-5 h-5 border-2 border-zinc-500 border-t-white rounded-full animate-spin" />
                              SIGNAL EN COURS...
                            </>
                         ) : 'LANCER LE SCAN PROFOND'}
                       </button>
                    </div>
                 </div>

                  {/* Urgency Box */}
                  <div className="p-6 border-2 border-dashed border-red-600/30 rounded-2xl bg-red-600/5 text-center">
                     <p className="text-[10px] uppercase font-black tracking-widest text-red-500 mb-2">Avis de conformité obligatoire</p>
                     <div className="text-2xl font-black text-white">ÉCHÉANCE LOI 96</div>
                     <div className="text-4xl font-mono text-white mt-1">01 JUIN 2025</div>
                     <p className="text-[8px] mt-4 text-zinc-400">LES AMENDES POUR NON-CONFORMITÉ DÉBUTENT À 3 000 $ / JOUR.</p>
                  </div>

                  {/* SENTINELLE-96 Status Card */}
                  <div className="p-6 bg-black border border-white/10 rounded-2xl relative overflow-hidden group">
                     <div className="absolute top-0 left-0 w-1 h-full bg-gold-primary" />
                     <div className="flex justify-between items-start mb-4">
                        <span className="text-[8px] font-black uppercase tracking-widest text-neutral-500">SENTINELLE-96_LINK</span>
                        <div className={`w-2 h-2 rounded-full ${systemStatus?.status === 'OPERATIONAL' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                     </div>
                     <div className="space-y-2">
                        <div className="flex justify-between text-[10px]">
                           <span className="text-neutral-500 font-bold uppercase">Uptime</span>
                           <span className="text-white font-mono">24:00:00:00</span>
                        </div>
                        <div className="flex justify-between text-[10px]">
                           <span className="text-neutral-500 font-bold uppercase">Audits</span>
                           <span className="text-white font-mono">{systemStatus?.audits_completed || 0}</span>
                        </div>
                        <div className="flex justify-between text-[10px]">
                           <span className="text-neutral-500 font-bold uppercase">OpenClaw</span>
                           <span className={systemStatus?.openclaw_link?.active ? 'text-emerald-500 font-mono' : 'text-red-500 font-mono'}>
                              {systemStatus?.openclaw_link?.active ? 'CONNECTED' : 'OFFLINE'}
                           </span>
                        </div>
                        <div className="flex justify-between text-[10px]">
                           <span className="text-neutral-500 font-bold uppercase">Memory</span>
                           <span className="text-emerald-500 font-mono">SYNCHRONIZED</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
        </section>

        {/* Dynamic Results Display */}
        {scanResult && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12 animate-in fade-in slide-in-from-bottom-20 duration-1000">
             
             {/* Left: The Dossier */}
             <div className="lg:col-span-8 overflow-hidden">
                <div className="text-center mb-8 uppercase text-xs tracking-[0.5em] font-light text-white/40">- FORENSIC_REPORT_DATA -</div>
                <SkeuoDossier 
                  businessName={scanResult.businessName}
                  neq={scanResult.neq}
                  riskScore={scanResult.riskScore}
                  violations={scanResult.violations}
                />
             </div>

             {/* Right: Fine Calculator & CTA */}
             <div className="lg:col-span-4 space-y-8">
                <div className="bg-slate-50 rounded-3xl p-10 shadow-2xl border-[10px] border-slate-200 text-slate-900 border-double">
                   <h2 className="text-xl font-black uppercase text-red-700 underline decoration-double underline-offset-8 decoration-red-200">
                     Calculateur d&apos;Amendes OQLF
                   </h2>
                   
                   <div className="mt-10 space-y-6">
                      <div className="flex justify-between items-center text-xs font-bold border-b border-slate-200 pb-2">
                         <span>Échelle d&apos;Affaires (25+ emp.) :</span>
                         <span className="text-red-600 uppercase">Responsabilité Tier 3</span>
                      </div>
                      
                      <div className="py-6 border-y border-slate-200">
                         <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">RESPONSABILITÉ QUOTIDIENNE ACTUELLE</p>
                         <div className="text-6xl font-black font-mono tracking-tighter text-red-700">30 000<span className="text-xl">$</span></div>
                      </div>

                      <div className="space-y-4 pt-6">
                         <p className="text-sm font-bold leading-relaxed">
                            Chaque jour où votre passerelle française n&apos;est pas vérifiée, vous risquez la pénalité maximale lors de la vague d&apos;application OQLF 2025/2026.
                         </p>
                         <button className="w-full bg-slate-900 text-gold-primary py-5 font-black text-lg uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 hover:bg-black transition-all">
                            Protéger vos Actifs
                         </button>
                      </div>
                   </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl p-8 border border-white/10 text-center relative overflow-hidden group">
                   <div className="relative z-10">
                      <div className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400 mb-2">Remédiation Automatisée</div>
                      <h3 className="text-xl font-bold mb-4">Intégrer Max Agent</h3>
                      <p className="text-sm text-indigo-200 mb-6">Laissez Max gérer toutes les traductions et les documents d&apos;enregistrement OQLF automatiquement.</p>
                      <button className="bg-white text-indigo-900 px-8 py-3 rounded-full font-black text-xs uppercase hover:scale-105 transition-transform">
                         Passer en Pro
                      </button>
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>

    </main>
  );
}
