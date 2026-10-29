import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import AuthModal from './components/auth/AuthModal';
import ProtectedRoute from './routes/ProtectedRoute';

// Pages
import Home from './pages/Home';
import BuyerSignup from './pages/BuyerSignup';
import SellerSignup from './pages/SellerSignup';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

export const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          {/* Global Reference Authentication Modal */}
          <AuthModal />

          {/* Application Routing */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup/buyer" element={<BuyerSignup />} />
            <Route path="/signup/seller" element={<SellerSignup />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
