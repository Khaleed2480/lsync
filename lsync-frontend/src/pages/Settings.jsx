import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RefreshCw,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Lock,
} from 'lucide-react';

export default function Settings() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Dynamic user data
  const [photo, setPhoto] = useState(null);
  const [firstName, setFirstName] = useState('Daniel');
  const [lastName, setLastName] = useState('Okunlola');
  const [email, setEmail] = useState('daniel@example.com');
  const [phone, setPhone] = useState('+234 812 345 6789');
  const [github, setGithub] = useState('https://github.com/daniel-dev');
  const [linkedin, setLinkedin] = useState('https://linkedin.com/in/daniel');

  // Password fields
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  // Password visibility toggles
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);

  // Two-Factor Auth State
  const [twoFactorMethod, setTwoFactorMethod] = useState('email');

  // Feedback states
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      if (stored.fullName || stored.name) {
        const parts = (stored.fullName || stored.name).split(' ');
        setFirstName(parts[0] || 'Daniel');
        setLastName(parts.slice(1).join(' ') || 'Okunlola');
      }
      if (stored.email) setEmail(stored.email);
      if (stored.photo) setPhoto(stored.photo);
      if (stored.phone) setPhone(stored.phone);
      if (stored.github) setGithub(stored.github);
      if (stored.linkedin) setLinkedin(stored.linkedin);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const displayName = `${firstName} ${lastName}`.trim() || 'Daniel Okunlola';
  const initials =
    displayName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'DO';

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAll = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (newPassword || repeatPassword || oldPassword) {
      if (!oldPassword) {
        setErrorMsg('Please enter your old password to set a new one.');
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
    }

    setIsSaving(true);

    setTimeout(() => {
      // Preserve existing user fields (like interests, username, headline) while updating settings
      const existing = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = {
        ...existing,
        fullName: displayName,
        name: displayName,
        email,
        phone,
        photo,
        github,
        linkedin,
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setIsSaving(false);
      setSuccessMsg('All changes and security settings saved successfully!');
      setOldPassword('');
      setNewPassword('');
      setRepeatPassword('');

      setTimeout(() => setSuccessMsg(''), 3000);
    }, 900);
  };

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-6xl mx-auto w-full font-sans">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A102F] tracking-tight">
          Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Manage your personal profile, update your password, and configure two-factor authentication.
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

      <form onSubmit={handleSaveAll} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* LEFT CARD: GENERAL INFO */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-base font-extrabold text-[#1A102F]">
              General Information
            </h2>

            <div className="flex items-center gap-5">
              {photo ? (
                <img
                  src={photo}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover ring-4 ring-purple-100 shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-[#4332C8] text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
                  {initials}
                </div>
              )}

              <div>
                <div className="flex items-center gap-3 mb-1">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="px-4 py-1.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-xs font-bold text-[#1A102F] transition cursor-pointer"
                  >
                    Change photo
                  </button>
                  {photo && (
                    <button
                      type="button"
                      onClick={() => setPhoto(null)}
                      className="text-xs font-bold text-[#633BB3] hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-gray-400">
                  A square image works best. Shown on your public portfolio.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1A102F] mb-1.5">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-[#1A102F] focus:outline-none focus:border-[#633BB3] transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1A102F] mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-[#1A102F] focus:outline-none focus:border-[#633BB3] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A102F] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-[#1A102F] focus:outline-none focus:border-[#633BB3] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A102F] mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-[#1A102F] focus:outline-none focus:border-[#633BB3] transition"
              />
            </div>

            <div className="space-y-3 pt-2">
              <span className="block text-xs font-extrabold text-[#1A102F]">
                Social Profiles (Portfolio Links)
              </span>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1">
                  GitHub URL
                </label>
                <input
                  type="url"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs font-medium text-[#1A102F] focus:outline-none focus:border-[#633BB3] transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs font-medium text-[#1A102F] focus:outline-none focus:border-[#633BB3] transition"
                />
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: CHANGE PASSWORD & 2FA */}
          <div className="space-y-6">
            
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#633BB3]" />
                <h2 className="text-base font-extrabold text-[#1A102F]">
                  Change password
                </h2>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A102F] mb-1.5">
                  Old password
                </label>
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

            {/* 2FA */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h2 className="text-base font-extrabold text-[#1A102F]">
                  Two-Factor Auth
                </h2>
              </div>
              <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
                Add an extra layer of security to your LSync learning portfolio.
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

          </div>

        </div>

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-xs font-bold text-[#1A102F] transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="px-7 py-3 rounded-xl bg-[#633BB3] hover:bg-[#522F9E] text-white text-xs font-bold shadow-md shadow-[#633BB3]/25 active:scale-95 transition cursor-pointer disabled:opacity-70 flex items-center gap-2"
          >
            {isSaving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
            <span>{isSaving ? 'Saving Changes...' : 'Save All Changes'}</span>
          </button>
        </div>
      </form>

    </div>
  );
}