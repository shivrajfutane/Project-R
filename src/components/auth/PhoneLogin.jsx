import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';
import OtpVerification from './OtpVerification';
import { isValidIndianPhone, formatPhoneToE164 } from '../../utils/validation';

export const PhoneLogin = () => {
  const navigate = useNavigate();
  const { loginWithPhoneOtp, confirmPhoneOtp, rememberMe, setRememberMe } = useAuth();

  const [phone, setPhone] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [demoOtpNotice, setDemoOtpNotice] = useState(null);

  const handlePhoneChange = (e) => {
    // Only numbers, max 10 digits
    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(cleaned);
    if (error) setError(null);
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!phone) {
      setError('Please enter your 10-digit mobile number');
      return;
    }

    if (!isValidIndianPhone(phone)) {
      setError('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await loginWithPhoneOtp(phone);
      setStep('otp');
      if (res.demoCode) {
        setDemoOtpNotice(`Demo OTP Code: ${res.demoCode}`);
      }
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please check the number.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (code) => {
    setIsLoading(true);
    setError(null);
    try {
      await confirmPhoneOtp(phone, code);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid or expired OTP code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const res = await loginWithPhoneOtp(phone);
      if (res.demoCode) {
        setDemoOtpNotice(`New Demo OTP Code: ${res.demoCode}`);
      }
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
    }
  };

  if (step === 'otp') {
    return (
      <div className="space-y-4">
        {demoOtpNotice && (
          <div className="bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-xs py-1.5 px-3 rounded-lg text-center font-mono font-bold">
            {demoOtpNotice}
          </div>
        )}
        <OtpVerification
          target={`+91 ${phone}`}
          targetType="phone"
          onVerify={handleVerifyOtp}
          onResend={handleResendOtp}
          onBack={() => setStep('phone')}
          isLoading={isLoading}
          error={error}
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleRequestOtp} className="space-y-5">
      {/* Phone number input group with Indian flag and +91 */}
      <div>
        <label
          htmlFor="mobile-number"
          className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
        >
          Mobile Number
        </label>
        <div className="flex rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-900/40 overflow-hidden transition-all">
          {/* Flag & Country Code Selector */}
          <div className="flex items-center gap-1.5 pl-3.5 pr-2 py-2.5 bg-slate-50 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 select-none">
            {/* Indian Flag Emoji/SVG */}
            <span className="text-lg leading-none" role="img" aria-label="India flag">
              🇮🇳
            </span>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              +91
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* Number input */}
          <input
            id="mobile-number"
            type="tel"
            inputMode="numeric"
            placeholder="Enter 10-digit mobile number"
            value={phone}
            onChange={handlePhoneChange}
            maxLength={10}
            className="flex-1 px-3.5 py-2.5 text-sm bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none"
            autoComplete="tel-national"
          />
        </div>

        {error && (
          <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1">
            <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </p>
        )}
      </div>

      {/* Remember Me Checkbox */}
      <div className="flex items-center justify-between text-xs">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded text-blue-600 border-slate-300 dark:border-slate-600 focus:ring-blue-500 dark:bg-slate-800"
          />
          <span className="text-slate-600 dark:text-slate-300 font-medium">
            Remember Me
          </span>
        </label>
      </div>

      {/* Rounded Yellow Continue Button from Reference Screenshot */}
      <Button
        type="submit"
        variant="yellow"
        fullWidth
        size="lg"
        isLoading={isLoading}
      >
        Continue
      </Button>
    </form>
  );
};

export default PhoneLogin;
