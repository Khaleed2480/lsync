import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

export default function Analytics() {
  // Time filter state
  const [timeRange, setTimeRange] = useState('12 weeks');

  // Check if brand-new user (0 connected platforms) or active user
  const [connectedPlatforms, setConnectedPlatforms] = useState(() => {
    try {
      const stored = localStorage.getItem('connected_platforms');
      if (stored !== null) {
        return JSON.parse(stored);
      }
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    try {
      const storedPlatforms = localStorage.getItem('connected_platforms');
      if (storedPlatforms !== null) {
        setConnectedPlatforms(JSON.parse(storedPlatforms));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const isNewUser = connectedPlatforms.length === 0;

  // Weekly bar data matching your exact Figma screenshot (Max Y-axis = 6 h)
  const weeklyBars = [
    { week: 'Wk 1', hours: 2.1 },
    { week: 'Wk 2', hours: 2.8 },
    { week: 'Wk 3', hours: 3.4 },
    { week: 'Wk 4', hours: 3.0 },
    { week: 'Wk 5', hours: 4.2 },
    { week: 'Wk 6', hours: 4.6 },
    { week: 'Wk 7', hours: 5.1 },
    { week: 'Wk 8', hours: 5.8 },
  ];

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full space-y-7 font-sans">
      
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
              {isNewUser ? '0 h' : '126 h'}
            </div>
            <span className="text-xs font-medium text-gray-400 mt-2 block">
              {isNewUser ? 'No sources synced yet' : `In the last ${timeRange}`}
            </span>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
            <span className="text-xs font-semibold text-gray-400 block mb-2">
              Average per day
            </span>
            <div className="text-3xl sm:text-4xl font-black text-[#1A102F]">
              {isNewUser ? '0 h' : '1.5 h'}
            </div>
            <span className={`text-xs font-bold mt-2 block ${isNewUser ? 'text-gray-400' : 'text-emerald-600'}`}>
              {isNewUser ? '0 h vs previous period' : '+0.3 h vs previous period'}
            </span>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
            <span className="text-xs font-semibold text-gray-400 block mb-2">
              Active days
            </span>
            <div className="text-3xl sm:text-4xl font-black text-[#1A102F]">
              {isNewUser ? '0 of 84' : '71 of 84'}
            </div>
            <span className="text-xs font-medium text-gray-400 mt-2 block">
              {isNewUser ? '0% consistency' : '85% consistency'}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-400 block mb-1">
              Longest streak
            </span>
            <div className="text-2xl sm:text-3xl font-black text-[#1A102F]">
              {isNewUser ? '0 days' : '21 days'}
            </div>
            <span className="text-xs font-medium text-gray-400 mt-1 block">
              {isNewUser ? 'Current streak: 0 days' : 'Current streak: 9 days'}
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
              {isNewUser ? '0 h' : '31 h'}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
            <span className="text-xs font-semibold text-gray-400 block mb-2">
              Articles read
            </span>
            <div className="text-3xl sm:text-4xl font-black text-[#1A102F]">
              {isNewUser ? '0' : '38'}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
            <span className="text-xs font-semibold text-gray-400 block mb-2">
              Documentation pages
            </span>
            <div className="text-3xl sm:text-4xl font-black text-[#1A102F]">
              {isNewUser ? '0' : '112'}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
          <span className="text-xs font-semibold text-gray-400 block mb-1">
            Average session
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#1A102F]">
            {isNewUser ? '0 min' : '24 min'}
          </div>
        </div>
      </div>

      {/* SECTION 3: READING CHARTS (EXACT FIGMA REPRESENTATION) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Reading Time Per Week Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs">
          <h3 className="text-base font-extrabold text-[#1A102F] mb-8">
            Reading time per week
          </h3>

          {isNewUser ? (
            <div className="h-56 flex flex-col items-center justify-center text-center">
              <p className="text-xs font-bold text-gray-400 mb-2">
                No reading activity recorded yet.
              </p>
              <Link
                to="/sources"
                className="text-xs font-bold text-[#633BB3] hover:underline"
              >
                Connect your sources to track reading &rarr;
              </Link>
            </div>
          ) : (
            <div className="w-full pt-4">
              <div className="flex">
                {/* Left Vertical Y-Axis Labels (6 h, 4, 2, 0) */}
                <div className="flex flex-col justify-between items-end pr-3 sm:pr-4 h-52 text-[11px] font-semibold text-gray-400 select-none">
                  <span className="-mt-2">6 h</span>
                  <span>4</span>
                  <span>2</span>
                  <span className="-mb-1.5">0</span>
                </div>

                {/* Plot Area with Gridlines + Bars */}
                <div className="flex-1 relative h-52 border-b border-gray-200">
                  {/* Horizontal Gridlines matching 6h, 4, 2 */}
                  <div className="absolute inset-x-0 top-0 border-t border-dashed border-gray-100 pointer-events-none" />
                  <div className="absolute inset-x-0 top-1/3 border-t border-dashed border-gray-100 pointer-events-none" />
                  <div className="absolute inset-x-0 top-2/3 border-t border-dashed border-gray-100 pointer-events-none" />

                  {/* 8 Bars */}
                  <div className="relative z-10 h-full flex items-end justify-between gap-2 sm:gap-4 px-2 sm:px-4">
                    {weeklyBars.map((bar) => {
                      const heightPercent = (bar.hours / 6) * 100;
                      return (
                        <div
                          key={bar.week}
                          className="flex-1 h-full flex flex-col justify-end items-center"
                        >
                          <div
                            className="relative w-full max-w-[44px] bg-[#4332C8] hover:bg-[#5240DF] rounded-t-lg transition-all duration-300"
                            style={{ height: `${heightPercent}%` }}
                          >
                            {/* Value directly above bar */}
                            <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[11px] font-bold text-[#1A102F] whitespace-nowrap">
                              {bar.hours.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom X-Axis Labels (Wk 1 to Wk 8) */}
              <div className="flex pl-7 sm:pl-9 mt-2.5">
                <div className="flex-1 flex items-center justify-between gap-2 sm:gap-4 px-2 sm:px-4">
                  {weeklyBars.map((bar) => (
                    <span
                      key={bar.week}
                      className="flex-1 text-center text-[11px] font-semibold text-gray-400"
                    >
                      {bar.week}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Reading by Type */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs flex flex-col justify-between">
          <h3 className="text-base font-extrabold text-[#1A102F] mb-6">
            Reading by type
          </h3>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs font-bold text-[#1A102F] mb-2">
                <span>Articles and blogs</span>
                <span className="text-gray-400 font-semibold">{isNewUser ? '0 h' : '14 h'}</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#4332C8] rounded-full transition-all duration-500" style={{ width: isNewUser ? '0%' : '80%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-[#1A102F] mb-2">
                <span>Documentation</span>
                <span className="text-gray-400 font-semibold">{isNewUser ? '0 h' : '11 h'}</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#4332C8] rounded-full transition-all duration-500" style={{ width: isNewUser ? '0%' : '60%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-[#1A102F] mb-2">
                <span>Books and notes</span>
                <span className="text-gray-400 font-semibold">{isNewUser ? '0 h' : '6 h'}</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#4332C8] rounded-full transition-all duration-500" style={{ width: isNewUser ? '0%' : '35%' }} />
              </div>
            </div>
          </div>

          <div />
        </div>

      </div>

      {/* SECTION 4: HEATMAP CALENDAR & INSIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: 26-Week Heatmap Calendar (With Vertical Mon/Wed/Fri/Sun on Left) */}
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
            <div className="flex items-start gap-3 min-w-[520px]">
              {/* Vertical Day Labels on the Left */}
              <div className="grid grid-rows-7 gap-1.5 text-[10px] font-semibold text-gray-400 py-0.5 select-none">
                <span className="h-3.5 leading-3.5">Mon</span>
                <span className="h-3.5 leading-3.5"></span>
                <span className="h-3.5 leading-3.5">Wed</span>
                <span className="h-3.5 leading-3.5"></span>
                <span className="h-3.5 leading-3.5">Fri</span>
                <span className="h-3.5 leading-3.5"></span>
                <span className="h-3.5 leading-3.5">Sun</span>
              </div>

              {/* 7x26 Blocks */}
              <div className="flex-1 grid grid-rows-7 grid-flow-col gap-1.5">
                {Array.from({ length: 182 }).map((_, i) => {
                  const intensities = [
                    'bg-[#4332C8]',
                    'bg-[#7A64E8]',
                    'bg-[#C2B7F8]',
                    'bg-[#ECE8FA]',
                  ];
                  const color = isNewUser
                    ? 'bg-gray-100'
                    : (i * 7 + 3) % 11 === 0
                    ? intensities[0]
                    : (i + 4) % 5 === 0
                    ? intensities[1]
                    : (i + 2) % 3 === 0
                    ? intensities[2]
                    : (i + 1) % 2 === 0
                    ? intensities[3]
                    : 'bg-[#F3F0FC]';

                  return (
                    <div
                      key={i}
                      className={`w-3.5 h-3.5 rounded-[3px] ${color} transition hover:ring-2 hover:ring-[#4332C8] cursor-pointer`}
                      title={isNewUser ? 'No activity' : `Day ${i + 1}`}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Heatmap Legend */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 pt-4 mt-1">
            <span className="text-[11px] mr-1">Less</span>
            <div className="w-3.5 h-3.5 rounded-[3px] bg-gray-100" />
            <div className="w-3.5 h-3.5 rounded-[3px] bg-[#ECE8FA]" />
            <div className="w-3.5 h-3.5 rounded-[3px] bg-[#C2B7F8]" />
            <div className="w-3.5 h-3.5 rounded-[3px] bg-[#7A64E8]" />
            <div className="w-3.5 h-3.5 rounded-[3px] bg-[#4332C8]" />
            <span className="text-[11px] ml-1">More</span>
          </div>
        </div>

        {/* Right: Insights */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs flex flex-col justify-between space-y-6">
          <h3 className="text-base font-extrabold text-[#1A102F]">
            Insights
          </h3>

          {isNewUser ? (
            <div className="py-6 text-xs text-gray-400 leading-relaxed">
              Connect at least one learning platform to unlock personalized study patterns and peak focus insights.
            </div>
          ) : (
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
          )}

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
                {!isNewUser && (
                  <>
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
                  </>
                )}
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-[#1A102F] leading-none">
                  {isNewUser ? '0 h' : '126 h'}
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
                <span className="text-gray-400 font-semibold">{isNewUser ? '0 h • 0%' : '44 h • 35%'}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-bold text-[#1A102F]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1A102F]" />
                  Video
                </span>
                <span className="text-gray-400 font-semibold">{isNewUser ? '0 h • 0%' : '32 h • 25%'}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-bold text-[#1A102F]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#7A64E8]" />
                  Reading
                </span>
                <span className="text-gray-400 font-semibold">{isNewUser ? '0 h • 0%' : '31 h • 25%'}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-bold text-[#1A102F]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F4A836]" />
                  Code
                </span>
                <span className="text-gray-400 font-semibold">{isNewUser ? '0 h • 0%' : '19 h • 15%'}</span>
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
                {isNewUser ? '0 h' : '12.5 h'}
              </span>
              <span className="text-xs text-gray-400 font-medium">
                of your 10 h goal this week
              </span>
            </div>

            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-[#4332C8] rounded-full transition-all duration-500"
                style={{ width: isNewUser ? '0%' : '100%' }}
              />
            </div>

            {isNewUser ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-bold mb-3">
                <span>0% completed</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-3">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Goal reached</span>
              </div>
            )}

            <p className="text-xs text-gray-400 font-medium">
              {isNewUser
                ? 'Start learning to work toward your 10 h weekly target.'
                : 'You reached your goal in 9 of the last 12 weeks.'}
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

    </div>
  );
}