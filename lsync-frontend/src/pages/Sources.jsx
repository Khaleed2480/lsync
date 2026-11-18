import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  RefreshCw,
  Plus,
  Check,
  ExternalLink,
  Globe,
  Trash2,
  X
} from 'lucide-react';

export default function Sources() {
  const navigate = useNavigate();

  // Connected Sources State
  const [sources, setSources] = useState([
    {
      id: 'coursera',
      name: 'Coursera',
      type: 'Online courses',
      badge: 'C',
      badgeBg: 'bg-white text-[#0056D2] border border-gray-200',
      status: 'connected',
      details: 'Last synced 2 min ago. 18 courses and 214 lessons imported.',
      btnLabel: 'Disconnect',
    },
    {
      id: 'github',
      name: 'GitHub',
      type: 'Code repositories',
      badge: 'G',
      badgeBg: 'bg-[#1A102F] text-white',
      status: 'syncing',
      details: 'Importing repositories and commits. 64% done.',
      syncProgress: 64,
      btnLabel: 'Disconnect',
    },
    {
      id: 'youtube',
      name: 'YouTube',
      type: 'Video learning',
      badge: 'yt',
      status: 'not_connected',
      details: 'Import watched tutorials and playlists you want counted as learning.',
      btnLabel: 'Connect YouTube',
    },
    {
      id: 'edx',
      name: 'edX',
      type: 'Online courses',
      badge: 'edx',
      status: 'not_connected',
      details: 'Bring in enrolled courses, progress and completion dates.',
      btnLabel: 'Connect edX',
    },
    {
      id: 'udemy',
      name: 'Udemy',
      type: 'Online courses',
      badge: 'U',
      badgeBg: 'bg-[#5B21B6] text-white',
      status: 'not_connected',
      details: 'Add purchased courses and track how far you have got in each.',
      btnLabel: 'Connect Udemy',
    },
  ]);

  const [websiteUrl, setWebsiteUrl] = useState('');
  const [urlMessage, setUrlMessage] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [customCategory, setCustomCategory] = useState('Development');

  const connectedCount = sources.filter(
    (s) => s.status === 'connected' || s.status === 'syncing'
  ).length;

  const totalSources = sources.length + 1;
  const progressPercent = Math.round((connectedCount / totalSources) * 100);

  const toggleConnection = (id) => {
    setSources((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (item.status === 'connected' || item.status === 'syncing') {
            return {
              ...item,
              status: 'not_connected',
              btnLabel: `Connect ${item.name}`,
            };
          } else {
            return {
              ...item,
              status: 'connected',
              btnLabel: 'Disconnect',
              details: 'Connected just now. Syncing initial history...',
            };
          }
        }
        return item;
      })
    );
  };

  const handleAddWebsite = (e) => {
    e.preventDefault();
    if (!websiteUrl.trim()) return;

    setUrlMessage('Source link added! Activity tracking enabled.');
    setWebsiteUrl('');
    setTimeout(() => setUrlMessage(''), 3000);
  };

  const handleAddCustomSource = (e) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const newSource = {
      id: customName.toLowerCase().replace(/\s+/g, '-'),
      name: customName.trim(),
      type: customCategory,
      badge: customName.slice(0, 1).toUpperCase(),
      badgeBg: 'bg-[#633BB3] text-white',
      status: 'connected',
      details: `Custom source linked via ${customUrl || 'browser tracking'}.`,
      btnLabel: 'Disconnect',
    };

    setSources([...sources, newSource]);
    setCustomName('');
    setCustomUrl('');
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F6] font-sans p-6 sm:p-10 lg:p-14 selection:bg-[#7038C4] selection:text-white">
      <div className="max-w-5xl mx-auto">
        
        {/* Top Logo with /lsync logo.jpeg & h-20 */}
        <div className="mb-8">
          <Link to="/dashboard">
            <img 
              src="/lsync logo.jpeg" 
              alt="LSync Logo" 
              className="h-20 w-auto object-contain rounded-xl"
            />
          </Link>
        </div>

        {/* Header Row & Progress Card */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
          <div className="max-w-xl">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A102F] tracking-tight">
              Link your learning sources
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-2 leading-relaxed">
              Connect the platforms you learn on. LSync collects your activity, merges duplicates and builds your learning record. You can disconnect any source at any time.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm w-full md:w-64 shrink-0">
            <div className="flex items-center justify-between text-xs font-bold text-[#1A102F] mb-2">
              <span>{connectedCount} of {totalSources} sources connected</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#4D34D4] rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Add Custom Source Action */}
        <div className="flex justify-end mb-6">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-xs font-bold text-[#633BB3] shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Custom Platform (Without API)</span>
          </button>
        </div>

        {/* 6 Platform Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          
          {/* Coursera */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 text-[#0056D2] font-black text-lg flex items-center justify-center shadow-xs">
                    C
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#1A102F]">Coursera</h3>
                    <span className="text-xs text-gray-400 font-medium">Online courses</span>
                  </div>
                </div>

                {sources.find((s) => s.id === 'coursera')?.status === 'connected' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700">
                    <Check className="w-3 h-3 stroke-[3]" />
                    Connected
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-500 leading-relaxed mb-6">
                {sources.find((s) => s.id === 'coursera')?.details}
              </p>
            </div>

            <button
              type="button"
              onClick={() => toggleConnection('coursera')}
              className={`w-full py-2.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                sources.find((s) => s.id === 'coursera')?.status === 'connected'
                  ? 'border-[#F4A836] text-[#1A102F] bg-white hover:bg-orange-50/20'
                  : 'bg-[#9667E0] hover:bg-[#8553D6] text-white'
              }`}
            >
              {sources.find((s) => s.id === 'coursera')?.btnLabel}
            </button>
          </div>

          {/* GitHub */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1A102F] text-white font-black text-lg flex items-center justify-center shadow-xs">
                    G
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#1A102F]">GitHub</h3>
                    <span className="text-xs text-gray-400 font-medium">Code repositories</span>
                  </div>
                </div>

                {sources.find((s) => s.id === 'github')?.status === 'syncing' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#EFEAFB] text-[#633BB3]">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    Syncing
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-500 leading-relaxed mb-3">
                {sources.find((s) => s.id === 'github')?.details}
              </p>

              {sources.find((s) => s.id === 'github')?.status === 'syncing' && (
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-6">
                  <div className="h-full bg-[#4D34D4] rounded-full w-[64%]" />
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => toggleConnection('github')}
              className="w-full py-2.5 rounded-xl text-xs font-bold transition border border-[#F4A836] text-[#1A102F] bg-white hover:bg-orange-50/20 cursor-pointer"
            >
              {sources.find((s) => s.id === 'github')?.btnLabel}
            </button>
          </div>

          {/* YouTube */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shadow-xs">
                    <svg className="w-5 h-5 fill-red-600" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#1A102F]">YouTube</h3>
                    <span className="text-xs text-gray-400 font-medium">Video learning</span>
                  </div>
                </div>

                <span className="text-[11px] font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                  {sources.find((s) => s.id === 'youtube')?.status === 'connected' ? 'Connected' : 'Not connected'}
                </span>
              </div>

              <p className="text-xs text-gray-500 leading-relaxed mb-6">
                {sources.find((s) => s.id === 'youtube')?.details}
              </p>
            </div>

            <button
              type="button"
              onClick={() => toggleConnection('youtube')}
              className={`w-full py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                sources.find((s) => s.id === 'youtube')?.status === 'connected'
                  ? 'border border-[#F4A836] text-[#1A102F] bg-white'
                  : 'bg-[#9667E0] hover:bg-[#8553D6] text-white shadow-md shadow-[#9667E0]/20'
              }`}
            >
              {sources.find((s) => s.id === 'youtube')?.btnLabel}
            </button>
          </div>

          {/* edX */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#02262B] text-[#D1FAE5] font-black text-xs flex items-center justify-center shrink-0 tracking-tighter">
                    edX
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#1A102F]">edX</h3>
                    <span className="text-xs text-gray-400 font-medium">Online courses</span>
                  </div>
                </div>

                <span className="text-[11px] font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                  {sources.find((s) => s.id === 'edx')?.status === 'connected' ? 'Connected' : 'Not connected'}
                </span>
              </div>

              <p className="text-xs text-gray-500 leading-relaxed mb-6">
                {sources.find((s) => s.id === 'edx')?.details}
              </p>
            </div>

            <button
              type="button"
              onClick={() => toggleConnection('edx')}
              className={`w-full py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                sources.find((s) => s.id === 'edx')?.status === 'connected'
                  ? 'border border-[#F4A836] text-[#1A102F] bg-white'
                  : 'bg-[#9667E0] hover:bg-[#8553D6] text-white shadow-md shadow-[#9667E0]/20'
              }`}
            >
              {sources.find((s) => s.id === 'edx')?.btnLabel}
            </button>
          </div>

          {/* Udemy */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#5B21B6] text-white font-black text-lg flex items-center justify-center shadow-xs">
                    U
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#1A102F]">Udemy</h3>
                    <span className="text-xs text-gray-400 font-medium">Online courses</span>
                  </div>
                </div>

                <span className="text-[11px] font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                  {sources.find((s) => s.id === 'udemy')?.status === 'connected' ? 'Connected' : 'Not connected'}
                </span>
              </div>

              <p className="text-xs text-gray-500 leading-relaxed mb-6">
                {sources.find((s) => s.id === 'udemy')?.details}
              </p>
            </div>

            <button
              type="button"
              onClick={() => toggleConnection('udemy')}
              className={`w-full py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                sources.find((s) => s.id === 'udemy')?.status === 'connected'
                  ? 'border border-[#F4A836] text-[#1A102F] bg-white'
                  : 'bg-[#9667E0] hover:bg-[#8553D6] text-white shadow-md shadow-[#9667E0]/20'
              }`}
            >
              {sources.find((s) => s.id === 'udemy')?.btnLabel}
            </button>
          </div>

          {/* Blogs and Documentation */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-500 font-bold text-lg flex items-center justify-center">
                  +
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1A102F]">Blogs and documentation</h3>
                  <span className="text-xs text-gray-400 font-medium">Articles and technical docs</span>
                </div>
              </div>

              <p className="text-xs font-bold text-[#1A102F] mb-2">
                Paste a link from a supported site
              </p>

              {urlMessage && (
                <p className="text-[11px] font-bold text-emerald-600 mb-2">
                  {urlMessage}
                </p>
              )}

              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-[#1A102F] placeholder-gray-300 focus:outline-none focus:border-[#F4A836] transition mb-4"
              />
            </div>

            <button
              type="button"
              onClick={handleAddWebsite}
              className="w-full py-2.5 rounded-xl text-xs font-bold transition border border-[#F4A836] text-[#1A102F] bg-white hover:bg-orange-50/20 cursor-pointer"
            >
              Add website
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex items-center justify-end gap-6 pt-4 border-t border-gray-200/80">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="text-xs font-bold text-gray-500 hover:text-[#1A102F] transition cursor-pointer"
          >
            Skip for now
          </button>

          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#9667E0] hover:bg-[#8553D6] text-white text-xs font-bold shadow-md shadow-[#9667E0]/25 transition cursor-pointer active:scale-95"
          >
            <span>Continue to dashboard</span>
            <span>&rarr;</span>
          </button>
        </div>

      </div>

      {/* Modal: Custom Platform */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-extrabold text-[#1A102F]">
                Add Custom Learning Platform
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-500 mb-5 leading-relaxed">
              Track any platform without an official API (like Scrimba, LeetCode, or Khan Academy) by linking your public profile or course URL.
            </p>

            <form onSubmit={handleAddCustomSource} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1A102F] mb-1">
                  Platform Name
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Scrimba, LeetCode, Frontend Mentor"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-[#1A102F] focus:outline-none focus:border-[#633BB3]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A102F] mb-1">
                  Your Public Profile or Course URL
                </label>
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://scrimba.com/@yourname"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-[#1A102F] focus:outline-none focus:border-[#633BB3]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A102F] mb-1">
                  Skill Category
                </label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
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
                  className="px-5 py-2 rounded-xl bg-[#633BB3] hover:bg-[#522F9E] text-white text-xs font-bold cursor-pointer shadow-md"
                >
                  Link Platform
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}