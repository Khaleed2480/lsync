import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  RefreshCw,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Lock,
  LogOut,
  Trash2,
} from 'lucide-react';
import { apiRequest } from '../utils/api';

export default function Settings() {
  const navigate = useNavigate();

  // Password fields
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  // Password visibility toggles
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);

  // Two-Factor Auth Preference State
  const [twoFactorMethod, setTwoFactorMethod] = useState('email');

  // Feedback states
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Delete Account Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // ================= CHANGE PASSWORD (PUT /api/users/password) =================
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!oldPassword) {
      setErrorMsg('Please enter your old password, or click "Forgot old password?" to reset via email.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== repeatPassword) {
      setErrorMsg('New password and Repeat password do not match.');
      return;
    }

    setIsSaving(true);

    try {
      await apiRequest('/users/password', {
        method: 'PUT',
        body: JSON.stringify({
          currentPassword: oldPassword,
          newPassword: newPassword,
          confirmPassword: repeatPassword,
        }),
      });

      setOldPassword('');
      setNewPassword('');
      setRepeatPassword('');
      setSuccessMsg('Password updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3500);
    } catch (err) {
      setErrorMsg(err.message || 'Could not update password. Check your old password.');
    } finally {
      setIsSaving(false);
    }
  };

  // ================= LOG OUT =================
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('is_authenticated');
    localStorage.removeItem('keep_signed_in');
    navigate('/login');
  };

  // ================= DELETE ACCOUNT (DELETE /api/users/delete) =================
  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setErrorMsg('');
    try {
      await apiRequest('/users/delete', { method: 'DELETE' });
      localStorage.clear();
      setShowDeleteModal(false);
      navigate('/register');
    } catch (err) {
      setErrorMsg(err.message || 'Could not delete account.');
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-5xl mx-auto w-full font-sans">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A102F] tracking-tight">
          Security &amp; Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Update your password, configure security preferences, or manage your account status.
        </p>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-3.5 mb-6 rounded-2xl bg-red-100 border border-red-200 text-red-700 text-xs font-bold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-2 p-3.5 mb-6 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CARD 1: CHANGE PASSWORD (WITH FORGOT OLD PASSWORD LINK) */}
        <form
          onSubmit={handlePasswordChange}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#633BB3]" />
              <h2 className="text-base font-extrabold text-[#1A102F]">
                Change password
              </h2>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#1A102F]">
                  Old password
                </label>
                {/* LINK IF USER FORGOT THEIR OLD PASSWORD */}
                <Link
                  to="/forgot-password"
                  className="text-[11px] font-bold text-[#633BB3] hover:text-[#EB577F] hover:underline"
                >
                  Forgot old password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showOld ? 'text' : 'password'}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 pr-11 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-[#1A102F] placeholder-gray-300 focus:outline-none focus:border-[#633BB3] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowOld(!showOld)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition cursor-pointer"
                >
                  {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A102F] mb-1.5">
                New password
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 pr-11 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-[#1A102F] placeholder-gray-300 focus:outline-none focus:border-[#633BB3] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition cursor-pointer"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A102F] mb-1.5">
                Repeat New Password
              </label>
              <div className="relative">
                <input
                  type={showRepeat ? 'text' : 'password'}
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 pr-11 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-[#1A102F] placeholder-gray-300 focus:outline-none focus:border-[#633BB3] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowRepeat(!showRepeat)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition cursor-pointer"
                >
                  {showRepeat ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3 rounded-xl bg-[#633BB3] hover:bg-[#522F9E] text-white text-xs font-bold shadow-md shadow-[#633BB3]/25 active:scale-95 transition cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isSaving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              <span>{isSaving ? 'Updating Password...' : 'Update Password'}</span>
            </button>
          </div>
        </form>

        {/* RIGHT COLUMN: 2FA + ACCOUNT ACTIONS */}
        <div className="space-y-6">
          
          {/* CARD 2: TWO-FACTOR AUTHENTICATION */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h2 className="text-base font-extrabold text-[#1A102F]">
                  Two-Factor Auth
                </h2>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                Phase 2 Preview
              </span>
            </div>

            <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
              Select your preferred second verification factor (requires backend OTP activation in Phase 2).
            </p>

            <div className="space-y-3 pt-1">
              <label
                onClick={() => setTwoFactorMethod('email')}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition cursor-pointer ${
                  twoFactorMethod === 'email'
                    ? 'border-[#633BB3] bg-purple-50/30'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div>
                  <span className="text-xs font-bold text-[#1A102F] block">
                    Email Authentication
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">
                    Receive a 6-digit code via your registered email.
                  </span>
                </div>
                <input
                  type="radio"
                  name="2fa"
                  checked={twoFactorMethod === 'email'}
                  onChange={() => setTwoFactorMethod('email')}
                  className="w-4 h-4 text-[#633BB3]"
                />
              </label>

              <label
                onClick={() => setTwoFactorMethod('app')}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition cursor-pointer ${
                  twoFactorMethod === 'app'
                    ? 'border-[#633BB3] bg-purple-50/30'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div>
                  <span className="text-xs font-bold text-[#1A102F] block">
                    Google Authenticator
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">
                    Use Google Authenticator or Authy app.
                  </span>
                </div>
                <input
                  type="radio"
                  name="2fa"
                  checked={twoFactorMethod === 'app'}
                  onChange={() => setTwoFactorMethod('app')}
                  className="w-4 h-4 text-[#633BB3]"
                />
              </label>

              <label
                onClick={() => setTwoFactorMethod('disabled')}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition cursor-pointer ${
                  twoFactorMethod === 'disabled'
                    ? 'border-[#633BB3] bg-purple-50/30'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div>
                  <span className="text-xs font-bold text-gray-700 block">
                    Disabled
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">
                    Sign in using only password.
                  </span>
                </div>
                <input
                  type="radio"
                  name="2fa"
                  checked={twoFactorMethod === 'disabled'}
                  onChange={() => setTwoFactorMethod('disabled')}
                  className="w-4 h-4 text-[#633BB3]"
                />
              </label>
            </div>
          </div>

          {/* CARD 3: ACCOUNT MANAGEMENT (MOVED HERE FROM PROFILE) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-5">
            <h2 className="text-base font-extrabold text-[#1A102F]">
              Account Actions
            </h2>

            <div className="flex items-center justify-between gap-4 pb-5 border-b border-gray-100">
              <div>
                <h4 className="text-xs font-bold text-[#1A102F]">Log out</h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Sign out of LSync on this device.
                </p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-xs font-bold text-[#1A102F] transition cursor-pointer shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log out</span>
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-[#FDF2F0] border border-[#F8D7D2]">
              <h4 className="text-xs font-extrabold text-[#B91C1C] mb-1.5">
                Delete account
              </h4>
              <p className="text-[11px] text-[#991B1B]/80 leading-relaxed mb-4">
                This permanently deletes your profile, synced learning activity, and public portfolio.
              </p>
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C92A1D] hover:bg-[#A61E14] text-white text-xs font-bold shadow-sm transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete account</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-gray-100">
            <h3 className="text-lg font-extrabold text-[#1A102F] mb-2">
              Are you sure?
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-6">
              Deleting your account will erase all your synced activities and public portfolio permanently.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteAccount}
                className="px-4 py-2 rounded-xl bg-[#C92A1D] hover:bg-[#A61E14] text-white text-xs font-bold cursor-pointer flex items-center gap-2 disabled:opacity-60"
              >
                {isDeleting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>{isDeleting ? 'Deleting...' : 'Yes, Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}