import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Plus } from 'lucide-react';

export type FabAction = { label: string; icon?: ReactNode; onClick: () => void };

export default function FloatingActionButton({
  actions,
  onClick,
  className = '',
}: {
  actions?: FabAction[];
  onClick?: () => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  const hasMenu = actions && actions.length > 0;

  return (
    <div
      ref={ref}
      className={`fixed bottom-24 right-5 z-30 flex flex-col items-end gap-2 md:bottom-8 md:right-8 ${className}`}
    >
      {open && hasMenu && (
        <div className="mb-1 flex flex-col items-end gap-2 animate-scale-in">
          {actions!.map((a) => (
            <button
              key={a.label}
              type="button"
              onClick={() => {
                setOpen(false);
                a.onClick();
              }}
              className="flex items-center gap-2 rounded-[var(--radius-full)] border border-glass-border bg-glass px-4 py-2 text-sm font-medium text-text-primary shadow-lg backdrop-blur-xl transition-[transform,box-shadow] duration-[250ms] ease-[var(--ease-premium)] hover:-translate-y-0.5 hover:scale-105 hover:shadow-xl"
            >
              {a.icon}
              {a.label}
            </button>
          ))}
        </div>
      )}
      <button
        type="button"
        aria-label="Create"
        onClick={() => (hasMenu ? setOpen((o) => !o) : onClick?.())}
        className="flex size-14 items-center justify-center rounded-[var(--radius-full)] bg-primary text-white shadow-lg shadow-primary/40 transition-[transform,box-shadow] duration-[250ms] ease-[var(--ease-premium)] hover:scale-105 hover:shadow-xl hover:shadow-primary/50 active:scale-95"
      >
        <Plus className={`size-6 transition-transform duration-[250ms] ease-[var(--ease-premium)] ${open ? 'rotate-45' : ''}`} />
      </button>
    </div>
  );
}
