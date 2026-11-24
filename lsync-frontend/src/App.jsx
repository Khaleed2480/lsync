import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { API_URL } from './utils/api';
import SplashScreen from './components/SplashScreen';
import DashboardLayout from './components/DashboardLayout';

// Lazy load pages so mobile users ONLY download the page they open!
const Landing = lazy(() => import('./pages/Landing'));
const Auth = lazy(() => import('./pages/Auth'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Activity = lazy(() => import('./pages/Activity'));
const Skills = lazy(() => import('./pages/Skills'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Sources = lazy(() => import('./pages/Sources'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const PublicPortfolio = lazy(() => import('./pages/PublicPortfolio'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F6FA]">
      <div className="w-8 h-8 rounded-full border-4 border-[#633BB3] border-t-transparent animate-spin" />
    </div>
  );
}

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

  // Silently wake up Render backend the instant someone visits the website
  useEffect(() => {
    fetch(`${API_URL}/health`).catch(() => {});
  }, []);

  return (
    <AppProvider>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
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
        </Suspense>
      </BrowserRouter>
    </AppProvider>
  );
}