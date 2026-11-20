import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  GitCommit,
  RefreshCw,
  FolderOpen,
  Plus,
  X,
  AlertCircle,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { apiRequest } from '../utils/api';

export default function Activity() {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  // Manual Log Activity Modal
  const [showLogModal, setShowLogModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [type, setType] = useState('Coding');
  const [proofUrl, setProofUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Feedback
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // ================= 1. FETCH SYNCED GITHUB ACTIVITIES =================
  const loadActivities = async (pageNum = 1) => {
    setIsLoading(true);
    try {
      const res = await apiRequest(`/integrations/github/activities?page=${pageNum}&limit=20`, {
        method: 'GET',
      });
      const list = Array.isArray(res) ? res : res.activities || res.data || [];
      setActivities(list);
    } catch (err) {
      console.log('Activity fetch note:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadActivities(page);
  }, [page]);

  // ================= 2. LOG MANUAL ACTIVITY (POST /api/logs/log) =================
  const handleCreateLog = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsSubmitting(true);
    setErrorMsg('');
    setStatusMsg('');

    const mins = Number(durationMinutes) || 30;
    const payload = {
      title: title.trim(),
      description: description.trim() || `Completed ${type} study session`,
      durationMinutes: mins,
      durationSeconds: mins * 60,
      type,
      proofUrl: proofUrl.trim() || undefined,
      date: new Date().toISOString(),
    };

    try {
      const res = await apiRequest('/logs/log', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const created = res.log || res.data || {
        ...payload,
        _id: Date.now().toString(),
        source: 'Manual Log',
      };

      setActivities((prev) => [created, ...prev]);
      setStatusMsg('Learning activity logged to database!');
      setTitle('');
      setDescription('');
      setProofUrl('');
      setShowLogModal(false);
      setTimeout(() => setStatusMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.message || 'Could not log activity.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A102F] tracking-tight">
            Learning activity
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl leading-relaxed">
            Your synced GitHub commits and logged learning sessions merged into one timeline.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowLogModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#633BB3] hover:bg-[#522F9E] text-white text-xs font-bold shadow-md transition cursor-pointer shrink-0 self-end sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Log Activity</span>
        </button>
      </div>

      {/* Feedback */}
      {errorMsg && (
        <div className="flex items-center gap-2 p-3.5 mb-5 rounded-2xl bg-red-100 border border-red-200 text-red-700 text-xs font-bold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {statusMsg && (
        <div className="flex items-center gap-2 p-3.5 mb-5 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Sync Banner */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3.5">
          <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#1A102F] mr-2">
              {activities.length === 0 ? 'Ready to track.' : 'Sync active.'}
            </span>
            <span className="text-xs text-gray-500 font-medium">
              {activities.length === 0
                ? 'Sync GitHub repositories in Sources or log an activity manually above.'
                : `Showing ${activities.length} recorded learning events.`}
            </span>
          </div>
        </div>

        <button
          onClick={() => loadActivities(page)}
          className="text-xs font-bold text-[#633BB3] hover:underline cursor-pointer flex items-center gap-1"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Activity Feed Container */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-gray-400 text-xs font-bold gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-[#633BB3]" />
            <span>Fetching your learning timeline...</span>
          </div>
        ) : activities.length === 0 ? (
          <div className="py-20 px-6 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#633BB3] flex items-center justify-center">
              <FolderOpen className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-bold text-[#1A102F]">No learning activity yet</h3>
            <p className="text-xs text-gray-400 max-w-xs">
              Sync a GitHub repository in Sources or click "+ Log Activity" to record your study session.
            </p>
            <div className="flex items-center gap-3 mt-2">
              <Link
                to="/sources"
                className="px-5 py-2.5 rounded-xl bg-[#633BB3] text-white text-xs font-bold hover:bg-[#522F9E] transition shadow-md"
              >
                Go to Sources &rarr;
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-100">
              {activities.map((item, idx) => {
                const isGitHub =
                  item.source === 'GitHub' ||
                  item.platform === 'GitHub' ||
                  Boolean(item.commitSha || item.repository);

                return (
                  <div
                    key={item._id || item.id || idx}
                    className="flex items-center justify-between p-5 hover:bg-gray-50/50 transition gap-4"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isGitHub ? 'bg-gray-900 text-white' : 'bg-purple-50 text-[#633BB3]'
                        }`}
                      >
                        {isGitHub ? (
                          <GitCommit className="w-5 h-5" />
                        ) : (
                          <BookOpen className="w-5 h-5" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-[#1A102F] truncate">
                            {item.title || item.message || 'Learning Session'}
                          </h4>
                          {(item.proofUrl || item.url) && (
                            <a
                              href={item.proofUrl || item.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#633BB3] hover:text-[#4D12A8] shrink-0"
                              title="View Proof Link"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                        <span className="text-[11px] text-gray-400 font-medium block truncate">
                          {isGitHub ? 'GitHub' : item.type || 'Study'} •{' '}
                          {item.description || item.repository || 'Verified learning log'}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-[#1A102F] block">
                        {item.durationMinutes ? `${item.durationMinutes} min` : 'Synced'}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {item.date || item.createdAt
                          ? new Date(item.date || item.createdAt).toLocaleDateString()
                          : 'Recent'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="p-5 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">Page {page}</span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3.5 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#1A102F] text-xs font-bold text-white hover:bg-black cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ================= MODAL: LOG MANUAL ACTIVITY (POST /api/logs/log) ================= */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-extrabold text-[#1A102F]">
                Log Learning Activity
              </h3>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLog} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1A102F] mb-1">
                  Activity Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Node.js Authentication"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-[#1A102F] focus:outline-none focus:border-[#633BB3]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A102F] mb-1">
                  What did you learn?
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Built JWT authentication & protected routes"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-[#1A102F] focus:outline-none focus:border-[#633BB3]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1A102F] mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-[#1A102F] focus:outline-none focus:border-[#633BB3]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A102F] mb-1">
                    Activity Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-[#1A102F] focus:outline-none focus:border-[#633BB3]"
                  >
                    <option value="Coding">Coding</option>
                    <option value="Video">Video</option>
                    <option value="Reading">Reading</option>
                    <option value="Course">Course</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A102F] mb-1">
                  Proof URL (GitHub, Course, or Article Link)
                </label>
                <input
                  type="url"
                  value={proofUrl}
                  onChange={(e) => setProofUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-[#1A102F] focus:outline-none focus:border-[#633BB3]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-[#633BB3] hover:bg-[#522F9E] text-white text-xs font-bold cursor-pointer shadow-md"
                >
                  {isSubmitting ? 'Saving...' : 'Save Activity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}