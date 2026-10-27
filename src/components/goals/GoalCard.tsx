import React from 'react';
import { Check, Repeat, Flame, Sparkles } from 'lucide-react';
import type { GoalItem } from '../../types/goals';
import { sound } from '../../utils/audio';

interface GoalCardProps {
  goal: GoalItem;
  isDone?: boolean;
  currentMetric?: number;
  isEditable?: boolean;
  onToggleComplete: (id: string) => void;
  onDeleteGoal?: (id: string) => void;
  onIncrementProgress?: (id: string) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  isDone: customIsDone,
  currentMetric: customMetric,
  isEditable = true,
  onToggleComplete,
  onIncrementProgress
}) => {
  const isDone = customIsDone !== undefined ? customIsDone : goal.status === 'done';
  const displayMetric = customMetric !== undefined ? customMetric : goal.currentMetric;

  return (
    <div
      style={{
        position: 'relative',
        margin: '0 1rem 0.75rem',
        borderRadius: '6px',
        border: isDone ? '1px solid #161822' : '1px solid #1e202c',
        background: isDone ? '#0c0d12' : 'linear-gradient(90deg, #101218 0%, #13141f 65%, #1a1518 100%)',
        padding: '1rem 1.15rem',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: isDone ? 'none' : '0 4px 16px rgba(0,0,0,0.4)',
        opacity: isDone ? 0.6 : 1,
        transition: 'all 0.3s ease'
      }}
    >
      {/* Top Row: Badge & Checkbox */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '0.25rem'
      }}>
        {/* Left Badge: Streak or Improv */}
        {goal.isImprov ? (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            background: 'rgba(255, 85, 0, 0.12)',
            border: '1px solid rgba(255, 85, 0, 0.4)',
            borderRadius: '4px',
            padding: '2px 8px',
            fontSize: '0.72rem',
            fontWeight: 900,
            color: '#ff5500',
            letterSpacing: '0.04em'
          }}>
            <Sparkles size={11} color="#ff5500" strokeWidth={2.4} />
            <span>Improv</span>
          </div>
        ) : (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(255, 85, 0, 0.12)',
            border: '1px solid rgba(255, 85, 0, 0.4)',
            borderRadius: '4px',
            padding: '2px 8px',
            fontSize: '0.72rem',
            fontWeight: 900,
            color: '#ff5500',
            letterSpacing: '0.02em'
          }}>
            <span role="img" aria-label="flame" style={{ fontSize: '0.75rem' }}>🔥</span>
            <span>{goal.streakDays}d</span>
          </div>
        )}

        {/* Right Checkbox Button */}
        <button
          onClick={() => {
            if (!isEditable) return; // Do not edit after cutoff
            if (isDone) {
              sound.playPop();
            } else {
              sound.playVictoryFanfare();
            }
            onToggleComplete(goal.id);
          }}
          disabled={!isEditable}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '4px',
            border: isDone ? 'none' : '1px solid #282b3d',
            background: isDone ? '#ff5500' : '#14151f',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isEditable ? 'pointer' : 'default',
            padding: 0,
            boxShadow: isDone ? '0 0 12px rgba(255, 85, 0, 0.5)' : 'none',
            transition: 'all var(--transition-fast)',
            opacity: isEditable ? 1 : 0.65
          }}
          aria-label={isDone ? 'Completed' : 'To-do'}
          title={isDone ? 'Completed' : isEditable ? 'Click to complete' : 'Past task'}
        >
          <Check size={18} strokeWidth={2.6} color={isDone ? '#ffffff' : '#64748b'} />
        </button>
      </div>

      {/* Goal Title */}
      <h3 style={{
        fontFamily: "var(--font-heading), 'Outfit', sans-serif",
        fontSize: '1.2rem',
        fontWeight: 900,
        color: isDone ? '#64748b' : '#ffffff',
        letterSpacing: '-0.01em',
        margin: '0.35rem 0 0.65rem',
        lineHeight: 1.25,
        textDecoration: isDone ? 'line-through solid #ff5500 2.5px' : 'none',
        textDecorationLine: isDone ? 'line-through' : 'none',
        textDecorationColor: '#ff5500',
        textDecorationThickness: '2.5px',
        opacity: isDone ? 0.75 : 1,
        transition: 'all var(--transition-fast)'
      }}>
        {goal.title}
      </h3>

      {/* Metadata Row: 🔄 Frequency | Difficulty | Progress */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.76rem',
        fontWeight: 700,
        color: '#94a3b8'
      }}>
        {/* Frequency */}
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#cbd5e1' }}>
          <Repeat size={12} color="#8b949e" strokeWidth={2.4} />
          <span>{goal.frequency}</span>
        </span>

        <span style={{ color: '#33374a' }}>|</span>

        {/* Difficulty */}
        {goal.difficulty === 'Focus' ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: '#ff5500', fontWeight: 800 }}>
            <Flame size={12} color="#ff5500" fill="#ff5500" />
            <span>Focus</span>
          </span>
        ) : (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#cbd5e1' }}>
            {/* Visual Difficulty Indicator: colored mini-bars */}
            <span style={{ display: 'inline-flex', gap: '2px', alignItems: 'flex-end', height: '11px' }}>
              <span style={{ width: '3px', height: '6px', background: '#22c55e', borderRadius: '1px' }} />
              <span style={{ width: '3px', height: '9px', background: '#3b82f6', borderRadius: '1px' }} />
              <span style={{ width: '3px', height: '12px', background: '#3b82f6', borderRadius: '1px' }} />
            </span>
            <span>{goal.difficulty}</span>
          </span>
        )}

        <span style={{ color: '#33374a' }}>|</span>

        {/* Progress Metric */}
        <button
          onClick={() => {
            if (!isEditable) return; // Do not edit after cutoff
            if (onIncrementProgress) {
              sound.playPop();
              onIncrementProgress(goal.id);
            }
          }}
          disabled={!isEditable}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            color: isDone ? '#64748b' : '#ffffff',
            fontSize: '0.78rem',
            fontWeight: 900,
            cursor: isEditable ? 'pointer' : 'default',
            letterSpacing: '0.02em',
            opacity: isEditable ? 1 : 0.7
          }}
          title={isEditable ? 'Click to increment progress' : 'Progress'}
        >
          {displayMetric} / {goal.targetMetric}{goal.unit}
        </button>
      </div>
    </div>
  );
};
