import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import SplashScreen from './components/SplashScreen';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Activity from './pages/Activity';
import Skills from './pages/Skills';
import Analytics from './pages/Analytics';
import Sources from './pages/Sources';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import PublicPortfolio from './pages/PublicPortfolio';
import DashboardLayout from './components/DashboardLayout';

function HomeRoute() {
  const hasSavedSession =
    localStorage.getItem('keep_signed_in') === 'true' &&
    localStorage.getItem('is_authenticated') === 'true' &&
    Boolean(localStorage.getItem('token')) &&
    Boolean(localStorage.getItem('user'));

  return hasSavedSession ? <Navigate to="/dashboard" replace /> : <Landing />;
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <AppProvider>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Public Shareable Portfolio */}
          <Route path="/portfolio" element={<PublicPortfolio />} />
          <Route path="/portfolio/:username" element={<PublicPortfolio />} />

          {/* Protected Dashboard Pages */}
          <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
          <Route path="/activity" element={<DashboardLayout><Activity /></DashboardLayout>} />
          <Route path="/skills" element={<DashboardLayout><Skills /></DashboardLayout>} />
          <Route path="/analytics" element={<DashboardLayout><Analytics /></DashboardLayout>} />
          <Route path="/sources" element={<DashboardLayout><Sources /></DashboardLayout>} />
          <Route path="/profile" element={<DashboardLayout><Profile /></DashboardLayout>} />
          <Route path="/settings" element={<DashboardLayout><Settings /></DashboardLayout>} />
          <Route path="/profile/edit" element={<DashboardLayout><Settings /></DashboardLayout>} />

          <Route
            path="*"
            element={
              <div className="min-h-screen flex flex-col items-center justify-center bg-[#140C24] text-white">
                <h1 className="text-4xl font-extrabold text-[#F4A836] mb-2">404</h1>
                <p className="text-sm text-gray-400">Page Not Found</p>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}