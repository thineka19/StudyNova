import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  BarChart3,
  BookOpen,
  Calendar,
  GraduationCap,
  Info,
  LayoutDashboard,
  Settings,
  Timer,
  Trophy,
  User,
} from 'lucide-react';

export const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: LayoutDashboard, end: true },
  { to: '/subjects', label: 'Planner', icon: BookOpen, end: false },
  { to: '/calendar', label: 'Calendar', icon: Calendar, end: false },
  { to: '/focus', label: 'Focus Mode', icon: Timer, end: false },
  { to: '/analytics', label: 'Analytics', icon: BarChart3, end: false },
  { to: '/achievements', label: 'Achievements', icon: Trophy, end: false },
  { to: '/about', label: 'About', icon: Info, end: false },
];

export const BOTTOM_NAV_ITEMS = [
  { to: '/profile', label: 'Profile', icon: User, end: false },
  { to: '/settings', label: 'Settings', icon: Settings, end: false },
];

/** Primary mobile bottom-bar slots — 8 routes don't fit a clean bottom bar, so
 * Calendar/Achievements/Settings live behind Profile on small screens. */
export const MOBILE_NAV_ITEMS = [
  NAV_ITEMS[0]!,
  NAV_ITEMS[1]!,
  NAV_ITEMS[3]!,
  NAV_ITEMS[4]!,
  BOTTOM_NAV_ITEMS[0]!,
];

function DockItem({
  to,
  label,
  icon: Icon,
  end,
  expanded,
  onNavigate,
}: (typeof NAV_ITEMS)[number] & { expanded: boolean; onNavigate?: () => void }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      title={label}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 overflow-hidden rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-medium transition-[background-color,box-shadow,color] duration-[250ms] ease-[var(--ease-premium)] ${
          isActive
            ? 'bg-primary text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_4px_16px_-4px_var(--color-primary)]'
            : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
        }`
      }
    >
      <Icon className="size-[18px] shrink-0" />
      <span
        className={`whitespace-nowrap transition-all duration-200 ${
          expanded ? 'w-auto opacity-100' : 'w-0 opacity-0'
        }`}
      >
        {label}
      </span>
    </NavLink>
  );
}

export function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-1 flex-col justify-between px-3">
      <div className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <DockItem key={item.to} {...item} expanded onNavigate={onNavigate} />
        ))}
      </div>
      <div className="flex flex-col gap-1 border-t border-border pt-3">
        {BOTTOM_NAV_ITEMS.map((item) => (
          <DockItem key={item.to} {...item} expanded onNavigate={onNavigate} />
        ))}
      </div>
    </nav>
  );
}

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <aside
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className="fixed left-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-1 rounded-[var(--radius-lg)] border border-glass-border bg-glass p-2 shadow-2xl backdrop-blur-xl transition-[width] duration-200 md:flex"
      style={{ width: expanded ? 208 : 64 }}
    >
      <div className="mb-2 flex items-center gap-2.5 overflow-hidden px-1.5 py-1">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-primary text-white shadow-sm shadow-primary/30">
          <GraduationCap className="size-5" />
        </div>
        <span
          className={`whitespace-nowrap text-sm font-bold text-text-primary transition-all duration-200 ${
            expanded ? 'w-auto opacity-100' : 'w-0 opacity-0'
          }`}
        >
          StudyNova
        </span>
      </div>
      <nav className="flex flex-1 flex-col justify-between">
        <div className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <DockItem key={item.to} {...item} expanded={expanded} />
          ))}
        </div>
        <div className="flex flex-col gap-1 border-t border-border pt-2">
          {BOTTOM_NAV_ITEMS.map((item) => (
            <DockItem key={item.to} {...item} expanded={expanded} />
          ))}
        </div>
      </nav>
    </aside>
  );
}
