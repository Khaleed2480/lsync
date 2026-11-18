import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, KeyRound, Sparkles } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // Simulate backend password reset request
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1200);
  };

  const handleResetAgain = () => {
    setIsSubmitted(false);
    setEmail('');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 bg-[#140C24] select-none relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7038C4]/25 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#EB577F]/20 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        
        {/* Card Container */}
        <div className="rounded-3xl p-8 backdrop-blur-2xl bg-[#1E1233]/85 border border-[#7038C4]/40 shadow-[0_10px_50px_-10px_rgba(112,56,196,0.35)]">
          
          {/* Header Icon */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#7038C4] to-[#EB577F] shadow-lg shadow-[#7038C4]/30 mb-4 ring-4 ring-[#7038C4]/20">
              <KeyRound className="w-7 h-7 text-[#FAF7F2]" />
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-[#FAF7F2]">
              {isSubmitted ? 'Check Your Inbox' : 'Forgot Password?'}
            </h2>

            <p className="text-xs text-[#FAF7F2]/60 mt-1 max-w-xs mx-auto">
              {isSubmitted
                ? `We have dispatched a secure password reset link to ${email}`
                : "No worries! Enter the email address linked to your LSync account and we will send a reset link."}
            </p>
          </div>

          {/* Error Message Box */}
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 mb-5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ================= CONDITION 1: FORM NOT YET SUBMITTED ================= */}
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#FAF7F2]/80 mb-1">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FAF7F2]/40" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#140C24]/80 border border-[#3A2263] rounded-xl text-sm text-[#FAF7F2] placeholder-[#FAF7F2]/30 focus:outline-none focus:border-[#EB577F] focus:ring-1 focus:ring-[#EB577F] transition-all"
                  />
                </div>
              </div>

              {/* Submit Button with Linear Gradient */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 mt-2 bg-gradient-to-r from-[#7038C4] via-[#EB577F] to-[#F3A737] hover:opacity-95 text-[#FAF7F2] font-bold text-sm rounded-xl shadow-lg shadow-[#7038C4]/30 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
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
            /* ================= CONDITION 2: LINK DISPATCHED VIEW ================= */
            <div className="space-y-4 text-center">
              <div className="p-4 rounded-2xl bg-[#140C24]/80 border border-[#3A2263] flex items-center gap-3 text-left">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <p className="text-xs text-[#FAF7F2]/80">
                  Did not see it? Please verify your spam folder or wait up to 2 minutes.
                </p>
              </div>

              <button
                type="button"
                onClick={handleResetAgain}
                className="text-xs text-[#F3A737] hover:underline font-medium cursor-pointer"
              >
                Entered the wrong email? Try again
              </button>
            </div>
          )}

          {/* Back to Sign In Link */}
          <div className="mt-6 pt-5 border-t border-[#3A2263]/60 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#FAF7F2]/70 hover:text-[#FAF7F2] transition-colors"
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