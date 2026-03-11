'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import directoryData from '@/lib/directory_data.json';

interface Business {
  id: string;
  name: string;
  category: string;
  slug: string;
  isVerified: boolean;
  neq: string;
  loc: string;
}

function ClaimContent() {
  const searchParams = useSearchParams();
  const businessId = searchParams.get('businessId');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find business by ID
  const business = Object.values(directoryData).find(b => b.id === businessId) as Business | undefined;

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call to checkout
    try {
      const resp = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId, planType: 'PREMIUM_VERIFIED' })
      });
      const data = await resp.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen leather-bg py-24 px-6 lg:px-20 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        {/* Navigation */}
        <div className="mb-12 flex justify-between items-center bg-white/5 backdrop-blur-3xl p-6 rounded-full border border-white/10">
           <Link href="/" className="text-xl font-black tracking-tighter uppercase text-gradient-gold">ZYEUTÉ<span className="font-light text-white">.QC</span></Link>
           <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-white transition-colors">Cancel & Return</Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
           {/* Left: Forensic Claim Form */}
           <div className="lg:col-span-7">
              <div className="bg-zinc-900 border-4 border-zinc-800 rounded-[40px] p-12 relative shadow-2xl overflow-hidden">
                 {/* Red Stitching Detail */}
                 <div className="absolute inset-4 border-2 border-dashed border-red-600/20 rounded-[30px] pointer-events-none" />
                 
                 <div className="relative z-10">
                    <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 italic">Dossier Claim</h1>
                    <p className="text-xs font-black uppercase tracking-[0.4em] text-red-500 mb-12">Bill 96 Linguistic Enforcement Loop</p>
                    
                    <form onSubmit={handleClaim} className="space-y-8">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Business Registry Identification</label>
                          <div className="bg-black/40 border border-white/5 p-4 rounded-xl text-lg font-bold text-neutral-300">
                             {business ? business.name : "UNKNOWN_ENTITY"}
                          </div>
                       </div>

                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">NEQ / Registration Number</label>
                          <div className="bg-black/40 border border-white/5 p-4 rounded-xl font-mono text-sm text-neutral-500">
                             {business ? business.neq : "0000-0000-00"}
                          </div>
                       </div>

                       <div className="space-y-6 pt-6">
                          <p className="text-sm text-neutral-400 leading-relaxed font-medium">To finalize your claim and trigger the <span className="text-white">Linguistic Compliance Seal</span>, you must verify ownership via the Zyeuté secure checkout.</p>
                          
                          <div className="flex flex-col gap-4">
                             <div className="flex items-center gap-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">✓</div>
                                <div className="text-xs font-bold uppercase tracking-wide text-emerald-500">Verified Badge Eligibility Detected</div>
                             </div>
                             
                             <button 
                               type="submit"
                               disabled={isSubmitting}
                               className="w-full bg-gold-primary text-black py-6 rounded-full font-black text-sm uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(212,175,55,0.3)] disabled:opacity-50"
                             >
                                {isSubmitting ? "INITIALIZING SECURE LINK..." : "STRIKE CHECKOUT & VERIFY"}
                             </button>
                          </div>
                       </div>
                    </form>
                 </div>
              </div>
           </div>

           {/* Right: Sidebar Visuals */}
           <div className="lg:col-span-5 space-y-8">
              <div className="bg-zinc-800/50 p-8 rounded-[32px] border border-white/5 backdrop-blur-xl">
                 <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gold-primary mb-6">Premium Verification</h3>
                 <ul className="space-y-6">
                    <BenefitItem icon="🛡️" title="OQLF Safe-Guard" desc="Protection against direct linguistic complaints." />
                    <BenefitItem icon="📜" title="Certificate Plate" desc="Digital certificate suitable for office display." />
                    <BenefitItem icon="⚡" title="Daily Re-Scan" desc="Real-time monitoring of metadata compliance." />
                 </ul>
              </div>

              <div className="p-8 border-2 border-dashed border-red-600/30 rounded-[32px] text-center">
                 <p className="text-[9px] font-black uppercase tracking-widest text-red-500 mb-2">June 1, 2025 Cliff</p>
                 <p className="text-[11px] text-neutral-500 leading-tight">Businesses with 25+ staff failing to register face fines up to $30,000 CAD per day.</p>
              </div>
           </div>
        </div>
      </div>
    </main>
  );
}

export default function ClaimPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen leather-bg py-24 px-6 lg:px-20 flex items-center justify-center text-white font-black uppercase tracking-widest">
        Loading Dossier...
      </main>
    }>
      <ClaimContent />
    </Suspense>
  );
}


function BenefitItem({ icon, title, desc }: { icon: string, title: string, desc: string }) {
  return (
    <li className="flex gap-4">
       <span className="text-xl">{icon}</span>
       <div>
          <p className="text-[10px] font-black uppercase text-white mb-1">{title}</p>
          <p className="text-[10px] text-neutral-500 uppercase font-bold">{desc}</p>
       </div>
    </li>
  );
}

