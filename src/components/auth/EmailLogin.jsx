import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Input from '../common/Input';
import PasswordInput from '../common/PasswordInput';
import Button from '../common/Button';
import { isValidEmail } from '../../utils/validation';

export const EmailLogin = ({ onForgotPassword }) => {
  const navigate = useNavigate();
  const { loginWithEmail, rememberMe, setRememberMe } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    if (generalError) setGeneralError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setGeneralError(null);

    try {
      await loginWithEmail(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setGeneralError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {generalError && (
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs p-3 rounded-xl flex items-start gap-2">
          <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <div className="leading-snug">{generalError}</div>
        </div>
      )}

      {/* Email input */}
      <Input
        label="Email Address"
        name="email"
        type="email"
        placeholder="name@company.com"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        icon={<Mail className="w-4 h-4" />}
        autoComplete="email"
      />

      {/* Password input */}
      <div>
        <PasswordInput
          label="Password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="current-password"
        />

        <div className="flex justify-end mt-1.5">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline"
          >
            Forgot Password?
          </button>
        </div>
      </div>

      {/* Remember Me Checkbox */}
      <div className="flex items-center text-xs">
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

      {/* Rounded Yellow Continue Button */}
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

export default EmailLogin;
