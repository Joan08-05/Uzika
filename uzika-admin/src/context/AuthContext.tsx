import { createContext, useContext, useState, type ReactNode } from 'react';
import api from '../api/client';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<any>;
  resetPassword: (token: string, newPassword: string) => Promise<any>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  function saveSession(token: string, userData: User) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }

  async function login(email: string, password: string) {
    const res = await api.post('/auth/login', { email, password });
    saveSession(res.data.access_token, res.data.user);
  }

  async function signup(name: string, email: string, password: string) {
    const res = await api.post('/auth/signup', { name, email, password });
    saveSession(res.data.access_token, res.data.user);
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }

  async function forgotPassword(email: string) {
    const res = await api.post('/auth/forgot-password', { email });
    return res.data;
  }

  async function resetPassword(token: string, newPassword: string) {
    const res = await api.post('/auth/reset-password', { token, newPassword });
    return res.data;
  }

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, forgotPassword, resetPassword, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}