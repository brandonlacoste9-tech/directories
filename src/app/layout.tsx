import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Répertoire Loi 96 | Conformité Officielle Québec",
    template: "%s | Répertoire Loi 96"
  },
  description: "Le premier répertoire indépendant pour la conformité à la Loi 96 au Québec. Découvrez, auditez et protégez votre entreprise avec l'intelligence artificielle. | Official Bill 96 compliance registry for Quebec.",
  keywords: [
    "Répertoire entreprise Québec", "Conformité Loi 96", "Linguistic compliance", 
    "OQLF audit", "Bill 96 tracking", "Quebec business directory", 
    "Loi sur la langue officielle", "Francisation Québec", "Répertoire Loi 96"
  ],
  authors: [{ name: "Swarm Orchestrator - Loi 96" }],
  creator: "Répertoire Loi 96",
  publisher: "Linguistic Surveillance Swarm",
  openGraph: {
    type: 'website',
    locale: 'fr_CA',
    url: 'https://loi96repertoire.com',
    title: 'Répertoire Loi 96 | Conformité Québec',
    description: 'Surveillance autonome de la Loi 96 pour les entreprises québécoises.',
    siteName: 'Répertoire Loi 96',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Répertoire Loi 96 | Surveillance Officielle',
    description: 'Autonomous Bill 96 Compliance Tracking.',
  },
  alternates: {
    canonical: '/',
    languages: {
      'fr-CA': '/',
      'en-CA': '/en'
    }
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
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
