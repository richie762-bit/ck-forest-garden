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
   * Check if account is locked out due to too many failed attempts
   */
  const checkLockout = (email) => {
    const lockoutKey = `login_lockout_${email}`;
    const attemptsKey = `login_attempts_${email}`;

    const lockoutUntil = localStorage.getItem(lockoutKey);

    if (lockoutUntil) {
      const lockoutTime = parseInt(lockoutUntil);
      const now = Date.now();

      if (now < lockoutTime) {
        const remainingMinutes = Math.ceil((lockoutTime - now) / 60000);
        return {
          isLocked: true,
          remainingMinutes,
          lockoutUntil: lockoutTime
        };
      } else {
        // Lockout expired, clear data
        localStorage.removeItem(lockoutKey);
        localStorage.removeItem(attemptsKey);
      }
    }

    return { isLocked: false };
  };

  /**
   * Record failed login attempt and implement progressive delays
   */
  const recordFailedAttempt = async (email) => {
    const attemptsKey = `login_attempts_${email}`;
    const lockoutKey = `login_lockout_${email}`;

    let attempts = parseInt(localStorage.getItem(attemptsKey) || '0');
    attempts += 1;
    localStorage.setItem(attemptsKey, attempts.toString());

    // Progressive delays based on OWASP recommendations
    if (attempts >= 6) {
      // Lock account for 15 minutes after 6 failed attempts
      const lockoutUntil = Date.now() + (15 * 60 * 1000); // 15 minutes
      localStorage.setItem(lockoutKey, lockoutUntil.toString());
      throw new Error(`Account temporarily locked due to multiple failed login attempts. Please try again in 15 minutes.`);
    } else if (attempts === 5) {
      // 5 second delay on 5th attempt
      await new Promise(resolve => setTimeout(resolve, 5000));
      throw new Error(`Invalid credentials. Warning: Account will be locked after one more failed attempt. (${6 - attempts} attempt remaining)`);
    } else if (attempts >= 3) {
      // 2 second delay on 3rd and 4th attempts
      await new Promise(resolve => setTimeout(resolve, 2000));
      throw new Error(`Invalid credentials. Warning: Too many failed attempts. (${6 - attempts} attempts remaining)`);
    } else {
      // No delay for first 2 attempts
      throw new Error(`Invalid email or password. (${6 - attempts} attempts remaining before lockout)`);
    }
  };

  /**
   * Clear failed login attempts on successful login
   */
  const clearFailedAttempts = (email) => {
    const attemptsKey = `login_attempts_${email}`;
    const lockoutKey = `login_lockout_${email}`;
    localStorage.removeItem(attemptsKey);
    localStorage.removeItem(lockoutKey);
  };

  /**
   * Login function using Supabase Auth with rate limiting
   */
  const login = async (email, password) => {
    try {
      setLoading(true);

      // Check if account is locked out
      const lockoutStatus = checkLockout(email);
      if (lockoutStatus.isLocked) {
        throw new Error(`Account temporarily locked. Please try again in ${lockoutStatus.remainingMinutes} minute${lockoutStatus.remainingMinutes > 1 ? 's' : ''}.`);
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Record failed attempt with progressive delays
        await recordFailedAttempt(email);
        throw error; // This line won't be reached due to throw in recordFailedAttempt
      }

      if (data.user && data.session) {
        // Clear failed attempts on successful login
        clearFailedAttempts(email);
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
