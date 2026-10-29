import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Smartphone, Mail } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import GoogleLogin from './GoogleLogin';
import PhoneLogin from './PhoneLogin';
import EmailLogin from './EmailLogin';
import ForgotPassword from './ForgotPassword';

export const AuthModal = () => {
  const navigate = useNavigate();
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalTab,
    switchAuthModalTab,
    isAwsConfigured,
  } = useAuth();

  const [view, setView] = useState('login'); // 'login' | 'forgot_password'

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isAuthModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  // Reset view when modal re-opens
  useEffect(() => {
    if (isAuthModalOpen) {
      setView('login');
    }
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleRegisterClick = (role) => {
    closeAuthModal();
    if (role === 'seller') {
      navigate('/signup/seller');
    } else {
      navigate('/signup/buyer');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-overlay overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      onClick={(e) => {
        // Close when clicking outer backdrop
        if (e.target === e.currentTarget) {
          closeAuthModal();
        }
      }}
    >
      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-[420px] bg-white dark:bg-slate-900 rounded-3xl shadow-modal border border-slate-100 dark:border-slate-800 p-6 sm:p-8 animate-fade-in my-8 text-slate-800 dark:text-slate-100">
        
        {/* Pink Close Icon in Top Right Corner */}
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 rounded-full text-pink-500 hover:text-pink-600 bg-pink-50 hover:bg-pink-100 dark:bg-pink-950/40 dark:hover:bg-pink-900/60 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-pink-400 active:scale-95"
          aria-label="Close authentication modal"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* AWS Setup Notice badge if .env credentials not provided yet */}
        {!isAwsConfigured && (
          <div className="mb-4 -mt-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Demo Mode • Fill .env to connect to Live Cognito
            </span>
          </div>
        )}

        {view === 'login' ? (
          <>
            {/* Header: Blue Login heading with a Pink underline accent */}
            <div className="mb-6">
              <h2
                id="auth-modal-title"
                className="text-2xl sm:text-3xl font-extrabold text-[#1E40AF] dark:text-blue-400 tracking-tight"
              >
                Login
              </h2>
              {/* Pink Accent Underline */}
              <div className="w-12 h-1 bg-[#EC4899] rounded-full mt-2" />
            </div>

            {/* Google Sign-in at Top with Divider */}
            <GoogleLogin />

            {/* Navigation Tabs: "Use Phone Number" and "Use Email Address" */}
            <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6">
              <button
                type="button"
                onClick={() => switchAuthModalTab('phone')}
                className={`flex-1 pb-3 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-all relative ${
                  authModalTab === 'phone'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Use Phone Number</span>
              </button>

              <button
                type="button"
                onClick={() => switchAuthModalTab('email')}
                className={`flex-1 pb-3 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-all relative ${
                  authModalTab === 'email'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>Use Email Address</span>
              </button>
            </div>

            {/* Tab Body */}
            <div>
              {authModalTab === 'phone' ? (
                <PhoneLogin />
              ) : (
                <EmailLogin onForgotPassword={() => setView('forgot_password')} />
              )}
            </div>

            {/* Separate Registration Links for Buyers and Sellers */}
            <div className="mt-7 pt-5 border-t border-slate-100 dark:border-slate-800 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                Don't have an account yet?
              </p>
              <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold">
                <button
                  type="button"
                  onClick={() => handleRegisterClick('buyer')}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
                >
                  Register as Buyer
                </button>
                <span className="text-slate-300 dark:text-slate-700">|</span>
                <button
                  type="button"
                  onClick={() => handleRegisterClick('seller')}
                  className="text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 hover:underline"
                >
                  Register as Seller
                </button>
              </div>
            </div>
          </>
        ) : (
          <ForgotPassword onBackToLogin={() => setView('login')} />
        )}
      </div>
    </div>
  );
};

export default AuthModal;
