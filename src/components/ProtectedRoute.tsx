'use client';

import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import ClipLoader from 'react-spinners/ClipLoader';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is not authenticated, redirect to login
    if (!isAuthenticated && user === null) {
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

  // Show loading spinner while checking authentication
  if (isAuthenticated === false && user === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ClipLoader color="#3b82f6" size={50} />
      </div>
    );
  }

  // If user is authenticated, render children
  if (isAuthenticated && user) {
    return <>{children}</>;
  }

  // Default loading state
  return (
    <div className="min-h-screen flex items-center justify-center">
      <ClipLoader color="#3b82f6" size={50} />
    </div>
  );
}