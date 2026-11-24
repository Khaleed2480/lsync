import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  RefreshCw,
  GitCommit,
  CheckCircle2,
  ExternalLink,
  Share2,
  Flame,
  Sparkles,
  Calendar,
  Check,
  ArrowRight,
  Link2,
  BookOpen,
  X,
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();

  // User Profile State
  const [user, setUser] = useState({
    fullName: 'Daniel Okunlola',
    name: 'Daniel Okunlola',
    email: 'daniel@example.com',
    username: 'daniel-okunlola',
  });

  const [copiedLink, setCopiedLink] = useState(false);

  // Automatic Platform Detection
  const [connectedPlatforms, setConnectedPlatforms] = useState(() => {
    try {
      const stored = localStorage.getItem('connected_platforms');
      if (stored !== null) {
        return JSON.parse(stored);
      }
    } catch (e) {}
    return [];
  });

  // Warm Welcome Onboarding Modal (Shows automatically for new users on first visit)
  const [showWelcomeModal, setShowWelcomeModal] = useState(() => {
    return (
      connectedPlatforms.length === 0 &&
      sessionStorage.getItem('lsync_welcome_dismissed') !== 'true'
    );
  });

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      const storedPlatforms = localStorage.getItem('connected_platforms');
      if (storedPlatforms !== null) {
        setConnectedPlatforms(JSON.parse(storedPlatforms));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const dismissWelcomeModal = () => {
    sessionStorage.setItem('lsync_welcome_dismissed', 'true');
    setShowWelcomeModal(false);
  };

  const displayName = user.fullName || user.name || user.username || 'Learner';
  const firstName = displayName.split(' ')[0];
  const username = user.username || displayName.toLowerCase().replace(/\s+/g, '-');

  const [isAutoSyncing, setIsAutoSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState('Just now');
  const [timeRange, setTimeRange] = useState('12 weeks');

  const handleManualSync = () => {
    setIsAutoSyncing(true);
    setTimeout(() => {
      setIsAutoSyncing(false);
      setLastSynced('Just now');
    }, 1200);
  };

  const handleSharePortfolio = async () => {
    const shareUrl = `${window.location.origin}/portfolio/${username}`;
    const shareData = {
      title: `${displayName}'s Verified Learning Portfolio | LSync`,
      text: `Check out my verified learning achievements, skills, and progress on LSync!`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {}
    }

    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const generateRealTimeWeekHabits = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const result = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dayName = days[d.getDay()];
      const dayNumber = d.getDate();
      const isToday = i === 0;

      result.push({
        day: dayName,
        dateNumber: dayNumber,
        label: isToday ? 'Today' : String(dayNumber),
        active: i !== 3,
        isToday,
      });
    }
    return result;
  };

  const weekHabits = generateRealTimeWeekHabits();

  const toggleDemoMode = () => {
    if (connectedPlatforms.length > 0) {
      setConnectedPlatforms([]);
      localStorage.setItem('connected_platforms', JSON.stringify([]));
    } else {
      const fullList = ['Coursera', 'GitHub', 'YouTube', 'Udemy', 'edX'];
      setConnectedPlatforms(fullList);
      localStorage.setItem('connected_platforms', JSON.stringify(fullList));
    }
  };

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full space-y-6 font-sans">
      
      {/* ================= WARM WELCOME ONBOARDING MODAL ================= */}
      {showWelcomeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-purple-100 animate-[fadeIn_0.3s_ease-out]">
            {/* Gradient Top Banner */}
            <div className="bg-gradient-to-r from-[#4D12A8] via-[#633BB3] to-[#EB577F] p-6 sm:p-8 text-white relative">
              <button
                type="button"
                onClick={dismissWelcomeModal}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/15 hover:bg-white/25 text-white cursor-pointer transition"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-[#F4A836] text-[10px] font-black uppercase tracking-widest mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Welcome to LSync</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black leading-tight">
                Glad you’re here, {firstName}! 🎉
              </h2>
              <p className="text-xs sm:text-sm text-white/85 mt-2 leading-relaxed">
                Your unified learning portfolio is ready. Connect your favorite platforms or log your first study session to see your dashboard come alive!
              </p>
            </div>

            {/* Guided Quick Actions */}
            <div className="p-6 sm:p-8 space-y-3.5">
              <button
                type="button"
                onClick={() => {
                  dismissWelcomeModal();
                  navigate('/sources');
                }}
                className="w-full p-4 rounded-2xl bg-[#F8F6FD] hover:bg-[#EFEAFB] border border-[#D4C6F7] flex items-center justify-between gap-4 text-left transition cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#633BB3] text-white flex items-center justify-center shrink-0">
                    <Link2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-[#1A102F]">
                      1. Connect Your Learning Platforms
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Link GitHub, Coursera, or your YouTube Chrome Extension.
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#633BB3] group-hover:translate-x-1 transition shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => {
                  dismissWelcomeModal();
                  navigate('/activity');
                }}
                className="w-full p-4 rounded-2xl bg-[#FFF9F2] hover:bg-[#FEF1E1] border border-[#F4A836]/40 flex items-center justify-between gap-4 text-left transition cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#F4A836] text-[#1A102F] flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-[#1A102F]">
                      2. Log What You Learned Today
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Record a course lesson, article, or coding project in 10 seconds.
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#F4A836] group-hover:translate-x-1 transition shrink-0" />
              </button>

              <button
                type="button"
                onClick={dismissWelcomeModal}
                className="w-full py-3 mt-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-600 transition cursor-pointer"
              >
                Explore Dashboard First
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A102F] tracking-tight">
            Welcome back, {firstName} 👋
          </h1>

          {connectedPlatforms.length === 0 ? (
            <p className="text-xs font-bold text-[#633BB3] mt-1 flex items-center gap-1.5 flex-wrap">
              <span>Connect available platforms to begin tracking your learning progress.</span>
              <Link
                to="/sources"
                className="inline-flex items-center gap-1 text-[#F4A836] hover:text-[#EB577F] underline font-extrabold transition"
              >
                <span>Connect platforms now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </p>
          ) : (
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Aggregated lifelong learning intelligence across{' '}
              <span className="font-bold text-[#1A102F]">
                {connectedPlatforms.length} connected {connectedPlatforms.length === 1 ? 'platform' : 'platforms'}
              </span>
              {' '}({connectedPlatforms.join(', ')}).
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto flex-wrap">
          <button
            onClick={toggleDemoMode}
            className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-300 transition cursor-pointer"
            title="Toggle between New User (0) and Active User"
          >
            Toggle State: {connectedPlatforms.length === 0 ? 'New User (0)' : 'Active (5)'}
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border shadow-xs bg-emerald-50 text-emerald-700 border-emerald-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>Live Sync Active</span>
          </div>

          <span className="text-xs text-gray-500 font-medium">
            {lastSynced}
          </span>

          <button
            onClick={handleManualSync}
            disabled={isAutoSyncing}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-[#1A102F] shadow-sm active:scale-95 transition cursor-pointer disabled:opacity-70"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAutoSyncing ? 'animate-spin text-[#633BB3]' : ''}`} />
            <span>{isAutoSyncing ? 'Syncing...' : 'Sync now'}</span>
          </button>
        </div>
      </div>

      {/* Public Portfolio Share Banner */}
      <div className="bg-gradient-to-r from-[#4D12A8] via-[#633BB3] to-[#7038C4] text-white rounded-3xl p-5 sm:p-6 shadow-lg shadow-[#633BB3]/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
            <Sparkles className="w-6 h-6 text-[#F4A836]" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#F4A836]">
              PUBLIC PORTFOLIO READY
            </span>
            <h3 className="text-base font-extrabold text-white mt-0.5">
              Share your verified growth with recruiters and employers
            </h3>
            <p className="text-xs text-white/80 font-medium mt-0.5">
              lsync.app/portfolio/{username}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end md:self-auto shrink-0">
          <button
            onClick={handleSharePortfolio}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white text-xs font-bold transition border border-white/20 cursor-pointer active:scale-95"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                <span>Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Portfolio</span>
              </>
            )}
          </button>

          <button
            onClick={() => navigate(`/portfolio/${username}`)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-gray-100 text-[#4D12A8] text-xs font-extrabold shadow-md transition cursor-pointer active:scale-95"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Portfolio</span>
          </button>
        </div>
      </div>

      {/* 4 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs">
          <span className="text-xs font-semibold text-gray-500 block mb-1">
            Total learning time
          </span>
          <div className="text-3xl font-black text-[#1A102F]">
            {connectedPlatforms.length === 0 ? '0 h' : '126 h'}
          </div>
          <span className="text-xs font-bold text-emerald-600 mt-2 inline-block">
            {connectedPlatforms.length === 0 ? '0 h this week' : '+12.5 h this week'}
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs">
          <span className="text-xs font-semibold text-gray-500 block mb-1">
            Verified External Milestones
          </span>
          <div className="text-3xl font-black text-[#1A102F]">
            {connectedPlatforms.length === 0 ? '0' : '18'}
          </div>
          <span className="text-xs font-bold text-emerald-600 mt-2 inline-block">
            Assignments &amp; PRs passed
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs">
          <span className="text-xs font-semibold text-gray-500 block mb-1">
            Cross-Platform Completion
          </span>
          <div className="text-3xl font-black text-[#1A102F]">
            {connectedPlatforms.length === 0 ? '0%' : '84.2%'}
          </div>
          <span className="text-xs font-bold text-emerald-600 mt-2 inline-block">
            {connectedPlatforms.length === 0 ? 'Awaiting sources' : 'Top 10% consistency'}
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs">
          <span className="text-xs font-semibold text-gray-500 block mb-1">
            Current streak
          </span>
          <div className="text-3xl font-black text-[#1A102F] flex items-center gap-1.5">
            <span>{connectedPlatforms.length === 0 ? '0 days' : '9 days'}</span>
            <Flame className="w-6 h-6 text-amber-500 fill-amber-500" />
          </div>
          <span className="text-xs font-bold text-emerald-600 mt-2 inline-block">
            {connectedPlatforms.length === 0 ? 'Start your streak today' : 'Best streak: 21 days'}
          </span>
        </div>
      </div>

      {/* Real-Time Calendar Habit Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-extrabold text-[#1A102F] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#633BB3]" />
            Weekly Study Habit &amp; Calendar Consistency
          </h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Synced with your real-time calendar. Active learning detected on {connectedPlatforms.length === 0 ? '0' : '6'} of the last 7 days.
          </p>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3.5 flex-wrap">
          {weekHabits.map((item) => (
            <div key={item.day} className="flex flex-col items-center">
              <span
                className={`text-[10px] font-bold mb-1 ${
                  item.isToday ? 'text-[#633BB3] font-black underline' : 'text-gray-400'
                }`}
              >
                {item.day}
              </span>
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs shadow-xs transition ${
                  item.active && connectedPlatforms.length > 0
                    ? 'bg-gradient-to-tr from-[#633BB3] to-[#8C52FF] text-white shadow-[#633BB3]/25'
                    : 'bg-gray-100 text-gray-400 border border-gray-200'
                } ${item.isToday ? 'ring-2 ring-[#F4A836] ring-offset-2' : ''}`}
                title={`${item.day}, Date: ${item.dateNumber}`}
              >
                {item.active && connectedPlatforms.length > 0 ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  item.dateNumber
                )}
              </div>
              <span className="text-[9px] font-semibold text-gray-400 mt-1">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Middle Row: EXACT FIGMA LINE CHART STARTING AT WK 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-base font-bold text-[#1A102F]">
                Learning growth over time
              </h3>
            </div>

            <div className="flex items-center gap-1.5 bg-gray-50 p-1 rounded-xl border border-gray-200 self-start sm:self-auto">
              {['4 weeks', '12 weeks', '1 year'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                    timeRange === range
                      ? 'bg-white text-[#633BB3] shadow-sm border border-[#7038C4]/40'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full relative pt-2">
            {connectedPlatforms.length === 0 ? (
              <div className="h-56 flex flex-col items-center justify-center text-center p-4">
                <p className="text-xs font-bold text-gray-400 mb-2">No learning activity recorded yet.</p>
                <Link
                  to="/sources"
                  className="text-xs font-bold text-[#633BB3] hover:underline"
                >
                  Connect your first platform &rarr;
                </Link>
              </div>
            ) : (
              <svg className="w-full h-auto overflow-visible" viewBox="0 0 520 205">
                <line x1="45" y1="20" x2="485" y2="20" stroke="#F1F3F7" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="45" y1="70" x2="485" y2="70" stroke="#F1F3F7" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="45" y1="120" x2="485" y2="120" stroke="#F1F3F7" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="45" y1="170" x2="485" y2="170" stroke="#E5E7EB" strokeWidth="1" />

                <text x="34" y="24" textAnchor="end" fontSize="10" fontWeight="600" fill="#6B7280">15 h</text>
                <text x="34" y="74" textAnchor="end" fontSize="10" fontWeight="600" fill="#6B7280">10</text>
                <text x="34" y="124" textAnchor="end" fontSize="10" fontWeight="600" fill="#6B7280">5</text>
                <text x="34" y="174" textAnchor="end" fontSize="10" fontWeight="600" fill="#6B7280">0</text>

                <defs>
                  <linearGradient id="figmaAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#633BB3" stopOpacity="0.24" />
                    <stop offset="100%" stopColor="#633BB3" stopOpacity="0.02" />
                  </linearGradient>
                </defs>

                <polygon
                  points="45,128 85,120 125,110 165,120 205,102 245,90 285,100 325,80 365,65 405,70 445,54 485,45 485,170 45,170"
                  fill="url(#figmaAreaGrad)"
                />

                <polyline
                  points="45,128 85,120 125,110 165,120 205,102 245,90 285,100 325,80 365,65 405,70 445,54 485,45"
                  fill="none"
                  stroke="#4F3CC9"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />

                <circle cx="125" cy="110" r="4.5" fill="#FFFFFF" stroke="#4F3CC9" strokeWidth="2.5" />
                <text x="125" y="96" textAnchor="middle" fontSize="10" fontWeight="800" fill="#1A102F">6</text>

                <circle cx="165" cy="120" r="4.5" fill="#FFFFFF" stroke="#4F3CC9" strokeWidth="2.5" />
                <text x="165" y="106" textAnchor="middle" fontSize="10" fontWeight="800" fill="#1A102F">5</text>

                <circle cx="245" cy="90" r="4.5" fill="#FFFFFF" stroke="#4F3CC9" strokeWidth="2.5" />
                <text x="245" y="76" textAnchor="middle" fontSize="10" fontWeight="800" fill="#1A102F">8</text>

                <circle cx="285" cy="100" r="4.5" fill="#FFFFFF" stroke="#4F3CC9" strokeWidth="2.5" />
                <text x="285" y="86" textAnchor="middle" fontSize="10" fontWeight="800" fill="#1A102F">7</text>

                <circle cx="365" cy="65" r="4.5" fill="#FFFFFF" stroke="#4F3CC9" strokeWidth="2.5" />
                <text x="365" y="51" textAnchor="middle" fontSize="10" fontWeight="800" fill="#1A102F">10.5</text>

                <circle cx="405" cy="70" r="4.5" fill="#FFFFFF" stroke="#4F3CC9" strokeWidth="2.5" />
                <text x="405" y="56" textAnchor="middle" fontSize="10" fontWeight="800" fill="#1A102F">10</text>

                <circle cx="485" cy="45" r="4.5" fill="#FFFFFF" stroke="#4F3CC9" strokeWidth="2.5" />
                <text x="485" y="31" textAnchor="middle" fontSize="10" fontWeight="800" fill="#1A102F">12.5 h</text>

                <text x="45" y="192" textAnchor="middle" fontSize="10" fontWeight="600" fill="#6B7280">Wk 1</text>
                <text x="125" y="192" textAnchor="middle" fontSize="10" fontWeight="600" fill="#6B7280">3</text>
                <text x="205" y="192" textAnchor="middle" fontSize="10" fontWeight="600" fill="#6B7280">5</text>
                <text x="285" y="192" textAnchor="middle" fontSize="10" fontWeight="600" fill="#6B7280">7</text>
                <text x="365" y="192" textAnchor="middle" fontSize="10" fontWeight="600" fill="#6B7280">9</text>
                <text x="445" y="192" textAnchor="middle" fontSize="10" fontWeight="600" fill="#6B7280">11</text>
              </svg>
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#F4A836]/40 shadow-sm flex flex-col justify-between">
          <h3 className="text-base font-bold text-[#1A102F] mb-6">
            Activity by source
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-[#1A102F] mb-1.5">
                <span>Coursera</span>
                <span className="text-gray-500 font-semibold">{connectedPlatforms.includes('Coursera') ? '42 h' : '0 h'}</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#3B28CC] rounded-full" style={{ width: connectedPlatforms.includes('Coursera') ? '100%' : '0%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-[#1A102F] mb-1.5">
                <span>YouTube</span>
                <span className="text-gray-500 font-semibold">{connectedPlatforms.includes('YouTube') ? '31 h' : '0 h'}</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#3B28CC] rounded-full" style={{ width: connectedPlatforms.includes('YouTube') ? '75%' : '0%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-[#1A102F] mb-1.5">
                <span>GitHub</span>
                <span className="text-gray-500 font-semibold">{connectedPlatforms.includes('GitHub') ? '26 h' : '0 h'}</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#3B28CC] rounded-full" style={{ width: connectedPlatforms.includes('GitHub') ? '62%' : '0%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-[#1A102F] mb-1.5">
                <span>Udemy</span>
                <span className="text-gray-500 font-semibold">{connectedPlatforms.includes('Udemy') ? '18 h' : '0 h'}</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#3B28CC] rounded-full" style={{ width: connectedPlatforms.includes('Udemy') ? '43%' : '0%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-[#1A102F] mb-1.5">
                <span>edX</span>
                <span className="text-gray-500 font-semibold">{connectedPlatforms.includes('edX') ? '9 h' : '0 h'}</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#3B28CC] rounded-full" style={{ width: connectedPlatforms.includes('edX') ? '22%' : '0%' }} />
              </div>
            </div>
          </div>

          <div />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="bg-[#FCECE3] px-6 py-4 border-b border-[#F8D9C8]">
            <h3 className="text-base font-bold text-[#1A102F]">
              Recent activity
            </h3>
          </div>

          <div className="p-6 divide-y divide-gray-100">
            {connectedPlatforms.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-400">
                No learning activity logged yet. Connect a platform in Sources to begin!
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0056D2] font-black text-base flex items-center justify-center shrink-0">
                      C
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#1A102F]">
                        Data cleaning with pandas
                      </h4>
                      <span className="text-[11px] text-gray-400 font-medium">
                        Coursera • Data • Graded Assignment Passed
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#1A102F] block">45 min</span>
                    <span className="text-[10px] text-gray-400 font-medium">Today</span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3.5">
                  <div className="flex items-center gap-3.5">
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
                        YouTube • Data • Video Tutorial
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#1A102F] block">28 min</span>
                    <span className="text-[10px] text-gray-400 font-medium">Today</span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3.5">
                  <div className="flex items-center gap-3.5">
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

                <div className="flex items-center justify-between py-3.5">
                  <div className="flex items-center gap-3.5">
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
              </>
            )}
          </div>

          <div className="p-4 pt-0">
            <button
              onClick={() => navigate('/activity')}
              className="text-xs font-bold text-[#633BB3] hover:underline cursor-pointer"
            >
              View all activity
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#1A102F]">
              Recommended next
            </h3>
            <p className="text-xs text-gray-500 mt-1 mb-5">
              External courses based on your Skill Map gaps.
            </p>

            <div className="space-y-3.5">
              <div className="p-4 rounded-2xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/20 transition cursor-pointer">
                <h4 className="text-xs font-bold text-[#1A102F]">
                  Intermediate SQL for analysts
                </h4>
                <span className="text-[10px] text-gray-400 font-medium block mt-1">
                  Coursera • 12 h • Builds on Data analysis
                </span>
              </div>

              <div className="p-4 rounded-2xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/20 transition cursor-pointer">
                <h4 className="text-xs font-bold text-[#1A102F]">
                  Data storytelling and dashboards
                </h4>
                <span className="text-[10px] text-gray-400 font-medium block mt-1">
                  Udemy • 6 h • Builds on Data visualisation
                </span>
              </div>

              <div className="p-4 rounded-2xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/20 transition cursor-pointer">
                <h4 className="text-xs font-bold text-[#1A102F]">
                  Version control with Git
                </h4>
                <span className="text-[10px] text-gray-400 font-medium block mt-1">
                  YouTube • 4 h • Strengthens Development
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button className="text-xs font-bold text-[#633BB3] hover:underline cursor-pointer">
              See all recommendations
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}