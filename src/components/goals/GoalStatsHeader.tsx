import React from 'react';
import { Settings } from 'lucide-react';
import type { GoalChallengeStats } from '../../types/goals';
import { sound } from '../../utils/audio';

interface GoalStatsHeaderProps {
  stats: GoalChallengeStats;
  onOpenSettings: () => void;
}

export const GoalStatsHeader: React.FC<GoalStatsHeaderProps> = ({ stats, onOpenSettings }) => {
  const hasStreak = stats.globalStreak > 0;
  const hasTrophies = stats.trophies > 0;
  const hasXP = stats.xpPoints > 0;

  return (
    <header style={{
      padding: 'max(env(safe-area-inset-top, 1rem), 1rem) 1rem 0.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%'
    }}>
      {/* Gamification Stats Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Streak Pill [🔥 53] */}
        <div
          title={`Active Habit Streak: ${stats.globalStreak} day${stats.globalStreak === 1 ? '' : 's'}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: '#14151f',
            border: hasStreak ? '1px solid rgba(255, 85, 0, 0.45)' : '1px solid #222434',
            borderRadius: '4px',
            padding: '0.35rem 0.75rem',
            fontSize: '0.85rem',
            fontWeight: 900,
            color: hasStreak ? '#ff5500' : '#64748b',
            boxShadow: hasStreak ? '0 2px 10px rgba(255, 85, 0, 0.2)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <span style={{ fontSize: '0.95rem', opacity: hasStreak ? 1 : 0.45 }} role="img" aria-label="streak">🔥</span>
          <span style={{ letterSpacing: '0.02em' }}>{stats.globalStreak}</span>
        </div>

        {/* Trophies Pill [🏆 4] */}
        <div
          title={`Milestone Trophies: ${stats.trophies}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: '#14151f',
            border: hasTrophies ? '1px solid rgba(234, 179, 8, 0.4)' : '1px solid #222434',
            borderRadius: '4px',
            padding: '0.35rem 0.75rem',
            fontSize: '0.85rem',
            fontWeight: 900,
            color: hasTrophies ? '#facc15' : '#64748b',
            boxShadow: hasTrophies ? '0 2px 10px rgba(234, 179, 8, 0.15)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <span style={{ fontSize: '0.95rem', opacity: hasTrophies ? 1 : 0.45 }} role="img" aria-label="trophies">🏆</span>
          <span>{stats.trophies}</span>
        </div>

        {/* XP Points Pill [+ 4,975] */}
        <div
          title={`Total Challenge XP: ${stats.xpPoints.toLocaleString()}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: '#14151f',
            border: hasXP ? '1px solid rgba(255, 85, 0, 0.35)' : '1px solid #222434',
            borderRadius: '4px',
            padding: '0.35rem 0.75rem',
            fontSize: '0.85rem',
            fontWeight: 900,
            color: '#ffffff',
            boxShadow: hasXP ? '0 2px 8px rgba(0,0,0,0.3)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <span style={{ color: hasXP ? '#ff5500' : '#64748b', fontWeight: 900 }}>+</span>
          <span style={{ color: hasXP ? '#ffffff' : '#64748b' }}>{stats.xpPoints.toLocaleString()}</span>
        </div>
      </div>

      {/* Settings Button [⚙️] */}
      <button
        onClick={() => {
          sound.playPop();
          onOpenSettings();
        }}
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '4px',
          border: '1px solid #222434',
          background: '#14151f',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#94a3b8',
          transition: 'transform var(--transition-fast)'
        }}
        aria-label="Open Settings"
        title="Settings"
      >
        <Settings size={18} />
      </button>
    </header>
  );
};
