import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { sound } from '../../utils/audio';

interface GoalDayTrackerProps {
  currentDay: number;
  totalDays: number;
  onPrevDay: () => void;
  onNextDay: () => void;
}

export const GoalDayTracker: React.FC<GoalDayTrackerProps> = ({
  currentDay,
  totalDays,
  onPrevDay,
  onNextDay
}) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.4rem 1rem 0.75rem',
      userSelect: 'none'
    }}>
      {/* Heavy Headline: DAY 53 / 66 */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
        <h1 style={{
          fontFamily: "var(--font-heading), 'Outfit', -apple-system, sans-serif",
          fontSize: '2.2rem',
          fontWeight: 900,
          letterSpacing: '-0.04em',
          lineHeight: 1,
          color: '#121212',
          margin: 0
        }}>
          DAY {currentDay}
        </h1>
        <span style={{
          fontSize: '1.25rem',
          fontWeight: 600,
          color: '#71717a',
          letterSpacing: '-0.02em'
        }}>
          /{totalDays}
        </span>
      </div>

      {/* Segmented Day Navigator [< | >] */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        border: '1.5px solid #1a1a1a',
        borderRadius: '6px',
        background: '#ffffff',
        overflow: 'hidden',
        height: '34px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
      }}>
        <button
          onClick={() => {
            sound.playPop();
            onPrevDay();
          }}
          disabled={currentDay <= 1}
          style={{
            width: '34px',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            borderRight: '1.5px solid #1a1a1a',
            color: currentDay <= 1 ? '#a1a1aa' : '#121212',
            cursor: currentDay <= 1 ? 'not-allowed' : 'pointer',
            padding: 0,
            transition: 'background var(--transition-fast)'
          }}
          aria-label="Previous Day"
          title="Previous Day"
        >
          <ChevronLeft size={18} strokeWidth={2.5} />
        </button>

        <button
          onClick={() => {
            sound.playPop();
            onNextDay();
          }}
          disabled={currentDay >= totalDays}
          style={{
            width: '34px',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            color: currentDay >= totalDays ? '#a1a1aa' : '#121212',
            cursor: currentDay >= totalDays ? 'not-allowed' : 'pointer',
            padding: 0,
            transition: 'background var(--transition-fast)'
          }}
          aria-label="Next Day"
          title="Next Day"
        >
          <ChevronRight size={18} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};
