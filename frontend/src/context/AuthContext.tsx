import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState } from '../types';
import { api, isTokenExpired } from '../services/api';

interface AuthContextType extends AuthState {
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  hasRole: (roleName: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const token = localStorage.getItem('elysian_token');
    const userStr = localStorage.getItem('elysian_user');

    if (token && isTokenExpired(token)) {
      localStorage.removeItem('elysian_token');
      localStorage.removeItem('elysian_user');
      return {
        token: null,
        user: null,
        isAuthenticated: false,
      };
    }

    let user = null;
    if (userStr) {
      try {
        user = JSON.parse(userStr);
      } catch {
        // ignore
      }
    }
    return {
      token,
      user,
      isAuthenticated: !!token && !!user,
    };
  });

  useEffect(() => {
    const handleLogout = () => {
      logout();
    };
    window.addEventListener('auth_logout', handleLogout);
    return () => window.removeEventListener('auth_logout', handleLogout);
  }, []);

  const login = async (email: string, pass: string) => {
    const data = await api.auth.login({ email, password: pass });
    const userObj = {
      id: data.id,
      email: data.email,
      fullName: data.fullName,
      avatarUrl: data.avatarUrl,
      roles: data.roles,
    };
    localStorage.setItem('elysian_token', data.token);
    localStorage.setItem('elysian_user', JSON.stringify(userObj));
    setAuthState({
      token: data.token,
      user: userObj,
      isAuthenticated: true,
    });
  };

  const logout = () => {
    localStorage.removeItem('elysian_token');
    localStorage.removeItem('elysian_user');
    setAuthState({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  };

  const hasRole = (roleName: string) => {
    if (!authState.user) return false;
    const cleanRole = roleName.startsWith('ROLE_') ? roleName : `ROLE_${roleName}`;
    return authState.user.roles.includes('ROLE_SUPER_ADMIN') || authState.user.roles.includes(cleanRole);
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, hasRole }}>
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
