import { createContext, useContext, useState, useEffect } from 'react';
import { adminLogin as apiAdminLogin, getCurrentAdmin } from '../services/api';
import { saveUser, removeUser, getUser, isAuthenticated } from '../utils/helpers';
import toast from 'react-hot-toast';

/**
 * Authentication Context
 */
const AuthContext = createContext(null);

/**
 * AuthProvider Component
 * Manages authentication state and provides auth methods
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  /**
   * Initialize auth state from localStorage on mount
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (isAuthenticated()) {
          const savedUser = getUser();
          setUser(savedUser);
          setIsAdmin(savedUser?.role === 'admin');

          // Verify token is still valid by fetching current user
          try {
            const response = await getCurrentAdmin();
            if (response.data) {
              setUser(response.data);
              setIsAdmin(response.data.role === 'admin');
            }
          } catch (error) {
            // Token is invalid, clear auth state
            console.error('Token validation failed:', error);
            logout();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Login function
   */
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await apiAdminLogin(email, password);

      if (response.status === 'success' && response.data) {
        const { user: userData, token } = response.data;

        // Save to localStorage
        saveUser(userData, token);

        // Update state
        setUser(userData);
        setIsAdmin(userData.role === 'admin');

        toast.success('Login successful!');
        return { success: true };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      const errorMessage =
        error.customMessage ||
        error.response?.data?.message ||
        'Login failed. Please check your credentials.';

      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout function
   */
  const logout = () => {
    // Clear localStorage
    removeUser();

    // Clear state
    setUser(null);
    setIsAdmin(false);

    toast.success('Logged out successfully');
  };

  /**
   * Check if user is authenticated
   */
  const checkAuth = () => {
    return isAuthenticated() && user !== null;
  };

  /**
   * Context value
   */
  const value = {
    user,
    isAdmin,
    loading,
    login,
    logout,
    checkAuth,
    isAuthenticated: checkAuth(),
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
