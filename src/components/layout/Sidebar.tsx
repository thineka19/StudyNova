import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: '🏠', end: true },
  { to: '/subjects', label: 'Subjects', icon: '📚', end: false },
  { to: '/calendar', label: 'Calendar', icon: '📅', end: false },
  { to: '/focus', label: 'Focus Mode', icon: '⏳', end: false },
  { to: '/analytics', label: 'Analytics', icon: '📊', end: false },
  { to: '/achievements', label: 'Achievements', icon: '🏆', end: false },
];

export function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-1 flex-col gap-1 px-3">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            }`
          }
        >
          <span className="text-lg">{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

export default function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-200 bg-white py-6 md:flex dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 px-5">
        <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">📖 StudyNova</h1>
        <p className="text-xs text-slate-400">Plan smarter, study better</p>
      </div>
      <NavLinks />
    </aside>
  );
}
