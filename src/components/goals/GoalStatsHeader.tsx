import React from 'react';
import { Settings } from 'lucide-react';
import type { GoalChallengeStats } from '../../types/goals';
import { sound } from '../../utils/audio';

interface GoalStatsHeaderProps {
  stats: GoalChallengeStats;
  onOpenSettings: () => void;
}

export const GoalStatsHeader: React.FC<GoalStatsHeaderProps> = ({ stats, onOpenSettings }) => {
  return (
    <header style={{
      padding: 'max(env(safe-area-inset-top, 44px), 44px) 1rem 0.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%'
    }}>
      {/* Gamification Stats Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Streak Pill [🔥 53] */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: '#14151f',
          border: '1px solid rgba(255, 85, 0, 0.45)',
          borderRadius: '4px',
          padding: '0.35rem 0.75rem',
          fontSize: '0.85rem',
          fontWeight: 900,
          color: '#ff5500',
          boxShadow: '0 2px 8px rgba(255, 85, 0, 0.15)'
        }}>
          <span style={{ fontSize: '0.95rem' }} role="img" aria-label="streak">🔥</span>
          <span style={{ color: '#ff5500', letterSpacing: '0.02em' }}>{stats.globalStreak}</span>
        </div>

        {/* Trophies Pill [🏆 4] */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: '#14151f',
          border: '1px solid #222434',
          borderRadius: '4px',
          padding: '0.35rem 0.75rem',
          fontSize: '0.85rem',
          fontWeight: 900,
          color: '#ffffff'
        }}>
          <span style={{ fontSize: '0.95rem' }} role="img" aria-label="trophies">🏆</span>
          <span>{stats.trophies}</span>
        </div>

        {/* XP Points Pill [+ 4,975] */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          background: '#14151f',
          border: '1px solid #222434',
          borderRadius: '4px',
          padding: '0.35rem 0.75rem',
          fontSize: '0.85rem',
          fontWeight: 900,
          color: '#ffffff'
        }}>
          <span style={{ color: '#ff5500', fontWeight: 900 }}>+</span>
          <span>{stats.xpPoints.toLocaleString()}</span>
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
