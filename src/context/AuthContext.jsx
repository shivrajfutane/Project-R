import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  signInWithEmail as apiSignInEmail,
  initiatePhoneOtp as apiInitiatePhoneOtp,
  verifyPhoneOtp as apiVerifyPhoneOtp,
  signInWithGoogle as apiSignInGoogle,
  registerUser as apiRegisterUser,
  confirmAccountVerification as apiConfirmVerification,
  resendAccountVerificationCode as apiResendCode,
  requestForgotPassword as apiRequestForgotPassword,
  completePasswordReset as apiCompletePasswordReset,
  getAuthenticatedUser,
  logoutUser,
} from '../services/authService';
import { isAwsConfigured } from '../config/amplify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem('auth_remember_me') === 'true';
  });

  // Modal controls for reference auth popup
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('phone'); // 'phone' | 'email'

  const clearError = useCallback(() => setError(null), []);

  const openAuthModal = useCallback((initialTab = 'phone') => {
    setAuthModalTab(initialTab);
    setIsAuthModalOpen(true);
    clearError();
  }, [clearError]);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    clearError();
  }, [clearError]);

  const switchAuthModalTab = useCallback((tab) => {
    setAuthModalTab(tab);
    clearError();
  }, [clearError]);

  const updateRememberMe = useCallback((value) => {
    setRememberMe(value);
    localStorage.setItem('auth_remember_me', value ? 'true' : 'false');
  }, []);

  // Format internal user object from Cognito attributes
  const mapUserFromData = (data) => {
    if (!data) return null;
    const attrs = data.attributes || {};
    return {
      id: data.userId || attrs.sub || 'user-' + Date.now(),
      username: data.username || attrs.email || attrs.phone_number,
      email: attrs.email || '',
      name: attrs.name || (attrs.email ? attrs.email.split('@')[0] : 'User'),
      phoneNumber: attrs.phone_number || '',
      role: attrs['custom:role'] || 'buyer',
      storeName: attrs['custom:store_name'] || '',
      sellerCategory: attrs['custom:seller_category'] || '',
      gstNumber: attrs['custom:gst_number'] || '',
      isVerified: attrs.email_verified === 'true' || attrs.phone_number_verified === 'true' || true,
      rawAttributes: attrs,
      tokens: data.tokens || null,
    };
  };

  // Check initial authentication state on mount
  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const authUser = await getAuthenticatedUser();
      if (authUser) {
        setUser(mapUserFromData(authUser));
      } else {
        setUser(null);
      }
    } catch (err) {
      console.warn('Session check:', err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Sign in with Email & Password
  const loginWithEmail = async (email, password) => {
    setIsLoading(true);
    clearError();
    try {
      const res = await apiSignInEmail(email, password);
      if (res.isSignedIn) {
        await checkAuth();
        closeAuthModal();
        return { success: true };
      }
      return { success: false, nextStep: res.nextStep };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Initiate Phone OTP login
  const loginWithPhoneOtp = async (phoneNumber) => {
    setIsLoading(true);
    clearError();
    try {
      const res = await apiInitiatePhoneOtp(phoneNumber);
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Confirm Phone OTP login
  const confirmPhoneOtp = async (phoneNumber, code) => {
    setIsLoading(true);
    clearError();
    try {
      const res = await apiVerifyPhoneOtp(phoneNumber, code);
      if (res.isSignedIn) {
        await checkAuth();
        closeAuthModal();
        return { success: true };
      }
      return { success: false, nextStep: res.nextStep };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Google OAuth Federation
  const loginWithGoogle = async () => {
    clearError();
    try {
      await apiSignInGoogle();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Registration
  const signup = async (userData) => {
    setIsLoading(true);
    clearError();
    try {
      const res = await apiRegisterUser(userData);
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Account Verification
  const verifyAccount = async (username, code) => {
    setIsLoading(true);
    clearError();
    try {
      const res = await apiConfirmVerification(username, code);
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Resend code
  const resendVerification = async (username) => {
    clearError();
    try {
      return await apiResendCode(username);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Forgot Password request
  const forgotPassword = async (username) => {
    setIsLoading(true);
    clearError();
    try {
      return await apiRequestForgotPassword(username);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Complete Password Reset
  const resetPassword = async (username, code, newPassword) => {
    setIsLoading(true);
    clearError();
    try {
      return await apiCompletePasswordReset(username, code, newPassword);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutUser();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    clearError,
    rememberMe,
    setRememberMe: updateRememberMe,
    // Modal states
    isAuthModalOpen,
    authModalTab,
    openAuthModal,
    closeAuthModal,
    switchAuthModalTab,
    // Auth actions
    loginWithEmail,
    loginWithPhoneOtp,
    confirmPhoneOtp,
    loginWithGoogle,
    signup,
    verifyAccount,
    resendVerification,
    forgotPassword,
    resetPassword,
    logout,
    checkAuth,
    isAwsConfigured: isAwsConfigured(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
