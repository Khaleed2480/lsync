import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Auth from './pages/Auth';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Activity from './pages/Activity';
import Skills from './pages/Skills';
import Analytics from './pages/Analytics';
import Sources from './pages/Sources';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import DashboardLayout from './components/DashboardLayout';

// Checks if the user checked "Keep me signed in" previously
function RootRedirect() {
  const hasSavedSession =
    localStorage.getItem('keep_signed_in') === 'true' &&
    localStorage.getItem('is_authenticated') === 'true' &&
    Boolean(localStorage.getItem('user'));

  return <Navigate to={hasSavedSession ? '/dashboard' : '/login'} replace />;
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

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