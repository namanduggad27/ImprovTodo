import React from 'react';
import { Settings, Sparkles } from 'lucide-react';
import type { GoalChallengeStats } from '../../types/goals';
import { sound } from '../../utils/audio';

interface GoalStatsHeaderProps {
  stats: GoalChallengeStats;
  onOpenSettings: () => void;
}

export const GoalStatsHeader: React.FC<GoalStatsHeaderProps> = ({ stats, onOpenSettings }) => {
  return (
    <header style={{
      padding: 'max(env(safe-area-inset-top, 44px), 44px) 1rem 0.4rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%'
    }}>
      {/* Gamification Stats Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Streak Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          background: '#f3efe6',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          borderRadius: '100px',
          padding: '0.35rem 0.75rem',
          fontSize: '0.88rem',
          fontWeight: 800,
          color: '#1a1a1a',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
        }}>
          <span style={{ fontSize: '1rem' }} role="img" aria-label="streak">🔥</span>
          <span>{stats.globalStreak}</span>
        </div>

        {/* Trophies Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          background: '#f3efe6',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          borderRadius: '100px',
          padding: '0.35rem 0.75rem',
          fontSize: '0.88rem',
          fontWeight: 800,
          color: '#1a1a1a',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
        }}>
          <span style={{ fontSize: '1rem' }} role="img" aria-label="trophies">🏆</span>
          <span>{stats.trophies}</span>
        </div>

        {/* XP Points Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          background: '#f3efe6',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          borderRadius: '100px',
          padding: '0.35rem 0.75rem',
          fontSize: '0.88rem',
          fontWeight: 800,
          color: '#1a1a1a',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
        }}>
          <Sparkles size={15} color="#ea580c" />
          <span>{stats.xpPoints.toLocaleString()}</span>
        </div>
      </div>

      {/* Settings Button */}
      <button
        onClick={() => {
          sound.playPop();
          onOpenSettings();
        }}
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          border: '1.5px solid #d4cebe',
          background: '#f3efe6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#1a1a1a',
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
