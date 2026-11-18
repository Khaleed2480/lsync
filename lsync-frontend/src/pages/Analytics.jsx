import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import {
  LayoutGrid,
  Activity,
  Award,
  BarChart2,
  Link2,
  User,
  Settings as SettingsIcon,
  LogOut,
  RefreshCw,
  Check,
  TrendingUp,
  Clock,
  BookOpen,
  Calendar,
  CheckCircle2
} from 'lucide-react';

export default function Analytics() {
  const navigate = useNavigate();

  // Time filter state
  const [timeRange, setTimeRange] = useState('12 weeks');

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

  // Navigation Links
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutGrid },
    { name: 'Activity', path: '/activity', icon: Activity },
    { name: 'Skills', path: '/skills', icon: Award },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'Sources', path: '/sources', icon: Link2 },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  // Weekly bar data
  const weeklyBars = [
    { week: 'Wk 1', hours: 2.1, height: '36%' },
    { week: 'Wk 2', hours: 2.8, height: '48%' },
    { week: 'Wk 3', hours: 3.4, height: '58%' },
    { week: 'Wk 4', hours: 3.0, height: '52%' },
    { week: 'Wk 5', hours: 4.2, height: '72%' },
    { week: 'Wk 6', hours: 4.6, height: '79%' },
    { week: 'Wk 7', hours: 5.1, height: '88%' },
    { week: 'Wk 8', hours: 5.8, height: '100%' },
  ];

  return (
    <div className="min-h-screen bg-[#F0F2F6] flex flex-col lg:flex-row font-sans selection:bg-[#7038C4] selection:text-white">
      
      {/* =========================================================================
          1. PURPLE SIDEBAR
      ========================================================================= */}
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
              const isActive = item.name === 'Analytics';
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

      {/* =========================================================================
          2. MAIN ANALYTICS DASHBOARD
      ========================================================================= */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full space-y-7">
        
        {/* Top Header Row with Time Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A102F] tracking-tight">
              Learning analytics
            </h1>
            <p className="text-xs text-gray-500 font-medium mt-1">
              See how much you learn, how consistently, and what you read, across every connected source.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-gray-200 shadow-xs">
            {['7 days', '30 days', '12 weeks', '1 year'].map((t) => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  timeRange === t
                    ? 'border border-[#633BB3] text-[#633BB3] bg-purple-50/50 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* SECTION 1: CORE LEARNING STATS */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
              <span className="text-xs font-semibold text-gray-400 block mb-2">
                Hours learned
              </span>
              <div className="text-3xl sm:text-4xl font-black text-[#1A102F]">
                126 h
              </div>
              <span className="text-xs font-medium text-gray-400 mt-2 block">
                In the last 12 weeks
              </span>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
              <span className="text-xs font-semibold text-gray-400 block mb-2">
                Average per day
              </span>
              <div className="text-3xl sm:text-4xl font-black text-[#1A102F]">
                1.5 h
              </div>
              <span className="text-xs font-bold text-emerald-600 mt-2 block">
                +0.3 h vs previous period
              </span>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
              <span className="text-xs font-semibold text-gray-400 block mb-2">
                Active days
              </span>
              <div className="text-3xl sm:text-4xl font-black text-[#1A102F]">
                71 of 84
              </div>
              <span className="text-xs font-medium text-gray-400 mt-2 block">
                85% consistency
              </span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-gray-400 block mb-1">
                Longest streak
              </span>
              <div className="text-2xl sm:text-3xl font-black text-[#1A102F]">
                21 days
              </div>
              <span className="text-xs font-medium text-gray-400 mt-1 block">
                Current streak: 9 days
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 2: READING STATISTICS */}
        <div className="space-y-4">
          <h2 className="text-lg font-extrabold text-[#1A102F]">
            Reading statistics
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
              <span className="text-xs font-semibold text-gray-400 block mb-2">
                Reading time
              </span>
              <div className="text-3xl sm:text-4xl font-black text-[#1A102F]">
                31 h
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
              <span className="text-xs font-semibold text-gray-400 block mb-2">
                Articles read
              </span>
              <div className="text-3xl sm:text-4xl font-black text-[#1A102F]">
                38
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
              <span className="text-xs font-semibold text-gray-400 block mb-2">
                Documentation pages
              </span>
              <div className="text-3xl sm:text-4xl font-black text-[#1A102F]">
                112
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
            <span className="text-xs font-semibold text-gray-400 block mb-1">
              Average session
            </span>
            <div className="text-2xl sm:text-3xl font-black text-[#1A102F]">
              24 min
            </div>
          </div>
        </div>

        {/* SECTION 3: READING CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs">
            <h3 className="text-base font-extrabold text-[#1A102F] mb-8">
              Reading time per week
            </h3>

            <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 px-2 sm:px-4 border-b border-gray-100 pb-3">
              {weeklyBars.map((bar) => (
                <div key={bar.week} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <span className="text-[11px] font-bold text-[#1A102F] mb-1.5 transition">
                    {bar.hours}
                  </span>
                  <div
                    className="w-full max-w-[42px] bg-[#4D34D4] hover:bg-[#3D25C4] rounded-xl transition-all duration-300 shadow-sm"
                    style={{ height: bar.height }}
                  />
                  <span className="text-[11px] font-semibold text-gray-400 mt-2">
                    {bar.week}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-[11px] font-bold text-gray-400 pt-3">
              <span>0</span>
              <span>2</span>
              <span>4</span>
              <span>6 h</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs flex flex-col justify-between">
            <h3 className="text-base font-extrabold text-[#1A102F] mb-6">
              Reading by type
            </h3>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold text-[#1A102F] mb-2">
                  <span>Articles and blogs</span>
                  <span className="text-gray-400 font-semibold">14 h</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#4D34D4] rounded-full" style={{ width: '80%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-[#1A102F] mb-2">
                  <span>Documentation</span>
                  <span className="text-gray-400 font-semibold">11 h</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#4D34D4] rounded-full" style={{ width: '60%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-[#1A102F] mb-2">
                  <span>Books and notes</span>
                  <span className="text-gray-400 font-semibold">6 h</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#4D34D4] rounded-full" style={{ width: '35%' }} />
                </div>
              </div>
            </div>

            <div />
          </div>
        </div>

        {/* SECTION 4: HEATMAP CALENDAR & INSIGHTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-extrabold text-[#1A102F]">
                Learning calendar
              </h3>
              <span className="text-xs text-gray-400 font-semibold">
                Last 26 weeks
              </span>
            </div>

            <div className="overflow-x-auto pb-2">
              <div className="min-w-[500px]">
                <div className="grid grid-rows-7 grid-flow-col gap-1.5">
                  {Array.from({ length: 182 }).map((_, i) => {
                    const intensities = [
                      'bg-[#4D34D4]',
                      'bg-[#7A64E8]',
                      'bg-[#C2B7F8]',
                      'bg-[#EFEAFB]',
                      'bg-[#EFEAFB]',
                      'bg-transparent',
                    ];
                    const color =
                      (i * 7 + 3) % 11 === 0
                        ? intensities[0]
                        : (i + 4) % 5 === 0
                        ? intensities[1]
                        : (i + 2) % 3 === 0
                        ? intensities[2]
                        : (i + 1) % 2 === 0
                        ? intensities[3]
                        : 'bg-[#F2EDFD]';

                    return (
                      <div
                        key={i}
                        className={`w-3.5 h-3.5 rounded-xs ${color} transition hover:ring-2 hover:ring-[#4D34D4] cursor-pointer`}
                        title={`Day ${i + 1}`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-semibold text-gray-400 pt-4 mt-2 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
                <span>Sun</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[11px]">Less</span>
                <div className="w-3 h-3 rounded-xs bg-[#F2EDFD]" />
                <div className="w-3 h-3 rounded-xs bg-[#C2B7F8]" />
                <div className="w-3 h-3 rounded-xs bg-[#7A64E8]" />
                <div className="w-3 h-3 rounded-xs bg-[#4D34D4]" />
                <span className="text-[11px]">More</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs flex flex-col justify-between space-y-6">
            <h3 className="text-base font-extrabold text-[#1A102F]">
              Insights
            </h3>

            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-bold text-[#1A102F]">
                  Your best day is Wednesday
                </h4>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5 leading-relaxed">
                  You learn 2.3 h on average.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#1A102F]">
                  You focus best from 6 pm to 8 pm
                </h4>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5 leading-relaxed">
                  Most of your sessions start in the evening.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#1A102F]">
                  Reading time is up 176%
                </h4>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5 leading-relaxed">
                  From 2.1 h to 5.8 h per week over 8 weeks.
                </p>
              </div>
            </div>

            <div />
          </div>
        </div>

        {/* SECTION 5: LEARNING MIX & WEEKLY GOAL */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs flex flex-col justify-between">
            <h3 className="text-base font-extrabold text-[#1A102F] mb-6">
              Learning mix
            </h3>

            <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
              <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#F1F3F7" strokeWidth="12" />
                  <circle
                    cx="50" cy="50" r="38" fill="none"
                    stroke="#3C25D4" strokeWidth="12"
                    strokeDasharray="83.5 155.5" strokeDashoffset="0"
                  />
                  <circle
                    cx="50" cy="50" r="38" fill="none"
                    stroke="#1A102F" strokeWidth="12"
                    strokeDasharray="59.7 179.3" strokeDashoffset="-83.5"
                  />
                  <circle
                    cx="50" cy="50" r="38" fill="none"
                    stroke="#7A64E8" strokeWidth="12"
                    strokeDasharray="59.7 179.3" strokeDashoffset="-143.2"
                  />
                  <circle
                    cx="50" cy="50" r="38" fill="none"
                    stroke="#F4A836" strokeWidth="12"
                    strokeDasharray="35.8 203.2" strokeDashoffset="-202.9"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-black text-[#1A102F] leading-none">
                    126 h
                  </span>
                  <span className="text-[10px] text-gray-400 font-semibold mt-0.5">
                    total
                  </span>
                </div>
              </div>

              <div className="space-y-3 w-full max-w-[200px]">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 font-bold text-[#1A102F]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#3C25D4]" />
                    Courses
                  </span>
                  <span className="text-gray-400 font-semibold">44 h • 35%</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 font-bold text-[#1A102F]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1A102F]" />
                    Video
                  </span>
                  <span className="text-gray-400 font-semibold">32 h • 25%</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 font-bold text-[#1A102F]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#7A64E8]" />
                    Reading
                  </span>
                  <span className="text-gray-400 font-semibold">31 h • 25%</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 font-bold text-[#1A102F]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F4A836]" />
                    Code
                  </span>
                  <span className="text-gray-400 font-semibold">19 h • 15%</span>
                </div>
              </div>
            </div>

            <div />
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs flex flex-col justify-between space-y-6">
            <div>
              <h3 className="text-base font-extrabold text-[#1A102F] mb-4">
                Weekly goal
              </h3>

              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl sm:text-4xl font-black text-[#1A102F]">
                  12.5 h
                </span>
                <span className="text-xs text-gray-400 font-medium">
                  of your 10 h goal this week
                </span>
              </div>

              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-[#4D34D4] rounded-full w-full" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-3">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Goal reached</span>
              </div>

              <p className="text-xs text-gray-400 font-medium">
                You reached your goal in 9 of the last 12 weeks.
              </p>
            </div>

            <div>
              <button
                type="button"
                onClick={() => alert('Goal editing is enabled in settings')}
                className="px-4 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-xs font-bold text-[#1A102F] transition cursor-pointer"
              >
                Edit goal
              </button>
            </div>
          </div>
        </div>

      </main>

    </div>
  );
}