import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home as HomeIcon } from 'lucide-react';
import Button from '../components/common/Button';

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-slate-800 dark:text-slate-100">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl">
        <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-500 mb-2">
          404
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
          The page or authentication route you are trying to access does not exist or has moved.
        </p>
        <Link to="/">
          <Button variant="yellow" fullWidth icon={<HomeIcon className="w-4 h-4" />}>
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
