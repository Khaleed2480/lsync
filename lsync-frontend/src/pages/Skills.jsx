import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, Plus, X, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { apiRequest } from '../utils/api';

export default function Skills() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [skillsData, setSkillsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Add Skill Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('Development');
  const [isCreating, setIsCreating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // ================= 1. FETCH SKILLS (GET /api/skills/skill) =================
  const loadSkills = async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest('/skills/skill', { method: 'GET' });
      const list = Array.isArray(res) ? res : res.skills || res.data || [];

      // Normalize backend skill objects into consistent display cards
      const normalized = list.map((s) => ({
        id: s._id || s.id || s.name,
        name: s.name || s.title || 'Unnamed Skill',
        category: s.category || 'Development',
        sources: Array.isArray(s.sources) ? s.sources.join(', ') : s.sources || 'LSync Tracked',
        level: s.level || (s.hours > 30 ? 'Intermediate' : 'Beginner'),
        segments: s.segments || (s.hours > 50 ? 3 : s.hours > 20 ? 2 : 1),
        hours: typeof s.hours === 'number' ? `${s.hours} h` : s.hours || '0 h',
        monthlyGain: s.monthlyGain || 'Active skill',
      }));

      setSkillsData(normalized);
    } catch (err) {
      // Fallback: check local profile interests if backend returns empty or error
      try {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (Array.isArray(storedUser.interests)) {
          setSkillsData(
            storedUser.interests.map((interest) => ({
              id: interest,
              name: interest,
              category: 'Profile Goal',
              sources: 'Added from your profile',
              level: 'Beginner',
              segments: 1,
              hours: '0 h',
              monthlyGain: 'Ready to track',
            }))
          );
        }
      } catch (e) {}
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  // ================= 2. CREATE SKILL (POST /api/skills/skill) =================
  const handleCreateSkill = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    setIsCreating(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await apiRequest('/skills/skill', {
        method: 'POST',
        body: JSON.stringify({
          name: newSkillName.trim(),
          category: newSkillCategory,
        }),
      });

      const created = res.skill || res.data || {
        name: newSkillName.trim(),
        category: newSkillCategory,
      };

      setSkillsData((prev) => [
        {
          id: created._id || created.id || Date.now().toString(),
          name: created.name || newSkillName.trim(),
          category: created.category || newSkillCategory,
          sources: 'Added manually',
          level: 'Beginner',
          segments: 1,
          hours: '0 h',
          monthlyGain: 'Just added',
        },
        ...prev,
      ]);

      setSuccessMsg(`Skill "${newSkillName.trim()}" added!`);
      setNewSkillName('');
      setShowAddModal(false);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.message || 'Could not create skill.');
    } finally {
      setIsCreating(false);
    }
  };

  const categories = ['All', ...new Set(skillsData.map((s) => s.category))];
  const filteredSkills =
    selectedCategory === 'All'
      ? skillsData
      : skillsData.filter((s) => s.category === selectedCategory);

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-6xl mx-auto w-full font-sans">
      
      {/* Header Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A102F] tracking-tight">
            Skill map
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1.5">
            Your learning activities, converted into skill categories. Mapped automatically from your connected sources.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#633BB3] hover:bg-[#522F9E] text-white text-xs font-bold shadow-md transition cursor-pointer shrink-0 self-end sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill</span>
        </button>
      </div>

      {/* Feedback Alerts */}
      {errorMsg && (
        <div className="flex items-center gap-2 p-3.5 mb-5 rounded-2xl bg-red-100 border border-red-200 text-red-700 text-xs font-bold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-2 p-3.5 mb-5 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

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
            Synced with database
          </span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
          <span className="text-xs font-semibold text-gray-500 block mb-2">
            Strongest area
          </span>
          <div className="text-xl sm:text-2xl font-black text-[#1A102F] tracking-tight truncate">
            {skillsData[0]?.name || 'None yet'}
          </div>
          <span className="text-xs font-medium text-gray-500 mt-2 inline-block">
            {skillsData[0]?.category || 'Connect a source to track'}
          </span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
          <span className="text-xs font-semibold text-gray-500 block mb-2">
            Categories active
          </span>
          <div className="text-xl sm:text-2xl font-black text-[#1A102F] tracking-tight truncate">
            {Math.max(0, categories.length - 1)}
          </div>
          <span className="text-xs font-medium text-gray-500 mt-2 inline-block">
            Across connected platforms
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

        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center text-gray-400 text-xs font-bold gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-[#633BB3]" />
            <span>Loading skills...</span>
          </div>
        ) : filteredSkills.length === 0 ? (
          <div className="py-16 px-6 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#633BB3] flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#1A102F]">No skills mapped yet</h3>
            <p className="text-xs text-gray-400 max-w-xs">
              Click "Add Skill" above or connect your learning platforms in Sources to start building your skill map.
            </p>
            <Link
              to="/sources"
              className="mt-2 px-5 py-2.5 rounded-xl bg-[#633BB3] text-white text-xs font-bold hover:bg-[#522F9E] transition shadow-md"
            >
              Go to Sources &rarr;
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredSkills.map((skill, index) => (
              <div
                key={skill.id}
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
        )}
      </div>

      {/* ================= MODAL: ADD SKILL (POST /api/skills/skill) ================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-extrabold text-[#1A102F]">
                Add New Skill
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1A102F] mb-1">
                  Skill Name
                </label>
                <input
                  type="text"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="e.g. React.js, Python, UI Design"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-[#1A102F] focus:outline-none focus:border-[#633BB3]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A102F] mb-1">
                  Category
                </label>
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-[#1A102F] focus:outline-none focus:border-[#633BB3]"
                >
                  <option value="Development">Development</option>
                  <option value="Data">Data</option>
                  <option value="Design">Design</option>
                  <option value="Cloud">Cloud & DevOps</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-5 py-2 rounded-xl bg-[#633BB3] hover:bg-[#522F9E] text-white text-xs font-bold cursor-pointer shadow-md"
                >
                  {isCreating ? 'Adding...' : 'Save Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}