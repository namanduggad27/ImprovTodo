import React from 'react';
import { ChevronLeft, ChevronRight, Edit3, Calendar as CalendarIcon, RotateCcw } from 'lucide-react';
import { sound } from '../../utils/audio';
import { formatChallengeDate } from '../../types/goals';

interface GoalDayTrackerProps {
  currentDay: number;
  totalDays: number;
  todayDay?: number;
  dateStr?: string;
  isSeriesActive?: boolean;
  onPrevDay: () => void;
  onNextDay: () => void;
  onJumpToToday?: () => void;
  onOpenChallengeModal?: () => void;
  onResetSeries?: () => void;
}

export const GoalDayTracker: React.FC<GoalDayTrackerProps> = ({
  currentDay,
  totalDays,
  todayDay,
  dateStr,
  isSeriesActive = true,
  onPrevDay,
  onNextDay,
  onJumpToToday,
  onOpenChallengeModal,
  onResetSeries
}) => {
  const displayTotal = totalDays > 0 ? totalDays : 66;
  const isNotToday = todayDay !== undefined && currentDay !== todayDay;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.4rem 1rem 0.85rem',
      userSelect: 'none'
    }}>
      {/* Heavy Headline: DAY X / 66 + Date Subtitle */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <h1 style={{
            fontFamily: "var(--font-heading), 'Outfit', -apple-system, sans-serif",
            fontSize: '2.1rem',
            fontWeight: 900,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            color: '#ffffff',
            margin: 0
          }}>
            DAY {isSeriesActive ? currentDay : 1}
          </h1>

          {!isSeriesActive ? (
            <span style={{
              fontSize: '0.65rem',
              fontWeight: 900,
              letterSpacing: '0.06em',
              background: 'rgba(255, 85, 0, 0.15)',
              border: '1px solid rgba(255, 85, 0, 0.4)',
              color: '#ff5500',
              padding: '2px 6px',
              borderRadius: '4px',
              textTransform: 'uppercase'
            }}>
              SETUP
            </span>
          ) : null}

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

        {/* Calendar Date Subline or Setup indicator */}
        <span style={{
          fontSize: '0.72rem',
          fontWeight: 800,
          color: isSeriesActive ? '#ff5500' : '#94a3b8',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          marginTop: '3px'
        }}>
          {isSeriesActive ? (dateStr ? formatChallengeDate(dateStr) : '') : 'Pre-Challenge • Day 1 Configuration'}
        </span>
      </div>

      {/* Segmented Day Controls & Reset Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {/* Reset Button (Only visible when series is active) */}
        {isSeriesActive && onResetSeries && (
          <button
            onClick={() => {
              sound.playPop();
              onResetSeries();
            }}
            title="Reset ongoing challenge series back to Day 1 setup"
            style={{
              height: '36px',
              padding: '0 0.65rem',
              borderRadius: '4px',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#ef4444',
              fontSize: '0.72rem',
              fontWeight: 900,
              letterSpacing: '0.04em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              marginRight: '2px'
            }}
          >
            <RotateCcw size={12} strokeWidth={2.4} />
            <span>RESET</span>
          </button>
        )}

        {isSeriesActive && isNotToday && onJumpToToday && (
          <button
            onClick={() => {
              sound.playPop();
              onJumpToToday();
            }}
            style={{
              height: '36px',
              padding: '0 0.65rem',
              borderRadius: '4px',
              background: 'rgba(255, 85, 0, 0.12)',
              border: '1px solid rgba(255, 85, 0, 0.4)',
              color: '#ff5500',
              fontSize: '0.7rem',
              fontWeight: 900,
              letterSpacing: '0.04em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
            title="Jump back to today"
          >
            <CalendarIcon size={12} /> TODAY
          </button>
        )}

        <button
          onClick={() => {
            sound.playPop();
            onPrevDay();
          }}
          disabled={!isSeriesActive || currentDay <= 1}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '4px',
            background: '#14151f',
            border: '1px solid #222434',
            color: (!isSeriesActive || currentDay <= 1) ? '#475569' : '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: (!isSeriesActive || currentDay <= 1) ? 'not-allowed' : 'pointer',
            padding: 0,
            transition: 'all var(--transition-fast)',
            opacity: !isSeriesActive ? 0.4 : 1
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
          disabled={!isSeriesActive || currentDay >= displayTotal}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '4px',
            background: '#14151f',
            border: '1px solid #222434',
            color: (!isSeriesActive || currentDay >= displayTotal) ? '#475569' : '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: (!isSeriesActive || currentDay >= displayTotal) ? 'not-allowed' : 'pointer',
            padding: 0,
            transition: 'all var(--transition-fast)',
            opacity: !isSeriesActive ? 0.4 : 1
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
