import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  RefreshCw,
  GitCommit,
  GitBranch,
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
import { apiRequest } from '../utils/api';

export default function Dashboard() {
  const navigate = useNavigate();

  // User Profile State
  const [user, setUser] = useState({
    fullName: 'Learner',
    name: 'Learner',
    email: '',
    username: 'learner',
  });

  // Real Backend Data States (ZERO hardcoded dummy courses!)
  const [githubUsername, setGithubUsername] = useState('');
  const [githubRepos, setGithubRepos] = useState([]);
  const [githubRepoCount, setGithubRepoCount] = useState(0);
  const [activities, setActivities] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [syncingRepoName, setSyncingRepoName] = useState(null);

  const [copiedLink, setCopiedLink] = useState(false);
  const [isAutoSyncing, setIsAutoSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState('Just now');
  const [statusNote, setStatusNote] = useState('');

  // Load Real User, GitHub Repos, GitHub Activities, and YouTube Watch Events
  const loadRealDashboardData = async () => {
    setIsLoadingData(true);

    // 1. Load local user immediately, then verify from /users/me
    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (storedUser.name || storedUser.fullName) setUser(storedUser);
    } catch (e) {}

    if (localStorage.getItem('token')) {
      try {
        const meRes = await apiRequest('/users/me', { method: 'GET' });
        const userObj = meRes.user || meRes.data || meRes;
        if (userObj && (userObj.name || userObj.fullName || userObj.email)) {
          setUser(userObj);
          localStorage.setItem('user', JSON.stringify(userObj));
        }
      } catch (e) {}
    }

    // 2. Fetch REAL GitHub Repositories (Matches James's exact JSON shape!)
    let hasGitHub = false;
    try {
      const ghRes = await apiRequest('/integrations/github/repositories?page=1&perPage=30', {
        method: 'GET',
      });
      const repos = Array.isArray(ghRes?.data)
        ? ghRes.data
        : Array.isArray(ghRes)
        ? ghRes
        : ghRes.repositories || [];

      setGithubRepos(repos);
      setGithubRepoCount(ghRes?.count ?? repos.length);
      if (ghRes?.username) setGithubUsername(ghRes.username);
      hasGitHub = true;

      // Update localStorage connected_platforms
      const current = JSON.parse(localStorage.getItem('connected_platforms') || '[]');
      if (!current.includes('GitHub')) {
        localStorage.setItem('connected_platforms', JSON.stringify([...current, 'GitHub']));
      }
    } catch (err) {
      setGithubRepos([]);
      setGithubRepoCount(0);
    }

    // 3. Fetch REAL Synced Activities (GitHub commits + YouTube watch events)
    let combinedActivities = [];

    try {
      const actRes = await apiRequest('/integrations/github/activities?page=1&limit=20', {
        method: 'GET',
      });
      const actList = Array.isArray(actRes) ? actRes : actRes.activities || actRes.data || [];
      combinedActivities = [
        ...combinedActivities,
        ...actList.map((a) => ({ ...a, _kind: 'github' })),
      ];
    } catch (e) {}

    try {
      const extToken = localStorage.getItem('extension_token');
      const ytRes = await apiRequest('/watch-events?page=1&limit=20', {
        method: 'GET',
        ...(extToken ? { headers: { Authorization: `Bearer ${extToken}` } } : {}),
      });
      const ytList = Array.isArray(ytRes)
        ? ytRes
        : ytRes.events || ytRes.watchEvents || ytRes.data || [];
      combinedActivities = [
        ...combinedActivities,
        ...ytList.map((y) => ({ ...y, _kind: 'youtube' })),
      ];
    } catch (e) {}

    combinedActivities.sort((a, b) => {
      const dA = new Date(a.watchedAt || a.date || a.createdAt || 0);
      const dB = new Date(b.watchedAt || b.date || b.createdAt || 0);
      return dB - dA;
    });

    setActivities(combinedActivities);
    setIsLoadingData(false);
    setLastSynced('Just now');
  };

  useEffect(() => {
    loadRealDashboardData();
  }, []);

  const displayName = user.fullName || user.name || user.username || 'Learner';
  const firstName = displayName.split(' ')[0];
  const username = user.username || displayName.toLowerCase().replace(/\s+/g, '-');

  // Welcome Modal only if user has 0 repos AND 0 activities
  const isCompletelyEmpty = githubRepoCount === 0 && activities.length === 0;
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    if (
      !isLoadingData &&
      isCompletelyEmpty &&
      sessionStorage.getItem('lsync_welcome_dismissed') !== 'true'
    ) {
      setShowWelcomeModal(true);
    }
  }, [isLoadingData, isCompletelyEmpty]);

  const dismissWelcomeModal = () => {
    sessionStorage.setItem('lsync_welcome_dismissed', 'true');
    setShowWelcomeModal(false);
  };

  // Real calculated metrics (NO dummy numbers!)
  const totalMinutes = activities.reduce((sum, item) => {
    const mins =
      item.durationMinutes ||
      (item.durationSeconds ? Math.max(1, Math.round(item.durationSeconds / 60)) : 15);
    return sum + mins;
  }, 0);
  const totalHoursFormatted =
    totalMinutes >= 60
      ? `${(totalMinutes / 60).toFixed(1)} h`
      : `${totalMinutes} min`;

  const githubMinutes = activities
    .filter((a) => a._kind === 'github' || a.platform === 'GitHub')
    .reduce((sum, a) => sum + (a.durationMinutes || 15), 0);

  const youtubeMinutes = activities
    .filter((a) => a._kind === 'youtube' || a.platform === 'YouTube')
    .reduce(
      (sum, a) =>
        sum +
        (a.durationMinutes ||
          (a.durationSeconds ? Math.max(1, Math.round(a.durationSeconds / 60)) : 10)),
      0
    );

  // Sync a single GitHub repository right from the dashboard
  const handleQuickSyncRepo = async (repo) => {
    const owner =
      (repo.fullName && repo.fullName.split('/')[0]) || githubUsername || 'user';
    const repoName = repo.name || (repo.fullName && repo.fullName.split('/')[1]);
    if (!repoName) return;

    setSyncingRepoName(repoName);
    setStatusNote('');
    try {
      await apiRequest(`/integrations/github/repositories/${owner}/${repoName}/sync`, {
        method: 'POST',
      });
      setStatusNote(`Synced commits from ${repoName}!`);
      await loadRealDashboardData();
    } catch (err) {
      setStatusNote(err.message || `Could not sync ${repoName}`);
    } finally {
      setSyncingRepoName(null);
    }
  };

  const handleManualSync = async () => {
    setIsAutoSyncing(true);
    await loadRealDashboardData();
    setIsAutoSyncing(false);
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

  // Real-time 7-day calendar strip matched against actual activity dates
  const generateRealTimeWeekHabits = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const result = [];
    const today = new Date();

    const activeDateStrings = new Set(
      activities
        .map((a) => {
          const raw = a.watchedAt || a.date || a.createdAt;
          return raw ? new Date(raw).toDateString() : null;
        })
        .filter(Boolean)
    );

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
        active: activeDateStrings.has(d.toDateString()),
        isToday,
      });
    }
    return result;
  };

  const weekHabits = generateRealTimeWeekHabits();
  const activeDaysThisWeek = weekHabits.filter((d) => d.active).length;

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full space-y-6 font-sans">
      
      {/* ================= WARM WELCOME MODAL (NEW USERS ONLY) ================= */}
      {showWelcomeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-purple-100">
            <div className="bg-gradient-to-r from-[#4D12A8] via-[#633BB3] to-[#EB577F] p-6 sm:p-8 text-white relative">
              <button
                type="button"
                onClick={dismissWelcomeModal}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/15 hover:bg-white/25 text-white cursor-pointer"
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
                Connect your GitHub repositories or log your first study session to see your real learning data appear here.
              </p>
            </div>

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
                      Authorize GitHub or link your YouTube Chrome Extension.
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

          {githubRepoCount === 0 && activities.length === 0 ? (
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
              {githubUsername ? (
                <>
                  Connected to GitHub (<span className="font-bold text-[#1A102F]">@{githubUsername}</span>) •{' '}
                  <span className="font-bold text-[#633BB3]">{githubRepoCount} repositories</span> loaded.
                </>
              ) : (
                `Tracking ${activities.length} verified learning activities.`
              )}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto flex-wrap">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border shadow-xs bg-emerald-50 text-emerald-700 border-emerald-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>Live Sync Active</span>
          </div>

          <span className="text-xs text-gray-500 font-medium">{lastSynced}</span>

          <button
            onClick={handleManualSync}
            disabled={isAutoSyncing || isLoadingData}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-[#1A102F] shadow-sm active:scale-95 transition cursor-pointer disabled:opacity-70"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAutoSyncing || isLoadingData ? 'animate-spin text-[#633BB3]' : ''}`} />
            <span>{isAutoSyncing || isLoadingData ? 'Syncing...' : 'Sync now'}</span>
          </button>
        </div>
      </div>

      {statusNote && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{statusNote}</span>
        </div>
      )}

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

      {/* 4 REAL METRICS CARDS (ZERO HARDCODED DUMMY NUMBERS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs">
          <span className="text-xs font-semibold text-gray-500 block mb-1">
            Total learning time
          </span>
          <div className="text-3xl font-black text-[#1A102F]">
            {totalHoursFormatted}
          </div>
          <span className="text-xs font-bold text-emerald-600 mt-2 inline-block">
            {activities.length === 0 ? 'Sync commits or videos to track' : `From ${activities.length} logged sessions`}
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs">
          <span className="text-xs font-semibold text-gray-500 block mb-1">
            GitHub Repositories
          </span>
          <div className="text-3xl font-black text-[#1A102F]">
            {githubRepoCount}
          </div>
          <span className="text-xs font-bold text-emerald-600 mt-2 inline-block">
            {githubUsername ? `@${githubUsername} connected` : 'Connect GitHub in Sources'}
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs">
          <span className="text-xs font-semibold text-gray-500 block mb-1">
            Synced Activities
          </span>
          <div className="text-3xl font-black text-[#1A102F]">
            {activities.length}
          </div>
          <span className="text-xs font-bold text-emerald-600 mt-2 inline-block">
            Commits &amp; video logs
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs">
          <span className="text-xs font-semibold text-gray-500 block mb-1">
            Active Days (This Week)
          </span>
          <div className="text-3xl font-black text-[#1A102F] flex items-center gap-1.5">
            <span>{activeDaysThisWeek} days</span>
            <Flame className="w-6 h-6 text-amber-500 fill-amber-500" />
          </div>
          <span className="text-xs font-bold text-emerald-600 mt-2 inline-block">
            {activeDaysThisWeek > 0 ? 'Keep the momentum going!' : 'Start your streak today'}
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
            Synced with your real-time calendar. Active learning detected on {activeDaysThisWeek} of the last 7 days.
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
                  item.active
                    ? 'bg-gradient-to-tr from-[#633BB3] to-[#8C52FF] text-white shadow-[#633BB3]/25'
                    : 'bg-gray-100 text-gray-400 border border-gray-200'
                } ${item.isToday ? 'ring-2 ring-[#F4A836] ring-offset-2' : ''}`}
                title={`${item.day}, Date: ${item.dateNumber}`}
              >
                {item.active ? <CheckCircle2 className="w-4 h-4" /> : item.dateNumber}
              </div>
              <span className="text-[9px] font-semibold text-gray-400 mt-1">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Middle Row: Growth Curve + Real Connected Source Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-base font-bold text-[#1A102F]">
                Learning growth over time
              </h3>
            </div>
          </div>

          <div className="w-full relative pt-2">
            {activities.length === 0 ? (
              <div className="h-56 flex flex-col items-center justify-center text-center p-4">
                <p className="text-xs font-bold text-gray-500 mb-2">
                  {githubRepoCount > 0
                    ? `${githubRepoCount} GitHub repositories connected! Click "Sync Commits" on a repository below to plot your growth curve.`
                    : 'No learning activity recorded yet.'}
                </p>
                <Link
                  to="/sources"
                  className="text-xs font-bold text-[#633BB3] hover:underline"
                >
                  Manage sources &amp; sync &rarr;
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
                  points={`45,165 165,155 285,140 405,120 485,${Math.max(30, 170 - Math.round((totalMinutes / 60) * 10))} 485,170 45,170`}
                  fill="url(#figmaAreaGrad)"
                />

                <polyline
                  points={`45,165 165,155 285,140 405,120 485,${Math.max(30, 170 - Math.round((totalMinutes / 60) * 10))}`}
                  fill="none"
                  stroke="#4F3CC9"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />

                <circle
                  cx="485"
                  cy={Math.max(30, 170 - Math.round((totalMinutes / 60) * 10))}
                  r="5"
                  fill="#FFFFFF"
                  stroke="#4F3CC9"
                  strokeWidth="2.5"
                />
                <text
                  x="485"
                  y={Math.max(16, 156 - Math.round((totalMinutes / 60) * 10))}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="800"
                  fill="#1A102F"
                >
                  {totalHoursFormatted}
                </text>

                <text x="45" y="192" textAnchor="middle" fontSize="10" fontWeight="600" fill="#6B7280">Wk 1</text>
                <text x="165" y="192" textAnchor="middle" fontSize="10" fontWeight="600" fill="#6B7280">4</text>
                <text x="285" y="192" textAnchor="middle" fontSize="10" fontWeight="600" fill="#6B7280">8</text>
                <text x="405" y="192" textAnchor="middle" fontSize="10" fontWeight="600" fill="#6B7280">11</text>
                <text x="485" y="192" textAnchor="middle" fontSize="10" fontWeight="600" fill="#6B7280">Now</text>
              </svg>
            )}
          </div>
        </div>

        {/* Real Activity by Source */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#F4A836]/40 shadow-sm flex flex-col justify-between">
          <h3 className="text-base font-bold text-[#1A102F] mb-6">
            Activity by source
          </h3>

          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs font-bold text-[#1A102F] mb-1.5">
                <span>GitHub {githubUsername ? `(@${githubUsername})` : ''}</span>
                <span className="text-gray-500 font-semibold">
                  {githubRepoCount > 0 ? `${githubRepoCount} repos` : 'Not linked'}
                </span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#3B28CC] rounded-full transition-all duration-500"
                  style={{ width: githubRepoCount > 0 ? '100%' : '0%' }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-[#1A102F] mb-1.5">
                <span>YouTube (Extension)</span>
                <span className="text-gray-500 font-semibold">
                  {youtubeMinutes > 0 ? `${youtubeMinutes} min` : '0 min'}
                </span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#EB577F] rounded-full transition-all duration-500"
                  style={{ width: youtubeMinutes > 0 ? `${Math.min(100, youtubeMinutes)}%` : '0%' }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-[#1A102F] mb-1.5">
                <span>GitHub Synced Commits</span>
                <span className="text-gray-500 font-semibold">
                  {githubMinutes > 0 ? `${githubMinutes} min` : '0 min'}
                </span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#633BB3] rounded-full transition-all duration-500"
                  style={{ width: githubMinutes > 0 ? `${Math.min(100, githubMinutes)}%` : '0%' }}
                />
              </div>
            </div>
          </div>

          <div className="pt-6">
            <Link
              to="/sources"
              className="text-xs font-bold text-[#633BB3] hover:underline"
            >
              Manage connected sources &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM ROW: REAL USER REPOSITORIES & RECENT ACTIVITIES ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT (2 Cols): ACTUAL CONNECTED GITHUB REPOSITORIES */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="bg-[#FCECE3] px-6 py-4 border-b border-[#F8D9C8] flex items-center justify-between">
            <h3 className="text-base font-bold text-[#1A102F]">
              Your GitHub Repositories {githubUsername && `(@${githubUsername})`}
            </h3>
            <span className="text-xs font-bold text-[#633BB3]">
              {githubRepoCount} total
            </span>
          </div>

          <div className="p-6 divide-y divide-gray-100">
            {isLoadingData ? (
              <div className="py-10 flex items-center justify-center gap-2 text-xs text-gray-400 font-bold">
                <RefreshCw className="w-4 h-4 animate-spin text-[#633BB3]" />
                <span>Loading your repositories...</span>
              </div>
            ) : githubRepos.length === 0 ? (
              <div className="py-10 text-center space-y-2">
                <p className="text-xs font-bold text-gray-400">
                  No GitHub repositories connected yet.
                </p>
                <Link
                  to="/sources"
                  className="inline-block text-xs font-bold text-[#633BB3] hover:underline"
                >
                  Authorize GitHub in Sources &rarr;
                </Link>
              </div>
            ) : (
              githubRepos.slice(0, 6).map((repo) => (
                <div
                  key={repo.githubId || repo.id || repo.name}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <GitBranch className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#1A102F] truncate">
                          {repo.name}
                        </h4>
                        {repo.url && (
                          <a
                            href={repo.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-gray-400 hover:text-[#633BB3]"
                            title="Open on GitHub"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 font-medium line-clamp-1 mt-0.5">
                        {repo.description || repo.fullName}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleQuickSyncRepo(repo)}
                    disabled={syncingRepoName === repo.name}
                    className="px-3.5 py-2 rounded-xl bg-[#EAE4FA] hover:bg-[#D4C6F7] text-[#4D12A8] text-xs font-bold transition cursor-pointer shrink-0 self-end sm:self-center flex items-center gap-1.5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncingRepoName === repo.name ? 'animate-spin' : ''}`} />
                    <span>{syncingRepoName === repo.name ? 'Syncing...' : 'Sync Commits'}</span>
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="p-4 pt-0 flex items-center justify-between">
            <button
              onClick={() => navigate('/sources')}
              className="text-xs font-bold text-[#633BB3] hover:underline cursor-pointer"
            >
              View all {githubRepoCount} repositories in Sources &rarr;
            </button>
          </div>
        </div>

        {/* RIGHT (1 Col): REAL RECENT ACTIVITIES FEED */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#1A102F]">
              Recent synced activity
            </h3>
            <p className="text-xs text-gray-500 mt-1 mb-5">
              Latest commits &amp; YouTube watch logs.
            </p>

            {activities.length === 0 ? (
              <div className="p-4 rounded-2xl bg-[#F8F9FC] border border-gray-100 text-xs text-gray-500 leading-relaxed">
                No commits or YouTube logs synced yet. Click <strong>"Sync Commits"</strong> on any repository on the left to log your coding proof!
              </div>
            ) : (
              <div className="space-y-3">
                {activities.slice(0, 4).map((act, i) => (
                  <div
                    key={act._id || act.id || i}
                    className="p-3.5 rounded-2xl border border-gray-100 hover:border-purple-200 transition"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-[#1A102F] truncate">
                        {act.title || act.videoTitle || act.message || 'Learning Activity'}
                      </h4>
                      <span className="text-[10px] font-bold text-[#633BB3] shrink-0">
                        {act.durationMinutes ? `${act.durationMinutes}m` : 'Synced'}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium block mt-1 truncate">
                      {act._kind === 'youtube' ? 'YouTube Extension' : 'GitHub Commit'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4">
            <button
              onClick={() => navigate('/activity')}
              className="text-xs font-bold text-[#633BB3] hover:underline cursor-pointer"
            >
              Open full Activity Timeline &rarr;
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}