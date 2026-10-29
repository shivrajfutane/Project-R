import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, ShoppingBag, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/common/Input';
import PasswordInput from '../components/common/PasswordInput';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import OtpVerification from '../components/auth/OtpVerification';
import ThemeToggle from '../components/common/ThemeToggle';
import { validateBuyerSignup } from '../utils/validation';

export const BuyerSignup = () => {
  const navigate = useNavigate();
  const { signup, verifyAccount, resendVerification, openAuthModal, isAwsConfigured } = useAuth();

  const [step, setStep] = useState('form'); // 'form' | 'verify' | 'success'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
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

    const validation = validateBuyerSignup(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);

    try {
      await signup({
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone ? `+91${formData.phone.replace(/\D/g, '')}` : '',
        password: formData.password,
        role: 'buyer',
      });
      setRegisteredEmail(formData.email);
      setStep('verify');
    } catch (err) {
      setGeneralError(err.message || 'Registration failed. Please verify your details.');
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
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <span>Cloud<span className="text-pink-500">Market</span></span>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => openAuthModal('email')}
            className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline px-3 py-1.5"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
          
          {/* Breadcrumb / Role Badge */}
          <div className="flex items-center justify-between mb-4">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
              <ShoppingBag className="w-3.5 h-3.5" /> Buyer Account
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
                  Create Buyer Account
                </h1>
                <div className="w-12 h-1 bg-[#EC4899] rounded-full mt-2" />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Join millions of shoppers. Discover trending deals and track your orders.
                </p>
              </div>

              {generalError && (
                <Alert type="error" className="mb-4" onClose={() => setGeneralError(null)}>
                  {generalError}
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Full Name"
                  name="name"
                  placeholder="e.g. Priya Sharma"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  icon={<User className="w-4 h-4" />}
                  required
                />

                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="priya@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  icon={<Mail className="w-4 h-4" />}
                  required
                />

                <Input
                  label="Mobile Number (Optional)"
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
                  helperText="Format: 10 digits (e.g. 9876543210)"
                />

                <PasswordInput
                  label="Password"
                  name="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  showStrengthMeter
                  required
                />

                <PasswordInput
                  label="Confirm Password"
                  name="confirmPassword"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  required
                />

                {/* Terms checkbox */}
                <div>
                  <label className="flex items-start gap-2.5 text-xs cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      className="w-4 h-4 mt-0.5 rounded text-blue-600 border-slate-300 dark:border-slate-600 focus:ring-blue-500"
                    />
                    <span className="text-slate-600 dark:text-slate-300">
                      I agree to the{' '}
                      <a href="#terms" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#privacy" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                        Privacy Policy
                      </a>
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
                  Create Buyer Account
                </Button>
              </form>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => openAuthModal('email')}
                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Sign In
                </button>
                {' • '}
                <Link to="/signup/seller" className="text-pink-600 dark:text-pink-400 font-semibold hover:underline">
                  Register as Seller instead
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
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                Account Verified Successfully!
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                Welcome to CloudMarket! Your AWS Cognito buyer credentials are confirmed. You can now log in to start shopping.
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
                Sign In to Your Account
              </Button>
            </div>
          )}
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-slate-400">
        © 2026 CloudMarket Enterprise Authentication. Powered by Amazon Cognito & React.
      </footer>
    </div>
  );
};

export default BuyerSignup;
