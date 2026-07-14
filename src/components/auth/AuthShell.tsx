import type { ReactNode } from 'react';
import { GraduationCap, Sparkles } from 'lucide-react';

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-bg">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden p-12 lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              'radial-gradient(60% 50% at 20% 15%, rgba(0,45,127,0.55), transparent 60%), radial-gradient(50% 45% at 85% 85%, rgba(0,40,118,0.45), transparent 60%), linear-gradient(180deg, #05070F 0%, #0A0F1E 100%)',
          }}
        />
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="flex size-10 items-center justify-center rounded-[var(--radius-sm)] bg-primary text-white shadow-lg shadow-primary/30">
            <GraduationCap className="size-5" />
          </div>
          <span className="text-lg font-bold text-text-primary">StudyNova</span>
        </div>
        <div className="relative z-10 max-w-md">
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-[var(--radius-full)] border border-glass-border bg-glass px-3 py-1 text-xs font-medium text-success backdrop-blur-xl">
            <Sparkles className="size-3.5" />
            AI-guided study planning
          </span>
          <h1 className="text-4xl font-bold leading-tight text-text-primary">Plan. Learn. Achieve.</h1>
          <p className="mt-4 text-sm text-text-secondary">
            A calm, focused workspace that turns your syllabus into a daily plan — so you always know exactly
            what to study next.
          </p>
        </div>
        <p className="relative z-10 text-xs text-text-secondary/60">© {new Date().getFullYear()} StudyNova</p>
      </div>

      <div className="relative flex w-full flex-col items-center justify-center px-4 py-10 lg:w-1/2">
        <div className="w-full max-w-md animate-slide-up">
          <div className="mb-8 flex flex-col items-center gap-3 text-center lg:items-start lg:text-left">
            <div className="flex size-12 items-center justify-center rounded-[var(--radius-md)] bg-primary text-white shadow-lg shadow-primary/30 lg:hidden">
              <GraduationCap className="size-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
              <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>
            </div>
          </div>

          <div className="rounded-[var(--radius-lg)] border border-glass-border bg-card/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            {children}
          </div>

          <p className="mt-6 text-center text-sm text-text-secondary">{footer}</p>
        </div>
      </div>
    </div>
  );
}
