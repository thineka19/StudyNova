import { NavLink } from 'react-router-dom';
import { MOBILE_NAV_ITEMS } from '../layout/Sidebar';

export default function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-glass-border bg-glass px-2 py-2 backdrop-blur-xl md:hidden">
      {MOBILE_NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex min-w-14 flex-col items-center gap-0.5 rounded-[var(--radius-sm)] px-2 py-1.5 text-[11px] font-medium transition-[color,transform] duration-[250ms] ease-[var(--ease-premium)] ${
              isActive ? 'scale-105 text-accent drop-shadow-[0_0_6px_color-mix(in_srgb,var(--color-accent)_55%,transparent)]' : 'text-text-secondary'
            }`
          }
        >
          <Icon className="size-5" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
