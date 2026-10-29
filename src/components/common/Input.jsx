import React, { forwardRef } from 'react';

export const Input = forwardRef(
  (
    {
      label,
      id,
      name,
      type = 'text',
      placeholder,
      value,
      onChange,
      onBlur,
      error,
      helperText,
      required = false,
      disabled = false,
      icon = null,
      rightElement = null,
      className = '',
      inputClassName = '',
      ...props
    },
    ref
  ) => {
    const inputId = id || name || Math.random().toString(36).substring(2, 9);
    const errorId = `${inputId}-error`;

    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 tracking-wide"
          >
            {label}
            {required && <span className="text-pink-500 ml-1 font-bold">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className={`
              w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500
              border rounded-xl text-sm transition-all duration-150 py-2.5 outline-none
              ${icon ? 'pl-10' : 'pl-3.5'}
              ${rightElement ? 'pr-11' : 'pr-3.5'}
              ${
                error
                  ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-950/40'
                  : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30'
              }
              ${disabled ? 'bg-slate-100 dark:bg-slate-800/60 cursor-not-allowed opacity-75' : ''}
              ${inputClassName}
            `}
            {...props}
          />

          {rightElement && (
            <div className="absolute right-3 flex items-center">
              {rightElement}
            </div>
          )}
        </div>

        {error && (
          <p id={errorId} className="mt-1 text-xs text-red-500 font-medium flex items-center gap-1">
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

        {helperText && !error && (
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
