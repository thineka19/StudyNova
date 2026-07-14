import { useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Search, Settings, Sparkles, User } from 'lucide-react';
import Sidebar from './Sidebar';
import NotificationBell from './NotificationBell';
import BottomNav from '../common/BottomNav';
import Avatar from '../common/Avatar';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

const TITLES: Record<string, string> = {
  '/': 'Home',
  '/subjects': 'Planner',
  '/calendar': 'Academic Calendar',
  '/focus': 'Focus Mode',
  '/analytics': 'Analytics',
  '/achievements': 'Achievements',
  '/profile': 'Profile',
  '/settings': 'Settings',
};

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const title = TITLES[location.pathname] ?? 'StudyNova';
  const { user, logout } = useAuth();
  const { data } = useApp();

  const today = useMemo(
    () => new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }),
    [],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || !data) return [];
    const subjectName = (id: string) => data.subjects.find((s) => s.id === id)?.name ?? 'Unknown subject';
    const subjects = data.subjects.filter((s) => s.name.toLowerCase().includes(q)).map((s) => ({ label: s.name, type: 'Subject', to: '/subjects' }));
    const assignments = data.assignments.filter((a) => a.title.toLowerCase().includes(q)).map((a) => ({ label: a.title, type: 'Assignment', to: '/subjects' }));
    const exams = data.exams
      .filter((e) => subjectName(e.subjectId).toLowerCase().includes(q))
      .map((e) => ({ label: `${subjectName(e.subjectId)} exam`, type: 'Exam', to: '/calendar' }));
    return [...subjects, ...assignments, ...exams].slice(0, 8);
  }, [query, data]);

  const goToProfile = () => {
    setMenuOpen(false);
    navigate('/profile');
  };
  const goToSettings = () => {
    setMenuOpen(false);
    navigate('/settings');
  };
  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-bg text-text-primary">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col md:pl-24">
        <header className="relative z-40 flex items-center justify-between gap-3 border-b border-glass-border bg-glass px-4 py-3 backdrop-blur-xl md:px-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
            <span className="hidden text-xs text-text-secondary sm:inline">{today}</span>
          </div>

          <div className="relative hidden flex-1 max-w-sm sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-secondary" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search subjects, tasks, exams…"
              className="w-full rounded-[var(--radius-sm)] border border-border bg-card px-3 py-1.5 pl-9 text-sm text-text-primary placeholder:text-text-secondary/60 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
            {results.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-[var(--radius-md)] border border-glass-border bg-card shadow-2xl animate-scale-in">
                {results.map((r, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      navigate(r.to);
                      setQuery('');
                    }}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-text-primary hover:bg-surface"
                  >
                    <span>{r.label}</span>
                    <span className="text-[11px] text-text-secondary">{r.type}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="hidden items-center gap-1.5 rounded-[var(--radius-full)] border border-glass-border bg-success/10 px-3 py-1 text-xs font-medium text-success lg:flex">
              <Sparkles className="size-3.5" />
              AI on track
            </span>
            <NotificationBell />
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center rounded-full transition-transform hover:scale-105"
                aria-label="Account menu"
              >
                <Avatar name={user?.name ?? 'User'} src={user?.avatar} size="sm" />
              </button>
              {menuOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Close menu"
                    className="fixed inset-0 z-10 cursor-default"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-[var(--radius-md)] border border-glass-border bg-card shadow-2xl animate-scale-in">
                    <div className="border-b border-border px-3 py-2.5">
                      <p className="truncate text-sm font-medium text-text-primary">{user?.name}</p>
                      <p className="truncate text-xs text-text-secondary">{user?.email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={goToProfile}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-text-primary hover:bg-surface"
                    >
                      <User className="size-4" /> Profile
                    </button>
                    <button
                      type="button"
                      onClick={goToSettings}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-text-primary hover:bg-surface"
                    >
                      <Settings className="size-4" /> Settings
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-danger hover:bg-danger/10"
                    >
                      <LogOut className="size-4" /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 pb-24 md:p-6 md:pb-6">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
