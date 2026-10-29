import React from 'react';
import LoadingSpinner from './LoadingSpinner';

export const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'yellow', // 'yellow' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size = 'md',        // 'sm' | 'md' | 'lg'
  isLoading = false,
  disabled = false,
  fullWidth = false,
  rounded = 'full',   // 'full' | 'xl' | 'lg' | 'md'
  icon = null,
  className = '',
  ...props
}) => {
  const baseClasses =
    'relative inline-flex items-center justify-center font-semibold text-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] select-none';

  const roundedClasses = {
    full: 'rounded-full',
    xl: 'rounded-xl',
    lg: 'rounded-lg',
    md: 'rounded-md',
  };

  const sizeClasses = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
  };

  const variantClasses = {
    // Yellow continue button from reference screenshot
    yellow:
      'bg-[#FFC000] hover:bg-[#E5AC00] active:bg-[#CC9800] text-slate-900 font-bold shadow-sm hover:shadow focus:ring-[#FFC000]',
    primary:
      'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-500',
    secondary:
      'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 focus:ring-slate-400',
    outline:
      'border border-slate-300 dark:border-slate-700 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 focus:ring-blue-500',
    ghost:
      'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 focus:ring-slate-400',
    danger:
      'bg-red-600 hover:bg-red-700 text-white shadow-sm focus:ring-red-500',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        ${baseClasses}
        ${roundedClasses[rounded] || roundedClasses.full}
        ${sizeClasses[size] || sizeClasses.md}
        ${variantClasses[variant] || variantClasses.yellow}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size="sm" className="mr-2" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {icon && <span className="inline-flex shrink-0">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};

export default Button;
