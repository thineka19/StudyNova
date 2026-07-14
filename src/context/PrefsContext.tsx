import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

const STORAGE_KEY = 'studynova:prefs:v1';

export interface NotificationPrefs {
  deadlineReminders: boolean;
  examAlerts: boolean;
  dailyStudyReminders: boolean;
}

export interface PlannerPrefs {
  preferredStudyHours: string;
  sessionLengthMins: number;
  breakDurationMins: number;
}

interface Prefs {
  notifications: NotificationPrefs;
  planner: PlannerPrefs;
}

const DEFAULT_PREFS: Prefs = {
  notifications: {
    deadlineReminders: true,
    examAlerts: true,
    dailyStudyReminders: false,
  },
  planner: {
    preferredStudyHours: 'evening',
    sessionLengthMins: 50,
    breakDurationMins: 10,
  },
};

function loadPrefs(): Prefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        notifications: { ...DEFAULT_PREFS.notifications, ...parsed.notifications },
        planner: { ...DEFAULT_PREFS.planner, ...parsed.planner },
      };
    }
  } catch {
    /* ignore malformed storage */
  }
  return DEFAULT_PREFS;
}

interface PrefsContextValue extends Prefs {
  setNotificationPref: (key: keyof NotificationPrefs, value: boolean) => void;
  setPlannerPref: <K extends keyof PlannerPrefs>(key: K, value: PlannerPrefs[K]) => void;
}

const PrefsContext = createContext<PrefsContextValue | null>(null);

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>(loadPrefs);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  }, [prefs]);

  const value: PrefsContextValue = {
    ...prefs,
    setNotificationPref: (key, value) =>
      setPrefs((p) => ({ ...p, notifications: { ...p.notifications, [key]: value } })),
    setPlannerPref: (key, value) => setPrefs((p) => ({ ...p, planner: { ...p.planner, [key]: value } })),
  };

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}

export function usePrefs(): PrefsContextValue {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error('usePrefs must be used within PrefsProvider');
  return ctx;
}
