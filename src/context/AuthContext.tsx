"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { internalApi, User, LoginCredentials } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await internalApi.get('/auth/me'); // Calls our internal API
        if (data.user) {
          setUser(data.user);
        }
      } catch (error) {
        // User not logged in, silent fail
        console.log("No active session");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const { data } = await internalApi.post('/auth/login', credentials);
      if (data.success && data.user) {
        setUser(data.user);
        router.push('/dashboard');
      }
    } catch (error: any) {
        console.error("Login failed", error);
        throw error; // Re-throw to be handled by the UI (e.g. show error message)
    }
  };

  const logout = async () => {
    try {
      await internalApi.post('/auth/logout');
      setUser(null);
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
