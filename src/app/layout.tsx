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
  // Updated PWA configuration with modern approach
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Dompet Keluarga',
  },
  // Add modern web app capabilities
  applicationName: 'Dompet Keluarga',
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
        {/* Modern meta tag for web app capability */}
        <meta name="mobile-web-app-capable" content="yes" />
        {/* Format detection for telephone numbers */}
        <meta name="format-detection" content="telephone=no" />
        {/* Additional meta tags for better PWA support */}
        <meta name="apple-mobile-web-app-title" content="Dompet Keluarga" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
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