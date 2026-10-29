import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ShieldCheck,
  Smartphone,
  Mail,
  Store,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Lock,
  CheckCircle2,
  Server,
  Cloud,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import ThemeToggle from '../components/common/ThemeToggle';

export const Home = () => {
  const { openAuthModal, isAuthenticated, user, isAwsConfigured } = useAuth();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // If redirected with ?auth=required, automatically pop open the reference modal
    if (searchParams.get('auth') === 'required' && !isAuthenticated) {
      openAuthModal('phone');
    }
  }, [searchParams, isAuthenticated, openAuthModal]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between selection:bg-amber-400 selection:text-slate-900 transition-colors">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-pink-500 flex items-center justify-center text-white shadow-md">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-slate-100">
              Cloud<span className="text-pink-500">Market</span>
            </span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            <ThemeToggle />

            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button variant="primary" size="sm" rounded="xl">
                  Go to Dashboard ({user?.name?.split(' ')[0]})
                </Button>
              </Link>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => openAuthModal('phone')}
                  className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-1.5 transition-colors"
                >
                  Sign In
                </button>

                <Button
                  variant="yellow"
                  size="sm"
                  rounded="full"
                  onClick={() => openAuthModal('phone')}
                  className="shadow-sm"
                >
                  Open Login Modal
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 flex flex-col items-center text-center">
        {/* Top Feature Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 shadow-sm mb-6 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Production-Ready AWS Cognito Authentication Architecture</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-slate-100 tracking-tight max-w-4xl leading-[1.15]">
          Enterprise Authentication System with{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-500">
            AWS Cognito & React
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          Pixel-accurate implementation of the reference authentication modal. Featuring Indian mobile (+91) OTP verification, email & password authentication, Google federation, and role-based buyer/seller onboarding.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Button
            variant="yellow"
            size="lg"
            rounded="full"
            onClick={() => openAuthModal('phone')}
            icon={<Smartphone className="w-5 h-5 text-slate-900" />}
            className="shadow-accent px-8"
          >
            Launch Login Modal
          </Button>

          <Link to="/signup/buyer">
            <Button
              variant="primary"
              size="lg"
              rounded="full"
              icon={<ShoppingBag className="w-5 h-5" />}
            >
              Register as Buyer
            </Button>
          </Link>

          <Link to="/signup/seller">
            <Button
              variant="outline"
              size="lg"
              rounded="full"
              icon={<Store className="w-5 h-5 text-pink-500" />}
            >
              Register as Seller
            </Button>
          </Link>
        </div>

        {/* Status Pill */}
        <div className="mt-5 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{isAwsConfigured ? 'Connected to live AWS Cognito User Pool' : 'Running in Interactive Demo Mode (Credentials in .env)'}</span>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left w-full max-w-5xl">
          {/* Card 1: Reference Modal */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mb-4">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
              Reference Modal Design
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Centered white modal with dark overlay, blue "Login" heading with pink accent underline, Google button, tabs for phone/email, Indian flag input, and yellow rounded button.
            </p>
            <button
              type="button"
              onClick={() => openAuthModal('phone')}
              className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
            >
              Test Reference Modal →
            </button>
          </div>

          {/* Card 2: AWS Cognito Security */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
              AWS Cognito User Pools
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Zero client secrets embedded in browser. Secure SRP & OAuth 2.0 flows, Amplify v6 SDK, automatic token refresh, and Cognito password policy enforcement.
            </p>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
              ✓ No Passwords in Frontend Storage
            </span>
          </div>

          {/* Card 3: Dual Multi-Role Flows */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-pink-100 dark:bg-pink-950/60 text-pink-600 flex items-center justify-center mb-4">
              <Store className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
              Buyer & Seller Portals
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Separate registration paths storing <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-pink-600 font-mono text-xs">custom:role</code> attributes in Cognito, with store details and GST verification for merchants.
            </p>
            <div className="flex gap-2">
              <Link to="/signup/buyer" className="text-xs font-bold text-blue-600 hover:underline">
                Buyer Signup →
              </Link>
              <span className="text-slate-300">|</span>
              <Link to="/signup/seller" className="text-xs font-bold text-pink-600 hover:underline">
                Seller Signup →
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 bg-white dark:bg-slate-900 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>CloudMarket Authentication System • Built with React, Vite & Amazon Cognito</span>
          <div className="flex items-center gap-4">
            <a href="#cognito" className="hover:text-blue-600">Cognito Docs</a>
            <a href="#amplify" className="hover:text-blue-600">Amplify v6</a>
            <a href="#security" className="hover:text-blue-600">Security Specs</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
