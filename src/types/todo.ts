export type Priority = 'low' | 'medium' | 'high' | 'improv';
export type DateScheduleType = 'single' | 'range' | 'days';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  category: string;
  createdAt: number;
  isImprovPrompt?: boolean;
  // Scheduling fields
  date?: string; // YYYY-MM-DD
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  selectedDays?: number[]; // [0=Sun, 1=Mon, 2=Tue, ..., 6=Sat]
  scheduleType?: DateScheduleType;
}

export interface ImprovPrompt {
  id: string;
  title: string;
  category: 'creative' | 'action' | 'mindset' | 'quick-win';
  description: string;
  timeEstimate: string;
}

export type TabType = 'todos' | 'calendar' | 'improv' | 'stats';

/* ==========================================================================
   Google Keep Style Notebook Types
   ========================================================================== */

export interface NoteItem {
  id: string;
  text: string;
  completed: boolean;
}

export type NoteColor = 'default' | 'blue' | 'sage' | 'yellow' | 'lavender' | 'pink';

export interface Note {
  id: string;
  title: string;
  content: string; // Used when isList === false
  isList: boolean;
  items?: NoteItem[]; // Used when isList === true
  color: NoteColor;
  updatedAt: number;
}

/* ==========================================================================
   Modular App Settings
   ========================================================================== */

export interface AppSettings {
  enableImprov: boolean;      // Improv Studio, Challenge Wheel, Improv Priority/Filters
  enableNotes: boolean;       // Quick Notes & Google Keep Notebooks
  enableRecurring: boolean;   // Recurring / Scheduled Tasks & Calendar View
  enableSprintTimer: boolean; // ⚡ Sprint Timer button & Modal
  enableStats: boolean;       // Progress & Stats tab
  enableSound: boolean;       // Web Audio API ticks & fanfares
}

export const DEFAULT_APP_SETTINGS: AppSettings = {
  enableImprov: true,
  enableNotes: true,
  enableRecurring: true,
  enableSprintTimer: true,
  enableStats: true,
  enableSound: true,
};
