import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Store,
  LogOut,
  ShieldCheck,
  Key,
  Server,
  Layers,
  ShoppingBag,
  TrendingUp,
  Package,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import ThemeToggle from '../components/common/ThemeToggle';
import { awsConfigDetails } from '../config/amplify';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isAwsConfigured } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showTokens, setShowTokens] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const isSeller = user?.role === 'seller';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-sm ${
              isSeller ? 'bg-pink-600' : 'bg-blue-600'
            }`}>
              {isSeller ? <Store className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
            </div>
            <div>
              <span className="font-extrabold text-slate-900 dark:text-slate-100 text-lg">
                CloudMarket
              </span>
              <span className={`ml-2 text-xs font-bold px-2 py-0.5 rounded-full ${
                isSeller
                  ? 'bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800'
                  : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
              }`}>
                {isSeller ? 'Seller Central' : 'Buyer Hub'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              rounded="xl"
              onClick={handleLogout}
              isLoading={isLoggingOut}
              icon={<LogOut className="w-4 h-4 text-red-500" />}
              className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 border-red-200 dark:border-red-900"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-pink-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              Authenticated via Amazon Cognito
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Valued User'}!
            </h1>
            <p className="mt-2 text-sm text-blue-100">
              {isSeller
                ? `Managing your merchant storefront "${user?.storeName || 'Active Store'}" on the CloudMarket network.`
                : 'Your secure buyer portal is active. Browse exclusive promotions, check purchase history, and update security.'}
            </p>
          </div>
          {/* Subtle background graphics */}
          <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        </div>

        {/* AWS Environment Status Banner */}
        {!isAwsConfigured && (
          <div className="bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse shrink-0" />
              <div className="text-xs sm:text-sm text-amber-900 dark:text-amber-200">
                <span className="font-bold">Simulated Authentication Mode:</span> Add your AWS Cognito User Pool details in <code className="bg-amber-100 dark:bg-amber-900 px-1 py-0.5 rounded font-mono font-bold">.env</code> to verify against your live AWS infrastructure.
              </div>
            </div>
            <a
              href="#setup-guide"
              onClick={(e) => {
                e.preventDefault();
                alert('Refer to the AWS_SETUP_GUIDE.md in the root directory for step-by-step setup instructions!');
              }}
              className="text-xs font-bold text-amber-800 dark:text-amber-300 hover:underline shrink-0"
            >
              View AWS Setup Guide →
            </a>
          </div>
        )}

        {/* User Profile & Role Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" /> User Profile
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                Verified
              </span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="text-slate-400 block text-xs">Full Name</label>
                <div className="font-semibold text-slate-800 dark:text-slate-200">
                  {user?.name || 'N/A'}
                </div>
              </div>

              <div>
                <label className="text-slate-400 block text-xs">Email Address</label>
                <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 break-all">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {user?.email || 'N/A'}
                </div>
              </div>

              <div>
                <label className="text-slate-400 block text-xs">Phone Number</label>
                <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {user?.phoneNumber || 'Not Linked'}
                </div>
              </div>

              <div>
                <label className="text-slate-400 block text-xs">Assigned Cognito Role</label>
                <div className="font-semibold capitalize text-blue-600 dark:text-blue-400">
                  {user?.role || 'Buyer'}
                </div>
              </div>
            </div>
          </div>

          {/* Role Details Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                {isSeller ? <Store className="w-4 h-4 text-pink-600" /> : <ShoppingBag className="w-4 h-4 text-blue-600" />}
                {isSeller ? 'Merchant Storefront Details' : 'Buyer Perks & Privileges'}
              </h2>
            </div>

            {isSeller ? (
              <div className="space-y-3 text-xs sm:text-sm">
                <div>
                  <label className="text-slate-400 block text-xs">Store Name</label>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    {user?.storeName || 'Active Merchant Store'}
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block text-xs">Catalog Category</label>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    {user?.sellerCategory || 'General Merchandise'}
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block text-xs">GSTIN / Tax Identifier</label>
                  <div className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {user?.gstNumber || 'Not Registered (Exempt)'}
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block text-xs">Store Status</label>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                    ● Live on Marketplace
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    Free Express Delivery
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Enabled for your verified buyer account on eligible regional items.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    Cognito MFA Protection
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    SMS and email verification protect your account from unauthorized login attempts.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* AWS Security & Architecture Inspector */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Server className="w-4 h-4 text-purple-600" /> AWS Cognito State
              </h2>
              <span className="text-xs font-mono text-slate-400">
                Amplify v6
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">AWS Region:</span>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                  {awsConfigDetails.region}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">User Sub (UUID):</span>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200 truncate max-w-[150px]" title={user?.id}>
                  {user?.id || 'simulated-uuid'}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">User Pool Connected:</span>
                <span className="font-semibold text-emerald-600">
                  {isAwsConfigured ? 'Live AWS Pool' : 'Simulated Sandbox'}
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowTokens(!showTokens)}
                  className="w-full text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline text-center flex items-center justify-center gap-1"
                >
                  <Key className="w-3.5 h-3.5" />
                  {showTokens ? 'Hide JWT Claims' : 'Inspect Cognito Session Claims'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Optional JWT Claims Drawer */}
        {showTokens && (
          <div className="bg-slate-900 text-slate-200 rounded-2xl p-6 font-mono text-xs overflow-x-auto border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-emerald-400">Decoded Cognito Session Payload:</span>
              <span className="text-slate-400 text-[11px]">Secure Browser Session</span>
            </div>
            <pre className="whitespace-pre-wrap leading-relaxed">
              {JSON.stringify(
                {
                  sub: user?.id,
                  email: user?.email,
                  phone_number: user?.phoneNumber,
                  'custom:role': user?.role,
                  'custom:store_name': user?.storeName,
                  token_use: 'id',
                  auth_time: Math.floor(Date.now() / 1000),
                  iss: `https://cognito-idp.${awsConfigDetails.region}.amazonaws.com/${awsConfigDetails.userPoolId || 'USER_POOL_ID'}`,
                },
                null,
                2
              )}
            </pre>
          </div>
        )}

        {/* Live Marketplace Activity / Dummy Metrics */}
        {isSeller ? (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Live Store Performance Metrics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>Gross Sales (30 Days)</span>
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
                  ₹1,42,850
                </div>
                <span className="text-emerald-500 text-xs font-semibold">+18.4% vs last month</span>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>Pending Dispatches</span>
                  <Package className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
                  14 Orders
                </div>
                <span className="text-blue-500 text-xs font-semibold">Ready for courier pickup</span>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                  <span>Product Catalog</span>
                  <Layers className="w-4 h-4 text-purple-500" />
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
                  68 SKUs
                </div>
                <span className="text-slate-400 text-xs">All active in {user?.sellerCategory || 'Catalog'}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Recent Account Activity
            </h3>
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
              <div className="p-4 flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      Cognito Authentication Verified
                    </div>
                    <div className="text-slate-400 text-xs">
                      Logged in from current session
                    </div>
                  </div>
                </div>
                <span className="text-slate-400 text-xs flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Just now
                </span>
              </div>

              <div className="p-4 flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      Buyer Account Established
                    </div>
                    <div className="text-slate-400 text-xs">
                      Default shipping profile set to India (+91)
                    </div>
                  </div>
                </div>
                <span className="text-slate-400 text-xs flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Today
                </span>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="py-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
        Enterprise Session Management • Protected by AWS Cognito IAM & OAuth 2.0 Tokens
      </footer>
    </div>
  );
};

export default Dashboard;
