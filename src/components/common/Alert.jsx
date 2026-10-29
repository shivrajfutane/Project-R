import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export const Alert = ({
  type = 'info', // 'error' | 'success' | 'info' | 'warning'
  title,
  children,
  onClose,
  className = '',
}) => {
  const styles = {
    error: {
      container: 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900/60 text-red-800 dark:text-red-200',
      icon: <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />,
      closeBtn: 'text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50',
    },
    success: {
      container: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-200',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />,
      closeBtn: 'text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/50',
    },
    warning: {
      container: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-200',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />,
      closeBtn: 'text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-900/50',
    },
    info: {
      container: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/60 text-blue-800 dark:text-blue-200',
      icon: <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />,
      closeBtn: 'text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50',
    },
  };

  const current = styles[type] || styles.info;

  return (
    <div
      role="alert"
      className={`border rounded-xl p-3.5 flex items-start gap-3 transition-all duration-200 text-xs sm:text-sm ${current.container} ${className}`}
    >
      {current.icon}
      <div className="flex-1 min-w-0">
        {title && <h5 className="font-semibold mb-0.5 text-sm">{title}</h5>}
        <div className="leading-relaxed break-words">{children}</div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className={`p-1 rounded-md transition-colors -mr-1 -mt-1 ${current.closeBtn}`}
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
