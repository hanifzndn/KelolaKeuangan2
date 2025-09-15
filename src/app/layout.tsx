import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navigation from '../components/Navigation';
import { FinanceProvider } from '../context/FinanceContext';
import { AuthProvider } from '../context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dompet Keluarga - Kelola Keuangan',
  description: 'Aplikasi pengelolaan keuangan keluarga',
  manifest: '/manifest.json',
  themeColor: '#3b82f6',
  viewport: 'minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover',
  icons: {
    icon: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Dompet Keluarga',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <FinanceProvider>
            <Navigation />
            <div className="min-h-screen bg-gray-50">
              {children}
            </div>
          </FinanceProvider>
        </AuthProvider>
      </body>
    </html>
  );
}