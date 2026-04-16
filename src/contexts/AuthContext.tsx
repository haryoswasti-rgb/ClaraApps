import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User } from '@/lib/types';
import * as store from '@/lib/store';

interface AuthCtx {
  user: User | null;
  login: (name: string, role: 'admin' | 'peminjam') => void;
  logout: () => void;
}

const AuthContext = createContext<AuthCtx>({ user: null, login: () => {}, logout: () => {} });

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => store.getAuth());

  const login = useCallback((name: string, role: 'admin' | 'peminjam') => {
    const u = store.login(name, role);
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    store.logout();
    setUser(null);
  }, []);

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}
