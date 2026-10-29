import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import Input from './Input';
import { checkPasswordStrength } from '../../utils/validation';

export const PasswordInput = forwardRef(
  (
    {
      label = 'Password',
      value = '',
      error,
      showStrengthMeter = false,
      placeholder = 'Enter password',
      required = false,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const strength = showStrengthMeter ? checkPasswordStrength(value) : null;

    const toggleShow = () => setShowPassword((prev) => !prev);

    return (
      <div className="w-full">
        <Input
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          label={label}
          value={value}
          error={error}
          placeholder={placeholder}
          required={required}
          icon={<Lock className="w-4 h-4" />}
          rightElement={
            <button
              type="button"
              onClick={toggleShow}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              title={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          }
          {...props}
        />

        {showStrengthMeter && value && (
          <div className="mt-2 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-500 dark:text-slate-400">Password Strength:</span>
              <span className={`font-semibold ${
                strength.score >= 4 ? 'text-emerald-600 dark:text-emerald-400' :
                strength.score >= 3 ? 'text-amber-600 dark:text-amber-400' : 'text-red-500'
              }`}>
                {strength.label}
              </span>
            </div>

            {/* Strength meter bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${strength.color}`}
                style={{ width: `${strength.percentage}%` }}
              />
            </div>

            {/* Checklist */}
            <div className="grid grid-cols-2 gap-1 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
              <span className={strength.checks.minLength ? 'text-emerald-600 font-medium' : ''}>
                {strength.checks.minLength ? '✓' : '•'} Min 8 characters
              </span>
              <span className={strength.checks.hasUpper ? 'text-emerald-600 font-medium' : ''}>
                {strength.checks.hasUpper ? '✓' : '•'} 1 Uppercase letter
              </span>
              <span className={strength.checks.hasLower ? 'text-emerald-600 font-medium' : ''}>
                {strength.checks.hasLower ? '✓' : '•'} 1 Lowercase letter
              </span>
              <span className={strength.checks.hasNumber ? 'text-emerald-600 font-medium' : ''}>
                {strength.checks.hasNumber ? '✓' : '•'} 1 Number
              </span>
              <span className={strength.checks.hasSpecial ? 'text-emerald-600 font-medium' : ''}>
                {strength.checks.hasSpecial ? '✓' : '•'} 1 Special character
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
export default PasswordInput;
