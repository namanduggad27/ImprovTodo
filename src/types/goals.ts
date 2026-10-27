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
  dailyMetrics?: Record<string, number>; // Map of 'YYYY-MM-DD' -> metric achieved
  createdAt: number;
  isImprov?: boolean;
}

export interface GoalChallengeStats {
  isSeriesActive?: boolean;     // Whether a challenge series is actively running
  startDate?: string;           // YYYY-MM-DD
  totalChallengeDays: number;   // default 66
  currentDay: number;           // 1 to totalChallengeDays
  globalStreak: number;
  baseStreak?: number;          // Base streak accumulated before current day
  lastStreakDate?: string;      // Last date (YYYY-MM-DD) streak was updated
  trophies: number;
  xpPoints: number;
  activeDateStr: string;
}

export const DEFAULT_CHALLENGE_DAYS = 66;

// Helper to dynamically calculate current challenge day from start date
export function calculateChallengeDay(
  startDateStr?: string, 
  totalDays: number = DEFAULT_CHALLENGE_DAYS,
  isSeriesActive: boolean = true
): number {
  if (!isSeriesActive || !startDateStr) return 1;
  const maxDays = totalDays > 0 ? totalDays : DEFAULT_CHALLENGE_DAYS;
  const [year, month, day] = startDateStr.split('-').map(Number);
  const start = new Date(year, month - 1, day);
  start.setHours(0, 0, 0, 0);

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const diffTime = now.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

  return Math.min(maxDays, Math.max(1, diffDays));
}

// Convert day number back to a YYYY-MM-DD date string based on challenge startDate
export function getChallengeDateStr(startDateStr: string | undefined, dayNum: number = 1): string {
  const baseStr = startDateStr || new Date().toISOString().split('T')[0];
  const [year, month, day] = baseStr.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day + (dayNum - 1));
  const y = targetDate.getFullYear();
  const m = String(targetDate.getMonth() + 1).padStart(2, '0');
  const d = String(targetDate.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// 5:00 AM cutoff check: tasks for dateStr can only be edited until next day 5:00 AM
export function isDayEditable(dateStr: string, now: Date = new Date()): boolean {
  if (!dateStr) return false;
  const [y, m, d] = dateStr.split('-').map(Number);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return false;

  // Cutoff is the following morning at 05:00:00 AM
  const cutoff = new Date(y, m - 1, d + 1, 5, 0, 0, 0);

  // Future check: dates starting tomorrow at 00:00:00 AM cannot be edited in advance
  const targetDayStart = new Date(y, m - 1, d, 0, 0, 0, 0);
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  if (targetDayStart.getTime() > todayEnd.getTime()) {
    return false;
  }

  // Editable only if current time is strictly before the next-day 5:00 AM cutoff
  return now.getTime() < cutoff.getTime();
}

// User-friendly date formatting: e.g. "Oct 27 • Today"
export function formatChallengeDate(dateStr: string): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const targetDate = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetWithoutTime = new Date(y, m - 1, d);
  targetWithoutTime.setHours(0, 0, 0, 0);

  const diffDays = Math.round((targetWithoutTime.getTime() - today.getTime()) / 86400000);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthStr = monthNames[targetDate.getMonth()];
  const formatted = `${monthStr} ${targetDate.getDate()}`;

  if (diffDays === 0) return `${formatted} • Today`;
  if (diffDays === -1) return `${formatted} • Yesterday`;
  if (diffDays === 1) return `${formatted} • Tomorrow`;
  return formatted;
}

export const DEFAULT_GOAL_STATS: GoalChallengeStats = {
  isSeriesActive: false,
  startDate: undefined,
  totalChallengeDays: DEFAULT_CHALLENGE_DAYS,
  currentDay: 1,
  globalStreak: 0,
  trophies: 0,
  xpPoints: 0,
  activeDateStr: new Date().toISOString().split('T')[0]
};

export const INITIAL_GOAL_ITEMS: GoalItem[] = [];

