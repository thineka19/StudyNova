import { useRef, useState } from 'react';

export function useSwipeToComplete(onComplete: () => void, opts?: { threshold?: number; disabled?: boolean }) {
  const threshold = opts?.threshold ?? 96;
  const disabled = opts?.disabled ?? false;
  const [dx, setDx] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [completing, setCompleting] = useState(false);
  const startX = useRef<number | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    if (disabled || completing) return;
    startX.current = e.clientX;
    setIsSwiping(true);
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (startX.current === null) return;
    const delta = Math.max(0, e.clientX - startX.current);
    setDx(delta);
  };

  const finish = () => {
    if (startX.current === null) return;
    const delta = dx;
    startX.current = null;
    setIsSwiping(false);
    if (delta >= threshold && !disabled) {
      setCompleting(true);
      setDx(0);
      window.setTimeout(() => {
        onComplete();
        setCompleting(false);
      }, 320);
    } else {
      setDx(0);
    }
  };

  const onPointerUp = () => finish();
  const onPointerCancel = () => finish();

  return {
    style: completing
      ? undefined
      : {
          transform: `translateX(${dx}px)`,
          transition: isSwiping ? 'none' : 'transform 200ms ease-out',
        },
    className: completing ? 'animate-swipe-complete' : '',
    progress: Math.min(1, dx / threshold),
    isSwiping,
    completing,
    handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel },
  };
}
