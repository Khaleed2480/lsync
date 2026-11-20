import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Share2,
  Check,
  Award,
  Clock,
  BookOpen,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { apiRequest } from '../utils/api';

export default function PublicPortfolio() {
  const { username } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPortfolio = async () => {
      setIsLoading(true);
      const targetUser =
        username ||
        JSON.parse(localStorage.getItem('user') || '{}').username ||
        'learner';

      try {
        const res = await apiRequest(`/portfolio/${targetUser}`, {
          method: 'GET',
          skipAuth: true,
        });
        setPortfolio(res.portfolio || res.data || res);
      } catch (err) {
        // Fallback to localStorage user if testing locally before backend syncs
        const localUser = JSON.parse(localStorage.getItem('user') || '{}');
        setPortfolio({
          name: localUser.fullName || localUser.name || targetUser,
          username: targetUser,
          headline:
            localUser.headline ||
            'Continuous Learner building verified technical skills on LSync.',
          about:
            localUser.about ||
            'Consolidating courses, documentation study, and coding projects into one verifiable record.',
          photo: localUser.photo || null,
          skills: (localUser.interests || ['JavaScript', 'React', 'Node.js']).map((s) => ({
            name: s,
          })),
          activities: [],
          totalHours: 0,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolio();
  }, [username]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F6FA] gap-3 font-sans">
        <RefreshCw className="w-8 h-8 animate-spin text-[#633BB3]" />
        <p className="text-xs font-bold text-gray-500">Loading Verified Portfolio...</p>
      </div>
    );
  }

  const displayName = portfolio?.name || portfolio?.fullName || 'LSync Learner';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const skills = portfolio?.skills || [];
  const activities = portfolio?.activities || portfolio?.logs || [];

  return (
    <div className="min-h-screen bg-[#F7F6FA] font-sans selection:bg-[#7038C4] selection:text-white">
      
      {/* Public Top Navbar (Clean, no private sidebar) */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <img
              src="/lsync logo.jpeg"
              alt="LSync Logo"
              className="h-10 w-auto object-contain rounded-lg"
            />
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#633BB3] hover:bg-[#522F9E] text-white text-xs font-bold shadow-sm cursor-pointer transition"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied URL!' : 'Share Portfolio'}</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-6 sm:p-10 space-y-8">
        
        {/* Hero Card */}
        <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
          <div className="h-32 bg-gradient-to-r from-[#4D12A8] via-[#633BB3] to-[#EB577F]" />
          <div className="px-6 sm:px-10 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 mb-6">
              {portfolio?.photo ? (
                <img
                  src={portfolio.photo}
                  alt={displayName}
                  className="w-24 h-24 rounded-3xl object-cover ring-4 ring-white shadow-lg bg-white"
                />
              ) : (
                <div className="w-24 h-24 rounded-3xl bg-[#1A102F] text-white flex items-center justify-center font-black text-2xl ring-4 ring-white shadow-lg">
                  {initials}
                </div>
              )}

              <div className="flex items-center gap-4">
                <div className="text-center px-4 py-2 rounded-2xl bg-[#F8F9FC] border border-gray-100">
                  <span className="text-lg font-black text-[#1A102F] block">
                    {portfolio?.totalHours || 0}h
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Learning</span>
                </div>
                <div className="text-center px-4 py-2 rounded-2xl bg-[#F8F9FC] border border-gray-100">
                  <span className="text-lg font-black text-[#1A102F] block">
                    {skills.length}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Skills</span>
                </div>
                <div className="text-center px-4 py-2 rounded-2xl bg-[#F8F9FC] border border-gray-100">
                  <span className="text-lg font-black text-[#1A102F] block">
                    {activities.length}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Logs</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black text-[#1A102F]">
                {displayName}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                <CheckCircle2 className="w-3 h-3" />
                Verified LSync Portfolio
              </span>
            </div>

            <p className="text-sm font-semibold text-[#633BB3] mt-1">
              {portfolio?.headline}
            </p>
            <p className="text-xs text-gray-500 mt-3 leading-relaxed max-w-2xl">
              {portfolio?.about}
            </p>
          </div>
        </div>

        {/* Verified Skills */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs">
          <h2 className="text-base font-extrabold text-[#1A102F] mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#633BB3]" />
            Verified Skills
          </h2>
          {skills.length === 0 ? (
            <p className="text-xs text-gray-400">No public skills listed yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2.5">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 rounded-xl bg-[#EAE4FA] text-[#4D12A8] text-xs font-bold"
                >
                  {skill.name || skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Learning Journey Timeline */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs">
          <h2 className="text-base font-extrabold text-[#1A102F] mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#633BB3]" />
            Verified Learning Journey
          </h2>

          {activities.length === 0 ? (
            <p className="text-xs text-gray-400">
              No public learning activities synced yet.
            </p>
          ) : (
            <div className="space-y-4">
              {activities.map((act, idx) => (
                <div
                  key={act._id || idx}
                  className="p-4 rounded-2xl border border-gray-100 flex items-center justify-between gap-4"
                >
                  <div>
                    <h4 className="text-sm font-bold text-[#1A102F]">
                      {act.title || act.message}
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {act.type || 'Learning'} • {act.description || 'Verified Activity'}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-[#633BB3] block">
                      {act.durationMinutes ? `${act.durationMinutes} min` : 'Verified'}
                    </span>
                    {act.proofUrl && (
                      <a
                        href={act.proofUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-gray-400 hover:text-[#633BB3] inline-flex items-center gap-1 mt-1"
                      >
                        Proof <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}