import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Zyeuté Répertoire | Conformité Loi 96 Québec",
    template: "%s | Zyeuté Répertoire"
  },
  description: "Zyeuté est le premier répertoire au monde pour la conformité à la Loi 96 au Québec. Découvrez, auditez et protégez votre entreprise avec l'intelligence artificielle. | The premier Bill 96 compliance directory in Quebec.",
  keywords: [
    "Répertoire entreprise Québec", "Conformité Loi 96", "Linguistic compliance", 
    "OQLF audit", "Bill 96 tracking", "Quebec business directory", 
    "Loi sur la langue officielle", "Francisation Québec", "Zyeuté"
  ],
  authors: [{ name: "Zyeuté Swarm Orchestrator" }],
  creator: "Zyeuté",
  publisher: "Zyeuté Linguistic Swarm",
  openGraph: {
    type: 'website',
    locale: 'fr_CA',
    url: 'https://loi96repertoire.com',
    title: 'Zyeuté Répertoire | Conformité Loi 96',
    description: 'Surveillance autonome de la Loi 96 pour les entreprises québécoises.',
    siteName: 'Zyeuté',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zyeuté Répertoire | Loi 96',
    description: 'Autonomous Bill 96 Compliance Tracking.',
  },
  alternates: {
    canonical: '/',
    languages: {
      'fr-CA': '/',
      'en-CA': '/en'
    }
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr-CA">
      <body>{children}</body>
    </html>
  );
}
