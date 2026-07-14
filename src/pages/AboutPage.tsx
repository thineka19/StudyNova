import { ArrowRight, BookOpenCheck, Brain, CalendarDays, Sparkles, TimerReset, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../components/common/Card';

const features = [
  {
    title: 'Smart study planning',
    description: 'Turn subjects, assignments, and exams into a clear daily routine with calm, actionable steps.',
    icon: BookOpenCheck,
  },
  {
    title: 'Focus-first workflow',
    description: 'Use a distraction-light timer and progress cues to stay on track when it matters most.',
    icon: TimerReset,
  },
  {
    title: 'Meaningful insights',
    description: 'Track weekly progress, energy, and study consistency with elegant analytics that feel motivating.',
    icon: Brain,
  },
  {
    title: 'Momentum that lasts',
    description: 'Celebrate milestones, maintain streaks, and build confidence through steady, visible progress.',
    icon: Trophy,
  },
];

const stats = [
  { label: 'Study goals', value: 'Daily' },
  { label: 'Focus mode', value: 'Built in' },
  { label: 'Progress views', value: 'Weekly' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg px-4 py-8 text-text-primary sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <section className="overflow-hidden rounded-[var(--radius-lg)] border border-glass-border bg-gradient-to-br from-primary/90 via-primary to-accent/80 p-8 text-white shadow-2xl shadow-primary/20 sm:p-10 lg:p-12">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium backdrop-blur">
              <Sparkles className="size-4" />
              Study smarter, not harder
            </div>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              StudyNova helps students build calm, consistent study habits.
            </h1>
            <p className="mt-4 max-w-2xl text-base text-white/85 sm:text-lg">
              From assignments and exams to focus sessions and weekly progress, StudyNova brings your learning life into one thoughtful workspace.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] bg-white px-4 py-2.5 text-sm font-semibold text-primary transition hover:scale-[1.01]"
              >
                Start free <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center rounded-[var(--radius-sm)] border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.label} className="text-center">
              <p className="text-2xl font-semibold text-text-primary">{stat.value}</p>
              <p className="mt-1 text-sm text-text-secondary">{stat.label}</p>
            </Card>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} hover className="flex gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-primary/10 text-accent">
                  <Icon className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">{feature.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-text-secondary">{feature.description}</p>
                </div>
              </Card>
            );
          })}
        </section>

        <section className="rounded-[var(--radius-lg)] border border-border bg-card/70 p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-text-primary">Built for students who want clarity.</h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-text-secondary">
                StudyNova combines planning, focus, and reflection into one peaceful experience so you can spend less time organizing and more time learning.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-[var(--radius-sm)] border border-border bg-surface px-3 py-2 text-sm text-text-secondary">
              <CalendarDays className="size-4 text-accent" />
              Designed for modern study routines
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
