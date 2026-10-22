import React from 'react';
import { Check, Repeat, Signal, Trash2 } from 'lucide-react';
import type { GoalItem } from '../../types/goals';
import { GOAL_BACKDROPS } from '../../data/goalBackdrops';
import { sound } from '../../utils/audio';

interface GoalCardProps {
  goal: GoalItem;
  onToggleComplete: (id: string) => void;
  onDeleteGoal?: (id: string) => void;
  onIncrementProgress?: (id: string) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onToggleComplete,
  onDeleteGoal,
  onIncrementProgress
}) => {
  const isDone = goal.status === 'done';
  const isSkipped = goal.status === 'skipped';

  // Get background image from preset or custom URL
  const backdrop = GOAL_BACKDROPS[goal.bgPreset] || GOAL_BACKDROPS.water;
  const bgImage = goal.bgImageUrl || backdrop.defaultImage;

  return (
    <div
      className="goal-card"
      style={{
        position: 'relative',
        margin: '0 1rem 0.85rem',
        borderRadius: '14px',
        border: '1.5px solid #1a1a20',
        overflow: 'hidden',
        minHeight: '115px',
        boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
        background: '#09090b',
        opacity: isDone ? 0.7 : 1
      }}
    >
      {/* Background Illustration Layer */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url("${bgImage}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center right',
        opacity: 0.85
      }} />

      {/* Dark Vignette Gradient Overlay for Maximum Text Contrast */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(90deg, rgba(9,9,11,0.94) 0%, rgba(9,9,11,0.72) 48%, rgba(9,9,11,0.18) 100%)'
      }} />

      {/* Card Foreground Content */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        padding: '0.9rem 1.15rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.85rem'
      }}>
        {/* Left Column: Details & Metadata */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Streak Badge (🔥 1d) */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px',
            background: 'rgba(0, 0, 0, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            borderRadius: '4px',
            padding: '2px 7px',
            fontSize: '0.72rem',
            fontWeight: 800,
            color: '#ffffff',
            marginBottom: '6px',
            letterSpacing: '0.02em',
            backdropFilter: 'blur(4px)'
          }}>
            <span role="img" aria-label="flame" style={{ fontSize: '0.8rem' }}>🔥</span>
            <span>{goal.streakDays}d</span>
          </div>

          {/* Goal Title */}
          <h3 style={{
            fontFamily: "var(--font-heading), 'Outfit', sans-serif",
            fontSize: '1.25rem',
            fontWeight: 900,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            margin: '0 0 8px',
            lineHeight: 1.15,
            textShadow: '0 2px 8px rgba(0,0,0,0.6)',
            textDecoration: isDone ? 'line-through' : 'none',
            opacity: isDone ? 0.85 : 1
          }}>
            {goal.title}
          </h3>

          {/* Metadata Row: 🔁 Frequency | 📶 Difficulty | Progress */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#e4e4e7',
            flexWrap: 'wrap',
            textShadow: '0 1px 4px rgba(0,0,0,0.8)'
          }}>
            {/* Frequency */}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Repeat size={13} color="#ffffff" strokeWidth={2.4} />
              <span>{goal.frequency}</span>
            </span>

            <span style={{ opacity: 0.4 }}>•</span>

            {/* Difficulty */}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Signal size={13} color="#ffffff" strokeWidth={2.4} />
              <span>{goal.difficulty}</span>
            </span>

            <span style={{ opacity: 0.4 }}>•</span>

            {/* Progress / Metric */}
            <button
              onClick={() => {
                if (onIncrementProgress) {
                  sound.playPop();
                  onIncrementProgress(goal.id);
                }
              }}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '4px',
                padding: '1px 6px',
                color: '#ffffff',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
              title="Click to increment progress"
            >
              {goal.currentMetric} / {goal.targetMetric}{goal.unit}
            </button>
          </div>
        </div>

        {/* Right Column: Checkbox Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {onDeleteGoal && (
            <button
              className="goal-delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                sound.playPop();
                onDeleteGoal(goal.id);
              }}
              style={{
                background: 'rgba(0, 0, 0, 0.45)',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.6)',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '6px',
                transition: 'all var(--transition-fast)'
              }}
              aria-label="Delete goal"
              title="Delete goal"
            >
              <Trash2 size={16} />
            </button>
          )}

          <button
            onClick={() => {
              if (isDone) {
                sound.playPop();
              } else {
                sound.playVictoryFanfare();
              }
              onToggleComplete(goal.id);
            }}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '6px',
              border: isDone ? '1.5px solid #22c55e' : '1.5px solid rgba(255, 255, 255, 0.75)',
              background: isDone ? '#22c55e' : 'rgba(0, 0, 0, 0.35)',
              backdropFilter: 'blur(4px)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
              boxShadow: isDone ? '0 0 12px rgba(34, 197, 94, 0.5)' : 'none',
              transition: 'all var(--transition-fast)'
            }}
            aria-label={isDone ? 'Mark uncompleted' : 'Mark completed'}
            title={isDone ? 'Completed' : 'Click to complete'}
          >
            {isDone ? (
              <Check size={20} strokeWidth={3} />
            ) : isSkipped ? (
              <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>SKIP</span>
            ) : (
              <Check size={18} strokeWidth={2.5} style={{ opacity: 0.4 }} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
