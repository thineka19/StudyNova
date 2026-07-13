import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar, { NavLinks } from './Sidebar';
import NotificationBell from './NotificationBell';

const TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/subjects': 'Subjects',
  '/calendar': 'Academic Calendar',
  '/focus': 'Focus Mode',
  '/analytics': 'Analytics',
  '/achievements': 'Achievements',
};

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const title = TITLES[location.pathname] ?? 'StudyNova';

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <Sidebar />

      {mobileOpen && (
        <div className="fixed inset-0 z-30 flex md:hidden">
          <div className="flex w-64 flex-col bg-white py-6 dark:bg-slate-900">
            <div className="mb-6 px-5">
              <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">📖 StudyNova</h1>
            </div>
            <NavLinks onNavigate={() => setMobileOpen(false)} />
          </div>
          <button
            type="button"
            aria-label="Close menu"
            className="flex-1 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900 md:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 md:hidden dark:hover:bg-slate-800"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              ☰
            </button>
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
          <NotificationBell />
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
