import React, { useState, useEffect } from 'react';
import type { GoalItem, GoalChallengeStats, GoalStatus } from '../../types/goals';
import { DEFAULT_GOAL_STATS, DEFAULT_CHALLENGE_DAYS, calculateChallengeDay } from '../../types/goals';
import { GoalStatsHeader } from './GoalStatsHeader';
import { GoalDayTracker } from './GoalDayTracker';
import { GoalFilterStrip } from './GoalFilterStrip';
import { GoalCard } from './GoalCard';
import { GoalEditorModal } from './GoalEditorModal';
import { GoalChallengeModal } from './GoalChallengeModal';
import { Sparkles, Plus } from 'lucide-react';
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

  // Filter: 'todo' | 'done' | 'skipped'
  const [activeFilter, setActiveFilter] = useState<GoalStatus>('todo');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);

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
    if (stats.currentDay > 1) {
      setStats(prev => ({ ...prev, currentDay: prev.currentDay - 1 }));
    }
  };

  const handleNextDay = () => {
    const maxDays = stats.totalChallengeDays > 0 ? stats.totalChallengeDays : DEFAULT_CHALLENGE_DAYS;
    if (stats.currentDay < maxDays) {
      setStats(prev => ({ ...prev, currentDay: prev.currentDay + 1 }));
    }
  };

  // Update dynamic challenge timespan
  const handleUpdateChallengeSpan = (newTotalDays: number, newStartDate: string) => {
    const safeTotalDays = newTotalDays > 0 ? newTotalDays : DEFAULT_CHALLENGE_DAYS;
    const dynamicDay = calculateChallengeDay(newStartDate, safeTotalDays);
    setStats(prev => ({
      ...prev,
      totalChallengeDays: safeTotalDays,
      startDate: newStartDate,
      currentDay: dynamicDay
    }));
  };

  // Toggle goal completion
  const handleToggleComplete = (id: string) => {
    setGoals(prev => prev.map(g => {
      if (g.id !== id) return g;
      const willBeDone = g.status !== 'done';
      return {
        ...g,
        status: willBeDone ? 'done' : 'todo',
        currentMetric: willBeDone ? (typeof g.targetMetric === 'number' ? g.targetMetric : 1) : 0,
        streakDays: willBeDone ? g.streakDays + 1 : Math.max(0, g.streakDays - 1)
      };
    }));

    // Grant XP and check streaks
    setStats(prev => {
      const targetGoal = goals.find(g => g.id === id);
      const isFinishing = targetGoal && targetGoal.status !== 'done';
      const xpGained = isFinishing ? 50 : -50;
      return {
        ...prev,
        xpPoints: Math.max(0, prev.xpPoints + xpGained)
      };
    });
  };

  // Increment numeric progress on click
  const handleIncrementProgress = (id: string) => {
    setGoals(prev => prev.map(g => {
      if (g.id !== id) return g;
      const target = typeof g.targetMetric === 'number' ? g.targetMetric : 1;
      const step = target > 10 ? 1 : target > 1 ? 0.5 : 0.2;
      const nextVal = Math.min(target, Math.round((g.currentMetric + step) * 10) / 10);
      const isComplete = nextVal >= target;
      return {
        ...g,
        currentMetric: nextVal,
        status: isComplete ? 'done' : g.status,
        streakDays: isComplete && g.status !== 'done' ? g.streakDays + 1 : g.streakDays
      };
    }));
  };

  // Delete goal
  const handleDeleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  // Create new goal
  const handleSaveGoal = (goalData: Omit<GoalItem, 'id' | 'createdAt'>) => {
    const newGoal: GoalItem = {
      ...goalData,
      id: 'goal-' + Math.random().toString(36).substring(2, 9),
      createdAt: Date.now()
    };
    setGoals(prev => [newGoal, ...prev]);
    setStats(prev => ({ ...prev, xpPoints: prev.xpPoints + 25 }));
  };

  // Counts
  const counts = {
    todo: goals.filter(g => g.status === 'todo').length,
    done: goals.filter(g => g.status === 'done').length,
    skipped: goals.filter(g => g.status === 'skipped').length
  };

  // Filter and sort:
  // In the 'todo' view, active to-dos stay on top, completed tasks get slashed and move to the bottom.
  // In 'done' view, only completed tasks are shown.
  // In 'skipped' view, only skipped tasks are shown.
  const displayedGoals = goals
    .filter(g => {
      if (activeFilter === 'todo') return g.status === 'todo' || g.status === 'done';
      if (activeFilter === 'done') return g.status === 'done';
      if (activeFilter === 'skipped') return g.status === 'skipped';
      return true;
    })
    .sort((a, b) => {
      // Completed goals always move to the bottom
      const aDone = a.status === 'done' ? 1 : 0;
      const bDone = b.status === 'done' ? 1 : 0;
      return aDone - bDone;
    });

  const pendingGoals = displayedGoals.filter(g => g.status === 'todo');
  const completedGoals = displayedGoals.filter(g => g.status === 'done');

  return (
    <div className="animate-fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      minHeight: '100vh',
      background: '#090a0e',
      paddingBottom: 'calc(var(--bottom-nav-height) + 1.5rem)'
    }}>
      {/* 1. Top Gamification Stats Pill Bar [🔥 53 | 🏆 4 | + 4,975 | ⚙️] */}
      <GoalStatsHeader stats={stats} onOpenSettings={onOpenSettings} />

      {/* 2. Heavy Day Tracker: DAY 53 / 66 [<] [>] with editable timespan */}
      <GoalDayTracker
        currentDay={stats.currentDay}
        totalDays={stats.totalChallengeDays || DEFAULT_CHALLENGE_DAYS}
        onPrevDay={handlePrevDay}
        onNextDay={handleNextDay}
        onOpenChallengeModal={() => setIsChallengeModalOpen(true)}
      />

      {/* 3. Filter Strip & Add Button [TO-DOS 8 | DONE 0 | SKIPPED 1 | +] */}
      <GoalFilterStrip
        activeStatus={activeFilter}
        onSelectStatus={setActiveFilter}
        counts={counts}
        onOpenAdd={() => setIsAddOpen(true)}
      />

      {/* 4. Goal Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {displayedGoals.length === 0 ? (
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
                ? "You've crushed all your daily habits for today! Time to level up."
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
            {/* If all goals are completed in the TO-DOS view, show a sleek congratulatory banner */}
            {activeFilter === 'todo' && pendingGoals.length === 0 && completedGoals.length > 0 && (
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
                  {completedGoals.length}/{completedGoals.length} DONE
                </span>
              </div>
            )}

            {/* Pending Goals (if on todo tab) or all non-done items */}
            {(activeFilter === 'todo' ? pendingGoals : displayedGoals.filter(g => g.status !== 'done')).map(goal => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onToggleComplete={handleToggleComplete}
                onDeleteGoal={handleDeleteGoal}
                onIncrementProgress={handleIncrementProgress}
              />
            ))}

            {/* Completed Section Divider when in TO-DOS tab with both pending & completed items */}
            {activeFilter === 'todo' && pendingGoals.length > 0 && completedGoals.length > 0 && (
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
                  Completed ({completedGoals.length})
                </span>
                <span style={{ height: '1px', flex: 1, background: '#1e202c' }} />
              </div>
            )}

            {/* Completed Goals at the bottom */}
            {(activeFilter === 'todo' || activeFilter === 'done' ? completedGoals : []).map(goal => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onToggleComplete={handleToggleComplete}
                onDeleteGoal={handleDeleteGoal}
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
    </div>
  );
};
