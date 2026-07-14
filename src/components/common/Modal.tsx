import type { ReactNode } from 'react';
import { X } from 'lucide-react';

export default function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[var(--radius-lg)] border border-glass-border bg-card p-5 shadow-2xl animate-scale-in">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-text-secondary transition-colors hover:bg-surface hover:text-text-primary"
          >
            <X className="size-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
