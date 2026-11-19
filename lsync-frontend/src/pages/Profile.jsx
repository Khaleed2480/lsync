import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut,
  RefreshCw,
  Check,
  Plus,
  Trash2,
  X,
  CheckCircle2,
} from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Top sub-navigation tab state
  const [activeTab, setActiveTab] = useState('Profile');

  // Form States (Initialized from localStorage)
  const [photo, setPhoto] = useState(null);
  const [fullName, setFullName] = useState('Daniel Okunlola');
  const [username, setUsername] = useState('daniel-okunlola');
  const [headline, setHeadline] = useState(
    'Product designer building skills in data analysis and development.'
  );
  const [about, setAbout] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('daniel@example.com');

  // Learning Interests
  const [interests, setInterests] = useState([
    'Data analysis',
    'Product design',
    'Web development',
  ]);
  const [isAddingInterest, setIsAddingInterest] = useState(false);
  const [newInterest, setNewInterest] = useState('');

  // Save Feedback
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Portfolio Visibility States
  const [isPortfolioPublic, setIsPortfolioPublic] = useState(true);
  const [sourceVisibility, setSourceVisibility] = useState({
    Coursera: true,
    GitHub: true,
    YouTube: true,
    Udemy: true,
    edX: true,
  });

  // Delete Account Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Load real user details from localStorage
  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (storedUser.fullName || storedUser.name) {
        setFullName(storedUser.fullName || storedUser.name);
      }
      if (storedUser.username) {
        setUsername(storedUser.username);
      } else if (storedUser.fullName || storedUser.name) {
        const slug = (storedUser.fullName || storedUser.name)
          .toLowerCase()
          .replace(/\s+/g, '-');
        setUsername(slug);
      }
      if (storedUser.email) setEmail(storedUser.email);
      if (storedUser.headline) setHeadline(storedUser.headline);
      if (storedUser.about) setAbout(storedUser.about);
      if (storedUser.dob) setDob(storedUser.dob);
      if (storedUser.photo) setPhoto(storedUser.photo);
      if (storedUser.interests) setInterests(storedUser.interests);
    } catch (err) {
      console.error('Error loading user:', err);
    }
  }, []);

  const initials =
    fullName
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

  const handleAddInterest = (e) => {
    e.preventDefault();
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
    }
    setNewInterest('');
    setIsAddingInterest(false);
  };

  const removeInterest = (interestToRemove) => {
    setInterests(interests.filter((item) => item !== interestToRemove));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');

    const updatedUser = {
      fullName: fullName.trim(),
      name: fullName.trim(),
      username: username.trim().toLowerCase(),
      headline,
      about,
      dob,
      email: email.trim(),
      photo,
      interests,
    };

    setTimeout(() => {
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setIsSaving(false);
      setSaveMessage('Profile details saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    }, 800);
  };

  const toggleSource = (sourceName) => {
    setSourceVisibility((prev) => ({
      ...prev,
      [sourceName]: !prev[sourceName],
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleDeleteAccount = () => {
    localStorage.clear();
    setShowDeleteModal(false);
    navigate('/register');
  };

  const scrollToSection = (tabName, elementId) => {
    setActiveTab(tabName);
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const sourceList = [
    { name: 'Coursera', badge: 'C', bg: 'bg-blue-50', text: 'text-[#0056D2]' },
    { name: 'GitHub', badge: 'G', bg: 'bg-gray-900', text: 'text-white' },
    { name: 'YouTube', badge: 'Y', bg: 'bg-amber-50', text: 'text-[#F4A836]' },
    { name: 'Udemy', badge: 'U', bg: 'bg-purple-600', text: 'text-white' },
    { name: 'edX', badge: 'e', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  ];

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-5xl mx-auto w-full font-sans">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A102F] tracking-tight">
          Profile and settings
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Edit your details, choose what is public, and manage your account.
        </p>
      </div>

      {/* Sub-Tabs Row */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {[
          { label: 'Profile', id: 'section-profile' },
          { label: 'Portfolio visibility', id: 'section-visibility' },
          { label: 'Account', id: 'section-account' },
        ].map((tab) => (
          <button
            key={tab.label}
            type="button"
            onClick={() => scrollToSection(tab.label, tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === tab.label
                ? 'bg-[#EAE4FA] text-[#4D12A8] border border-[#D4C6F7]'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* CARD 1: PROFILE DETAILS */}
      <section
        id="section-profile"
        className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm mb-6"
      >
        <h2 className="text-base font-extrabold text-[#1A102F] mb-6">
          Profile details
        </h2>

        <div className="flex items-center gap-5 mb-8">
          {photo ? (
            <img
              src={photo}
              alt="Avatar"
              className="w-16 h-16 rounded-full object-cover ring-4 ring-purple-100 shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[#4332C8] text-white flex items-center justify-center font-extrabold text-xl shadow-md shrink-0">
              {initials}
            </div>
          )}

          <div>
            <div className="flex items-center gap-3 mb-1.5">
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
                  className="text-xs font-bold text-[#4332C8] hover:underline cursor-pointer"
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

        {saveMessage && (
          <div className="flex items-center gap-2 p-3 mb-5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{saveMessage}</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-[#1A102F] mb-1.5">
                Full name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-[#1A102F] focus:outline-none focus:border-[#633BB3] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A102F] mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-[#1A102F] focus:outline-none focus:border-[#633BB3] transition"
              />
              <p className="text-[10px] text-gray-400 mt-1">
                Your public link: <span className="font-semibold text-gray-600">lsync.app/{username || 'username'}</span>
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A102F] mb-1.5">
              Headline
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Aspiring Full-Stack Developer building scalable apps"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-[#1A102F] focus:outline-none focus:border-[#633BB3] transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A102F] mb-1.5">
              About
            </label>
            <textarea
              rows={4}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Tell recruiters and peers a bit about your learning journey..."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-medium text-[#1A102F] focus:outline-none focus:border-[#633BB3] transition resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-[#1A102F] mb-1.5">
                Date of birth
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-[#1A102F] focus:outline-none focus:border-[#633BB3] transition"
              />
              <p className="text-[10px] text-gray-400 mt-1">
                Used to celebrate your birthday. Never shown on your public portfolio.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A102F] mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-[#1A102F] focus:outline-none focus:border-[#633BB3] transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A102F] mb-2">
              Learning interests
            </label>
            <div className="flex items-center gap-2.5 flex-wrap">
              {interests.map((interest) => (
                <span
                  key={interest}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EAE4FA] text-[#4332C8] text-xs font-bold group"
                >
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{interest}</span>
                  <button
                    type="button"
                    onClick={() => removeInterest(interest)}
                    className="ml-1 text-[#4332C8]/60 hover:text-red-500 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {isAddingInterest ? (
                <div className="inline-flex items-center gap-1.5">
                  <input
                    type="text"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddInterest(e);
                    }}
                    placeholder="Type interest..."
                    autoFocus
                    className="px-3 py-1 rounded-full border border-[#633BB3] text-xs focus:outline-none w-32"
                  />
                  <button
                    type="button"
                    onClick={handleAddInterest}
                    className="px-2.5 py-1 rounded-full bg-[#633BB3] text-white text-xs font-bold cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddingInterest(true)}
                  className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full border border-gray-300 bg-white hover:bg-gray-50 text-xs font-bold text-[#1A102F] transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add interest</span>
                </button>
              )}
            </div>
          </div>

          <div className="pt-3 flex items-center gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-[#4332C8] hover:bg-[#3526A8] text-white text-xs font-bold shadow-md shadow-[#4332C8]/25 active:scale-95 transition cursor-pointer disabled:opacity-70 flex items-center gap-2"
            >
              {isSaving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              <span>{isSaving ? 'Saving...' : 'Save'}</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-xs font-bold text-[#1A102F] transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </section>

      {/* BOTTOM 2-COLUMN ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section
          id="section-visibility"
          className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col justify-between"
        >
          <div>
            <h2 className="text-base font-extrabold text-[#1A102F]">
              Portfolio visibility
            </h2>
            <p className="text-xs text-gray-500 mt-1 mb-5">
              Your public portfolio shows only the sources you tick below.
            </p>

            <div
              onClick={() => setIsPortfolioPublic(!isPortfolioPublic)}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F4F5F8] border border-gray-200/70 mb-5 cursor-pointer hover:bg-[#ECEEF4] transition"
            >
              <span className="text-xs font-extrabold text-[#1A102F]">
                Make my portfolio public
              </span>
              <div
                className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 flex items-center ${
                  isPortfolioPublic ? 'bg-[#4332C8] justify-end' : 'bg-gray-300 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow" />
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {sourceList.map((source) => {
                const isOn = sourceVisibility[source.name];
                return (
                  <div
                    key={source.name}
                    className="flex items-center justify-between py-3 first:pt-1 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-lg ${source.bg} ${source.text} font-black text-xs flex items-center justify-center shrink-0`}
                      >
                        {source.badge}
                      </div>
                      <span className="text-xs font-bold text-[#1A102F]">
                        {source.name}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleSource(source.name)}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold transition cursor-pointer ${
                        isOn
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                    >
                      {isOn ? 'on' : 'off'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="section-account"
          className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col justify-between space-y-6"
        >
          <div>
            <h2 className="text-base font-extrabold text-[#1A102F] mb-5">
              Account
            </h2>

            <div className="flex items-center justify-between gap-4 pb-6 border-b border-gray-100">
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
          </div>

          <div className="p-5 rounded-2xl bg-[#FDF2F0] border border-[#F8D7D2]">
            <h4 className="text-xs font-extrabold text-[#B91C1C] mb-1.5">
              Delete account
            </h4>
            <p className="text-[11px] text-[#991B1B]/80 leading-relaxed mb-4">
              This permanently deletes your profile, your synced learning activity and your public portfolio. This cannot be undone.
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
        </section>
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
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="px-4 py-2 rounded-xl bg-[#C92A1D] hover:bg-[#A61E14] text-white text-xs font-bold cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}