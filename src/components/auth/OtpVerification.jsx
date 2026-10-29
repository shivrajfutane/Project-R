import React, { useState, useEffect, useRef } from 'react';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';

export const OtpVerification = ({
  target, // phone number or email
  targetType = 'phone', // 'phone' | 'email'
  onVerify,
  onResend,
  onBack,
  isLoading = false,
  error = null,
}) => {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleChange = (index, value) => {
    // Allow only single numeric digit
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned && value !== '') return;

    const newDigits = [...digits];
    newDigits[index] = cleaned.slice(-1);
    setDigits(newDigits);

    // Auto-advance
    if (cleaned && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const newDigits = [...digits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || '';
    }
    setDigits(newDigits);

    const nextIndex = Math.min(pasted.length, 5);
    if (inputRefs.current[nextIndex]) {
      inputRefs.current[nextIndex].focus();
    }
  };

  const code = digits.join('');
  const isComplete = code.length === 6;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isComplete && onVerify) {
      onVerify(code);
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    setCountdown(30);
    setCanResend(false);
    if (onResend) onResend();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="text-center">
        <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">
          Enter Verification Code
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          We have sent a 6-digit verification OTP to{' '}
          <span className="font-semibold text-slate-800 dark:text-slate-200">{target}</span>
        </p>
      </div>

      {/* 6-box input */}
      <div className="flex justify-center items-center gap-2 sm:gap-3 py-1">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={`w-10 h-12 sm:w-12 sm:h-14 text-center font-bold text-lg sm:text-xl rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-all outline-none ${
              digit
                ? 'border-blue-600 ring-2 ring-blue-100 dark:ring-blue-900/40'
                : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40'
            }`}
          />
        ))}
      </div>

      {error && (
        <p className="text-xs text-red-500 text-center font-medium">{error}</p>
      )}

      {/* Resend OTP */}
      <div className="flex items-center justify-between text-xs px-1">
        <button
          type="button"
          onClick={onBack}
          className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline font-medium"
        >
          Change {targetType === 'phone' ? 'Mobile Number' : 'Email'}
        </button>

        {canResend ? (
          <button
            type="button"
            onClick={handleResend}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold"
          >
            Resend OTP
          </button>
        ) : (
          <span className="text-slate-400">
            Resend in <span className="font-semibold text-slate-600 dark:text-slate-300">{countdown}s</span>
          </span>
        )}
      </div>

      {/* Yellow Continue Button */}
      <Button
        type="submit"
        variant="yellow"
        fullWidth
        size="lg"
        disabled={!isComplete || isLoading}
        isLoading={isLoading}
      >
        Verify & Continue
      </Button>
    </form>
  );
};

export default OtpVerification;
