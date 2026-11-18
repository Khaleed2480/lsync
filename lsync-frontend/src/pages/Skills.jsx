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
} from 'lucide-react';

const API_BASE_URL = 'https://lsync-1-0-0-1.onrender.com/api';

const DEFAULT_GUIDE_SKILLS = [
  {
    name: 'Data analysis',
    category: 'Data',
    sources: 'Coursera, YouTube, edX',
    level: 'Intermediate',
    segments: 2,
    hours: '64 h',
    monthlyGain: '+6 h this month',
  },
  {
    name: 'Python',
    category: 'Development',
    sources: 'Coursera, GitHub',
    level: 'Intermediate',
    segments: 2,
    hours: '38 h',
    monthlyGain: '+4 h this month',
  },
  {
    name: 'Figma and UI design',
    category: 'Design',
    sources: 'Udemy, YouTube',
    level: 'Intermediate',
    segments: 2,
    hours: '29 h',
    monthlyGain: '+5 h this month',
  },
  {
    name: 'Git and version control',
    category: 'Development',
    sources: 'GitHub, YouTube',
    level: 'Intermediate',
    segments: 2,
    hours: '24 h',
    monthlyGain: '+2 h this month',
  },
  {
    name: 'SQL',
    category: 'Data',
    sources: 'YouTube, Udemy',
    level: 'Beginner',
    segments: 1,
    hours: '22 h',
    monthlyGain: '+3 h this month',
  },
  {
    name: 'Data visualisation',
    category: 'Data',
    sources: 'Udemy, Coursera',
    level: 'Beginner',
    segments: 1,
    hours: '18 h',
    monthlyGain: '+2 h this month',
  },
  {
    name: 'UX research',
    category: 'Design',
    sources: 'Coursera',
    level: 'Beginner',
    segments: 1,
    hours: '16 h',
    monthlyGain: '+1 h this month',
  },
  {
    name: 'Web accessibility',
    category: 'Development',
    sources: 'Blogs, YouTube',
    level: 'Beginner',
    segments: 1,
    hours: '9 h',
    monthlyGain: '+1 h this month',
  },
];

export default function Skills() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [user, setUser] = useState({
    fullName: 'Daniel Okunlola',
    name: 'Daniel Okunlola',
    email: 'daniel@example.com'
  });
  const [skillsData, setSkillsData] = useState(DEFAULT_GUIDE_SKILLS);

  useEffect(() => {
    let loadedInterests = [];

    try {
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      if (stored.fullName || stored.name) {
        setUser(stored);
      }
      if (Array.isArray(stored.interests)) {
        loadedInterests = stored.interests;
      }
    } catch (e) {
      console.error(e);
    }

    const mergedSkills = [...DEFAULT_GUIDE_SKILLS];
    loadedInterests.forEach((interest) => {
      const exists = mergedSkills.some(
        (s) => s.name.toLowerCase() === interest.toLowerCase()
      );
      if (!exists) {
        mergedSkills.unshift({
          name: interest,
          category: 'Profile Goal',
          sources: 'Added from your profile',
          level: 'Beginner',
          segments: 1,
          hours: '0 h',
          monthlyGain: 'Ready to track',
        });
      }
    });
    setSkillsData(mergedSkills);

    const fetchRealSkills = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch(`${API_BASE_URL}/skills`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.skills) && data.skills.length > 0) {
            setSkillsData(data.skills);
          }
        }
      } catch (err) {}
    };

    fetchRealSkills();
  }, []);

  const displayName = user.fullName || user.name || 'Daniel Okunlola';
  const initials =
    displayName
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'DO';

  const categories = ['All', ...new Set(skillsData.map((s) => s.category))];

  const filteredSkills =
    selectedCategory === 'All'
      ? skillsData
      : skillsData.filter((s) => s.category === selectedCategory);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutGrid },
    { name: 'Activity', path: '/activity', icon: Activity },
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
              const isActive = item.name === 'Skills';
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

      {/* ================= MAIN CONTENT: SKILL MAP ================= */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-6xl mx-auto w-full">
        
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-xs mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A102F] tracking-tight">
            Skill map
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1.5">
            Your learning activities, converted into skill categories. Mapped automatically from your connected sources and profile goals.
          </p>
        </div>

        {/* 3 Top Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-7">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
            <span className="text-xs font-semibold text-gray-500 block mb-2">
              Skills mapped
            </span>
            <div className="text-3xl sm:text-4xl font-black text-[#1A102F] tracking-tight">
              {skillsData.length}
            </div>
            <span className="text-xs font-bold text-emerald-600 mt-2 inline-block">
              Auto-updated from sources
            </span>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
            <span className="text-xs font-semibold text-gray-500 block mb-2">
              Strongest area
            </span>
            <div className="text-xl sm:text-2xl font-black text-[#1A102F] tracking-tight truncate">
              Data analysis
            </div>
            <span className="text-xs font-medium text-gray-500 mt-2 inline-block">
              64 h across 3 sources
            </span>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
            <span className="text-xs font-semibold text-gray-500 block mb-2">
              Biggest growth area
            </span>
            <div className="text-xl sm:text-2xl font-black text-[#1A102F] tracking-tight truncate">
              Cloud computing
            </div>
            <span className="text-xs font-medium text-gray-500 mt-2 inline-block">
              3 h
            </span>
          </div>
        </div>

        {/* Skills by Category Table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-[#E9F5BE] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-base font-extrabold text-[#1A102F]">
              Skills by category
            </h2>

            <div className="flex items-center gap-1.5 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#1A102F] text-white shadow-xs'
                      : 'bg-white/70 text-[#1A102F] hover:bg-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredSkills.map((skill, index) => (
              <div
                key={skill.name}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4.5 transition ${
                  index % 2 === 1 ? 'bg-[#F4F9FA]' : 'bg-white'
                } hover:bg-purple-50/30`}
              >
                <div className="sm:w-1/2">
                  <h4 className="text-sm font-bold text-[#1A102F]">
                    {skill.name}
                  </h4>
                  <span className="text-[11px] text-gray-400 font-medium">
                    {skill.category} • {skill.sources}
                  </span>
                </div>

                <div className="sm:w-1/4 flex flex-col items-start">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    {[1, 2, 3].map((seg) => (
                      <div
                        key={seg}
                        className={`w-7 h-1.5 rounded-full ${
                          seg <= skill.segments ? 'bg-[#4D34D4]' : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold text-[#1A102F]">
                    {skill.level}
                  </span>
                </div>

                <div className="sm:w-1/4 text-left sm:text-right">
                  <span className="text-sm font-extrabold text-[#1A102F] block">
                    {skill.hours}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-600">
                    {skill.monthlyGain}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

    </div>
  );
}