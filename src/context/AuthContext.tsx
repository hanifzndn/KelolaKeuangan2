// src/context/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { signUp, signIn, signOut, getCurrentUser } from '../lib/supabaseData';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
  });

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setAuthState({
            user: {
              id: user.id,
              name: user.user_metadata?.name || '',
              email: user.email || '',
              createdAt: user.created_at,
            },
            isAuthenticated: true,
            loading: false,
          });
        } else {
          // Only use mock user in development when Supabase is not configured
          const useMockUser = process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_SUPABASE_URL;
          if (useMockUser) {
            setAuthState({
              user: {
                id: 'mock-user-id',
                name: 'Mock User',
                email: 'mock@example.com',
                createdAt: new Date().toISOString(),
              },
              isAuthenticated: true,
              loading: false,
            });
          } else {
            // In production or when Supabase is configured, set loading to false
            setAuthState(prev => ({ ...prev, loading: false }));
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Only fall back to mock user in development
        if (process.env.NODE_ENV === 'development') {
          setAuthState({
            user: {
              id: 'mock-user-id',
              name: 'Mock User',
              email: 'mock@example.com',
              createdAt: new Date().toISOString(),
            },
            isAuthenticated: true,
            loading: false,
          });
        } else {
          setAuthState(prev => ({ ...prev, loading: false }));
        }
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Basic email validation
      if (!email || !email.includes('@')) {
        return { success: false, error: 'Please enter a valid email address' };
      }
      
      // Basic password validation
      if (!password || password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters long' };
      }

      const response = await signIn(email, password);
      if (response.user) {
        setAuthState({
          user: {
            id: response.user.id,
            name: response.user.user_metadata?.name || '',
            email: response.user.email || '',
            createdAt: response.user.created_at,
          },
          isAuthenticated: true,
          loading: false,
        });
        return { success: true };
      }
      return { success: false, error: 'Invalid credentials' };
    } catch (error: any) {
      console.error('Login error:', error);
      // Handle specific Supabase errors
      if (error?.message) {
        // Check if it's a generic "Invalid login credentials" error
        if (error.message.includes('Invalid login credentials')) {
          return { success: false, error: 'Invalid email or password. Please check your credentials and try again.' };
        }
        return { success: false, error: error.message };
      }
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Basic email validation
      if (!email || !email.includes('@')) {
        return { success: false, error: 'Please enter a valid email address' };
      }
      
      // Basic password validation
      if (!password || password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters long' };
      }
      
      // Basic name validation
      if (!name || name.trim().length === 0) {
        return { success: false, error: 'Please enter your name' };
      }

      const response = await signUp(email, password, name);
      if (response.user) {
        // Set user as authenticated immediately without email confirmation
        setAuthState({
          user: {
            id: response.user.id,
            name,
            email,
            createdAt: response.user.created_at,
          },
          isAuthenticated: true,
          loading: false,
        });
        
        return { 
          success: true,
          error: 'Registration successful! You are now logged in.' 
        };
      }
      return { success: false, error: 'Registration failed' };
    } catch (error: any) {
      console.error('Registration error:', error);
      // Handle specific Supabase errors
      if (error?.message) {
        // Check for common Supabase auth errors
        if (error.message.includes('Email address')) {
          return { success: false, error: 'The email address is not valid or not allowed. Please use a different email address.' };
        }
        if (error.message.includes('rate limit')) {
          return { success: false, error: 'Too many requests. Please try again later.' };
        }
        return { success: false, error: error.message };
      }
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setAuthState({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (name: string) => {
    if (authState.user) {
      // In a real app, you would update the user profile in Supabase here
      const updatedUser = {
        ...authState.user,
        name,
      };
      
      setAuthState({
        ...authState,
        user: updatedUser,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};