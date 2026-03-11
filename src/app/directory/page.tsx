'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import directoryData from '@/lib/directory_data.json';

interface BusinessItem {
  id: string;
  name: string;
  category: string;
  slug: string;
  isVerified: boolean;
  neq: string;
  loc: string;
}

export default function DirectoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const businesses = Object.values(directoryData) as BusinessItem[];

  const filteredBusinesses = businesses.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.neq.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-neutral-950 font-sans text-white pb-60">
      {/* Navigation Header */}
      <nav className="h-24 border-b border-white/5 flex items-center justify-between px-6 lg:px-20 backdrop-blur-xl sticky top-0 z-50 bg-black/60">
        <Link href="/" className="text-2xl font-black tracking-tighter uppercase text-gradient-gold">ZYEUTÉ <span className="font-light text-white">RÉPERTOIRE</span></Link>
        <div className="flex items-center gap-6">
           <Link href="/audit" className="bg-white/5 hover:bg-white/10 px-6 py-2 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest transition-all">
             Audit de site / <span className="opacity-60">Audit Portal</span>
           </Link>
        </div>
      </nav>

      <section className="pt-24 pb-20 px-6 lg:px-20 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
          <div>
            <h1 className="text-5xl font-black tracking-tighter uppercase">Archives du Registre</h1>
            <p className="text-neutral-500 mt-2 uppercase text-xs font-black tracking-widest">Base de données Alpha | Division Québec 2026</p>
          </div>
          
          <div className="w-full md:w-96 relative">
            <input 
              type="text" 
              placeholder="Rechercher par nom ou NEQ..."
              className="w-full bg-zinc-900 border border-white/5 rounded-xl py-4 px-6 text-sm font-bold text-white focus:border-gold-primary outline-none transition-all shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute right-4 top-4 opacity-20">🔍</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBusinesses.map((item) => (
            <Link 
              href={`/directory/${item.category.toLowerCase()}/${item.slug}`} 
              key={item.id} 
              className="skeuo-card group border border-white/5 p-8 rounded-3xl hover:bg-zinc-900/50 transition-all hover:scale-[1.02]"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-2xl opacity-40">
                  {item.category === 'CONSTRUCTION' ? '🏗️' : '🏢'}
                </div>
                <div className={`skeuo-seal skeuo-seal-gold w-14 h-14 text-[7px] ${!item.isVerified ? 'opacity-10 grayscale' : ''}`}>
                  LOI<br/>96<br/>
                  <span style={{fontSize: '5px'}}>{item.isVerified ? 'VÉRIFIÉ' : 'EN ATTENTE'}</span>
                </div>
              </div>
              <h4 className="text-xl font-black uppercase mb-2 group-hover:text-gold-primary transition-colors">{item.name}</h4>
              <p className="text-xs text-neutral-500 font-bold mb-6 tracking-widest">{item.category}</p>
              <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.2em] text-neutral-600 pt-6 border-t border-white/5">
                <span>NEQ: {item.neq}</span>
                <span>{item.loc}</span>
              </div>
            </Link>
          ))}
        </div>

        {filteredBusinesses.length === 0 && (
          <div className="text-center py-40 bg-zinc-900/20 rounded-[40px] border border-dashed border-white/5">
            <p className="text-neutral-600 font-black uppercase tracking-widest text-sm">Aucune entreprise trouvée pour &quot;{searchTerm}&quot;</p>
          </div>
        )}
      </section>

      <footer className="py-20 text-center opacity-20">
        <p className="text-[10px] uppercase font-black tracking-widest">Vérifié par le Pipeline de Sécurité Max Agent-Zero</p>
      </footer>
    </main>
  );
}
