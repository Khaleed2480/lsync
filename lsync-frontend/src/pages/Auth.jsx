import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Check, RefreshCw } from 'lucide-react';

const API_BASE_URL = 'https://lsync-1-0-0-1.onrender.com/api';

export default function Auth() {
  const location = useLocation();
  const navigate = useNavigate();

  // Mode: Sign In vs Sign Up
  const isSignUp = location.pathname === '/register';

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);

  // Status
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    setErrorMessage('');
    setSuccessMessage('');
  }, [location.pathname]);

  // ================= REAL SUBMISSION HANDLER =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (isSignUp) {
      if (!fullName || !username || !email || !password) {
        setErrorMessage('PLEASE FILL IN ALL FIELDS.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('PASSWORD MUST BE AT LEAST 6 CHARACTERS.');
        return;
      }
      if (!agreedToTerms) {
        setErrorMessage('PLEASE AGREE TO THE TERMS AND PRIVACY POLICY.');
        return;
      }

      setIsLoading(true);

      try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: fullName.trim(),
            fullName: fullName.trim(),
            username: username.trim().toLowerCase(),
            email: email.trim().toLowerCase(),
            password: password,
          }),
        });

        const data = await response.json();

        if (!response.ok || data.success === false) {
          throw new Error(data.message || data.error || 'Registration failed. Try again.');
        }

        localStorage.setItem(
          'user',
          JSON.stringify({
            fullName: fullName.trim(),
            name: fullName.trim(),
            username: username.trim(),
            email: email.trim(),
          })
        );

        setSuccessMessage('ACCOUNT CREATED SUCCESSFULLY! REDIRECTING...');

        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);

      } catch (err) {
        setErrorMessage(err.message || 'Server is taking longer to respond. Please try again.');
      } finally {
        setIsLoading(false);
      }

    } else {
      // ================= LOGIN FLOW =================
      if (!identifier || !password) {
        setErrorMessage('PLEASE ENTER YOUR USERNAME/EMAIL AND PASSWORD.');
        return;
      }

      setIsLoading(true);

      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: identifier.trim().toLowerCase(),
            username: identifier.trim().toLowerCase(),
            password: password,
          }),
        });

        const data = await response.json();

        if (!response.ok || data.success === false) {
          throw new Error(data.message || data.error || 'Invalid credentials. Please try again.');
        }

        const token = data.token || data.accessToken || data.data?.token;
        if (token) {
          localStorage.setItem('token', token);
        }

        const userObj = data.user || data.data?.user || {
          fullName: identifier.split('@')[0],
          name: identifier.split('@')[0],
          email: identifier,
        };
        localStorage.setItem('user', JSON.stringify(userObj));

        setSuccessMessage('LOGIN SUCCESSFUL! LOADING DASHBOARD...');

        setTimeout(() => {
          navigate('/dashboard');
        }, 800);

      } catch (err) {
        setErrorMessage(err.message || 'Unable to connect to server. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F7F6FA] font-sans overflow-x-hidden selection:bg-[#9667E0] selection:text-white">
      
      {/* CSS KEYFRAMES */}
      <style>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes floatReverse {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(10px); }
        }
        @keyframes flowInward {
          from { stroke-dashoffset: 24; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.06); opacity: 1; }
        }
        @keyframes floatShapeBlue {
          0%, 100% { transform: rotate(38deg) translateY(0px); }
          50% { transform: rotate(41deg) translateY(-12px); }
        }
        @keyframes floatShapeLilac {
          0%, 100% { transform: rotate(-28deg) translateY(0px); }
          50% { transform: rotate(-25deg) translateY(12px); }
        }
        @keyframes pulseCircle {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.85; }
          50% { transform: translate(-50%, -50%) scale(1.05); opacity: 1; }
        }

        .animate-float-1 { animation: floatSlow 4s ease-in-out infinite; }
        .animate-float-2 { animation: floatReverse 5s ease-in-out infinite 0.5s; }
        .animate-float-3 { animation: floatSlow 4.5s ease-in-out infinite 1s; }
        .animate-float-4 { animation: floatReverse 5.5s ease-in-out infinite 1.5s; }
        .animate-flow-lines { animation: flowInward 1.2s linear infinite; }
        .animate-pulse-hub { animation: pulseGlow 3s ease-in-out infinite; }
        .animate-diamond-blue { animation: floatShapeBlue 7s ease-in-out infinite; }
        .animate-diamond-lilac { animation: floatShapeLilac 8s ease-in-out infinite; }
        .animate-peach-circle { animation: pulseCircle 6s ease-in-out infinite; }
      `}</style>

      {/* ================= SIGN UP PAGE ================= */}
      {isSignUp ? (
        <div className="w-full flex flex-col lg:flex-row min-h-screen">
          
          <div className="w-full lg:w-1/2 min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-14 relative overflow-hidden">
            
            <div className="absolute top-1/2 left-1/2 w-[520px] h-[520px] rounded-full bg-[#FCE3CE]/60 pointer-events-none animate-peach-circle" />
            <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full bg-[#F8BA82]/85 pointer-events-none shadow-[0_0_60px_rgba(248,186,130,0.4)] animate-peach-circle" style={{ animationDelay: '1s' }} />

            {/* Top Logo with h-20 */}
            <div className="relative z-10">
              <Link to="/login">
                <img 
                  src="/lsync logo.jpeg" 
                  alt="LSync Logo" 
                  className="h-20 w-auto object-contain"
                />
              </Link>
            </div>

            <div className="relative z-10 my-auto py-6 max-w-sm w-full mx-auto">
              
              <div className="mb-6">
                <div className="inline-block bg-white/50 backdrop-blur-sm px-6 py-2.5 rounded-2xl shadow-xs">
                  <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wide text-[#1A102F]">
                    CREATE ACCOUNT
                  </h1>
                </div>
              </div>

              {errorMessage && (
                <div className="mb-4 p-3 rounded-xl bg-red-100 text-red-800 text-xs font-bold uppercase tracking-wide border border-red-300">
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wide border border-emerald-300">
                  {successMessage}
                </div>
              )}

              <form key="signup-form" onSubmit={handleSubmit} autoComplete="on" className="space-y-4">
                <div>
                  <label htmlFor="signup-fullname" className="block text-xs font-black uppercase tracking-wider text-[#1A102F] mb-1.5">
                    FULL NAME
                  </label>
                  <input
                    id="signup-fullname"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Daniel Okunlola"
                    required
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-gray-200 text-sm font-bold text-[#1A102F] shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9667E0] transition"
                  />
                </div>

                <div>
                  <label htmlFor="signup-username" className="block text-xs font-black uppercase tracking-wider text-[#1A102F] mb-1.5">
                    USERNAME
                  </label>
                  <input
                    id="signup-username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. daniel_dev"
                    required
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-gray-200 text-sm font-bold text-[#1A102F] shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9667E0] transition"
                  />
                </div>

                <div>
                  <label htmlFor="signup-email" className="block text-xs font-black uppercase tracking-wider text-[#1A102F] mb-1.5">
                    EMAIL ADDRESS
                  </label>
                  <input
                    id="signup-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. daniel@example.com"
                    required
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-gray-200 text-sm font-bold text-[#1A102F] shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9667E0] transition"
                  />
                </div>

                <div>
                  <label htmlFor="signup-password" className="block text-xs font-black uppercase tracking-wider text-[#1A102F] mb-1.5">
                    PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      id="signup-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full px-4 pr-11 py-3 rounded-2xl bg-white border border-gray-200 text-sm font-bold text-[#1A102F] shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9667E0] transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 transition cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-[#1A102F]/80 font-bold uppercase tracking-wide mt-1.5 leading-snug">
                    USE AT LEAST 6 CHARACTERS WITH LETTERS AND NUMBERS.
                  </p>
                </div>

                <div className="pt-1">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-400 text-[#9667E0] focus:ring-[#9667E0]"
                    />
                    <span className="text-xs font-bold text-[#1A102F]">
                      I AGREE TO THE{' '}
                      <span className="font-black text-[#6D28D9] hover:underline">TERMS</span> AND{' '}
                      <span className="font-black text-[#6D28D9] hover:underline">PRIVACY POLICY</span>
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 mt-2 bg-[#9667E0] hover:bg-[#8553D6] text-white font-black uppercase tracking-wider text-sm rounded-2xl shadow-lg shadow-[#9667E0]/30 active:scale-[0.99] transition duration-200 cursor-pointer disabled:opacity-70 flex items-center justify-center min-h-[48px]"
                >
                  {isLoading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    'SIGN UP'
                  )}
                </button>
              </form>

              <div className="text-center mt-5">
                <span className="text-xs font-bold uppercase text-[#1A102F]/80">ALREADY HAVE AN ACCOUNT? </span>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-xs font-black uppercase text-[#6D28D9] hover:underline cursor-pointer"
                >
                  SIGN IN
                </button>
              </div>

            </div>

            <div />
          </div>

          <div className="hidden lg:flex lg:w-1/2 min-h-screen relative overflow-hidden bg-[#E8E6F5] items-center justify-center p-12 select-none">
            <div className="absolute -top-12 right-24 w-[420px] h-[420px] rounded-[65px] bg-[#3C25D4] shadow-2xl pointer-events-none animate-diamond-blue" />
            <div className="absolute -bottom-16 -right-10 w-[420px] h-[650px] rounded-[70px] bg-[#CEB5F6] shadow-xl pointer-events-none animate-diamond-lilac" />

            <div className="relative z-10 max-w-md w-full">
              <h2 className="text-3xl sm:text-4xl font-black text-[#1A102F] leading-tight tracking-tight mb-10">
                Everything you learn, <br />
                finally in one place.
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-3.5 animate-float-1">
                  <div className="w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-[#3C25D4] stroke-[3]" />
                  </div>
                  <p className="text-sm font-bold text-[#1A102F] leading-relaxed">
                    Link to your learning platform in one click.
                  </p>
                </div>

                <div className="flex items-start gap-3.5 animate-float-2">
                  <div className="w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-[#3C25D4] stroke-[3]" />
                  </div>
                  <p className="text-sm font-bold text-[#1A102F] leading-relaxed">
                    See your total progress, skill and growth on one dashboard.
                  </p>
                </div>

                <div className="flex items-start gap-3.5 animate-float-3">
                  <div className="w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-[#3C25D4] stroke-[3]" />
                  </div>
                  <p className="text-sm font-bold text-[#1A102F] leading-relaxed">
                    Share a public portfolio and choose exactly what others can see.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* ================= LOGIN PAGE ================= */
        <div className="w-full flex flex-col lg:flex-row min-h-screen">
          
          <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 lg:p-14">
            {/* Top Logo with h-20 */}
            <div>
              <Link to="/login">
                <img 
                  src="/lsync logo.jpeg" 
                  alt="LSync Logo" 
                  className="h-20 w-auto object-contain"
                />
              </Link>
            </div>

            <div className="my-auto py-8 max-w-md w-full mx-auto">
              <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-[0_10px_35px_rgba(112,56,196,0.06)] border-2 border-[#F4A836]">
                
                <div className="text-center mb-6">
                  <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wide text-[#1A102F]">
                    WELCOME BACK
                  </h2>
                  <p className="text-[11px] text-gray-600 mt-2 font-bold uppercase tracking-wide leading-relaxed">
                    SIGN IN TO SEE YOUR LEARNING PROGRESS ACROSS YOUR SOURCES.
                  </p>
                </div>

                {errorMessage && (
                  <div className="mb-4 p-3 rounded-xl bg-red-100 text-red-800 text-xs font-bold uppercase tracking-wide border border-red-300">
                    {errorMessage}
                  </div>
                )}

                {successMessage && (
                  <div className="mb-4 p-3 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wide border border-emerald-300">
                    {successMessage}
                  </div>
                )}

                <form key="login-form" onSubmit={handleSubmit} autoComplete="on" className="space-y-4">
                  <div>
                    <label htmlFor="login-identifier" className="block text-xs font-black uppercase tracking-wider text-[#1A102F] mb-1.5">
                      USERNAME OR EMAIL
                    </label>
                    <input
                      id="login-identifier"
                      name="username"
                      type="text"
                      autoComplete="username"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. daniel@example.com"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-[#F8F9FC] border border-gray-300 text-sm font-bold text-[#1A102F] placeholder-gray-400 focus:outline-none focus:border-[#7038C4] focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="login-password" className="block text-xs font-black uppercase tracking-wider text-[#1A102F] mb-1.5">
                      PASSWORD
                    </label>
                    <div className="relative">
                      <input
                        id="login-password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        className="w-full px-4 pr-11 py-3 rounded-xl bg-[#F8F9FC] border border-gray-300 text-sm font-bold text-[#1A102F] placeholder-gray-400 focus:outline-none focus:border-[#7038C4] focus:bg-white transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#7038C4] transition cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={keepSignedIn}
                        onChange={(e) => setKeepSignedIn(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-400 text-[#7038C4] focus:ring-[#7038C4]"
                      />
                      <span className="text-[11px] text-gray-700 font-bold uppercase tracking-wide">
                        KEEP ME SIGNED IN
                      </span>
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-[11px] font-black uppercase tracking-wide text-[#7038C4] hover:text-[#EB577F] transition-colors"
                    >
                      FORGOT PASSWORD?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 mt-2 bg-[#9667E0] hover:bg-[#8553D6] text-white font-black uppercase tracking-wider text-sm rounded-xl shadow-lg shadow-[#9667E0]/25 active:scale-[0.99] transition duration-200 cursor-pointer disabled:opacity-70 flex items-center justify-center min-h-[48px]"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      'SIGN IN'
                    )}
                  </button>
                </form>

                <div className="text-center mt-5">
                  <span className="text-[11px] text-gray-700 font-bold uppercase tracking-wide">
                    NEW TO LSYNC?{' '}
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate('/register')}
                    className="text-[11px] font-black uppercase tracking-wide text-[#F4A836] hover:text-[#EB577F] transition-colors cursor-pointer"
                  >
                    CREATE AN ACCOUNT
                  </button>
                </div>

                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                    <span className="bg-white px-3 text-gray-500">OR</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => alert('Social OAuth is configured by backend!')}
                    className="h-11 bg-white hover:bg-[#FAF7F2] border border-[#F4A836]/50 rounded-xl flex items-center justify-center shadow-[0_2px_12px_rgba(244,168,54,0.18)] active:scale-95 transition cursor-pointer"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z" />
                      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={() => alert('Social OAuth is configured by backend!')}
                    className="h-11 bg-white hover:bg-[#FAF7F2] border border-[#F4A836]/50 rounded-xl flex items-center justify-center shadow-[0_2px_12px_rgba(244,168,54,0.18)] active:scale-95 transition cursor-pointer"
                  >
                    <svg className="w-5 h-5 fill-[#1A102F]" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={() => alert('Social OAuth is configured by backend!')}
                    className="h-11 bg-white hover:bg-[#FAF7F2] border border-[#F4A836]/50 rounded-xl flex items-center justify-center shadow-[0_2px_12px_rgba(244,168,54,0.18)] active:scale-95 transition cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 23 23">
                      <path fill="#f35325" d="M1 1h10v10H1z" />
                      <path fill="#81bc06" d="M12 1h10v10H12z" />
                      <path fill="#05a6f0" d="M1 12h10v10H1z" />
                      <path fill="#ffba08" d="M12 12h10v10H12z" />
                    </svg>
                  </button>
                </div>

              </div>
            </div>

            <div className="text-center lg:text-left text-[11px] font-bold uppercase text-gray-400">
              © 2026 LSync Platform. All rights reserved.
            </div>
          </div>

          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#4D12A8] via-[#430DA3] to-[#2E0775] flex-col justify-between p-12 lg:p-16 relative overflow-hidden select-none">
            <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-[#EB577F]/25 rounded-full blur-[110px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-[#F4A836]/20 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '1.5s' }} />

            <div />

            <div className="relative w-80 h-80 mx-auto flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 320 320">
                <line x1="60" y1="60" x2="160" y2="160" stroke="#FAF7F2" strokeWidth="2.5" strokeDasharray="6,6" strokeOpacity="0.5" className="animate-flow-lines" />
                <line x1="260" y1="60" x2="160" y2="160" stroke="#FAF7F2" strokeWidth="2.5" strokeDasharray="6,6" strokeOpacity="0.5" className="animate-flow-lines" />
                <line x1="60" y1="260" x2="160" y2="160" stroke="#FAF7F2" strokeWidth="2.5" strokeDasharray="6,6" strokeOpacity="0.5" className="animate-flow-lines" />
                <line x1="260" y1="260" x2="160" y2="160" stroke="#FAF7F2" strokeWidth="2.5" strokeDasharray="6,6" strokeOpacity="0.5" className="animate-flow-lines" />
              </svg>

              <div className="relative z-10 w-22 h-22 rounded-3xl bg-white shadow-[0_0_40px_rgba(255,255,255,0.4)] flex items-center justify-center animate-pulse-hub cursor-pointer hover:scale-110 transition duration-300">
                <RefreshCw className="w-10 h-10 text-[#4D12A8] stroke-[2.5] animate-[spin_10s_linear_infinite]" />
              </div>

              <div className="absolute top-4 left-4 z-10 animate-float-1">
                <div className="w-13 h-13 rounded-2xl bg-white shadow-xl flex items-center justify-center font-black text-xl text-[#0056D2] hover:scale-115 transition duration-200 ring-2 ring-white/50">
                  C
                </div>
              </div>

              <div className="absolute top-4 right-4 z-10 animate-float-2">
                <div className="w-13 h-13 rounded-2xl bg-[#1A102F] shadow-xl flex items-center justify-center font-black text-xl text-white hover:scale-115 transition duration-200 ring-2 ring-white/30">
                  G
                </div>
              </div>

              <div className="absolute bottom-4 left-4 z-10 animate-float-3">
                <div className="w-13 h-13 rounded-2xl bg-[#FAF7F2] border border-[#F4A836]/60 shadow-xl flex items-center justify-center font-black text-xl text-[#F4A836] hover:scale-115 transition duration-200 ring-2 ring-[#F4A836]/40">
                  Y
                </div>
              </div>

              <div className="absolute bottom-4 right-4 z-10 animate-float-4">
                <div className="w-13 h-13 rounded-2xl bg-[#D1FAE5] shadow-xl flex items-center justify-center font-black text-xl text-[#059669] hover:scale-115 transition duration-200 ring-2 ring-[#059669]/30">
                  e
                </div>
              </div>
            </div>

            <div className="max-w-md mx-auto w-full animate-float-1">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-2xl hover:bg-white/15 transition duration-300">
                <p className="text-[#FAF7F2] text-xs sm:text-sm font-medium leading-relaxed tracking-wide">
                  Track your learning everywhere, verify your progress, and showcase your growth with confidence.
                </p>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}