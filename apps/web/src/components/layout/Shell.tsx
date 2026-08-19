import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useSocket } from '../../context/SocketContext';
import {
  LayoutDashboard,
  CalendarCheck,
  FileText,
  Calendar,
  Briefcase,
  Users,
  Megaphone,
  Bell,
  Search,
  Sun,
  Moon,
  LogOut,
  User,
  Shield,
  FileSpreadsheet,
  Menu,
  X,
  GraduationCap,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { apiFetch } from '../../lib/api';

export const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications } = useSocket();
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);

  const role = user?.role || 'STUDENT';

  // Navigation Items per Role
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['STUDENT', 'FACULTY', 'COORDINATOR', 'ADMIN'] },
    { label: 'Attendance', path: '/attendance', icon: CalendarCheck, roles: ['STUDENT', 'FACULTY', 'ADMIN'] },
    { label: 'Assignments', path: '/assignments', icon: FileText, roles: ['STUDENT', 'FACULTY', 'ADMIN'] },
    { label: 'Events & Tickets', path: '/events', icon: Calendar, roles: ['STUDENT', 'FACULTY', 'COORDINATOR', 'ADMIN'] },
    { label: 'Placements', path: '/placements', icon: Briefcase, roles: ['STUDENT', 'COORDINATOR', 'ADMIN'] },
    { label: 'Student Clubs', path: '/clubs', icon: Users, roles: ['STUDENT', 'COORDINATOR', 'ADMIN'] },
    { label: 'Announcements', path: '/announcements', icon: Megaphone, roles: ['STUDENT', 'FACULTY', 'COORDINATOR', 'ADMIN'] },
    { label: 'Admin Panel', path: '/admin', icon: Shield, roles: ['ADMIN'] },
    { label: 'Export Reports', path: '/reports', icon: FileSpreadsheet, roles: ['COORDINATOR', 'ADMIN'] },
    { label: 'My Profile', path: '/profile', icon: User, roles: ['STUDENT', 'FACULTY', 'COORDINATOR', 'ADMIN'] },
  ].filter(item => item.roles.includes(role));

  const handleSearch = async (q: string) => {
    setSearchQuery(q);
    if (q.trim().length < 2) {
      setSearchResults(null);
      return;
    }
    setIsSearching(true);
    try {
      const res = await apiFetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (res.success) {
        setSearchResults(res.data);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-slate-800">
          <Link to="/" className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-brand-600 text-white shadow-md">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900 dark:text-slate-100 tracking-tight">SmartCampus</span>
              <span className="block text-[10px] uppercase tracking-widest text-brand-600 font-semibold">DevFusion 4.O</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-semibold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Card footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{user?.name}</p>
                <p className="text-[10px] font-medium text-brand-600 dark:text-brand-400 uppercase tracking-wider">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={() => logout().then(() => navigate('/login'))}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation Bar */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="hidden sm:block">
              <p className="text-xs text-slate-400">Portal &gt; <span className="text-slate-700 dark:text-slate-200 capitalize font-medium">{location.pathname.replace('/', '') || 'Dashboard'}</span></p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-3">
            {/* Global Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search platform...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-slate-200 dark:bg-slate-700 rounded text-slate-600 dark:text-slate-300">⌘K</kbd>
            </button>

            {/* Notifications Trigger */}
            <button
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-brand-600 ring-2 ring-white dark:ring-slate-900 animate-pulse"></span>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Global Search Modal */}
      <Modal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} title="Global Campus Search" maxWidth="lg">
        <div className="space-y-4">
          <Input
            placeholder="Type student name, assignment, event title, or company..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            autoFocus
          />

          {isSearching && <p className="text-xs text-slate-500 py-4 text-center">Searching database...</p>}

          {searchResults && (
            <div className="max-h-96 overflow-y-auto space-y-4 pt-2">
              {searchResults.students?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Students</h4>
                  <div className="space-y-1">
                    {searchResults.students.map((st: any) => (
                      <div key={st.id} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-900 dark:text-slate-100">{st.name} ({st.rollNumber})</span>
                        <span className="text-slate-500">{st.email}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.events?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Events</h4>
                  <div className="space-y-1">
                    {searchResults.events.map((ev: any) => (
                      <div key={ev.id} onClick={() => { setIsSearchOpen(false); navigate('/events'); }} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-900 dark:text-slate-100">{ev.title}</span>
                        <span className="text-brand-600">{ev.venue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.placements?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Placements</h4>
                  <div className="space-y-1">
                    {searchResults.placements.map((pl: any) => (
                      <div key={pl.id} onClick={() => { setIsSearchOpen(false); navigate('/placements'); }} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-900 dark:text-slate-100">{pl.companyName} - {pl.jobRole}</span>
                        <span className="text-emerald-600 font-bold">{pl.ctc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>

      {/* Realtime Notification Center Drawer */}
      <Modal isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} title="Realtime Notifications">
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">No new notifications.</p>
          ) : (
            notifications.map((n, idx) => (
              <div key={idx} className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{n.title}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">{n.message}</p>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
};
