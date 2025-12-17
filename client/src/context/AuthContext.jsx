import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import toast from 'react-hot-toast';

/**
 * Authentication Context - Supabase Auth
 */
const AuthContext = createContext(null);

/**
 * AuthProvider Component
 * Manages authentication state using Supabase Auth
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  /**
   * Initialize auth state and listen for auth changes
   */
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  /**
   * Login function using Supabase Auth
   */
  const login = async (email, password) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user && data.session) {
        toast.success('Login successful!');
        return { success: true };
      } else {
        throw new Error('Invalid response from authentication service');
      }
    } catch (error) {
      console.error('Login error:', error);

      let errorMessage = 'Login failed. Please check your credentials.';

      if (error.message === 'Invalid login credentials') {
        errorMessage = 'Invalid email or password. Please try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout function using Supabase Auth
   */
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout. Please try again.');
    }
  };

  /**
   * Check if user is authenticated
   */
  const checkAuth = () => {
    return session !== null && user !== null;
  };

  /**
   * Context value
   */
  const value = {
    user,
    session,
    loading,
    login,
    logout,
    checkAuth,
    isAuthenticated: user !== null,
    // For backward compatibility with admin checks
    isAdmin: user !== null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * useAuth Hook
 * Custom hook to use the AuthContext
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export default AuthContext;
