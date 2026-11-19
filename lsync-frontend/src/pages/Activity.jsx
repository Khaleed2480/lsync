import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Activity as ActivityIcon,
  CheckCircle2,
  GitCommit,
  GitMerge,
  RefreshCw,
  FolderOpen
} from 'lucide-react';

export default function Activity() {
  const navigate = useNavigate();
  const { isNewUser, connectedPlatforms } = useApp();

  const [edxRetrying, setEdxRetrying] = useState(false);
  const [edxStatus, setEdxStatus] = useState('failed');

  const handleRetryEdx = () => {
    setEdxRetrying(true);
    setTimeout(() => {
      setEdxRetrying(false);
      setEdxStatus('synced');
    }, 1500);
  };

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full font-sans">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A102F] tracking-tight">
          Learning activity
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-3xl leading-relaxed">
          Everything from your connected sources, merged into one timeline. Duplicate entries are combined automatically so your history stays consistent.
        </p>
      </div>

      {/* Sync Banner */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3.5">
          <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#1A102F] mr-2">
              {isNewUser ? 'Awaiting initial integration.' : 'Sync complete.'}
            </span>
            <span className="text-xs text-gray-500 font-medium">
              {isNewUser
                ? 'Connect your learning sources to start importing activity.'
                : `214 activities imported from ${connectedPlatforms.length} sources. 6 duplicates merged.`}
            </span>
          </div>
        </div>
        {!isNewUser && (
          <button className="text-xs font-bold text-[#633BB3] hover:underline cursor-pointer">
            Review merged items
          </button>
        )}
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Activity Timeline List */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden flex flex-col justify-between">
          
          {isNewUser ? (
            <div className="py-20 px-6 text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#633BB3] flex items-center justify-center">
                <FolderOpen className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-bold text-[#1A102F]">No learning activity yet</h3>
              <p className="text-xs text-gray-400 max-w-xs">
                You haven't connected any sources or logged any learning activity. Link your accounts to populate your timeline.
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
              {/* Item 1 */}
              <div className="flex items-center justify-between p-5 hover:bg-gray-50/50 transition">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0056D2] font-black text-lg flex items-center justify-center shrink-0">
                    C
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1A102F]">Data cleaning with pandas</h4>
                    <span className="text-[11px] text-gray-400 font-medium">Coursera • Data • Lesson</span>
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
                    <h4 className="text-sm font-bold text-[#1A102F]">SQL joins explained</h4>
                    <span className="text-[11px] text-gray-400 font-medium">YouTube • Data • Video</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#1A102F] block">28 min</span>
                  <span className="text-[10px] text-gray-400 font-medium">Today</span>
                </div>
              </div>
            </div>
          )}

          {!isNewUser && (
            <div className="p-5 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">Showing 1 to 8 of 214 activities</span>
              <div className="flex items-center gap-2">
                <button className="px-3.5 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition cursor-pointer">Previous</button>
                <button className="px-3.5 py-1.5 rounded-xl bg-[#1A102F] text-xs font-bold text-white hover:bg-black transition cursor-pointer shadow-xs">Next</button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Sync Status Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-xs">
            <div className="bg-[#9CA8B8] px-6 py-4 text-white">
              <h3 className="text-base font-bold">Sync status</h3>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1A102F]">Coursera</span>
                <span className="text-xs font-bold text-emerald-600">
                  {isNewUser ? 'Not connected' : '✓ Synced 2 min ago'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1A102F]">GitHub</span>
                <span className="text-xs font-bold text-gray-400">
                  {isNewUser ? 'Not connected' : '✓ Synced 10 min ago'}
                </span>
              </div>
            </div>

            <div className="p-6 pt-0">
              <div className="p-4 rounded-2xl bg-[#FFF9E6] border border-[#FDE68A]">
                <h4 className="text-xs font-bold text-[#92400E] mb-1">
                  {isNewUser ? 'Get started' : 'edX needs attention'}
                </h4>
                <p className="text-[11px] text-[#B45309] leading-relaxed mb-3">
                  {isNewUser
                    ? 'Connect your learning platforms in Sources to start syncing automatically.'
                    : 'The last sync did not finish. Try again to import new activity.'}
                </p>

                {isNewUser ? (
                  <Link
                    to="/sources"
                    className="block text-center py-2 bg-[#1A102F] text-white text-xs font-bold rounded-xl"
                  >
                    Go to Sources
                  </Link>
                ) : (
                  edxStatus !== 'synced' && (
                    <button
                      onClick={handleRetryEdx}
                      disabled={edxRetrying}
                      className="w-full py-2 bg-[#1A102F] hover:bg-black text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      {edxRetrying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Retry sync'}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}