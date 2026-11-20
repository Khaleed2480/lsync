import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, KeyRound } from 'lucide-react';
import { apiRequest } from '../utils/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      await apiRequest('/auth/forgot-password', {
        method: 'POST',
        skipAuth: true,
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      setIsSubmitted(true);
    } catch (err) {
      setErrorMessage(err.message || 'Unable to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetAgain = () => {
    setIsSubmitted(false);
    setEmail('');
    setErrorMessage('');
  };

  const particles = [
    { left: '12%', size: 'w-1.5 h-1.5', color: 'bg-[#F3A737]/50', duration: '9s', delay: '0s' },
    { left: '25%', size: 'w-2 h-2', color: 'bg-[#EB577F]/40', duration: '12s', delay: '2s' },
    { left: '38%', size: 'w-1 h-1', color: 'bg-[#FAF7F2]/40', duration: '8s', delay: '4s' },
    { left: '62%', size: 'w-2 h-2', color: 'bg-[#7038C4]/60', duration: '11s', delay: '1s' },
    { left: '76%', size: 'w-1.5 h-1.5', color: 'bg-[#F3A737]/45', duration: '10s', delay: '3s' },
    { left: '88%', size: 'w-1.5 h-1.5', color: 'bg-[#EB577F]/50', duration: '13s', delay: '0.5s' },
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 bg-[#120A22] font-sans select-none relative overflow-hidden">
      <style>{`
        @keyframes haloPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.45; }
          50% { transform: translate(-50%, -50%) scale(1.08); opacity: 0.7; }
        }
        @keyframes driftOrbOne {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(45px, -35px) scale(1.1); }
          66% { transform: translate(-30px, 25px) scale(0.95); }
        }
        @keyframes driftOrbTwo {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(-50px, 30px) scale(1.08); }
          66% { transform: translate(35px, -40px) scale(0.92); }
        }
        @keyframes floatParticle {
          0% { transform: translateY(100vh) scale(0.6); opacity: 0; }
          20% { opacity: 0.8; }
          80% { opacity: 0.8; }
          100% { transform: translateY(-10vh) scale(1.2); opacity: 0; }
        }
        @keyframes keyFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }

        .animate-halo-inner { animation: haloPulse 6s ease-in-out infinite; }
        .animate-halo-outer { animation: haloPulse 8s ease-in-out infinite 1.5s; }
        .animate-orb-1 { animation: driftOrbOne 12s ease-in-out infinite; }
        .animate-orb-2 { animation: driftOrbTwo 14s ease-in-out infinite; }
        .animate-key-float { animation: keyFloat 3.5s ease-in-out infinite; }
      `}</style>

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[15%] left-[18%] w-96 h-96 bg-[#7038C4]/30 rounded-full blur-[130px] animate-orb-1" />
        <div className="absolute bottom-[12%] right-[18%] w-96 h-96 bg-[#EB577F]/25 rounded-full blur-[130px] animate-orb-2" />
        <div className="absolute top-[55%] left-[55%] w-72 h-72 bg-[#F3A737]/15 rounded-full blur-[120px] animate-orb-1" style={{ animationDelay: '3s' }} />

        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] sm:w-[620px] sm:h-[620px] rounded-full bg-[#3A1E6E]/25 border border-[#7038C4]/15 animate-halo-inner" />
        <div className="absolute top-1/2 left-1/2 w-[680px] h-[680px] sm:w-[820px] sm:h-[820px] rounded-full border border-[#EB577F]/10 animate-halo-outer" />

        {particles.map((p, idx) => (
          <span
            key={idx}
            className={`absolute bottom-0 rounded-full blur-[1px] ${p.size} ${p.color}`}
            style={{
              left: p.left,
              animation: `floatParticle ${p.duration} linear infinite ${p.delay}`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-3xl p-8 sm:p-10 backdrop-blur-2xl bg-[#1A0F2E]/85 border border-[#7038C4]/45 shadow-[0_15px_60px_-10px_rgba(112,56,196,0.4)]">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#7038C4] to-[#EB577F] shadow-lg shadow-[#EB577F]/25 mb-4 ring-4 ring-[#7038C4]/25 animate-key-float">
              <KeyRound className="w-7 h-7 text-[#FAF7F2]" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#FAF7F2] leading-tight">
              {isSubmitted ? 'Check Your Inbox' : 'Forgot Password?'}
            </h2>

            <p className="text-xs text-[#FAF7F2]/65 mt-2 max-w-xs mx-auto leading-relaxed">
              {isSubmitted
                ? `We have dispatched a secure password reset link to ${email}`
                : 'No worries! Enter the email address linked to your LSync account and we will send a reset link.'}
            </p>
          </div>

          {errorMessage && (
            <div className="flex items-center gap-2 p-3 mb-5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} autoComplete="on" className="space-y-5">
              <div>
                <label htmlFor="reset-email" className="block text-xs font-bold text-[#FAF7F2]/85 mb-2">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FAF7F2]/40" />
                  <input
                    id="reset-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-[#120A22]/85 border border-[#3A2263] rounded-xl text-sm font-medium text-[#FAF7F2] placeholder-[#FAF7F2]/30 focus:outline-none focus:border-[#EB577F] focus:ring-1 focus:ring-[#EB577F] transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-[#7038C4] via-[#EB577F] to-[#F3A737] hover:opacity-95 text-[#FAF7F2] font-bold text-sm rounded-xl shadow-lg shadow-[#7038C4]/30 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#FAF7F2] border-t-transparent rounded-full animate-spin" />
                    Sending link...
                  </span>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-4 text-center">
              <div className="p-4 rounded-2xl bg-[#120A22]/80 border border-[#3A2263] flex items-center gap-3 text-left">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <p className="text-xs text-[#FAF7F2]/80">
                  Check your inbox (or spam folder) for the reset token link.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Link
                  to="/reset-password"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#7038C4] to-[#EB577F] text-white text-xs font-bold shadow-md"
                >
                  Already have your reset token? Enter it here
                </Link>

                <button
                  type="button"
                  onClick={handleResetAgain}
                  className="text-xs text-[#F3A737] hover:underline font-semibold cursor-pointer mt-1"
                >
                  Entered the wrong email? Try again
                </button>
              </div>
            </div>
          )}

          <div className="mt-7 pt-5 border-t border-[#3A2263]/60 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#FAF7F2]/75 hover:text-[#FAF7F2] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-[#EB577F]" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}