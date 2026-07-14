import type { ReactNode } from 'react';
import { Check } from 'lucide-react';
import { useSwipeToComplete } from '../../hooks/useSwipeToComplete';

export default function SwipeableRow({
  children,
  onComplete,
  completed = false,
  disabled = false,
  className = '',
}: {
  children: ReactNode;
  onComplete: () => void;
  completed?: boolean;
  disabled?: boolean;
  className?: string;
}) {
  const { style, className: swipeClass, progress, handlers } = useSwipeToComplete(onComplete, {
    disabled: disabled || completed,
  });

  return (
    <div className={`relative overflow-hidden rounded-[var(--radius-lg)] ${className}`}>
      <div
        className="absolute inset-0 flex items-center justify-start bg-success/20 px-5"
        style={{ opacity: progress }}
      >
        <Check className="size-5 text-success" />
      </div>
      <div
        {...handlers}
        style={style}
        className={`relative touch-pan-y select-none ${swipeClass}`}
      >
        {children}
      </div>
    </div>
  );
}
