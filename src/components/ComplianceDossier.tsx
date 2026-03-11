// src/components/ComplianceDossier.tsx
'use client';

import React from 'react';

interface DossierProps {
  businessName: string;
  neq: string;
  riskScore: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  violations: string[];
}

export function Badge({ children, variant = 'default' }: { children: React.ReactNode, variant?: string }) {
  const styles: Record<string, React.CSSProperties> = {
    default: { background: '#1e293b', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 800 },
    critical: { background: '#dc2626', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 900, boxShadow: '0 0 10px rgba(220, 38, 38, 0.4)' },
    high: { background: '#ea580c', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 900 },
  };
  return <span style={styles[variant.toLowerCase()] || styles.default}>{children}</span>;
}

export default function ComplianceDossier({ businessName, neq, riskScore, violations }: DossierProps) {
  return (
    <div style={{ 
      position: 'relative', 
      maxWidth: '800px', 
      margin: '40px auto', 
      padding: '60px', 
      background: '#f4f1ea', 
      borderLeft: '24px solid #7f1d1d', 
      boxShadow: '0 30px 60px rgba(0,0,0,0.5), -10px 10px 20px rgba(0,0,0,0.2)',
      color: '#1e293b',
      fontFamily: 'var(--font-heading)',
      transform: 'rotate(-0.5deg)',
      backgroundImage: 'radial-gradient(#d1d5db 0.5px, transparent 0.5px)',
      backgroundSize: '24px 24px'
    }}>
      {/* Skeuomorphic Paper Clip */}
      <div style={{ 
        position: 'absolute', 
        top: '-15px', 
        right: '80px', 
        width: '12px', 
        height: '60px', 
        background: 'linear-gradient(to right, #94a3b8, #cbd5e1, #64748b)', 
        borderRadius: '10px',
        boxShadow: '2px 2px 5px rgba(0,0,0,0.3)',
        zIndex: 10
      }} />

      {/* Official Stamp Overlay (Transparent PNG Mockup) */}
      <div style={{
        position: 'absolute',
        top: '100px',
        right: '60px',
        border: '4px double #dc2626',
        color: '#dc2626',
        padding: '10px 20px',
        fontWeight: 900,
        fontSize: '1.5rem',
        textTransform: 'uppercase',
        transform: 'rotate(15deg)',
        opacity: 0.7,
        pointerEvents: 'none',
        userSelect: 'none'
      }}>
        À TRAITER URGEMMENT
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #334155', paddingBottom: '24px', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', margin: 0, textDecoration: 'underline decoration-thickness(2px)' }}>
            DOSSIER DE CONFORMITÉ : {businessName}
          </h2>
          <p style={{ marginTop: '8px', opacity: 0.7, fontWeight: 700 }}>NEQ: {neq}</p>
        </div>
        <Badge variant={riskScore.toLowerCase()}>{riskScore} RISK</Badge>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textTransform: 'uppercase', fontSize: '0.875rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #94a3b8', paddingBottom: '8px' }}>
          <span>INSPECTION DATE / DATE D&apos;INSPECTION:</span>
          <span style={{ fontWeight: 800 }}>MARCH 09, 2026</span>
        </div>
        
        <div style={{ padding: '24px', background: 'rgba(220, 38, 38, 0.05)', border: '2px dashed #dc2626', borderRadius: '4px' }}>
          <p style={{ color: '#dc2626', fontSize: '1rem', fontWeight: 900, marginBottom: '16px' }}>⚠️ CRITICAL VIOLATIONS DETECTED / MANQUEMENTS CRITIQUES:</p>
          <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '12px', margin: 0 }}>
            {violations.map((v, i) => (
              <li key={i} style={{ lineHeight: 1.4, fontWeight: 700 }}>{v}</li>
            ))}
          </ul>
        </div>
        
        <div style={{ textAlign: 'center', paddingTop: '40px' }}>
          <p style={{ marginBottom: '24px', fontSize: '0.9rem' }}>
            TOTAL ESTIMATED FINANCIAL EXPOSURE (DAILY): <br />
            <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#dc2626' }}>$3,000 - $30,000</span>
          </p>
          
          <div style={{ background: '#7f1d1d', padding: '20px 40px', display: 'inline-block', color: '#fff', borderRadius: '4px', boxShadow: '5px 5px 0 #000', cursor: 'pointer', transition: 'transform 0.1s' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 900 }}>ACTIVATE LOI 96 COMPLIANCE SHIELD</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '60px', paddingTop: '20px', borderTop: '1px solid #cbd5e1', fontSize: '0.625rem', color: '#64748b', textAlign: 'center' }}>
        REGISTRE OFFICIEL LOI 96 | AUDIT FORENSIQUE #88-2026-XQ | DIVISION QUÉBEC
      </div>
    </div>
  );
}
