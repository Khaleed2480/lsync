import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, Link, useLocation } from 'react-router-dom';
import {
  LayoutGrid,
  Activity,
  Award,
  BarChart2,
  Link2,
  User,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [user, setUser] = useState({
    fullName: 'Daniel Okunlola',
    email: 'daniel@example.com',
    photo: null,
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {}
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const displayName = user.fullName || user.name || user.username || 'Daniel Okunlola';
  const initials =
    displayName
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'DO';

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutGrid },
    { name: 'Activity', path: '/activity', icon: Activity },
    { name: 'Skills', path: '/skills', icon: Award },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'Sources', path: '/sources', icon: Link2 },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('is_authenticated');
    localStorage.removeItem('keep_signed_in');
    setMobileMenuOpen(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen w-full bg-[#F0F2F6] flex flex-col lg:flex-row font-sans selection:bg-[#7038C4] selection:text-white overflow-x-hidden">
      
      {/* MOBILE TOP NAVBAR */}
      <header className="lg:hidden sticky top-0 z-30 w-full bg-[#633BB3] text-white px-4 py-3 flex items-center justify-between shadow-md">
        <Link to="/dashboard" className="flex items-center">
          <img
            src="/lsync logo.jpeg"
            alt="LSync Logo"
            className="h-11 w-auto object-contain rounded-lg"
          />
        </Link>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
          className="p-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white transition cursor-pointer active:scale-95"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* MOBILE BACKDROP */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#633BB3] text-white flex flex-col justify-between p-6 shrink-0 shadow-2xl overflow-y-auto transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-6">
            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <img
                src="/lsync logo.jpeg"
                alt="LSync Logo"
                className="h-16 lg:h-20 w-auto object-contain rounded-xl"
              />
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
              className="lg:hidden p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 ${
                      isActive
                        ? 'bg-white text-[#633BB3] shadow-md'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 mt-6 border-t border-white/15 space-y-3">
          <div
            onClick={() => {
              setMobileMenuOpen(false);
              navigate('/settings');
            }}
            title="Click to open Settings"
            className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 cursor-pointer hover:bg-white/15 transition"
          >
            {user.photo ? (
              <img
                src={user.photo}
                alt={displayName}
                className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-white/30"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#48258D] text-white flex items-center justify-center font-bold text-sm shadow shrink-0">
                {initials}
              </div>
            )}
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-white truncate">{displayName}</h4>
              <p className="text-[10px] text-white/70 truncate">
                {user.email || 'Profile and settings'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-white/70 hover:text-white transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* MAIN PAGE CONTENT */}
      <main className="flex-1 min-w-0 w-full">
        {children}
      </main>

    </div>
  );
}