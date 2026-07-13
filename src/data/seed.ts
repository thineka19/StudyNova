import type { StudyNovaData } from '../types';

// Sample data so the app is populated on first run, matching the scenario
// described in the product brief (Database exam, Algorithms assignment,
// evening free time blocks).
function iso(daysFromToday: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  return d.toISOString().slice(0, 10);
}

export function buildSeedData(): StudyNovaData {
  const dbSubjectId = 'subj-database';
  const algoSubjectId = 'subj-algorithms';
  const webSubjectId = 'subj-webdev';

  return {
    subjects: [
      {
        id: dbSubjectId,
        name: 'Database Systems',
        difficulty: 'high',
        progress: 40,
        color: '#6366f1',
        createdAt: iso(-10),
        topics: [
          { name: 'ER Modeling', covered: true },
          { name: 'Normalization', covered: true },
          { name: 'SQL Joins', covered: false },
          { name: 'Transactions & ACID', covered: false },
          { name: 'Indexing', covered: false },
        ],
      },
      {
        id: algoSubjectId,
        name: 'Algorithms',
        difficulty: 'high',
        progress: 55,
        color: '#f59e0b',
        createdAt: iso(-14),
        topics: [
          { name: 'Sorting', covered: true },
          { name: 'Recursion', covered: true },
          { name: 'Dynamic Programming', covered: false },
          { name: 'Graphs', covered: false },
        ],
      },
      {
        id: webSubjectId,
        name: 'Web Development',
        difficulty: 'med',
        progress: 70,
        color: '#10b981',
        createdAt: iso(-20),
        topics: [
          { name: 'HTML/CSS', covered: true },
          { name: 'JavaScript', covered: true },
          { name: 'React', covered: true },
          { name: 'Backend APIs', covered: false },
        ],
      },
    ],
    assignments: [
      {
        id: 'asg-algo-1',
        subjectId: algoSubjectId,
        title: 'Algorithms Problem Set 3',
        deadline: iso(33), // Aug 15 relative placeholder (kept dynamic)
        weight: 8,
        status: 'in-progress',
        createdAt: iso(-3),
      },
      {
        id: 'asg-web-1',
        subjectId: webSubjectId,
        title: 'React Portfolio Project',
        deadline: iso(20),
        weight: 6,
        status: 'not-started',
        createdAt: iso(-1),
      },
    ],
    exams: [
      {
        id: 'exam-db-1',
        subjectId: dbSubjectId,
        date: iso(38), // Aug 20 relative placeholder
        difficulty: 'high',
        preparedness: 35,
        practiceTestsDone: 1,
        createdAt: iso(-5),
      },
    ],
    studySessions: [],
    focusSessions: [],
    availability: [
      { dayOfWeek: 0, freeTimeBlocks: [{ start: '19:00', end: '22:00' }] },
      { dayOfWeek: 1, freeTimeBlocks: [{ start: '19:00', end: '22:00' }] },
      { dayOfWeek: 2, freeTimeBlocks: [{ start: '19:00', end: '22:00' }] },
      { dayOfWeek: 3, freeTimeBlocks: [{ start: '19:00', end: '22:00' }] },
      { dayOfWeek: 4, freeTimeBlocks: [{ start: '19:00', end: '22:00' }] },
      { dayOfWeek: 5, freeTimeBlocks: [{ start: '14:00', end: '18:00' }] },
      { dayOfWeek: 6, freeTimeBlocks: [{ start: '14:00', end: '18:00' }] },
    ],
    xp: {
      totalXP: 0,
      level: 1,
      badges: [
        { id: 'first-task', name: 'First Task', description: 'Complete your first study task', icon: '🎯', unlockedAt: null },
        { id: 'streak-7', name: '7-Day Streak', description: 'Study 7 days in a row', icon: '🔥', unlockedAt: null },
        { id: 'hours-20', name: '20 Hours Studied', description: 'Log 20 total hours of focused study', icon: '⏱️', unlockedAt: null },
        { id: 'exam-warrior', name: 'Exam Warrior', description: 'Reach 90%+ readiness on an exam', icon: '🛡️', unlockedAt: null },
      ],
    },
    notifications: [],
  };
}
