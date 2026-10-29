import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Store, Building2, ArrowLeft, ShieldCheck, Tag } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/common/Input';
import PasswordInput from '../components/common/PasswordInput';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import OtpVerification from '../components/auth/OtpVerification';
import ThemeToggle from '../components/common/ThemeToggle';
import { validateSellerSignup } from '../utils/validation';

const SELLER_CATEGORIES = [
  'Consumer Electronics & Gadgets',
  'Fashion, Apparel & Footwear',
  'Home, Kitchen & Furnishing',
  'Grocery & Gourmet Foods',
  'Beauty, Wellness & Personal Care',
  'Books, Stationery & Office Supplies',
  'Handmade, Crafts & Art',
  'Sports, Fitness & Outdoors',
  'Automotive & Industrial Parts',
];

export const SellerSignup = () => {
  const navigate = useNavigate();
  const { signup, verifyAccount, resendVerification, openAuthModal, isAwsConfigured } = useAuth();

  const [step, setStep] = useState('form'); // 'form' | 'verify' | 'success'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    storeName: '',
    category: SELLER_CATEGORIES[0],
    gstNumber: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError(null);

    const validation = validateSellerSignup(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);

    try {
      await signup({
        name: formData.name,
        email: formData.email,
        phone_number: `+91${formData.phone.replace(/\D/g, '')}`,
        password: formData.password,
        role: 'seller',
        storeName: formData.storeName,
        sellerCategory: formData.category,
        gstNumber: formData.gstNumber,
      });
      setRegisteredEmail(formData.email);
      setStep('verify');
    } catch (err) {
      setGeneralError(err.message || 'Seller registration failed. Please verify all details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (code) => {
    setIsLoading(true);
    setGeneralError(null);
    try {
      await verifyAccount(registeredEmail, code);
      setStep('success');
    } catch (err) {
      setGeneralError(err.message || 'Verification failed. Please check the code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendVerification(registeredEmail);
    } catch (err) {
      setGeneralError(err.message || 'Failed to resend code');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between transition-colors">
      {/* Top Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-slate-800 dark:text-slate-100 font-extrabold text-xl">
          <div className="w-9 h-9 rounded-xl bg-pink-600 flex items-center justify-center text-white shadow-md">
            <Store className="w-5 h-5" />
          </div>
          <span>Cloud<span className="text-pink-500">Seller</span> Hub</span>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => openAuthModal('email')}
            className="text-sm font-semibold text-pink-600 dark:text-pink-400 hover:underline px-3 py-1.5"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
        <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
          
          {/* Breadcrumb / Role Badge */}
          <div className="flex items-center justify-between mb-4">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-pink-50 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-900">
              <Store className="w-3.5 h-3.5" /> Merchant / Seller Onboarding
            </span>
          </div>

          {!isAwsConfigured && (
            <div className="mb-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Demo Mode Active • In demo mode, use code 123456
              </span>
            </div>
          )}

          {step === 'form' && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E40AF] dark:text-blue-400 tracking-tight">
                  Register as a Seller
                </h1>
                <div className="w-12 h-1 bg-[#EC4899] rounded-full mt-2" />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Launch your online storefront, reach pan-India buyers, and manage inventory seamlessly.
                </p>
              </div>

              {generalError && (
                <Alert type="error" className="mb-4" onClose={() => setGeneralError(null)}>
                  {generalError}
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Personal Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Authorized Representative Name"
                    name="name"
                    placeholder="e.g. Rajesh Patel"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    icon={<User className="w-4 h-4" />}
                    required
                  />

                  <Input
                    label="Official Business Email"
                    name="email"
                    type="email"
                    placeholder="sales@store.com"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    icon={<Mail className="w-4 h-4" />}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Contact Mobile Number"
                    name="phone"
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={formData.phone}
                    onChange={(e) => {
                      const cleaned = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setFormData((prev) => ({ ...prev, phone: cleaned }));
                    }}
                    error={errors.phone}
                    icon={<Phone className="w-4 h-4" />}
                    required
                  />

                  <Input
                    label="Store / Business Name"
                    name="storeName"
                    placeholder="e.g. Patel Electronics"
                    value={formData.storeName}
                    onChange={handleChange}
                    error={errors.storeName}
                    icon={<Store className="w-4 h-4" />}
                    required
                  />
                </div>

                {/* Business Category Dropdown */}
                <div>
                  <label
                    htmlFor="seller-category"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Primary Business Category <span className="text-pink-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-3 text-slate-400 pointer-events-none">
                      <Tag className="w-4 h-4" />
                    </div>
                    <select
                      id="seller-category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30"
                    >
                      {SELLER_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.category && (
                    <p className="text-xs text-red-500 mt-1 font-medium">{errors.category}</p>
                  )}
                </div>

                {/* GSTIN / Tax ID */}
                <Input
                  label="GSTIN / Business Registration ID (Optional)"
                  name="gstNumber"
                  placeholder="e.g. 22AAAAA0000A1Z5"
                  value={formData.gstNumber}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      gstNumber: e.target.value.toUpperCase().slice(0, 15),
                    }));
                  }}
                  error={errors.gstNumber}
                  icon={<Building2 className="w-4 h-4" />}
                  helperText="15-character Goods and Services Tax Identification Number"
                />

                {/* Passwords */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <PasswordInput
                    label="Account Password"
                    name="password"
                    placeholder="Min 8 characters"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    showStrengthMeter
                    required
                  />

                  <PasswordInput
                    label="Confirm Password"
                    name="confirmPassword"
                    placeholder="Re-type password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                    required
                  />
                </div>

                {/* Terms agreement */}
                <div>
                  <label className="flex items-start gap-2.5 text-xs cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      className="w-4 h-4 mt-0.5 rounded text-pink-600 border-slate-300 dark:border-slate-600 focus:ring-pink-500"
                    />
                    <span className="text-slate-600 dark:text-slate-300">
                      I agree to the{' '}
                      <a href="#seller-policy" className="text-pink-600 dark:text-pink-400 font-semibold hover:underline">
                        Merchant Services Agreement
                      </a>{' '}
                      and Marketplace Compliance Standards
                    </span>
                  </label>
                  {errors.agreeTerms && (
                    <p className="text-xs text-red-500 mt-1 font-medium">{errors.agreeTerms}</p>
                  )}
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  variant="yellow"
                  fullWidth
                  size="lg"
                  isLoading={isLoading}
                >
                  Register Store & Continue
                </Button>
              </form>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
                Already registered as a merchant?{' '}
                <button
                  type="button"
                  onClick={() => openAuthModal('email')}
                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Sign In
                </button>
                {' • '}
                <Link to="/signup/buyer" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                  Register as Buyer instead
                </Link>
              </div>
            </>
          )}

          {step === 'verify' && (
            <div className="py-2">
              {generalError && (
                <Alert type="error" className="mb-4" onClose={() => setGeneralError(null)}>
                  {generalError}
                </Alert>
              )}
              <OtpVerification
                target={registeredEmail}
                targetType="email"
                onVerify={handleVerify}
                onResend={handleResend}
                onBack={() => setStep('form')}
                isLoading={isLoading}
              />
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-pink-100 dark:bg-pink-950 text-pink-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                Seller Account Activated!
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                Your merchant profile <span className="font-semibold text-slate-800 dark:text-slate-200">{formData.storeName}</span> is now verified on AWS Cognito. Sign in to access your Seller Central dashboard.
              </p>
              <Button
                type="button"
                variant="yellow"
                fullWidth
                size="lg"
                onClick={() => {
                  openAuthModal('email');
                  navigate('/');
                }}
              >
                Sign In to Seller Central
              </Button>
            </div>
          )}
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-slate-400">
        © 2026 CloudMarket Seller Onboarding. Secured with Amazon Cognito User Pools.
      </footer>
    </div>
  );
};

export default SellerSignup;
