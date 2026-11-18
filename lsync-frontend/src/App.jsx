import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Activity from './pages/Activity';
import Skills from './pages/Skills';
import Analytics from './pages/Analytics';
import Sources from './pages/Sources';
import Profile from './pages/Profile';
import Settings from './pages/Settings'; 
import EditProfile from './pages/EditProfile';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Inner Pages */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/sources" element={<Sources />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} /> 
        <Route path="/profile/edit" element={<Settings />} />

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
  );
}