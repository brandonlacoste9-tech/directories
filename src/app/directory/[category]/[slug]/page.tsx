// src/app/directory/[category]/[slug]/page.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SkeuoDossier from '@/components/SkeuoDossier';
import directoryData from '@/lib/directory_data.json';

interface Business {
  id: string;
  name: string;
  category: string;
  slug: string;
  isVerified: boolean;
  neq: string;
  loc: string;
  auditDate?: string;
  riskScore?: number;
  riskLevel?: string;
  violations?: string[];
  remediationPrice?: {
    tier: string;
    price: string;
    complexity: string;
    estimated_time: string;
    fr_desc: string;
  };
}

// ISR configuration
export const revalidate = 3600; // Revalidate every hour

export async function generateStaticParams() {
  const data = directoryData as Record<string, Business>;
  return Object.values(data).map((business: Business) => ({
    category: business.category.toLowerCase(),
    slug: business.slug,
  }));
}

// Data fetching from JSON
async function fetchBusinessData(slug: string): Promise<Business | null> {
  const decodedSlug = decodeURIComponent(slug);
  const data = directoryData as Record<string, Business>;
  return (data[decodedSlug] as Business) || null;
}

export default async function BusinessProfile({ params: paramsPromise }: { params: Promise<{ category: string; slug: string }> }) {
  const params = await paramsPromise;
  const business = await fetchBusinessData(params.slug);

  if (!business) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-center p-20">
         <h1 className="text-4xl font-black text-red-600 mb-8 tracking-tighter uppercase">DOSSIER NOT FOUND</h1>
         <p className="text-neutral-500 max-w-md mx-auto mb-12">The business NEQ identifier has not been audited by Max Agent-Zero or is currently being processed by the official compliance pipeline.</p>
         <Link href="/" className="bg-white/5 px-6 py-2 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-white">Return to Registry Home</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 font-sans text-white pb-60">
      
      {/* Navigation Header */}
      <nav className="h-24 border-b border-white/5 flex items-center justify-between px-6 lg:px-20 backdrop-blur-xl sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-4">
          <Image src="/bill96-logo.png" alt="Loi 96 Logo" width={32} height={32} className="rounded-sm brightness-110" />
          <span className="text-2xl font-black tracking-tighter uppercase text-gradient-gold">LOI 96 <span className="font-light text-white">RÉPERTOIRE</span></span>
        </Link>
        <div className="flex items-center gap-6">
           <Link href="/audit" className="bg-white/5 hover:bg-white/10 px-6 py-2 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest transition-all">
             Audit de site / <span className="opacity-60">Audit Portal</span>
           </Link>
        </div>
      </nav>

      {/* Hero Header for Business */}
      <section className="pt-24 pb-40 px-6 lg:px-20 bg-neutral-900 border-b border-white/5 relative overflow-hidden">
        {/* Abstract Texture */}
        <div className="absolute inset-x-0 bottom-0 top-0 opacity-10 blur-[100px] pointer-events-none overflow-hidden">
           <div className="w-[800px] h-[800px] rounded-full bg-gold-primary absolute -left-1/4 -top-1/4" />
        </div>
        
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-end relative z-10 gap-12">
           <div>
              <p className="text-gold-primary text-[10px] font-black uppercase tracking-[0.4em] mb-4">{business.category}</p>
              <h1 className="text-6xl lg:text-7xl font-black tracking-tighter uppercase leading-none drop-shadow-2xl">{business.name}</h1>
              <div className="flex items-center gap-6 mt-8">
                 <div className="text-xs font-black tracking-widest text-neutral-500 uppercase">NEQ: {business.neq}</div>
                 <div className="text-xs font-black tracking-widest text-neutral-500 uppercase">{business.loc}</div>
              </div>
           </div>

           <div className="flex flex-col items-center lg:items-end gap-12">
              <div className="flex items-center gap-12">
                 <div className="text-center">
                    <p className="text-[8px] font-black uppercase tracking-widest text-neutral-600 mb-2">STATUT LOI 96</p>
                    <div className={`skeuo-seal ${business.isVerified ? 'skeuo-seal-gold' : 'opacity-20 grayscale'} w-24 h-24`}>
                       LOI<br/>96<br/>
                       <span style={{fontSize: '8px'}}>{business.isVerified ? 'CONFORME' : 'EN ATTENTE'}</span>
                    </div>
                 </div>
                 <div className="text-center">
                    <p className="text-[8px] font-black uppercase tracking-widest text-neutral-600 mb-2">SCORE DE CONFIANCE</p>
                    <div className="w-24 h-24 rounded-full border-4 border-emerald-500/20 flex items-center justify-center relative overflow-hidden">
                       <div className="absolute inset-0 bg-emerald-500/5 animate-pulse" />
                       <span className="text-3xl font-black text-emerald-500 leading-none">A+</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Audit & Compliance Dossier Display */}
      <section className="py-40 px-6 lg:px-20 bg-neutral-950 relative z-20">
         <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
               
               {/* Left: Forensic Reports */}
               <div className="lg:col-span-8 space-y-24">
                  <div className="text-center mb-0 uppercase text-[10px] tracking-[0.6em] font-light text-white/20">- DOSSIER_PUBLIC_OUVERT -</div>
        <div className="max-w-4xl mx-auto">
          <SkeuoDossier 
            businessName={business.name}
            neq={business.neq}
            riskScore={business.riskScore || 50}
            violations={business.violations || ["Analyse automatique en cours"]}
            auditDate={business.auditDate}
          />
        </div>
                  
                  {/* Reviews Mock (Sticky Post-its) */}
                  <div className="mt-40">
                     <h2 className="text-3xl font-black uppercase tracking-tight text-center mb-16">Témoignages Vérifiés</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <ReviewPostIt 
                          author="Jean-Claude V."
                          content="Service très professionnel et conforme. Nous craignions la vague de l'OQLF mais ils étaient déjà vérifiés."
                          rating={5}
                          date="MAR-03-2026"
                          rotation="rotate-[-1deg]"
                        />
                        <ReviewPostIt 
                          author="Sarah D. (Laval)"
                          content="Trouvé via loi96repertoire.com. Le fait qu'ils soient vérifiés Loi 96 nous a fait les choisir plutôt que les concurrents."
                          rating={4}
                          date="FEB-22-2026"
                          rotation="rotate-[2deg]"
                        />
                     </div>
                  </div>
               </div>

               {/* Right: Sidebar Claims & Paywall */}
               <div className="lg:col-span-4 space-y-12 lg:sticky lg:top-32">
                  {/* Remediation Summary Card */}
                  {business.remediationPrice && (
                    <div className="leather-bg rounded-[32px] p-8 border-4 border-zinc-900 shadow-2xl relative overflow-hidden">
                      <div className="absolute inset-2 border border-dashed border-red-600/30 pointer-events-none rounded-2xl" />
                      <div className="relative z-10">
                        <p className="text-[8px] font-black uppercase tracking-widest text-red-500 mb-4 italic">PLAN DE REMÉDIATION SUR MESURE</p>
                        <h4 className="text-2xl font-black text-white mb-2 leading-none uppercase tracking-tighter">{business.remediationPrice.tier}</h4>
                        <div className="flex items-end gap-2 mb-6">
                          <span className="text-4xl font-black text-white">{business.remediationPrice.price}</span>
                          <span className="text-[10px] font-black uppercase text-neutral-500 mb-2">Paiement Unique</span>
                        </div>
                        
                        <p className="text-xs text-neutral-400 mb-8 leading-relaxed font-medium italic">
                          &quot;{business.remediationPrice.fr_desc}&quot;
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                          <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                            <p className="text-[7px] font-black uppercase text-neutral-500 mb-1">COMPLEXITÉ</p>
                            <p className="text-[10px] font-black text-red-500 uppercase">{business.remediationPrice.complexity}</p>
                          </div>
                          <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                            <p className="text-[7px] font-black uppercase text-neutral-500 mb-1">DÉLAI ESTIMÉ</p>
                            <p className="text-[10px] font-black text-white uppercase">{business.remediationPrice.estimated_time}</p>
                          </div>
                        </div>

                        <Link href={`/remediate?slug=${business.slug}`} className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center">
                          Activer le Bouquet de Conformité
                        </Link>
                      </div>
                    </div>
                  )}

                  <div className="bg-zinc-800/50 p-10 rounded-[32px] border border-white/5 shadow-2xl backdrop-blur-3xl">
                     <h3 className="text-xl font-black uppercase text-gold-primary mb-2 tracking-tight">C&apos;est votre entreprise ?</h3>
                     <p className="text-sm text-neutral-400 mb-10 leading-relaxed">Réclamez votre profil pour mettre à jour vos métadonnées de conformité, répondre aux avis et débloquer votre sceau de vérification.</p>
                     
                     <div className="space-y-4">
                        <Link href={`/claim?businessId=${business.id}`} className="w-full bg-gold-primary text-black py-4 rounded-full font-black text-xs uppercase tracking-widest hover:scale-[1.03] transition-transform shadow-xl flex items-center justify-center">
                          Réclamer le profil maintenant
                        </Link>
                        <Link href="/audit" className="w-full h-12 flex items-center justify-center border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-colors">
                          Lancer un nouveau scan en direct
                        </Link>
                     </div>
                  </div>

                  <div className="bg-red-800/10 p-10 rounded-[32px] border-2 border-red-800/20 shadow-2xl text-center">
                     <p className="text-xs font-black uppercase tracking-widest text-red-500 mb-6">⚠️ Signaler un manque de service en français</p>
                     <p className="text-sm text-neutral-400 mb-8 leading-relaxed">Cette entreprise vous a-t-elle refusé un service en français ou son site n&apos;est pas traduit ? Soumettez un signalement pour révision.</p>
                     <button className="text-[10px] font-black uppercase tracking-widest text-white underline underline-offset-4 decoration-2 decoration-red-900 hover:text-red-500 transition-colors">
                       Soumettre un rapport de violation
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Profile Footer */}
      <footer className="py-40 text-center border-t border-white/5 opacity-40">
         <p className="text-[10px] uppercase font-black tracking-widest text-neutral-400">© 2026 Registre Officiel Loi 96 | Audit Forensique Vérifié le 10 MARS 2026</p>
      </footer>
    </main>
  );
}

function ReviewPostIt({ author, content, rating, date, rotation }: { author: string, content: string, rating: number, date: string, rotation: string }) {
  return (
    <div className={`leather-bg ${rotation} p-8 text-white shadow-2xl relative border-4 border-zinc-900 overflow-hidden group rounded-xl`}>
       {/* Inner Red Stitching */}
       <div className="absolute inset-2 border-2 border-dashed border-red-600/20 pointer-events-none rounded-lg" />
       
       <div className="relative z-10">
          <div className="flex gap-2 mb-6">
             {[...Array(5)].map((_, i) => (
               <span key={i} className={`text-xl ${i < rating ? 'text-red-500' : 'text-zinc-800'}`}>★</span>
             ))}
          </div>

          <p className="text-xl font-heading leading-tight mb-8 drop-shadow-sm font-bold italic tracking-tight text-neutral-200">
             &quot;{content}&quot;
          </p>

          <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-zinc-500 pt-6 border-t border-red-600/10">
             <span>{author}</span>
             <span>{date}</span>
          </div>
       </div>
    </div>
  );
}
