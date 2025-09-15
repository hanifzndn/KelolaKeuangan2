// src/context/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (name: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedAuth = localStorage.getItem('isAuthenticated');
    
    if (storedUser && storedAuth === 'true') {
      try {
        setAuthState({
          user: JSON.parse(storedUser),
          isAuthenticated: true,
        });
      } catch (e) {
        console.error('Failed to parse stored user data', e);
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would be an API call
    // For this demo, we'll simulate authentication
    
    // Check if user exists in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);
    
    if (user) {
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      };
      
      setAuthState({
        user: userData,
        isAuthenticated: true,
      });
      
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isAuthenticated', 'true');
      
      return true;
    }
    
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find((u: any) => u.email === email);
    
    if (existingUser) {
      return false; // User already exists
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password, // In a real app, this should be hashed
      createdAt: new Date().toISOString(),
    };
    
    // Save user to localStorage
    const updatedUsers = [...users, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // Automatically log in the user
    const userData = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
    };
    
    setAuthState({
      user: userData,
      isAuthenticated: true,
    });
    
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isAuthenticated', 'true');
    
    return true;
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
    });
    
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
  };

  const updateProfile = (name: string) => {
    if (authState.user) {
      const updatedUser = {
        ...authState.user,
        name,
      };
      
      setAuthState({
        ...authState,
        user: updatedUser,
      });
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update user in users array
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map((u: any) => 
        u.id === updatedUser.id ? { ...u, name } : u
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));
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