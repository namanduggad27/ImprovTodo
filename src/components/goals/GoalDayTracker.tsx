import React from 'react';
import { ChevronLeft, ChevronRight, Edit3 } from 'lucide-react';
import { sound } from '../../utils/audio';

interface GoalDayTrackerProps {
  currentDay: number;
  totalDays: number;
  onPrevDay: () => void;
  onNextDay: () => void;
  onOpenChallengeModal?: () => void;
}

export const GoalDayTracker: React.FC<GoalDayTrackerProps> = ({
  currentDay,
  totalDays,
  onPrevDay,
  onNextDay,
  onOpenChallengeModal
}) => {
  const displayTotal = totalDays > 0 ? totalDays : 66;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.4rem 1rem 0.85rem',
      userSelect: 'none'
    }}>
      {/* Heavy Headline: DAY 53 / 66 */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
        <h1 style={{
          fontFamily: "var(--font-heading), 'Outfit', -apple-system, sans-serif",
          fontSize: '2.1rem',
          fontWeight: 900,
          letterSpacing: '-0.02em',
          lineHeight: 1,
          color: '#ffffff',
          margin: 0
        }}>
          DAY {currentDay}
        </h1>

        <button
          onClick={() => {
            sound.playPop();
            if (onOpenChallengeModal) onOpenChallengeModal();
          }}
          title="Click to change challenge timespan (Default: 66 days)"
          style={{
            background: 'none',
            border: 'none',
            padding: '2px 4px',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'baseline',
            gap: '4px',
            transition: 'background var(--transition-fast)'
          }}
        >
          <span style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#64748b',
            letterSpacing: '-0.01em'
          }}>
            / {displayTotal}
          </span>
          <Edit3 size={11} color="#64748b" style={{ opacity: 0.7 }} />
        </button>
      </div>

      {/* Segmented Day Navigator [<] [>] */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button
          onClick={() => {
            sound.playPop();
            onPrevDay();
          }}
          disabled={currentDay <= 1}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '4px',
            background: '#14151f',
            border: '1px solid #222434',
            color: currentDay <= 1 ? '#475569' : '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: currentDay <= 1 ? 'not-allowed' : 'pointer',
            padding: 0,
            transition: 'all var(--transition-fast)'
          }}
          aria-label="Previous Day"
          title="Previous Day"
        >
          <ChevronLeft size={18} strokeWidth={2.4} />
        </button>

        <button
          onClick={() => {
            sound.playPop();
            onNextDay();
          }}
          disabled={currentDay >= displayTotal}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '4px',
            background: '#14151f',
            border: '1px solid #222434',
            color: currentDay >= displayTotal ? '#475569' : '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: currentDay >= displayTotal ? 'not-allowed' : 'pointer',
            padding: 0,
            transition: 'all var(--transition-fast)'
          }}
          aria-label="Next Day"
          title="Next Day"
        >
          <ChevronRight size={18} strokeWidth={2.4} />
        </button>
      </div>
    </div>
  );
};
