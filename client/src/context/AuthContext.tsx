import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import type { Role, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState<Role | null>(localStorage.getItem('userRole') as Role);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check initial auth state
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('userRole') as Role;

    if (storedToken && storedRole) {
      setToken(storedToken);
      setUserRole(storedRole);
      try {
        const decoded: any = jwtDecode(storedToken);
        setUserId(decoded.id);
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
      }
    }
    setLoading(false);
  }, []);

  const login = (newToken: string, newRole: Role) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('userRole', newRole);
    setToken(newToken);
    setUserRole(newRole);
    try {
      const decoded: any = jwtDecode(newToken);
      setUserId(decoded.id);
    } catch (error) {
      console.error("Invalid token", error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setToken(null);
    setUserRole(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated: !!token, 
        userRole, 
        userId,
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
