'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function Navigation() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  
  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Akun', path: '/accounts' },
    { name: 'Bills', path: '/bills' },
    { name: 'Laporan', path: '/reports' },
    { name: 'Tentang', path: '/about' },
  ];
  
  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">Dompet Keluarga</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    pathname === item.path
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              {user && (
                <Link
                  href="/profile"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    pathname === '/profile'
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Profil
                </Link>
              )}
            </div>
          </div>
          
          {user && (
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <span className="text-sm text-gray-700 mr-4">Hai, {user.name}</span>
                  <button
                    onClick={logout}
                    className="text-sm text-gray-700 hover:text-gray-900"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}