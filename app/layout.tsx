import type { Metadata } from 'next';
import { Outfit, IBM_Plex_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-ibm',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Ohana Recovery — Meeting System',
  description: 'Live meeting management for Ohana Recovery Core Organizational Planning Meetings',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${ibmPlexSans.variable} ${jetbrainsMono.variable} h-full`}>
      <body className="h-full antialiased" style={{ fontFamily: 'var(--font-ibm), "IBM Plex Sans", sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
