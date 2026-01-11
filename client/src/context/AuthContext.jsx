import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import {
  checkLoginLockout,
  recordFailedLoginAttempt,
  clearLoginAttempts
} from '../services/supabaseService';
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
   * Login function using Supabase Auth with database-based rate limiting
   */
  const login = async (email, password) => {
    try {
      setLoading(true);

      // Check if account is locked out (from database)
      const lockoutStatus = await checkLoginLockout(email);
      if (lockoutStatus.isLocked) {
        throw new Error(`Account temporarily locked. Please try again in ${lockoutStatus.remainingMinutes} minute${lockoutStatus.remainingMinutes > 1 ? 's' : ''}.`);
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Record failed attempt in database with progressive delays
        const attemptRecord = await recordFailedLoginAttempt(email);

        // Progressive delays based on attempt count
        if (attemptRecord.isLocked) {
          // 3rd attempt - locked
          throw new Error(`Account temporarily locked due to multiple failed login attempts. Please try again in 15 minutes.`);
        } else if (attemptRecord.attempt_count === 2) {
          // 2nd attempt - 5 second delay
          await new Promise(resolve => setTimeout(resolve, 5000));
          throw new Error(`Invalid credentials. Warning: Account will be locked after one more failed attempt. (${3 - attemptRecord.attempt_count} attempt remaining)`);
        } else {
          // 1st attempt - 2 second delay
          await new Promise(resolve => setTimeout(resolve, 2000));
          throw new Error(`Invalid email or password. (${3 - attemptRecord.attempt_count} attempts remaining before lockout)`);
        }
      }

      if (data.user && data.session) {
        // Clear failed attempts on successful login (from database)
        await clearLoginAttempts(email);
        toast.success('Login successful!');
        return { success: true };
      } else {
        throw new Error('Invalid response from authentication service');
      }
    } catch (error) {
      console.error('Login error:', error);

      let errorMessage = error.message || 'Login failed. Please check your credentials.';

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
