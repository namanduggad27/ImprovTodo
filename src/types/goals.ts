export type GoalDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Focus';
export type GoalStatus = 'todo' | 'done' | 'skipped';
export type GoalPreset = 'water' | 'workout' | 'running' | 'study' | 'mindset' | 'custom';

export interface GoalItem {
  id: string;
  title: string;
  frequency: string;            // 'Daily', '6x/week', '5x/week', etc.
  difficulty: GoalDifficulty;   // 'Easy', 'Medium', 'Hard', 'Focus'
  currentMetric: number;        // e.g. 0
  targetMetric: number | string; // e.g. 2, 1.2, 2.8, '1'
  unit: string;                 // 'L', 'hrs', 'km', 'mins', 'Session'
  streakDays: number;           // e.g. 1
  status: GoalStatus;           // 'todo' | 'done' | 'skipped'
  bgPreset: GoalPreset;
  bgImageUrl?: string;          // Custom image URL or SVG data
  completedDates: string[];     // Array of 'YYYY-MM-DD' dates
  createdAt: number;
  isImprov?: boolean;
}

export interface GoalChallengeStats {
  startDate?: string;           // YYYY-MM-DD
  totalChallengeDays: number;   // default 66
  currentDay: number;           // 1 to totalChallengeDays
  globalStreak: number;
  trophies: number;
  xpPoints: number;
  activeDateStr: string;
}

export const DEFAULT_CHALLENGE_DAYS = 66;

// Helper to dynamically calculate current challenge day from start date
export function calculateChallengeDay(startDateStr?: string, totalDays: number = DEFAULT_CHALLENGE_DAYS): number {
  const maxDays = totalDays > 0 ? totalDays : DEFAULT_CHALLENGE_DAYS;
  if (!startDateStr) return 1;
  const [year, month, day] = startDateStr.split('-').map(Number);
  const start = new Date(year, month - 1, day);
  start.setHours(0, 0, 0, 0);

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const diffTime = now.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

  return Math.min(maxDays, Math.max(1, diffDays));
}

export const DEFAULT_GOAL_STATS: GoalChallengeStats = {
  startDate: new Date().toISOString().split('T')[0],
  totalChallengeDays: DEFAULT_CHALLENGE_DAYS,
  currentDay: 1,
  globalStreak: 0,
  trophies: 0,
  xpPoints: 0,
  activeDateStr: new Date().toISOString().split('T')[0]
};

export const INITIAL_GOAL_ITEMS: GoalItem[] = [];

