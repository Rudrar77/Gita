import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI, setToken, removeToken } from '@/lib/api';

interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(() => {
    return localStorage.getItem('authToken');
  });
  const [loading, setLoading] = useState(true);

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      const storedToken = localStorage.getItem('authToken');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const data = await authAPI.getMe();
        setUser(data.user);
        setTokenState(storedToken);
      } catch (error) {
        // Token is invalid, clear it
        removeToken();
        setTokenState(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await authAPI.login(email, password);
    setToken(data.token);
    setTokenState(data.token);
    setUser(data.user);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const data = await authAPI.register(name, email, password);
    setToken(data.token);
    setTokenState(data.token);
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    removeToken();
    setTokenState(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        loading,
        login,
        register,
        logout,
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
