import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

type User = {
  id: string;
  email: string;
  name: string;
  first_name: string;
  last_name: string;
  type: 'customer' | 'owner';
  avatar?: string;
  phone_number?: string;
};

type AuthError = {
  message: string;
  field?: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string, type: 'customer' | 'owner') => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string, type: 'customer' | 'owner') => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  error: AuthError | null;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  const clearError = () => setError(null);

  // Helper function to get auth token
  const getToken = () => localStorage.getItem('auth_token');
  
  // Helper function to set auth token
  const setToken = (token: string) => localStorage.setItem('auth_token', token);
  
  // Helper function to remove auth token
  const removeToken = () => localStorage.removeItem('auth_token');

  // API call helper with error handling
  const apiCall = async (url: string, options: RequestInit = {}) => {
    try {
      const token = getToken();
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      };

      const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      setError({ message });
      throw err;
    }
  };

  // Get current user from token
  const getCurrentUser = async () => {
    try {
      const token = getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      const userData = await apiCall('/users/me/');
      setUser(userData);
    } catch (err) {
      console.error('Failed to get current user:', err);
      removeToken();
    } finally {
      setIsLoading(false);
    }
  };

  // Login function with real API integration
  const login = async (email: string, password: string, type: 'customer' | 'owner') => {
    try {
      setIsLoading(true);
      clearError();

      const response = await apiCall('/auth/login/', {
        method: 'POST',
        body: JSON.stringify({ 
          email, 
          password, 
          user_type: type 
        }),
      });

      if (response.access) {
        setToken(response.access);
        // Get user data after successful login
        const userData = await apiCall('/users/me/');
        setUser(userData);
        toast.success('Login successful!');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError({ message });
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function with real API integration
  const register = async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    type: 'customer' | 'owner'
  ) => {
    try {
      setIsLoading(true);
      clearError();

      const response = await apiCall('/auth/register/', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          user_type: type,
        }),
      });

      if (response.access) {
        setToken(response.access);
        // Get user data after successful registration
        const userData = await apiCall('/users/me/');
        setUser(userData);
        toast.success('Registration successful!');
      } else {
        throw new Error('Registration failed');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError({ message });
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Attempt to call logout endpoint
      await apiCall('/auth/logout/', { method: 'POST' }).catch(() => {
        // Ignore errors - still proceed with local logout
      });
    } finally {
      removeToken();
      setUser(null);
      clearError();
      toast.success('Logged out successfully');
      window.location.href = '/';
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    if (!getToken()) return;
    
    try {
      const userData = await apiCall('/users/me/');
      setUser(userData);
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  // Update profile
  const updateProfile = async (updates: Partial<User>) => {
    try {
      setIsLoading(true);
      clearError();

      const updatedUser = await apiCall('/users/me/', {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });

      setUser(updatedUser);
      toast.success('Profile updated successfully!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update profile';
      setError({ message });
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize auth state on mount
  useEffect(() => {
    getCurrentUser();
  }, []);

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isLoading,
    refreshUser,
    updateProfile,
    error,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
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

// Auth guard hook
export function useRequireAuth(redirectTo = '/') {
  const { isAuthenticated, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = redirectTo;
    }
  }, [isAuthenticated, isLoading, redirectTo]);
  
  return { isAuthenticated, isLoading };
}

// Role-based access hook
export function useRequireRole(requiredRole: 'customer' | 'owner', redirectTo = '/') {
  const { user, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading && (!user || user.type !== requiredRole)) {
      toast.error(`Access denied. ${requiredRole} role required.`);
      window.location.href = redirectTo;
    }
  }, [user, isLoading, requiredRole, redirectTo]);
  
  return { user, isLoading, hasRole: user?.type === requiredRole };
}

export default AuthContext;
