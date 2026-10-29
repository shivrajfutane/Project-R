import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';

export const ProtectedRoute = ({ children, allowedRoles = null }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 gap-3">
        <LoadingSpinner size="lg" className="text-blue-600" />
        <p className="text-sm font-medium animate-pulse">Verifying authenticated session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save attempted location for post-login redirect
    return <Navigate to="/?auth=required" state={{ from: location }} replace />;
  }

  // Check role authorization if specified
  if (allowedRoles && Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    const userRole = user?.role || 'buyer';
    if (!allowedRoles.includes(userRole)) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 text-center">
          <div className="max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xl">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-950/60 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-2xl">
              !
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Unauthorized Role Access
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              Your account role (<span className="font-semibold text-blue-600">{userRole}</span>) does not have permission to view this restricted area.
            </p>
            <a
              href="/dashboard"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm transition-colors"
            >
              Return to Your Dashboard
            </a>
          </div>
        </div>
      );
    }
  }

  return children;
};

export default ProtectedRoute;
