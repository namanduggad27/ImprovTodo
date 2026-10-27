import React, { useState, useEffect } from 'react';
import type { GoalItem, GoalChallengeStats, GoalStatus } from '../../types/goals';
import { 
  DEFAULT_GOAL_STATS, 
  DEFAULT_CHALLENGE_DAYS, 
  calculateChallengeDay,
  getChallengeDateStr,
  isDayEditable
} from '../../types/goals';
import { GoalStatsHeader } from './GoalStatsHeader';
import { GoalDayTracker } from './GoalDayTracker';
import { GoalFilterStrip } from './GoalFilterStrip';
import { GoalCard } from './GoalCard';
import { GoalEditorModal } from './GoalEditorModal';
import { GoalChallengeModal } from './GoalChallengeModal';
import { Sparkles, Plus, Play, RotateCcw } from 'lucide-react';
import { sound } from '../../utils/audio';

interface GoalsViewProps {
  onOpenSettings: () => void;
}

export const GoalsView: React.FC<GoalsViewProps> = ({ onOpenSettings }) => {
  // Goal items state with localStorage persistence
  const [goals, setGoals] = useState<GoalItem[]>(() => {
    const saved = localStorage.getItem('improv_goals');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch (e) { console.error(e); }
    }
    return [];
  });

  // Gamification & challenge stats with persistence
  const [stats, setStats] = useState<GoalChallengeStats>(() => {
    const saved = localStorage.getItem('improv_goal_stats');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_GOAL_STATS,
          ...parsed,
          totalChallengeDays: parsed.totalChallengeDays > 0 ? parsed.totalChallengeDays : DEFAULT_CHALLENGE_DAYS
        };
      } catch (e) { console.error(e); }
    }
    return DEFAULT_GOAL_STATS;
  });

  const isSeriesActive = Boolean(stats.isSeriesActive);

  // 1. Calendar-synced challenge day: automatically computes current day from calendar if series is active
  const todayCalendarDay = isSeriesActive
    ? calculateChallengeDay(stats.startDate, stats.totalChallengeDays || DEFAULT_CHALLENGE_DAYS, true)
    : 1;

  // Active viewed day number (allows navigating back to previous days)
  const [selectedDay, setSelectedDay] = useState<number>(todayCalendarDay);

  // Keep selectedDay synced to today when challenge startDate changes or calendar advances
  useEffect(() => {
    setSelectedDay(todayCalendarDay);
  }, [todayCalendarDay, stats.startDate, stats.isSeriesActive]);

  const maxDays = stats.totalChallengeDays > 0 ? stats.totalChallengeDays : DEFAULT_CHALLENGE_DAYS;

  // Selected date corresponding to selectedDay (YYYY-MM-DD)
  const selectedDateStr = getChallengeDateStr(stats.startDate, selectedDay);

  // 5:00 AM Cutoff: past days cannot be edited after 5:00 AM of the next day
  const isSelectedDayEditable = isDayEditable(selectedDateStr);

  const todayStr = new Date().toISOString().split('T')[0];
  const isViewingToday = selectedDateStr === todayStr;

  // Filter: 'todo' | 'done' | 'skipped'
  const [activeFilter, setActiveFilter] = useState<GoalStatus>('todo');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Start the challenge series
  const handleStartSeries = () => {
    sound.playVictoryFanfare();
    const today = new Date().toISOString().split('T')[0];
    setStats(prev => ({
      ...prev,
      isSeriesActive: true,
      startDate: today,
      currentDay: 1,
      globalStreak: 0,
      baseStreak: 0,
      lastStreakDate: undefined,
      trophies: 0
    }));
    setSelectedDay(1);
  };

  // Reset the challenge series back to Day 1 setup
  const handleConfirmReset = () => {
    sound.playPop();
    setIsResetModalOpen(false);
    setStats(prev => ({
      ...prev,
      isSeriesActive: false,
      startDate: undefined,
      currentDay: 1,
      globalStreak: 0,
      baseStreak: 0,
      lastStreakDate: undefined,
      trophies: 0
    }));
    setSelectedDay(1);

    // Clear completed logs & progress on all goals, retaining the habit templates
    setGoals(prev => prev.map(g => ({
      ...g,
      status: 'todo',
      currentMetric: 0,
      completedDates: [],
      dailyMetrics: {},
      streakDays: 0
    })));
  };

  // Auto-sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('improv_goals', JSON.stringify(goals));
    } catch (e) {
      console.error('Failed to save goals', e);
    }
  }, [goals]);

  useEffect(() => {
    try {
      localStorage.setItem('improv_goal_stats', JSON.stringify(stats));
    } catch (e) {
      console.error('Failed to save goal stats', e);
    }
  }, [stats]);

  // Day navigation
  const handlePrevDay = () => {
    if (!isSeriesActive) return;
    if (selectedDay > 1) {
      setSelectedDay(prev => prev - 1);
    }
  };

  const handleNextDay = () => {
    if (!isSeriesActive) return;
    if (selectedDay < maxDays) {
      setSelectedDay(prev => prev + 1);
    }
  };

  const handleJumpToToday = () => {
    if (!isSeriesActive) return;
    setSelectedDay(todayCalendarDay);
  };

  // Update dynamic challenge timespan
  const handleUpdateChallengeSpan = (newTotalDays: number, newStartDate: string) => {
    const safeTotalDays = newTotalDays > 0 ? newTotalDays : DEFAULT_CHALLENGE_DAYS;
    const dynamicDay = isSeriesActive ? calculateChallengeDay(newStartDate, safeTotalDays, true) : 1;
    setStats(prev => ({
      ...prev,
      totalChallengeDays: safeTotalDays,
      startDate: isSeriesActive ? newStartDate : prev.startDate,
      currentDay: dynamicDay
    }));
    setSelectedDay(dynamicDay);
  };

  // Helper to determine base XP reward based on difficulty
  const getGoalBaseXP = (difficulty: string, isImprov?: boolean): number => {
    if (isImprov || difficulty === 'Focus') return 100;
    if (difficulty === 'Hard') return 75;
    if (difficulty === 'Medium') return 50;
    return 25;
  };

  // Toggle goal completion for selected date
  const handleToggleComplete = (id: string) => {
    // If series is not active, or not editable (past 5:00 AM cutoff or future), ignore edit
    if (!isSeriesActive || !isSelectedDayEditable) return;

    let xpDelta = 0;

    setGoals(prev => prev.map(g => {
      if (g.id !== id) return g;

      const existingDates = g.completedDates || [];
      const wasDoneOnDate = existingDates.includes(selectedDateStr);
      const willBeDone = !wasDoneOnDate;

      const updatedDates = willBeDone
        ? Array.from(new Set([...existingDates, selectedDateStr]))
        : existingDates.filter(d => d !== selectedDateStr);

      const targetVal = typeof g.targetMetric === 'number' ? g.targetMetric : 1;
      const updatedMetrics = { ...(g.dailyMetrics || {}) };
      if (willBeDone) {
        updatedMetrics[selectedDateStr] = targetVal;
      } else {
        delete updatedMetrics[selectedDateStr];
      }

      const nextStreak = willBeDone ? (g.streakDays || 0) + 1 : Math.max(0, (g.streakDays || 1) - 1);

      const baseXP = getGoalBaseXP(g.difficulty, g.isImprov);
      const streakBonus = willBeDone ? Math.min(50, (g.streakDays || 0) * 5) : 0;
      xpDelta = willBeDone ? (baseXP + streakBonus) : -(baseXP + streakBonus);

      return {
        ...g,
        status: isViewingToday ? (willBeDone ? 'done' : 'todo') : g.status,
        currentMetric: isViewingToday ? (willBeDone ? targetVal : 0) : g.currentMetric,
        streakDays: nextStreak,
        completedDates: updatedDates,
        dailyMetrics: updatedMetrics
      };
    }));

    if (xpDelta !== 0) {
      setStats(prev => ({
        ...prev,
        xpPoints: Math.max(0, prev.xpPoints + xpDelta)
      }));
    }
  };

  // Increment numeric progress on click for selected date
  const handleIncrementProgress = (id: string) => {
    if (!isSeriesActive || !isSelectedDayEditable) return;

    let xpDelta = 0;

    setGoals(prev => prev.map(g => {
      if (g.id !== id) return g;
      const target = typeof g.targetMetric === 'number' ? g.targetMetric : 1;
      const step = target > 10 ? 1 : target > 1 ? 0.5 : 0.2;

      const currentValOnDate = g.dailyMetrics?.[selectedDateStr] ?? (isViewingToday ? g.currentMetric : 0);
      const nextVal = Math.min(target, Math.round((currentValOnDate + step) * 10) / 10);
      // Metric task: reaching 75% or 100% of the metric target completes the task
      const isComplete = (nextVal / target) >= 0.75;

      const existingDates = g.completedDates || [];
      const wasDoneOnDate = existingDates.includes(selectedDateStr);

      if (!wasDoneOnDate && isComplete) {
        const baseXP = getGoalBaseXP(g.difficulty, g.isImprov);
        const streakBonus = Math.min(50, (g.streakDays || 0) * 5);
        xpDelta = baseXP + streakBonus;
      }

      const updatedDates = isComplete && !wasDoneOnDate
        ? Array.from(new Set([...existingDates, selectedDateStr]))
        : (!isComplete && wasDoneOnDate ? existingDates.filter(d => d !== selectedDateStr) : existingDates);

      const updatedMetrics = { ...(g.dailyMetrics || {}), [selectedDateStr]: nextVal };

      return {
        ...g,
        currentMetric: isViewingToday ? nextVal : g.currentMetric,
        status: isViewingToday ? (isComplete ? 'done' : 'todo') : g.status,
        streakDays: isComplete && !wasDoneOnDate ? (g.streakDays || 0) + 1 : g.streakDays,
        completedDates: updatedDates,
        dailyMetrics: updatedMetrics
      };
    }));

    if (xpDelta > 0) {
      setStats(prev => ({
        ...prev,
        xpPoints: prev.xpPoints + xpDelta
      }));
    }
  };

  // Delete goal
  const handleDeleteGoal = (id: string) => {
    if (isSeriesActive && !isSelectedDayEditable) return;
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  // Create new goal
  const handleSaveGoal = (goalData: Omit<GoalItem, 'id' | 'createdAt'>) => {
    const newGoal: GoalItem = {
      ...goalData,
      id: 'goal-' + Math.random().toString(36).substring(2, 9),
      createdAt: Date.now(),
      completedDates: [],
      dailyMetrics: {},
      streakDays: 0
    };
    setGoals(prev => [newGoal, ...prev]);
    setStats(prev => ({ ...prev, xpPoints: prev.xpPoints + 25 }));
  };

  // 75% Task Completion Threshold for Streak:
  const totalTasks = goals.length;
  // Count tasks completed for today's calendar date
  const completedTodayTasks = isSeriesActive
    ? goals.filter(g => (g.completedDates || []).includes(todayStr) || (isViewingToday && g.status === 'done')).length
    : 0;
  const completionRatio = totalTasks > 0 ? (completedTodayTasks / totalTasks) : 0;
  const hasReached75Percent = isSeriesActive && totalTasks > 0 && completionRatio >= 0.75;

  // Base streak accumulated before current day
  const baseStreak = !isSeriesActive
    ? 0
    : (stats.baseStreak !== undefined
      ? stats.baseStreak
      : (stats.lastStreakDate === todayStr ? Math.max(0, stats.globalStreak - 1) : (stats.globalStreak || 0)));

  // The streak updates (+1) only when 75% of the tasks are completed
  const activeStreak = !isSeriesActive
    ? 0
    : (hasReached75Percent
      ? Math.max(baseStreak + 1, Math.max(1, ...goals.map(g => g.streakDays || 0)))
      : baseStreak);

  // Persist updated streak when 75% threshold is crossed in active series
  useEffect(() => {
    if (isSeriesActive && hasReached75Percent) {
      setStats(prev => {
        if (prev.lastStreakDate === todayStr && prev.globalStreak === activeStreak) return prev;
        return {
          ...prev,
          globalStreak: activeStreak,
          baseStreak: prev.baseStreak !== undefined ? prev.baseStreak : Math.max(0, activeStreak - 1),
          lastStreakDate: todayStr
        };
      });
    }
  }, [isSeriesActive, hasReached75Percent, activeStreak, todayStr]);

  // Dynamic Milestone Trophies
  const anyDone = goals.some(g => (g.completedDates && g.completedDates.length > 0) || g.status === 'done');
  const allDoneToday = goals.length > 0 && completedTodayTasks === goals.length;
  const challengeDays = stats.totalChallengeDays > 0 ? stats.totalChallengeDays : DEFAULT_CHALLENGE_DAYS;
  const progressRatio = (todayCalendarDay || 1) / challengeDays;

  let dynamicTrophies = 0;
  if (isSeriesActive) {
    if (anyDone) dynamicTrophies += 1;                  // First Habit Done
    if (allDoneToday) dynamicTrophies += 1;             // Perfect Day Badge
    if (activeStreak >= 7) dynamicTrophies += 1;        // 7-Day Consistency
    if (activeStreak >= 21) dynamicTrophies += 1;       // 21-Day Habit Formed
    if (activeStreak >= 45) dynamicTrophies += 1;       // 45-Day Discipline
    if (activeStreak >= 66) dynamicTrophies += 2;       // 66-Day Mastery Complete
    if (progressRatio >= 0.25) dynamicTrophies += 1;    // Quarter Challenge Milestone
    if (progressRatio >= 0.50) dynamicTrophies += 1;    // Halfway Milestone
    if (progressRatio >= 0.75) dynamicTrophies += 1;    // Final Stretch Milestone
    if (progressRatio >= 1.0) dynamicTrophies += 1;     // Grand Finish
  }
  const dynamicStats: GoalChallengeStats = {
    ...stats,
    currentDay: selectedDay,
    globalStreak: activeStreak,
    trophies: dynamicTrophies
  };

  // Map each goal to its status on selectedDateStr
  const goalsForSelectedDate = goals.map(goal => {
    const isDoneOnDate = (goal.completedDates || []).includes(selectedDateStr) || (isViewingToday && goal.status === 'done');
    const metricOnDate = goal.dailyMetrics?.[selectedDateStr] ?? (
      isDoneOnDate
        ? (typeof goal.targetMetric === 'number' ? goal.targetMetric : 1)
        : (isViewingToday ? goal.currentMetric : 0)
    );
    const statusOnDate: GoalStatus = isDoneOnDate ? 'done' : (goal.status === 'skipped' ? 'skipped' : 'todo');

    return {
      goal,
      isDone: isDoneOnDate,
      metric: metricOnDate,
      status: statusOnDate
    };
  });

  // Counts for the selected date
  const counts = {
    todo: goalsForSelectedDate.filter(e => !e.isDone).length,
    done: goalsForSelectedDate.filter(e => e.isDone).length,
    skipped: 0
  };

  // Filter and sort for the selected date
  const displayedGoalEntries = goalsForSelectedDate
    .filter(entry => {
      if (activeFilter === 'todo') return entry.status === 'todo' || entry.status === 'done';
      if (activeFilter === 'done') return entry.status === 'done';
      if (activeFilter === 'skipped') return entry.status === 'skipped';
      return true;
    })
    .sort((a, b) => {
      const aDone = a.isDone ? 1 : 0;
      const bDone = b.isDone ? 1 : 0;
      return aDone - bDone;
    });

  const pendingEntries = displayedGoalEntries.filter(e => !e.isDone);
  const completedEntries = displayedGoalEntries.filter(e => e.isDone);

  return (
    <div className="animate-fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      minHeight: '100vh',
      background: '#090a0e',
      paddingBottom: 'calc(var(--bottom-nav-height) + 1.5rem)'
    }}>
      {/* 1. Top Gamification Stats Pill Bar [🔥 Streak | 🏆 Trophies | + XP | ⚙️] */}
      <GoalStatsHeader stats={dynamicStats} onOpenSettings={onOpenSettings} />

      {/* 2. Heavy Day Tracker: DAY X / 66 [<] [TODAY] [>] with editable timespan & Reset */}
      <GoalDayTracker
        currentDay={selectedDay}
        totalDays={stats.totalChallengeDays || DEFAULT_CHALLENGE_DAYS}
        todayDay={todayCalendarDay}
        dateStr={selectedDateStr}
        isSeriesActive={isSeriesActive}
        onPrevDay={handlePrevDay}
        onNextDay={handleNextDay}
        onJumpToToday={handleJumpToToday}
        onOpenChallengeModal={() => setIsChallengeModalOpen(true)}
        onResetSeries={() => setIsResetModalOpen(true)}
      />

      {/* 3. Filter Strip & Add Button [TO-DOS 8 | DONE 0 | SKIPPED 1 | +] */}
      <GoalFilterStrip
        activeStatus={activeFilter}
        onSelectStatus={setActiveFilter}
        counts={counts}
        onOpenAdd={() => setIsAddOpen(true)}
      />

      {/* Pre-Series Setup Hero Banner (When challenge is not active) */}
      {!isSeriesActive && (
        <div style={{
          margin: '0.4rem 1rem 1rem',
          padding: '1.25rem 1.15rem',
          background: 'linear-gradient(135deg, rgba(255, 85, 0, 0.12) 0%, #12131c 100%)',
          border: '1px solid rgba(255, 85, 0, 0.45)',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.45)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span role="img" aria-label="rocket" style={{ fontSize: '1.1rem' }}>🚀</span>
              <span style={{
                fontSize: '0.85rem',
                fontWeight: 900,
                color: '#ffffff',
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}>
                PRE-SERIES HABIT SETUP
              </span>
            </div>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 900,
              color: '#ff5500',
              background: 'rgba(255, 85, 0, 0.15)',
              border: '1px solid rgba(255, 85, 0, 0.35)',
              padding: '2px 8px',
              borderRadius: '4px'
            }}>
              {goals.length} HABIT{goals.length === 1 ? '' : 'S'} SET
            </span>
          </div>

          <p style={{
            fontSize: '0.82rem',
            color: '#94a3b8',
            lineHeight: 1.5,
            margin: 0
          }}>
            Add and customize your daily habits below for <strong>Day 1</strong>. When you start the series, these habits will automatically repeat across all {stats.totalChallengeDays || 66} days and daily tracking will activate.
          </p>

          <button
            onClick={handleStartSeries}
            style={{
              width: '100%',
              padding: '0.85rem 1rem',
              borderRadius: '6px',
              border: 'none',
              background: 'linear-gradient(135deg, #ff5500 0%, #ff6a00 100%)',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '0.88rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 18px rgba(255, 85, 0, 0.4)',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Play size={16} fill="#ffffff" /> START {stats.totalChallengeDays || 66}-DAY CHALLENGE
          </button>
        </div>
      )}

      {/* 4. Goal Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {displayedGoalEntries.length === 0 ? (
          <div style={{
            margin: '1.5rem 1rem',
            padding: '3rem 1.5rem',
            textAlign: 'center',
            background: '#101218',
            borderRadius: '6px',
            border: '1px solid #1e202c',
            boxShadow: '0 4px 18px rgba(0,0,0,0.5)'
          }}>
            <Sparkles size={32} color="#ff5500" style={{ margin: '0 auto 0.75rem', opacity: 0.9 }} />
            <h3 style={{
              fontFamily: "var(--font-heading), 'Outfit', sans-serif",
              fontSize: '1.1rem',
              fontWeight: 900,
              margin: '0 0 0.5rem',
              color: '#ffffff',
              letterSpacing: '0.03em',
              textTransform: 'uppercase'
            }}>
              No {activeFilter} goals found
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#8b949e', margin: '0 0 1.25rem', lineHeight: 1.45 }}>
              {activeFilter === 'todo'
                ? (!isSeriesActive ? "Add your first habit goal for Day 1 above to begin shaping your routine!" : "You've crushed all your daily habits for today! Time to level up.")
                : `Nothing in ${activeFilter} yet.`}
            </p>
            <button
              onClick={() => {
                sound.playPop();
                setIsAddOpen(true);
              }}
              style={{
                padding: '0.75rem 1.25rem',
                borderRadius: '4px',
                border: 'none',
                background: '#ff5500',
                color: '#ffffff',
                fontWeight: 900,
                fontSize: '0.8rem',
                letterSpacing: '0.04em',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 16px rgba(255, 85, 0, 0.35)'
              }}
            >
              <Plus size={16} strokeWidth={3} /> ADD NEW HABIT GOAL
            </button>
          </div>
        ) : (
          <>
            {/* If all goals are completed in the TO-DOS view on today's date */}
            {isSeriesActive && activeFilter === 'todo' && isViewingToday && pendingEntries.length === 0 && completedEntries.length > 0 && (
              <div style={{
                margin: '0 1rem 0.85rem',
                padding: '0.75rem 1rem',
                background: 'rgba(255, 85, 0, 0.08)',
                border: '1px solid rgba(255, 85, 0, 0.25)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={16} color="#ff5500" />
                  <span style={{
                    fontSize: '0.78rem',
                    fontWeight: 900,
                    color: '#ffffff',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase'
                  }}>
                    All habits completed today!
                  </span>
                </div>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 900,
                  color: '#ff5500',
                  background: 'rgba(255, 85, 0, 0.15)',
                  padding: '2px 8px',
                  borderRadius: '4px'
                }}>
                  {completedEntries.length}/{completedEntries.length} DONE
                </span>
              </div>
            )}

            {/* If 75%+ tasks completed today (streak updated) and some pending goals remain */}
            {isSeriesActive && activeFilter === 'todo' && isViewingToday && hasReached75Percent && pendingEntries.length > 0 && (
              <div style={{
                margin: '0 1rem 0.85rem',
                padding: '0.75rem 1rem',
                background: 'rgba(255, 85, 0, 0.09)',
                border: '1px solid rgba(255, 85, 0, 0.35)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span role="img" aria-label="flame" style={{ fontSize: '1rem' }}>🔥</span>
                  <span style={{
                    fontSize: '0.78rem',
                    fontWeight: 900,
                    color: '#ffffff',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase'
                  }}>
                    Streak Updated! (75%+ Tasks Done)
                  </span>
                </div>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 900,
                  color: '#ff5500',
                  background: 'rgba(255, 85, 0, 0.18)',
                  padding: '2px 8px',
                  borderRadius: '4px'
                }}>
                  {completedTodayTasks}/{totalTasks} DONE ({Math.round(completionRatio * 100)}%)
                </span>
              </div>
            )}

            {/* Pending Goals (if on todo tab) or all non-done items */}
            {(activeFilter === 'todo' ? pendingEntries : displayedGoalEntries.filter(e => !e.isDone)).map(entry => (
              <GoalCard
                key={entry.goal.id}
                goal={entry.goal}
                isDone={entry.isDone}
                currentMetric={entry.metric}
                isEditable={isSeriesActive && isSelectedDayEditable}
                onToggleComplete={handleToggleComplete}
                onDeleteGoal={(isSeriesActive ? isSelectedDayEditable : true) ? handleDeleteGoal : undefined}
                onIncrementProgress={handleIncrementProgress}
              />
            ))}

            {/* Completed Section Divider when in TO-DOS tab with both pending & completed items */}
            {activeFilter === 'todo' && pendingEntries.length > 0 && completedEntries.length > 0 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                margin: '0.75rem 1rem 0.85rem',
                paddingTop: '0.25rem'
              }}>
                <span style={{ height: '1px', flex: 1, background: '#1e202c' }} />
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 900,
                  letterSpacing: '0.08em',
                  color: '#64748b',
                  textTransform: 'uppercase'
                }}>
                  Completed ({completedEntries.length})
                </span>
                <span style={{ height: '1px', flex: 1, background: '#1e202c' }} />
              </div>
            )}

            {/* Completed Goals at the bottom */}
            {(activeFilter === 'todo' || activeFilter === 'done' ? completedEntries : []).map(entry => (
              <GoalCard
                key={entry.goal.id}
                goal={entry.goal}
                isDone={entry.isDone}
                currentMetric={entry.metric}
                isEditable={isSeriesActive && isSelectedDayEditable}
                onToggleComplete={handleToggleComplete}
                onDeleteGoal={(isSeriesActive ? isSelectedDayEditable : true) ? handleDeleteGoal : undefined}
                onIncrementProgress={handleIncrementProgress}
              />
            ))}
          </>
        )}
      </div>

      {/* 5. Create Goal Modal */}
      <GoalEditorModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSaveGoal={handleSaveGoal}
      />

      {/* 6. Dynamic Challenge Timespan Modal (Default: 66 Days) */}
      <GoalChallengeModal
        isOpen={isChallengeModalOpen}
        onClose={() => setIsChallengeModalOpen(false)}
        totalDays={stats.totalChallengeDays || DEFAULT_CHALLENGE_DAYS}
        startDate={stats.startDate}
        onSave={handleUpdateChallengeSpan}
      />

      {/* 7. Reset Series Confirmation Modal */}
      {isResetModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            background: '#12131b',
            border: '1px solid rgba(239, 68, 68, 0.5)',
            borderRadius: '8px',
            maxWidth: '380px',
            width: '100%',
            padding: '1.5rem',
            boxShadow: '0 10px 30px rgba(239, 68, 68, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ef4444'
              }}>
                <RotateCcw size={20} strokeWidth={2.4} />
              </div>
              <div>
                <h3 style={{
                  margin: 0,
                  fontSize: '1.05rem',
                  fontWeight: 900,
                  color: '#ffffff',
                  letterSpacing: '0.02em'
                }}>
                  RESET CHALLENGE SERIES?
                </h3>
                <span style={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: 700 }}>
                  Active series will be stopped
                </span>
              </div>
            </div>

            <p style={{
              fontSize: '0.82rem',
              color: '#94a3b8',
              lineHeight: 1.5,
              margin: 0
            }}>
              This will end your current series and reset your day counter, streak, and daily check-offs back to <strong>Day 1 Setup</strong> mode. Your habit templates will be preserved so you can restart anytime.
            </p>

            <div style={{ display: 'flex', gap: '8px', marginTop: '0.5rem' }}>
              <button
                onClick={() => {
                  sound.playPop();
                  setIsResetModalOpen(false);
                }}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '4px',
                  border: '1px solid #282b3d',
                  background: '#1a1c29',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                CANCEL
              </button>
              <button
                onClick={handleConfirmReset}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '4px',
                  border: 'none',
                  background: '#ef4444',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: '0.8rem',
                  letterSpacing: '0.03em',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)'
                }}
              >
                CONFIRM RESET
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
