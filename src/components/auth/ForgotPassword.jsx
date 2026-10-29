import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Input from '../common/Input';
import PasswordInput from '../common/PasswordInput';
import Button from '../common/Button';
import { isValidEmail } from '../../utils/validation';

export const ForgotPassword = ({ onBackToLogin }) => {
  const { forgotPassword, resetPassword } = useAuth();

  const [step, setStep] = useState('request'); // 'request' | 'reset' | 'success'
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Request code
  const handleRequestCode = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter your email or username');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await forgotPassword(username.trim());
      setStep('reset');
    } catch (err) {
      setError(err.message || 'Failed to request password reset code');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Submit new password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!code.trim() || code.trim().length !== 6) {
      setError('Please enter a valid 6-digit confirmation code');
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await resetPassword(username.trim(), code.trim(), newPassword);
      setStep('success');
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please check the code.');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="text-center py-4 space-y-4">
        <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Password Reset Complete
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Your password has been securely updated. You can now log in with your new credentials.
          </p>
        </div>
        <Button
          type="button"
          variant="yellow"
          fullWidth
          size="lg"
          onClick={onBackToLogin}
        >
          Sign In Now
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <button
          type="button"
          onClick={onBackToLogin}
          className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg"
          title="Back to login"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {step === 'request' ? 'Password Recovery' : 'Create New Password'}
        </span>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-300 text-xs p-3 rounded-xl">
          {error}
        </div>
      )}

      {step === 'request' ? (
        <form onSubmit={handleRequestCode} className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter the email address associated with your account and we'll send you a password reset code.
          </p>

          <Input
            label="Email or Username"
            type="text"
            placeholder="name@company.com"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            icon={<Mail className="w-4 h-4" />}
            required
          />

          <Button
            type="submit"
            variant="yellow"
            fullWidth
            size="lg"
            isLoading={isLoading}
          >
            Send Reset Code
          </Button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter the 6-digit code sent to <span className="font-semibold text-slate-700 dark:text-slate-200">{username}</span> and choose a new password.
          </p>

          <Input
            label="6-Digit Reset Code"
            type="text"
            placeholder="123456"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            required
          />

          <PasswordInput
            label="New Password"
            placeholder="Enter at least 8 characters"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            showStrengthMeter
            required
          />

          <PasswordInput
            label="Confirm New Password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="yellow"
            fullWidth
            size="lg"
            isLoading={isLoading}
          >
            Update Password
          </Button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
