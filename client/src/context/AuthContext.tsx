import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Role, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState<Role | null>(localStorage.getItem('userRole') as Role);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check initial auth state
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('userRole') as Role;

    if (storedToken && storedRole) {
      setToken(storedToken);
      setUserRole(storedRole);
    }
    setLoading(false);
  }, []);

  const login = (newToken: string, newRole: Role) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('userRole', newRole);
    setToken(newToken);
    setUserRole(newRole);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setToken(null);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated: !!token, 
        userRole, 
        token, 
        login, 
        logout,
        loading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
