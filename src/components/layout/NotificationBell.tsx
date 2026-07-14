import { useState } from 'react';
import { Bell } from 'lucide-react';
import { useApp } from '../../context/AppContext';

function timeAgo(iso: string): string {
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60_000));
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export default function NotificationBell() {
  const { data, markNotificationRead, markAllNotificationsRead } = useApp();
  const [open, setOpen] = useState(false);
  const notifications = data?.notifications ?? [];
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative rounded-full p-2 text-text-secondary transition-colors duration-200 hover:bg-surface hover:text-text-primary"
        aria-label="Notifications"
      >
        <Bell className="size-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <>
          <button
            type="button"
            aria-label="Close notifications"
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-2 w-80 max-w-[90vw] rounded-[var(--radius-md)] border border-glass-border bg-card shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="text-sm font-semibold text-text-primary">Notifications</span>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => markAllNotificationsRead()}
                  className="text-xs font-medium text-accent hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 && (
                <p className="px-4 py-6 text-center text-sm text-text-secondary">No notifications yet</p>
              )}
              {notifications.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => markNotificationRead(n.id)}
                  className={`block w-full border-b border-border px-4 py-3 text-left text-sm transition-colors last:border-0 hover:bg-surface ${
                    n.read ? 'opacity-60' : 'bg-primary/5'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-text-primary">{n.title}</span>
                    <span className="shrink-0 text-[11px] text-text-secondary">{timeAgo(n.createdAt)}</span>
                  </div>
                  <p className="mt-0.5 text-text-secondary">{n.body}</p>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
