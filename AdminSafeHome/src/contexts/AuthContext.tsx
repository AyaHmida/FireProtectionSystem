import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { AuthContextType, AuthUser } from '../types';
import { authService } from '../services/authService';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialiser depuis localStorage au montage
  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = authService.getToken();
      const storedUser = authService.getUser();

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser({
          id: storedUser.id,
          firstName: storedUser.firstName,
          lastName: storedUser.lastName,
          email: storedUser.email,
          role: storedUser.role as 'admin' | 'user' | 'technician',
        });
        setIsAuthenticated(true);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login({ email, password });

      if (!response.success) {
        setError(response.message);
        setIsLoading(false);
        return;
      }

      if (response.token && response.user) {
        setToken(response.token);
        setUser({
          id: response.user.id,
          firstName: response.user.firstName,
          lastName: response.user.lastName,
          email: response.user.email,
          role: response.user.role as 'admin' | 'user' | 'technician',
        });
        setIsAuthenticated(true);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Connection failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    setError(null);
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
