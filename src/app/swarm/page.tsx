'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface SwarmLead {
  name: string;
  domain: string;
  risk: string;
  score: number;
  slug?: string;
}

interface SystemStatus {
  status: string;
  audits_completed: number;
  active_swarms: string[];
  openclaw_link?: {
    active: boolean;
    version?: string;
  };
  recent_tasks: { time: string; target: string; action: string }[];
}

export default function SwarmPage() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [leads, setLeads] = useState<SwarmLead[]>([]);
  const [sector, setSector] = useState('Construction');

  const fetchStatus = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/status');
      const data = await res.json();
      setStatus(data);
    } catch (e) {
      console.error("Status fetch failed", e);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const deploySwarm = async () => {
    setIsDeploying(true);
    try {
      const res = await fetch(`http://localhost:8000/api/swarm/deploy?sector=${sector}`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.status === 'SUCCESS') {
        setLeads(data.leads);
        fetchStatus();
      }
    } catch (e) {
      console.error("Swarm deployment failed", e);
      alert("Swarm deployment failed. Ensure backend is running on port 8000.");
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-red-600/30">
      <nav className="border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
           <Link href="/" className="flex items-center gap-4 group">
             <Image src="/bill96-logo.png" alt="Loi 96 Logo" width={36} height={36} className="rounded-md shadow-2xl brightness-125 group-hover:scale-110 transition-transform" />
           </Link>
           <div>
              <h1 className="text-xl font-black tracking-tighter uppercase">SENTINELLE-96 <span className="text-red-600">v2.0</span></h1>
              <p className="text-[10px] text-neutral-500 font-bold tracking-widest uppercase">Orchestrateur d&apos;Essaim Autonome</p>
           </div>
        </div>
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${status ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                {status ? 'LIEN_ACTIF' : 'HORS_LIGNE'}
              </span>
           </div>
           <Link href="/audit" className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all">
              Portail d&apos;Audit
           </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-neutral-900/50 border border-white/10 rounded-[32px] p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <span className="text-9xl font-black italic">SWARM</span>
            </div>
            <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
               <span className="w-2 h-8 bg-red-600 rounded-full" />
               DÉPLOIEMENT DE MISSION
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
               <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-neutral-500 tracking-widest">Secteur Cible</label>
                  <select 
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-2xl p-4 text-sm font-bold focus:border-red-600 outline-none transition-all"
                  >
                    <option value="Construction">Construction</option>
                    <option value="Technology">Technologie</option>
                    <option value="Hospitality">Hôtellerie</option>
                    <option value="Retail">Commerce de détail</option>
                    <option value="Legal">Juridique</option>
                  </select>
               </div>
               <button 
                onClick={deploySwarm}
                disabled={isDeploying}
                className={`group relative overflow-hidden px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-2xl ${isDeploying ? 'bg-zinc-800 text-zinc-500' : 'bg-red-600 hover:bg-red-700 text-white hover:scale-[1.02] active:scale-95'}`}
               >
                 <span className="relative z-10">{isDeploying ? 'ÉCHAUFFEMENT DES MOTEURS...' : 'DÉPLOYER L\'ESSAIM LINGUISTIQUE'}</span>
                 {!isDeploying && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />}
               </button>
            </div>
            {isDeploying && (
              <div className="mt-12 space-y-6 animate-in fade-in duration-500">
                <div className="p-4 bg-red-600/10 border border-red-600/20 rounded-xl flex items-center gap-4 text-red-500">
                   <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                   <span className="text-xs font-bold uppercase tracking-widest">Scrutin actif en cours...</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-red-600 animate-progress" style={{ width: '60%' }} />
                </div>
              </div>
            )}
          </section>

          {leads.length > 0 && (
            <section className="bg-neutral-900 border border-white/10 rounded-[32px] overflow-hidden animate-in slide-in-from-bottom-8 duration-700">
               <div className="p-8 border-b border-white/5 bg-white/5">
                  <h3 className="font-black uppercase tracking-widest text-xs text-neutral-400">Nouveaux Résultats de Découverte</h3>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-black/50 text-[10px] font-black uppercase tracking-widest text-neutral-500 border-b border-white/5">
                      <tr>
                        <th className="px-8 py-4">Nom de l&apos;Entité</th>
                        <th className="px-8 py-4">Niveau de Risque</th>
                        <th className="px-8 py-4">Domaine</th>
                        <th className="px-8 py-4">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm font-bold">
                       {leads.map((lead, i) => (
                         <tr key={i} className="hover:bg-white/5 transition-colors group">
                           <td className="px-8 py-6 text-white text-xs">{lead.name}</td>
                           <td className="px-8 py-6">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${lead.risk === 'HIGH' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'}`}>
                                 {lead.risk} ({lead.score})
                              </span>
                           </td>
                           <td className="px-8 py-6 text-neutral-400 font-mono text-xs">{lead.domain}</td>
                           <td className="px-8 py-6">
                              <div className="flex gap-4">
                                 <button className="text-red-500 hover:text-red-400 uppercase text-[10px] font-black tracking-widest transition-all">
                                    Préparer Approche
                                 </button>
                                 <Link 
                                   href={`/audit?target=${lead.domain}`}
                                   className="text-emerald-500 hover:text-emerald-400 uppercase text-[10px] font-black tracking-widest transition-all"
                                 >
                                    Remédier
                                 </Link>
                              </div>
                           </td>
                         </tr>
                       ))}
                    </tbody>
                  </table>
               </div>
            </section>
          )}

          <section className="bg-black border border-white/10 rounded-[32px] p-8">
             <h3 className="text-xs font-black uppercase tracking-widest text-neutral-500 mb-8">Journal des Agents</h3>
             <div className="space-y-4">
                {status?.recent_tasks.map((task, i) => (
                   <div key={i} className="flex gap-6 items-start p-4 hover:bg-white/5 rounded-2xl transition-colors border-l-2 border-transparent hover:border-red-600 group">
                      <span className="text-[10px] font-mono text-neutral-600 pt-1">{new Date(task.time).toLocaleTimeString()}</span>
                      <div className="flex-1">
                         <div className="text-xs font-black uppercase tracking-widest text-white group-hover:text-red-500 transition-colors">
                            {task.action}
                         </div>
                         <div className="text-[10px] font-bold text-neutral-500 mt-1">{task.target}</div>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-emerald-500/20" />
                   </div>
                )) || <p className="text-neutral-600 text-xs italic">En attente de télémétrie...</p>}
             </div>
          </section>
        </div>

        <div className="space-y-8">
           <div className="bg-gradient-to-br from-red-600 to-red-900 p-[1px] rounded-[32px]">
              <div className="bg-[#0a0a0a] rounded-[31px] p-8 h-full">
                 <div className="flex justify-between items-start mb-6">
                    <h3 className="font-black uppercase tracking-tighter text-2xl">L&apos;ÂME</h3>
                    <div className="p-2 bg-red-600/10 rounded-lg">
                       <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    </div>
                 </div>
                 <p className="text-sm font-bold text-neutral-400 leading-relaxed mb-6 italic">
                   &quot;Identité par le code. Autorité par la conformité. Nous protégeons l&apos;héritage linguistique du Québec par des boucles agentiques imparables.&quot;
                 </p>
                 <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black uppercase">
                       <span className="text-neutral-500">Alignement</span>
                       <span className="text-white">Chaotique Loyal</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-black uppercase">
                       <span className="text-neutral-500">Modèle Principal</span>
                       <span className="text-emerald-500">Ollama (DeepSeek)</span>
                    </div>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 gap-4">
              <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6">
                 <div className="text-[10px] font-black uppercase text-neutral-500 mb-2">Engagements Totaux</div>
                 <div className="text-4xl font-black">{status?.audits_completed || 0}</div>
              </div>
              <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6">
                 <div className="text-[10px] font-black uppercase text-neutral-500 mb-2">Essaims Actifs</div>
                 <div className="flex gap-2 mt-2">
                    {status?.active_swarms.map((s, i) => (
                      <span key={i} className="bg-white/5 border border-white/10 px-2 py-1 rounded text-[8px] font-black uppercase">{s}</span>
                    ))}
                 </div>
              </div>
           </div>

           <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 relative overflow-hidden">
             {status?.openclaw_link?.active ? (
                <div className="animate-pulse absolute top-4 right-4 w-2 h-2 bg-emerald-500 rounded-full" />
             ) : (
                <div className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full" />
             )}
             <h3 className="text-xs font-black uppercase tracking-widest text-neutral-500 mb-4">Passerelle OpenClaw</h3>
             <div className="space-y-4">
                <div className="p-4 bg-black rounded-xl font-mono text-[10px] text-emerald-500/80">
                   {status?.openclaw_link?.version || "En attente de liaison..."}
                </div>
                {!status?.openclaw_link?.active && (
                   <p className="text-[10px] text-red-500 uppercase font-black tracking-widest leading-tight">
                     Échec du handshake. Assurez-vous qu&apos;OpenClaw tourne sur le port 18789.
                   </p>
                )}
             </div>
           </div>
        </div>
      </div>
    </main>
  );
}
