import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award } from 'lucide-react';

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
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Check if brand-new user (0 connected platforms) or active user
  const [connectedPlatforms, setConnectedPlatforms] = useState(() => {
    try {
      const stored = localStorage.getItem('connected_platforms');
      if (stored !== null) return JSON.parse(stored);
    } catch (e) {}
    return [];
  });

  const isNewUser = connectedPlatforms.length === 0;
  const [skillsData, setSkillsData] = useState([]);

  useEffect(() => {
    let loadedInterests = [];

    try {
      const storedPlatforms = localStorage.getItem('connected_platforms');
      const platforms = storedPlatforms !== null ? JSON.parse(storedPlatforms) : [];
      setConnectedPlatforms(platforms);

      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (Array.isArray(storedUser.interests)) {
        loadedInterests = storedUser.interests;
      }

      if (platforms.length === 0) {
        // Brand-new user: show only their profile goals at 0 h (or empty if none)
        const goalSkills = loadedInterests.map((interest) => ({
          name: interest,
          category: 'Profile Goal',
          sources: 'Added from your profile',
          level: 'Beginner',
          segments: 0,
          hours: '0 h',
          monthlyGain: 'Ready to track',
        }));
        setSkillsData(goalSkills);
      } else {
        // Active user: merge profile goals with tracked skills
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
      }
    } catch (e) {
      console.error(e);
    }

    // Fetch real skills from backend when ready
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

  const categories = ['All', ...new Set(skillsData.map((s) => s.category))];

  const filteredSkills =
    selectedCategory === 'All'
      ? skillsData
      : skillsData.filter((s) => s.category === selectedCategory);

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-6xl mx-auto w-full font-sans">
      
      {/* Header Box */}
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
            {isNewUser ? skillsData.length : 23}
          </div>
          <span className={`text-xs font-bold mt-2 inline-block ${isNewUser ? 'text-gray-400' : 'text-emerald-600'}`}>
            {isNewUser ? '0 new this month' : '3 new this month'}
          </span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
          <span className="text-xs font-semibold text-gray-500 block mb-2">
            Strongest area
          </span>
          <div className="text-xl sm:text-2xl font-black text-[#1A102F] tracking-tight truncate">
            {isNewUser ? 'None yet' : 'Data analysis'}
          </div>
          <span className="text-xs font-medium text-gray-500 mt-2 inline-block">
            {isNewUser ? 'Connect a source to track' : '64 h across 3 sources'}
          </span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
          <span className="text-xs font-semibold text-gray-500 block mb-2">
            Biggest growth area
          </span>
          <div className="text-xl sm:text-2xl font-black text-[#1A102F] tracking-tight truncate">
            {isNewUser ? 'None yet' : 'Cloud computing'}
          </div>
          <span className="text-xs font-medium text-gray-500 mt-2 inline-block">
            {isNewUser ? '0 h' : '3 h'}
          </span>
        </div>
      </div>

      {/* Skills by Category Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-[#E9F5BE] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base font-extrabold text-[#1A102F]">
            Skills by category
          </h2>

          {categories.length > 1 && (
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
          )}
        </div>

        {filteredSkills.length === 0 ? (
          <div className="py-16 px-6 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#633BB3] flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#1A102F]">No skills mapped yet</h3>
            <p className="text-xs text-gray-400 max-w-xs">
              Connect your learning platforms in Sources so LSync can automatically map your activities into skills.
            </p>
            <Link
              to="/sources"
              className="mt-2 px-5 py-2.5 rounded-xl bg-[#633BB3] text-white text-xs font-bold hover:bg-[#522F9E] transition shadow-md"
            >
              Connect Sources Now &rarr;
            </Link>
          </div>
        ) : (
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
                  <span className={`text-[11px] font-bold ${isNewUser ? 'text-gray-400' : 'text-emerald-600'}`}>
                    {skill.monthlyGain}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}