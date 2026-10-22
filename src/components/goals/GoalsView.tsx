import React, { useState, useEffect } from 'react';
import type { GoalItem, GoalChallengeStats, GoalStatus } from '../../types/goals';
import { INITIAL_GOAL_ITEMS, DEFAULT_GOAL_STATS } from '../../types/goals';
import { GoalStatsHeader } from './GoalStatsHeader';
import { GoalDayTracker } from './GoalDayTracker';
import { GoalFilterStrip } from './GoalFilterStrip';
import { GoalCard } from './GoalCard';
import { GoalEditorModal } from './GoalEditorModal';
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
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((g: any) => g.id));
          const missingInitials = INITIAL_GOAL_ITEMS.filter(init => !existingIds.has(init.id));
          return [...parsed, ...missingInitials];
        }
      } catch (e) { console.error(e); }
    }
    return INITIAL_GOAL_ITEMS;
  });

  // Gamification & challenge stats with persistence
  const [stats, setStats] = useState<GoalChallengeStats>(() => {
    const saved = localStorage.getItem('improv_goal_stats');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEFAULT_GOAL_STATS;
  });

  // Filter: 'todo' | 'done' | 'skipped'
  const [activeFilter, setActiveFilter] = useState<GoalStatus>('todo');
  const [isAddOpen, setIsAddOpen] = useState(false);

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
    if (stats.currentDay < stats.totalChallengeDays) {
      setStats(prev => ({ ...prev, currentDay: prev.currentDay + 1 }));
    }
  };

  // Toggle goal completion
  const handleToggleComplete = (id: string) => {
    setGoals(prev => prev.map(g => {
      if (g.id !== id) return g;
      const willBeDone = g.status !== 'done';
      return {
        ...g,
        status: willBeDone ? 'done' : 'todo',
        currentMetric: willBeDone ? g.targetMetric : 0,
        streakDays: willBeDone ? g.streakDays + 1 : Math.max(1, g.streakDays - 1)
      };
    }));

    // Grant XP and check streaks
    setStats(prev => {
      const targetGoal = goals.find(g => g.id === id);
      const isFinishing = targetGoal && targetGoal.status !== 'done';
      const xpGained = isFinishing ? 50 : -50;
      return {
        ...prev,
        xpPoints: Math.max(0, prev.xpPoints + xpGained),
        globalStreak: isFinishing ? prev.globalStreak : prev.globalStreak
      };
    });
  };

  // Increment numeric progress on click (e.g. +1L or +0.5hrs)
  const handleIncrementProgress = (id: string) => {
    setGoals(prev => prev.map(g => {
      if (g.id !== id) return g;
      const step = g.targetMetric > 10 ? 1 : g.targetMetric > 1 ? 0.5 : 0.2;
      const nextVal = Math.min(g.targetMetric, Math.round((g.currentMetric + step) * 10) / 10);
      const isComplete = nextVal >= g.targetMetric;
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
    // Reward XP for creating goals
    setStats(prev => ({ ...prev, xpPoints: prev.xpPoints + 25 }));
  };

  // Counts
  const counts = {
    todo: goals.filter(g => g.status === 'todo').length,
    done: goals.filter(g => g.status === 'done').length,
    skipped: goals.filter(g => g.status === 'skipped').length
  };

  const displayedGoals = goals.filter(g => g.status === activeFilter);

  return (
    <div className="animate-fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      minHeight: '100vh',
      background: 'hsl(210, 20%, 97%)',
      paddingBottom: 'calc(var(--bottom-nav-height) + 1rem)'
    }}>
      {/* 1. Top Gamification Stats Pill Bar */}
      <GoalStatsHeader stats={stats} onOpenSettings={onOpenSettings} />

      {/* 2. Heavy 66-Day Challenge Navigator */}
      <GoalDayTracker
        currentDay={stats.currentDay}
        totalDays={stats.totalChallengeDays}
        onPrevDay={handlePrevDay}
        onNextDay={handleNextDay}
      />

      {/* 3. Neo-Brutalist Filter Strip & Add Button */}
      <GoalFilterStrip
        activeStatus={activeFilter}
        onSelectStatus={setActiveFilter}
        counts={counts}
        onOpenAdd={() => setIsAddOpen(true)}
      />

      {/* 4. Cinematic Anime Task Cards */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {displayedGoals.length === 0 ? (
          <div style={{
            margin: '1.5rem 1rem',
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            background: '#ffffff',
            borderRadius: '14px',
            border: '1.5px solid #1a1a1a',
            boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
          }}>
            <Sparkles size={36} color="#ea580c" style={{ margin: '0 auto 0.75rem', opacity: 0.8 }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#18181b' }}>
              No {activeFilter} goals found
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#71717a', margin: '0 0 1.25rem' }}>
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
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                border: 'none',
                background: '#121212',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Plus size={16} /> Add New Habit Goal
            </button>
          </div>
        ) : (
          displayedGoals.map(goal => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onToggleComplete={handleToggleComplete}
              onDeleteGoal={handleDeleteGoal}
              onIncrementProgress={handleIncrementProgress}
            />
          ))
        )}
      </div>

      {/* 5. Create Goal Modal */}
      <GoalEditorModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSaveGoal={handleSaveGoal}
      />
    </div>
  );
};
