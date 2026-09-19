"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  domainId?: string;
  isVerifiedAccount: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, userData: User) => void;
  updateDomain: (domainId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  updateDomain: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.data);
        } catch {
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateDomain = (domainId: string) => {
    setUser((currentUser) => currentUser ? { ...currentUser, domainId } : currentUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, updateDomain, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
