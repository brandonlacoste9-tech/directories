'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import directoryData from '@/lib/directory_data.json';

interface BusinessItem {
  id: string;
  name: string;
  category: string;
  slug: string;
  isVerified: boolean;
  neq: string;
  loc: string;
  auditDate: string;
  riskScore?: number;
  domain?: string;
}

export default function Home() {
  const categories = [
    { fr: "Construction", en: "Construction" },
    { fr: "Services", en: "Services" },
    { fr: "Commerce", en: "Retail" },
    { fr: "Technologie", en: "Technology" }
  ];
  
  const businesses = Object.values(directoryData) as BusinessItem[];
  
  const handleCheckout = async (slug: string, tier: string) => {
    try {
       const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug, planType: tier.split(' / ')[0] })
       });
       const data = await res.json();
       if (data.url) {
          window.location.assign(data.url);
       }
    } catch (e) {
       console.error("Checkout failed", e);
    }
  };
  
  return (
    <main className="min-h-screen leather-bg font-sans text-white overflow-x-hidden selection:bg-gold-primary selection:text-black flex flex-col items-center">
      
      {/* Navigation Header - Bilingual */}
      <nav className="w-full h-24 border-b border-red-600/20 flex items-center justify-between px-6 lg:px-20 backdrop-blur-3xl sticky top-0 z-50 bg-black/60 shadow-2xl">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-4">
            <Image src="/bill96-logo.png" alt="Loi 96 Logo" width={40} height={40} className="rounded-sm shadow-2xl brightness-125" />
            <h1 className="text-2xl font-black tracking-tighter uppercase text-gradient-gold">LOI 96 <span className="font-light text-white">RÉPERTOIRE</span></h1>
          </Link>
          <div className="hidden lg:flex gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500">
             {categories.map((cat) => (
                <a key={cat.fr} href={`#${cat.fr.toLowerCase()}`} className="hover:text-gold-primary transition-colors cursor-pointer">
                  {cat.fr} <span className="opacity-30">/ {cat.en}</span>
                </a>
             ))}
          </div>
        </div>
        <div className="flex items-center gap-6">
           <Link href="/audit" className="bg-white/5 hover:bg-white/10 px-6 py-2 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest transition-all">
             Portail d&apos;Audit / <span className="opacity-60 text-[8px]">Audit Portal</span>
           </Link>
           <Link href="/swarm" className="bg-red-600/10 hover:bg-red-600/20 border border-red-600/30 text-red-500 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all">
             Contrôle Swarm
           </Link>
        </div>
      </nav>

      <div className="w-full max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section - French First */}
        <header className="py-20 text-center relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold-primary/5 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="inline-block bg-red-600/10 border border-red-600/20 text-red-500 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8">
            ALERTE : VAGUE D&apos;APPLICATION DE LA LOI 96 - 2026
          </div>
          
          <h2 className="text-6xl lg:text-8xl font-black tracking-tighter uppercase leading-[0.9] mb-8">
            LE REGISTRE <br />
            <span className="text-transparent" style={{ WebkitTextStroke: '1px var(--gold-primary)' }}>Linguistique Québécois</span>
          </h2>
          
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto mb-12">
            Le premier répertoire de conformité autonome au monde. Protégez votre entreprise contre les amendes linguistiques prédatrices grâce à la surveillance forensique du Répertoire Loi 96.
            <br/><span className="text-sm opacity-50 mt-4 block italic">The world&apos;s first autonomous compliance directory. Protect your enterprise from linguistic fines.</span>
          </p>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto bg-zinc-950 border border-white/10 p-2 rounded-3xl flex items-center shadow-2xl">
             <input 
               type="text" 
               placeholder="Rechercher par NEQ ou Nom d'entreprise..."
               className="bg-transparent flex-1 px-6 py-4 text-lg font-bold outline-none placeholder:text-neutral-700" 
             />
             <button className="bg-gold-primary text-black w-14 h-14 rounded-2xl flex items-center justify-center text-xl hover:scale-105 transition-transform active:scale-95">
               🔍
             </button>
          </div>
        </header>
        {/* Live Metrics Radar */}
        <section className="py-12 px-8 bg-zinc-900/50 border border-white/5 rounded-[40px] mb-20 backdrop-blur-xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <div className="w-32 h-32 border-4 border-red-600 rounded-full animate-ping" />
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10 text-center md:text-left">
              <div className="space-y-2">
                 <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em]">Audit Total</span>
                 <div className="text-4xl font-black text-white tabular-nums">2,842</div>
                 <div className="h-1 w-12 bg-gold-primary rounded-full" />
              </div>
              <div className="space-y-2">
                 <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em]">Risque Détecté</span>
                 <div className="text-4xl font-black text-red-500 tabular-nums">74%</div>
                 <div className="h-1 w-12 bg-red-600 rounded-full" />
              </div>
              <div className="space-y-2">
                 <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em]">Économies Potentielles (Amendes)</span>
                 <div className="text-4xl font-black text-white tabular-nums">1.2M <span className="text-lg text-neutral-600 font-bold">$</span></div>
                 <div className="h-1 w-12 bg-emerald-500 rounded-full" />
              </div>
              <div className="flex flex-col justify-center">
                 <div className="bg-red-600/20 text-red-500 text-[9px] font-black px-4 py-2 rounded-xl mb-2 flex items-center gap-2 border border-red-600/30">
                    <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                    RADAR ACTIF : SCAN EN COURS...
                 </div>
                 <span className="text-[8px] font-bold text-neutral-700 uppercase tracking-widest pl-2">Sync: Montréal_HQ_01</span>
              </div>
           </div>
        </section>

        {/* Pricing Tiers Section */}
        <section className="py-20 border-t border-white/5">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-black uppercase tracking-tight mb-4">FORFAITS DE CONFORMITÉ / <span className="text-neutral-600">PRICING TIERS</span></h3>
            <p className="text-neutral-500 font-bold uppercase text-xs tracking-widest">Calculés selon la complexité et le risque / Based on complexity & risk</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PricingCard 
              tier="BOUCLIER" 
              sub="SHIELD" 
              price="49$" 
              duration="24h"
              description="Mise à jour rapide des balises méta, audit de visibilité et correction des erreurs linguistiques mineures."
              features={["Audit de base", "Tags SEO FR", "Rapport de risque"]}
              color="emerald"
            />
            <PricingCard 
              tier="SENTINELLE" 
              sub="SENTINEL" 
              price="199$+" 
              duration="6h"
              description="Conformité standard : Traductions complètes, SEO localisé et Politiques de confidentialité conformes à la Loi 25/96."
              features={["Audit complet", "Traductions UI", "Politiques légales", "Dossier OQLF"]}
              featured={true}
            />
            <PricingCard 
              tier="FORTERESSE" 
              sub="FORTRESS" 
              price="499$+" 
              duration="Instant / 4h"
              description="Remédiation complète incluant défense légale, infrastructure bilingue et protection contre les amendes de l'OQLF."
              features={["Remédiation Swarm", "Liaison API", "Certificat de conformité", "Expertise Prioritaire"]}
              color="red"
            />
          </div>
        </section>

        {/* Featured Directory Grid */}
        <section className="mt-20">
          <div className="flex justify-between items-end mb-12">
             <div>
                <h3 className="text-3xl font-black uppercase tracking-tight">RÉPERTOIRE VEDETTE</h3>
                <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest mt-2">Recently analyzed by Sentinelle-96 v2.0</p>
             </div>
             <Link href="/archive" className="text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-white pb-1 border-b border-transparent hover:border-white transition-all">
                CONSULTER LES ARCHIVES &rarr;
             </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {businesses.slice(0, 12).map((biz) => {
                 const fullRecord = (directoryData as Record<string, any>)[biz.slug] || {};
                 const remediation = fullRecord.remediationPrice || {};
                 const risk = fullRecord.riskScore || 0;
                 return (
                    <div 
                       key={biz.id} 
                       onClick={() => handleCheckout(biz.slug, remediation.tier || 'STANDARD')}
                       className="skeuo-card group cursor-pointer hover:scale-[1.02] transition-all active:scale-95"
                    >
                       <div className="flex justify-between items-start mb-10">
                          <div className="w-12 h-12 bg-black/40 rounded-xl flex items-center justify-center text-2xl border border-white/5">
                             {biz.category === 'CONSTRUCTION' ? '🏗️' : biz.category === 'SERVICES' ? '🏢' : '🏬'}
                          </div>
                          <div className={`skeuo-seal overflow-hidden text-[8px] p-2 leading-none font-black ${risk > 50 ? 'skeuo-seal-red text-red-100' : 'skeuo-seal-gold'}`}>
                             RISQUE<br/><span className="text-[10px] mt-1 block">{risk}%</span>
                          </div>
                       </div>
                       
                       <h4 className="text-xl font-black uppercase tracking-tight mb-1 group-hover:text-gold-primary transition-colors">{biz.name}</h4>
                       <p className="text-[10px] font-black uppercase text-neutral-500 tracking-widest mb-6">
                          {remediation.tier ? remediation.tier.split(' / ')[0] : biz.category}
                       </p>
                       
                       {remediation.price && (
                          <div className="mb-6 p-3 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center text-[10px] uppercase font-black">
                             <span className="opacity-40">Plan :</span>
                             <span className="text-gold-primary">{remediation.price}</span>
                          </div>
                       )}

                       <div className="flex justify-between items-center text-[9px] font-bold text-neutral-600 border-t border-white/5 pt-4">
                          <span>NEQ: {biz.neq}</span>
                          <div className="flex items-center gap-3">
                             <span className={risk > 50 ? "text-red-500 font-black" : "text-emerald-500"}>
                                {risk > 50 ? "ACTION REQUISE" : "EN RÈGLE"}
                             </span>
                             <Link 
                               href={`/audit?target=${biz.domain}`}
                               className="bg-white/5 px-2 py-1 rounded text-white hover:bg-white/10 transition-all border border-white/5"
                             >
                                Remédier &rarr;
                             </Link>
                          </div>
                       </div>
                    </div>
                 );
              })}
          </div>
        </section>
      </div>

      <footer className="w-full py-12 border-t border-white/5 text-center mt-20">
         <p className="text-[10px] font-black uppercase tracking-[0.5em] text-neutral-600">
            REGISTRE OFFICIEL LOI 96 | © 2026 QUÉBEC CANADA
         </p>
      </footer>
    </main>
  );
}

interface PricingCardProps {
  tier: string;
  sub: string;
  price: string;
  duration: string;
  description: string;
  features: string[];
  color?: "gold" | "red" | "emerald";
  featured?: boolean;
}

function PricingCard({ tier, sub, price, duration, description, features, color = "gold", featured = false }: PricingCardProps) {
  const accent = color === 'red' ? 'border-red-600/30' : color === 'emerald' ? 'border-emerald-600/30' : 'border-gold-primary/30';
  const textAccent = color === 'red' ? 'text-red-500' : color === 'emerald' ? 'text-emerald-500' : 'text-gold-primary';

  return (
    <div className={`bg-zinc-950 border ${featured ? accent : 'border-white/5'} p-10 rounded-[32px] relative flex flex-col items-center justify-between hover:scale-105 transition-all shadow-2xl`}>
      {featured && <div className="absolute -top-4 bg-gold-primary text-black text-[8px] font-black px-4 py-1 rounded-full uppercase tracking-widest">Le Plus Populaire / Most Popular</div>}
      <div className="text-center w-full">
        <h4 className="text-2xl font-black uppercase tracking-tighter mb-1">{tier}</h4>
        <div className="text-[8px] opacity-40 uppercase font-black tracking-widest mb-8">{sub}</div>
        <div className={`text-5xl font-black mb-1 ${textAccent}`}>{price}</div>
        <div className="text-[8px] opacity-40 uppercase font-black tracking-widest mb-6">Délai : {duration} / TAT</div>
        <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-tight leading-relaxed mb-8 px-4 h-12 flex items-center justify-center">
          {description}
        </p>
      </div>
      <ul className="w-full border-t border-white/5 pt-8 space-y-4 mb-10">
        {features.map((f: string) => (
          <li key={f} className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-3">
            <span className={textAccent}>✔</span> {f}
          </li>
        ))}
      </ul>
      <button className={`w-full py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${featured ? 'bg-gold-primary text-black hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]' : 'bg-white/5 text-white hover:bg-white/10'}`}>
        Choisir ce forfait
      </button>
    </div>
  );
}
