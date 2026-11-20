import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, KeyRound, Eye, EyeOff, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { apiRequest } from '../utils/api';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Auto-reads ?token=... from email link if present, or allows manual paste
  const [token, setToken] = useState(searchParams.get('token') || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!token.trim()) {
      setErrorMessage('Reset token is required.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      await apiRequest('/auth/reset-password', {
        method: 'POST',
        skipAuth: true,
        body: JSON.stringify({
          token: token.trim(),
          newPassword,
        }),
      });

      setSuccessMessage('Password reset successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setErrorMessage(err.message || 'Invalid or expired reset token.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 bg-[#120A22] font-sans select-none relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[15%] left-[18%] w-96 h-96 bg-[#7038C4]/30 rounded-full blur-[130px] animate-pulse" />
        <div className="absolute bottom-[12%] right-[18%] w-96 h-96 bg-[#EB577F]/25 rounded-full blur-[130px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[540px] rounded-full bg-[#3A1E6E]/25 border border-[#7038C4]/15" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-3xl p-8 sm:p-10 backdrop-blur-2xl bg-[#1A0F2E]/85 border border-[#7038C4]/45 shadow-[0_15px_60px_-10px_rgba(112,56,196,0.4)]">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#7038C4] to-[#EB577F] shadow-lg shadow-[#EB577F]/25 mb-4 ring-4 ring-[#7038C4]/25">
              <Lock className="w-7 h-7 text-[#FAF7F2]" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#FAF7F2]">
              Set New Password
            </h2>
            <p className="text-xs text-[#FAF7F2]/65 mt-2">
              Enter your reset token and choose a strong new password.
            </p>
          </div>

          {errorMessage && (
            <div className="flex items-center gap-2 p-3 mb-5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="flex items-center gap-2 p-3 mb-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#FAF7F2]/85 mb-1.5">
                Reset Token
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FAF7F2]/40" />
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Paste your 64-character token"
                  className="w-full pl-10 pr-4 py-3 bg-[#120A22]/85 border border-[#3A2263] rounded-xl text-xs font-medium text-[#FAF7F2] placeholder-[#FAF7F2]/30 focus:outline-none focus:border-[#EB577F] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#FAF7F2]/85 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FAF7F2]/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-[#120A22]/85 border border-[#3A2263] rounded-xl text-sm font-medium text-[#FAF7F2] placeholder-[#FAF7F2]/30 focus:outline-none focus:border-[#EB577F] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#FAF7F2]/40 hover:text-[#FAF7F2] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#FAF7F2]/85 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FAF7F2]/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-[#120A22]/85 border border-[#3A2263] rounded-xl text-sm font-medium text-[#FAF7F2] placeholder-[#FAF7F2]/30 focus:outline-none focus:border-[#EB577F] transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-[#7038C4] via-[#EB577F] to-[#F3A737] hover:opacity-95 text-[#FAF7F2] font-bold text-sm rounded-xl shadow-lg shadow-[#7038C4]/30 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? 'Resetting password...' : 'Reset Password'}
            </button>
          </form>

          <div className="mt-7 pt-5 border-t border-[#3A2263]/60 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#FAF7F2]/75 hover:text-[#FAF7F2] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-[#EB577F]" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}