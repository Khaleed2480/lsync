import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import {
  LayoutGrid,
  Activity,
  Award,
  BarChart2,
  Link2,
  User,
  Settings as SettingsIcon,
  LogOut,
  RefreshCw,
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();

  // Load real user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{"fullName":"Daniel Okunlola","email":"daniel@example.com"}');
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

  return (
    <div className="min-h-screen bg-[#F0F2F6] flex flex-col lg:flex-row font-sans selection:bg-[#7038C4] selection:text-white">
      
      {/* ================= STATIC PURPLE SIDEBAR (NEVER UNMOUNTS) ================= */}
      <aside className="w-full lg:w-64 bg-[#633BB3] text-white flex flex-col justify-between p-6 shrink-0 shadow-xl sticky top-0 h-screen">
        <div>
          {/* Logo with /lsync logo.jpeg & h-20 */}
          <div className="mb-6">
            <Link to="/dashboard">
              <img 
                src="/lsync logo.jpeg" 
                alt="LSync Logo" 
                className="h-20 w-auto object-contain rounded-xl"
              />
            </Link>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
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

        {/* Bottom User Profile */}
        <div className="pt-6 border-t border-white/15 space-y-3">
          <div
            onClick={() => navigate('/settings')}
            title="Click to open Settings"
            className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 cursor-pointer hover:bg-white/15 transition"
          >
            <div className="w-10 h-10 rounded-full bg-[#48258D] text-white flex items-center justify-center font-bold text-sm shadow shrink-0">
              {initials}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-white truncate">{displayName}</h4>
              <p className="text-[10px] text-white/70 truncate">{user.email || 'Profile and settings'}</p>
            </div>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              navigate('/login');
            }}
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-white/70 hover:text-white transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* ================= DYNAMIC PAGE CONTENT AREA ================= */}
      <main className="flex-1 min-w-0">
        {children}
      </main>

    </div>
  );
}