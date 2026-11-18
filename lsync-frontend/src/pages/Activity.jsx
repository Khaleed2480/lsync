import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import {
  LayoutGrid,
  Activity as ActivityIcon,
  Award,
  BarChart2,
  Link2,
  User,
  Settings as SettingsIcon,
  LogOut,
  RefreshCw,
  GitCommit,
  CheckCircle2,
  AlertTriangle,
  GitMerge,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function Activity() {
  const navigate = useNavigate();

  // Load real user
  const [user, setUser] = useState({
    fullName: 'Daniel Okunlola',
    name: 'Daniel Okunlola',
    email: 'daniel@example.com'
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const displayName = user.fullName || user.name || 'Daniel Okunlola';
  const initials =
    displayName
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'DO';

  // State for Retry Sync simulation on edX
  const [edxRetrying, setEdxRetrying] = useState(false);
  const [edxStatus, setEdxStatus] = useState('failed');

  const handleRetryEdx = () => {
    setEdxRetrying(true);
    setTimeout(() => {
      setEdxRetrying(false);
      setEdxStatus('synced');
    }, 1500);
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutGrid },
    { name: 'Activity', path: '/activity', icon: ActivityIcon },
    { name: 'Skills', path: '/skills', icon: Award },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'Sources', path: '/sources', icon: Link2 },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-[#F0F2F6] flex flex-col lg:flex-row font-sans selection:bg-[#7038C4] selection:text-white">
      
      {/* ================= PURPLE SIDEBAR ================= */}
      <aside className="w-full lg:w-64 bg-[#633BB3] text-white flex flex-col justify-between p-6 shrink-0 shadow-xl">
        <div>
          {/* Logo with /lsync logo.jpeg & h-20 */}
          <div className="mb-6">
            <Link to="/dashboard">
              <img 
                src="/lsync logo.jpeg" 
                alt="LSync Logo" 
                className="h-20 w-auto object-contain rounded-xl"
              />
            </Link>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.name === 'Activity';
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-[#633BB3] shadow-md'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile */}
        <div className="pt-6 border-t border-white/15 space-y-3">
          <div
            onClick={() => navigate('/settings')}
            title="Click to open Settings"
            className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 cursor-pointer hover:bg-white/15 transition"
          >
            <div className="w-10 h-10 rounded-full bg-[#48258D] text-white flex items-center justify-center font-bold text-sm shadow shrink-0">
              {initials}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-white truncate">{displayName}</h4>
              <p className="text-[10px] text-white/70 truncate">{user.email || 'Profile and settings'}</p>
            </div>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              navigate('/login');
            }}
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-white/70 hover:text-white transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT: LEARNING ACTIVITY ================= */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A102F] tracking-tight">
            Learning activity
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-3xl leading-relaxed">
            Everything from your connected sources, merged into one timeline. Duplicate entries are combined automatically so your history stays consistent.
          </p>
        </div>

        {/* Sync Complete & Deduplication Banner */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3.5">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#1A102F] mr-2">Sync complete.</span>
              <span className="text-xs text-gray-500 font-medium">
                214 activities imported from 5 sources. 6 duplicates were merged.
              </span>
            </div>
          </div>
          <button className="text-xs font-bold text-[#633BB3] hover:underline self-end sm:self-auto cursor-pointer">
            Review merged items
          </button>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Activity Timeline List */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between">
            <div className="divide-y divide-gray-100">
              
              {/* Item 1 */}
              <div className="flex items-center justify-between p-5 hover:bg-gray-50/50 transition">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0056D2] font-black text-lg flex items-center justify-center shrink-0">
                    C
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1A102F]">
                      Data cleaning with pandas
                    </h4>
                    <span className="text-[11px] text-gray-400 font-medium">
                      Coursera • Data • Lesson
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#1A102F] block">45 min</span>
                  <span className="text-[10px] text-gray-400 font-medium">Today</span>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-center justify-between p-5 hover:bg-gray-50/50 transition">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 fill-red-600 shrink-0" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1A102F]">
                      SQL joins explained
                    </h4>
                    <span className="text-[11px] text-gray-400 font-medium">
                      YouTube • Data • Video
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#1A102F] block">28 min</span>
                  <span className="text-[10px] text-gray-400 font-medium">Today</span>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex items-center justify-between p-5 hover:bg-gray-50/50 transition">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center shrink-0">
                    <GitCommit className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1A102F]">
                      Merged pull request in lsync-ui
                    </h4>
                    <span className="text-[11px] text-gray-400 font-medium">
                      GitHub • Development • Commit
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#1A102F] block">2 commits</span>
                  <span className="text-[10px] text-gray-400 font-medium">Yesterday</span>
                </div>
              </div>

              {/* Item 4 */}
              <div className="flex items-center justify-between p-5 hover:bg-gray-50/50 transition">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#A435F0] font-black text-xl flex items-center justify-center shrink-0">
                    U
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1A102F]">
                      Figma auto layout deep dive
                    </h4>
                    <span className="text-[11px] text-gray-400 font-medium">
                      Udemy • Design • Lesson
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#1A102F] block">52 min</span>
                  <span className="text-[10px] text-gray-400 font-medium">Yesterday</span>
                </div>
              </div>

              {/* Item 5: Merged Entry */}
              <div className="flex items-center justify-between p-5 bg-purple-50/20 hover:bg-purple-50/40 transition">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0056D2] font-black text-lg flex items-center justify-center shrink-0">
                    C
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-[#1A102F]">
                        Linear regression basics
                      </h4>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EFEAFB] text-[#633BB3]">
                        <GitMerge className="w-3 h-3" />
                        Merged from 2 entries
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-400 font-medium">
                      Coursera, YouTube • Data • Lesson
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#1A102F] block">38 min</span>
                  <span className="text-[10px] text-gray-400 font-medium">11 Nov</span>
                </div>
              </div>

              {/* Item 6 */}
              <div className="flex items-center justify-between p-5 hover:bg-gray-50/50 transition">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#02262B] text-[#D1FAE5] font-black text-xs flex items-center justify-center shrink-0 tracking-tighter">
                    edX
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1A102F]">
                      Introduction to statistics, week 3 quiz
                    </h4>
                    <span className="text-[11px] text-gray-400 font-medium">
                      edX • Data • Quiz passed
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#1A102F] block">1 h 10 min</span>
                  <span className="text-[10px] text-gray-400 font-medium">10 Nov</span>
                </div>
              </div>

              {/* Item 7 */}
              <div className="flex items-center justify-between p-5 hover:bg-gray-50/50 transition">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 fill-red-600 shrink-0" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1A102F]">
                      Responsive layouts with CSS grid
                    </h4>
                    <span className="text-[11px] text-gray-400 font-medium">
                      YouTube • Development • Video
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#1A102F] block">34 min</span>
                  <span className="text-[10px] text-gray-400 font-medium">9 Nov</span>
                </div>
              </div>

              {/* Item 8 */}
              <div className="flex items-center justify-between p-5 hover:bg-gray-50/50 transition">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0056D2] font-black text-lg flex items-center justify-center shrink-0">
                    C
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1A102F]">
                      UX research methods, module 2
                    </h4>
                    <span className="text-[11px] text-gray-400 font-medium">
                      Coursera • Design • Lesson
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#1A102F] block">1 h 5 min</span>
                  <span className="text-[10px] text-gray-400 font-medium">7 Nov</span>
                </div>
              </div>
            </div>

            {/* Pagination Footer */}
            <div className="p-5 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">
                Showing 1 to 8 of 214 activities
              </span>
              <div className="flex items-center gap-2">
                <button className="px-3.5 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition cursor-pointer">
                  Previous
                </button>
                <button className="px-3.5 py-1.5 rounded-xl bg-[#1A102F] text-xs font-bold text-white hover:bg-black transition cursor-pointer shadow-sm">
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Right: Sync Status Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
              <div className="bg-[#9CA8B8] px-6 py-4 text-white">
                <h3 className="text-base font-bold">Sync status</h3>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1A102F]">Coursera</span>
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    ✓ Synced 2 min ago
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1A102F]">GitHub</span>
                  <span className="text-xs font-bold text-[#633BB3] flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Syncing 64%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1A102F]">YouTube</span>
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    ✓ Synced 1 h ago
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1A102F]">Udemy</span>
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    ✓ Synced 1 h ago
                  </span>
                </div>
              </div>

              <div className="p-6 pt-0">
                <div className="p-4 rounded-2xl bg-[#FFF9E6] border border-[#FDE68A]">
                  <h4 className="text-xs font-bold text-[#92400E] mb-1">
                    edX needs attention
                  </h4>
                  <p className="text-[11px] text-[#B45309] leading-relaxed mb-3">
                    {edxStatus === 'synced'
                      ? '✓ Sync successfully recovered! Account is up to date.'
                      : 'The last sync did not finish. Your existing data is safe. Try again to import new activity.'}
                  </p>

                  {edxStatus !== 'synced' && (
                    <button
                      onClick={handleRetryEdx}
                      disabled={edxRetrying}
                      className="w-full py-2 bg-[#1A102F] hover:bg-black text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      {edxRetrying ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Retrying sync...
                        </>
                      ) : (
                        'Retry sync'
                      )}
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>

      </main>

    </div>
  );
}