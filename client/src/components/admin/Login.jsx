import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, LogIn, AlertTriangle, Clock } from 'lucide-react';
import { loginSchema } from '../../utils/validation';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

/**
 * Login Component
 * Admin login form with rate limiting and lockout protection
 */
const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lockoutInfo, setLockoutInfo] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const emailValue = watch('email');

  /**
   * Check lockout status on component mount and when email changes
   */
  useEffect(() => {
    if (emailValue) {
      checkLockoutStatus(emailValue);
    }
  }, [emailValue]);

  /**
   * Update remaining time countdown
   */
  useEffect(() => {
    if (lockoutInfo?.lockoutUntil) {
      const interval = setInterval(() => {
        const now = Date.now();
        const remaining = lockoutInfo.lockoutUntil - now;

        if (remaining <= 0) {
          setLockoutInfo(null);
          setRemainingTime(null);
          if (emailValue) {
            checkLockoutStatus(emailValue);
          }
        } else {
          const minutes = Math.floor(remaining / 60000);
          const seconds = Math.floor((remaining % 60000) / 1000);
          setRemainingTime(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [lockoutInfo, emailValue]);

  /**
   * Check if account is currently locked out
   */
  const checkLockoutStatus = (email) => {
    const lockoutKey = `login_lockout_${email}`;
    const lockoutUntil = localStorage.getItem(lockoutKey);

    if (lockoutUntil) {
      const lockoutTime = parseInt(lockoutUntil);
      const now = Date.now();

      if (now < lockoutTime) {
        const remainingMinutes = Math.ceil((lockoutTime - now) / 60000);
        setLockoutInfo({
          isLocked: true,
          remainingMinutes,
          lockoutUntil: lockoutTime
        });
      } else {
        // Lockout expired
        localStorage.removeItem(lockoutKey);
        localStorage.removeItem(`login_attempts_${email}`);
        setLockoutInfo(null);
        setRemainingTime(null);
      }
    } else {
      setLockoutInfo(null);
      setRemainingTime(null);
    }
  };

  const onSubmit = async (data) => {
    // Check lockout before attempting login
    if (lockoutInfo?.isLocked) {
      return;
    }

    setIsLoading(true);

    const result = await login(data.email, data.password);

    setIsLoading(false);

    if (result.success) {
      navigate('/admin/packages');
    } else {
      // Refresh lockout status after failed login
      checkLockoutStatus(data.email);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img
              src="/assets/images/logo/Logo.jpg"
              alt="CK Forest Gardens Logo"
              className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-xl"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">CK Forest Gardens</h1>
          <p className="text-primary-100">Admin Portal</p>
        </div>

        {/* Login Card */}
        <div className="card p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to access the admin dashboard</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Lockout Warning */}
            {lockoutInfo?.isLocked && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-red-900 mb-1">Account Temporarily Locked</h4>
                    <p className="text-sm text-red-700 mb-2">
                      Too many failed login attempts. Please wait before trying again.
                    </p>
                    {remainingTime && (
                      <div className="flex items-center gap-2 text-sm font-medium text-red-800">
                        <Clock className="w-4 h-4" />
                        Time remaining: {remainingTime}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Security Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Lock className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800">
                  <strong>Security Notice:</strong> Account will be temporarily locked for 15 minutes after 6 failed login attempts.
                </p>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="label">
                <Mail className="w-4 h-4 inline mr-1" />
                Email Address
              </label>
              <input
                type="email"
                {...register('email')}
                className={`input ${errors.email ? 'input-error' : ''}`}
                placeholder="admin@ckforestgarden.com"
                autoComplete="email"
                disabled={lockoutInfo?.isLocked}
              />
              {errors.email && <p className="error-text">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="label">
                <Lock className="w-4 h-4 inline mr-1" />
                Password
              </label>
              <input
                type="password"
                {...register('password')}
                className={`input ${errors.password ? 'input-error' : ''}`}
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={lockoutInfo?.isLocked}
              />
              {errors.password && <p className="error-text">{errors.password.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-full py-4 text-lg"
              disabled={isLoading || lockoutInfo?.isLocked}
            >
              {isLoading ? (
                <LoadingSpinner size="small" text="Signing in..." />
              ) : lockoutInfo?.isLocked ? (
                <>
                  <Clock className="w-5 h-5 mr-2 inline" />
                  Account Locked
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2 inline" />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <a href="/" className="text-primary-100 hover:text-white transition-colors">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
