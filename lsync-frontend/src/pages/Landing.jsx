import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Link2,
  Award,
  BarChart2,
  Share2,
  ChevronDown,
  Menu,
  X,
  Flame,
} from 'lucide-react';

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: 'Is LSync a school or course platform?',
      a: 'No! LSync is a unified learning portfolio and tracker. You continue learning on YouTube, Coursera, GitHub, Udemy, edX, or technical blogs—LSync brings all that scattered progress into one verifiable profile.',
    },
    {
      q: 'How does LSync track YouTube tutorials if Google blocks watch history?',
      a: 'We built the lightweight LSync Chrome Extension! Once you link it with your Extension Token from Sources, it automatically records your educational YouTube watch time while you study.',
    },
    {
      q: 'Can I control what employers see on my public portfolio?',
      a: 'Yes. Inside your Profile visibility settings, you can toggle your entire portfolio public or private, and choose exactly which learning sources appear on your shared link.',
    },
    {
      q: 'How does the Skill Mapping Engine work?',
      a: 'LSync converts your synced GitHub commits, courses, and documentation reading into structured skill categories (like Development, Data, and Design) with visual proficiency levels.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F6FA] text-[#1A102F] font-sans selection:bg-[#7038C4] selection:text-white overflow-x-hidden">
      
      {/* ================= 1. TOP NAVBAR ================= */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-lg border-b border-gray-200/70">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center">
            <img
              src="/lsync logo.jpeg"
              alt="LSync Logo"
              className="h-14 sm:h-16 w-auto object-contain rounded-xl"
            />
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-gray-600">
            <a href="#features" className="hover:text-[#633BB3] transition">Features</a>
            <a href="#how-it-works" className="hover:text-[#633BB3] transition">How It Works</a>
            <a href="#faq" className="hover:text-[#633BB3] transition">FAQ</a>
            <Link to="/portfolio/daniel-okunlola" className="hover:text-[#633BB3] transition">
              Sample Portfolio
            </Link>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-xs font-extrabold uppercase tracking-wide text-[#1A102F] transition"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7038C4] via-[#EB577F] to-[#F4A836] hover:opacity-95 text-white text-xs font-extrabold uppercase tracking-wide shadow-md shadow-[#7038C4]/25 transition"
            >
              Get Started Free
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-gray-100 text-[#1A102F] cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-6 py-5 space-y-4 shadow-lg">
            <div className="flex flex-col space-y-3 text-xs font-bold uppercase tracking-wider text-gray-700">
              <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
              <Link to="/portfolio/daniel-okunlola" onClick={() => setMobileMenuOpen(false)}>
                Sample Portfolio
              </Link>
            </div>
            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2.5">
              <Link
                to="/login"
                className="w-full py-3 rounded-xl border border-gray-300 text-center text-xs font-extrabold uppercase"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7038C4] to-[#EB577F] text-white text-center text-xs font-extrabold uppercase"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ================= 2. HERO SECTION ================= */}
      <section className="relative pt-14 pb-20 sm:pt-20 sm:pb-28 px-5 sm:px-8 overflow-hidden">
        {/* Soft Electric Plum Background Glows */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#7038C4]/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#F4A836]/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
          
          {/* Left Hero Copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAE4FA] border border-[#D4C6F7] mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[#7038C4]" />
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#4D12A8]">
                Unified Learning Portfolio Platform
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1A102F] leading-[1.12] tracking-tight">
              Learn Smarter, <br />
              Track Better, <br />
              <span className="bg-gradient-to-r from-[#7038C4] via-[#EB577F] to-[#F4A836] bg-clip-text text-transparent">
                Showcase More.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-gray-600 font-medium mt-6 leading-relaxed max-w-xl">
              Stop letting your hard work stay scattered across YouTube, GitHub, Coursera, and technical blogs. LSync aggregates your learning into one verified, shareable portfolio.
            </p>

            {/* Hero Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-8">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-gradient-to-r from-[#7038C4] via-[#EB577F] to-[#F4A836] hover:opacity-95 text-white text-xs sm:text-sm font-black uppercase tracking-wider shadow-xl shadow-[#7038C4]/25 active:scale-[0.99] transition"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/portfolio/daniel-okunlola"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white hover:bg-gray-50 border-2 border-[#F4A836]/60 text-[#1A102F] text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-sm transition"
              >
                <span>View Sample Portfolio</span>
              </Link>
            </div>

            <div className="flex items-center gap-5 mt-8 text-xs font-bold text-gray-500 flex-wrap">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                GitHub Sync
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                YouTube Chrome Extension
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Free Forever
              </span>
            </div>
          </div>

          {/* Right Hero Visual Showcase Card */}
          <div className="relative">
            <div className="rounded-3xl bg-gradient-to-br from-[#4D12A8] via-[#430DA3] to-[#2E0775] p-6 sm:p-8 shadow-2xl border border-[#7038C4]/40 text-white relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-44 h-44 bg-[#EB577F]/30 rounded-full blur-3xl pointer-events-none" />

              {/* Mini Preview Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/15">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white text-[#4D12A8] font-black text-sm flex items-center justify-center">
                    DO
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Daniel Okunlola</h4>
                    <span className="text-[11px] text-white/70">lsync.app/portfolio/daniel</span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Sync
                </span>
              </div>

              {/* Mini Stats Row */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10">
                  <span className="text-[10px] text-white/70 block">Learning Time</span>
                  <span className="text-xl font-black text-white mt-0.5 block">126 h</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10">
                  <span className="text-[10px] text-white/70 block">Skills Mapped</span>
                  <span className="text-xl font-black text-white mt-0.5 block">23</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10">
                  <span className="text-[10px] text-white/70 block">Streak</span>
                  <span className="text-xl font-black text-[#F4A836] mt-0.5 flex items-center gap-1">
                    9d <Flame className="w-4 h-4 fill-[#F4A836]" />
                  </span>
                </div>
              </div>

              {/* Aggregated Sources Preview */}
              <div className="space-y-2.5">
                <div className="bg-white/10 rounded-xl px-4 py-3 flex items-center justify-between text-xs border border-white/10">
                  <span className="font-bold flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-white text-[#0056D2] font-black flex items-center justify-center text-[11px]">C</span>
                    Data cleaning with pandas (Coursera)
                  </span>
                  <span className="text-[#F4A836] font-bold">45 min</span>
                </div>
                <div className="bg-white/10 rounded-xl px-4 py-3 flex items-center justify-between text-xs border border-white/10">
                  <span className="font-bold flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-[#1A102F] text-white font-black flex items-center justify-center text-[11px]">G</span>
                    Merged PR in lsync-ui (GitHub)
                  </span>
                  <span className="text-emerald-300 font-bold">2 commits</span>
                </div>
                <div className="bg-white/10 rounded-xl px-4 py-3 flex items-center justify-between text-xs border border-white/10">
                  <span className="font-bold flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-[#FFF9E6] text-[#F4A836] font-black flex items-center justify-center text-[11px]">Y</span>
                    SQL Joins Explained (YouTube)
                  </span>
                  <span className="text-[#F4A836] font-bold">28 min</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 4-Feature Bottom Strip (Matching Screen 1) */}
        <div id="features" className="max-w-7xl mx-auto mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              icon: Link2,
              title: 'Connect Platforms',
              desc: 'Link GitHub, Coursera, Udemy, edX, or our YouTube Chrome Extension.',
            },
            {
              icon: Award,
              title: 'Map Your Skills',
              desc: 'Automatically convert every learning log into structured skill levels.',
            },
            {
              icon: BarChart2,
              title: 'Track Consistency',
              desc: 'Monitor daily habits, streaks, and 26-week learning heatmaps.',
            },
            {
              icon: Share2,
              title: 'Share Portfolio',
              desc: 'Generate a verified public link with full control over visibility.',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs hover:border-[#7038C4]/40 transition"
              >
                <div className="w-10 h-10 rounded-xl bg-[#EAE4FA] text-[#633BB3] flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-extrabold text-[#1A102F] mb-1.5">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= 3. HOW IT WORKS ================= */}
      <section id="how-it-works" className="py-16 sm:py-20 bg-white border-y border-gray-200/70 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#EB577F]">
              HOW LSYNC WORKS
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#1A102F] mt-2">
              From Fragmented History to Verified Proof
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-3xl bg-[#F7F6FA] border border-gray-100">
              <span className="inline-flex w-8 h-8 rounded-full bg-[#633BB3] text-white font-black text-xs items-center justify-center mb-4">
                1
              </span>
              <h3 className="text-base font-extrabold text-[#1A102F] mb-2">
                Link Your Sources
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Authorize GitHub repositories, link MOOC profiles, or install the LSync Chrome Extension to track YouTube tutorials automatically.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#F7F6FA] border border-gray-100">
              <span className="inline-flex w-8 h-8 rounded-full bg-[#EB577F] text-white font-black text-xs items-center justify-center mb-4">
                2
              </span>
              <h3 className="text-base font-extrabold text-[#1A102F] mb-2">
                Visualize Your Growth
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Watch your unified dashboard calculate total hours, map skills by category, merge duplicate lessons, and maintain your study streak.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#F7F6FA] border border-gray-100">
              <span className="inline-flex w-8 h-8 rounded-full bg-[#F4A836] text-[#1A102F] font-black text-xs items-center justify-center mb-4">
                3
              </span>
              <h3 className="text-base font-extrabold text-[#1A102F] mb-2">
                Share With Confidence
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Send your public LSync portfolio URL to recruiters and hiring managers to prove continuous self-directed learning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4. FAQ SECTION ================= */}
      <section id="faq" className="py-16 sm:py-20 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#633BB3]">
              QUESTIONS &amp; ANSWERS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1A102F] mt-2">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3.5">
            {faqs.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm font-bold text-[#1A102F]">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#633BB3] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= 5. FOOTER ================= */}
      <footer className="bg-[#140C24] text-white py-10 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img
              src="/lsync logo.jpeg"
              alt="LSync Logo"
              className="h-12 w-auto object-contain rounded-xl"
            />
            <div>
              <span className="text-sm font-black tracking-wide block">LSync</span>
              <span className="text-[11px] text-white/60">
                Unified Learning Portfolio &amp; Skill Verification Platform
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs font-bold text-white/70">
            <Link to="/login" className="hover:text-white transition">Sign In</Link>
            <Link to="/register" className="hover:text-white transition">Create Account</Link>
            <Link to="/portfolio/daniel-okunlola" className="hover:text-white transition">
              Sample Portfolio
            </Link>
          </div>

          <p className="text-[11px] text-white/50">
            © 2026 LSync Platform. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}