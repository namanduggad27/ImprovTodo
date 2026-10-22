export type GoalDifficulty = 'Easy' | 'Medium' | 'Hard';
export type GoalStatus = 'todo' | 'done' | 'skipped';
export type GoalPreset = 'water' | 'workout' | 'running' | 'study' | 'mindset' | 'custom';

export interface GoalItem {
  id: string;
  title: string;
  frequency: string;            // 'Daily', '6x/week', '5x/week', etc.
  difficulty: GoalDifficulty;   // 'Easy', 'Medium', 'Hard'
  currentMetric: number;        // e.g. 0
  targetMetric: number;         // e.g. 2, 1.2, 2.8
  unit: string;                 // 'L', 'hrs', 'km', 'mins'
  streakDays: number;           // e.g. 1
  status: GoalStatus;           // 'todo' | 'done' | 'skipped'
  bgPreset: GoalPreset;
  bgImageUrl?: string;          // Custom image URL or SVG data
  completedDates: string[];     // Array of 'YYYY-MM-DD' dates
  createdAt: number;
}

export interface GoalChallengeStats {
  currentDay: number;           // e.g. 53
  totalChallengeDays: number;   // e.g. 66
  globalStreak: number;         // e.g. 53
  trophies: number;             // e.g. 4
  xpPoints: number;             // e.g. 4975
  activeDateStr: string;        // 'YYYY-MM-DD' currently being inspected
}

export const DEFAULT_GOAL_STATS: GoalChallengeStats = {
  currentDay: 53,
  totalChallengeDays: 66,
  globalStreak: 53,
  trophies: 4,
  xpPoints: 4975,
  activeDateStr: new Date().toISOString().split('T')[0]
};

export const INITIAL_GOAL_ITEMS: GoalItem[] = [
  {
    id: 'goal-1',
    title: 'Drink 3L water',
    frequency: 'Daily',
    difficulty: 'Easy',
    currentMetric: 0,
    targetMetric: 2,
    unit: 'L',
    streakDays: 1,
    status: 'todo',
    bgPreset: 'water',
    completedDates: [],
    createdAt: Date.now() - 86400000 * 2
  },
  {
    id: 'goal-2',
    title: 'Workout 1h and 15min',
    frequency: '6x/week',
    difficulty: 'Easy',
    currentMetric: 0,
    targetMetric: 1.2,
    unit: 'hrs',
    streakDays: 1,
    status: 'todo',
    bgPreset: 'workout',
    completedDates: [],
    createdAt: Date.now() - 86400000 * 3
  },
  {
    id: 'goal-3',
    title: 'Run 2.8km',
    frequency: '6x/week',
    difficulty: 'Easy',
    currentMetric: 0,
    targetMetric: 2.8,
    unit: 'km',
    streakDays: 1,
    status: 'todo',
    bgPreset: 'running',
    completedDates: [],
    createdAt: Date.now() - 86400000 * 4
  },
  {
    id: 'goal-4',
    title: 'Fourteen days of deep focus',
    frequency: 'Daily',
    difficulty: 'Medium',
    currentMetric: 0,
    targetMetric: 1,
    unit: 'hr',
    streakDays: 2,
    status: 'todo',
    bgPreset: 'study',
    completedDates: [],
    createdAt: Date.now() - 86400000 * 5
  }
];
