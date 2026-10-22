import React from 'react';
import type { Todo } from '../types/todo';
import { Trophy, CheckCircle2, Sparkles, Zap, Flame, Target } from 'lucide-react';

interface ProgressProps {
  todos: Todo[];
}

export const Progress: React.FC<ProgressProps> = ({ todos }) => {
  const totalCount = todos.length;
  const completedCount = todos.filter(t => t.completed).length;
  const improvWins = todos.filter(t => t.isImprovPrompt && t.completed).length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      width: '100%'
    }}>
      {/* Header Banner */}
      <div style={{
        background: '#111218',
        border: '1px solid #1e202c',
        borderRadius: '6px',
        padding: '1.75rem 1.5rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
      }}>
        {/* Subtle orange accent glow behind */}
        <div style={{
          position: 'absolute',
          top: '-30px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '120px',
          height: '60px',
          background: 'rgba(255, 85, 0, 0.15)',
          filter: 'blur(25px)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

        <div style={{
          width: '54px',
          height: '54px',
          margin: '0 auto 0.75rem',
          borderRadius: '6px',
          background: 'rgba(255, 85, 0, 0.12)',
          border: '1px solid rgba(255, 85, 0, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Trophy size={28} color="#ff5500" strokeWidth={2.4} />
        </div>

        <h2 style={{
          fontFamily: "var(--font-heading), 'Outfit', sans-serif",
          fontSize: '2.5rem',
          fontWeight: 900,
          color: '#ffffff',
          letterSpacing: '0.02em',
          margin: 0,
          lineHeight: 1
        }}>
          {completionRate}<span style={{ color: '#ff5500', fontSize: '1.6rem' }}>%</span>
        </h2>

        <span style={{
          color: '#8b949e',
          fontSize: '0.74rem',
          fontWeight: 800,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          display: 'block',
          marginTop: '0.5rem'
        }}>
          Overall Completion Rate
        </span>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '0.75rem'
      }}>
        {/* Completed Tasks */}
        <div style={{
          background: '#111218',
          border: '1px solid #1e202c',
          borderRadius: '6px',
          padding: '1.25rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '4px',
            background: 'rgba(34, 197, 94, 0.12)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.5rem'
          }}>
            <CheckCircle2 size={18} color="#22c55e" strokeWidth={2.4} />
          </div>
          <h3 style={{
            fontFamily: "var(--font-heading), 'Outfit', sans-serif",
            fontSize: '1.6rem',
            fontWeight: 900,
            color: '#ffffff',
            margin: 0,
            lineHeight: 1
          }}>
            {completedCount}
          </h3>
          <span style={{
            color: '#8b949e',
            fontSize: '0.68rem',
            fontWeight: 800,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginTop: '0.35rem'
          }}>
            Tasks Done
          </span>
        </div>

        {/* Improv Wins */}
        <div style={{
          background: '#111218',
          border: '1px solid #1e202c',
          borderRadius: '6px',
          padding: '1.25rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '4px',
            background: 'rgba(168, 85, 247, 0.12)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.5rem'
          }}>
            <Sparkles size={18} color="#a855f7" strokeWidth={2.4} />
          </div>
          <h3 style={{
            fontFamily: "var(--font-heading), 'Outfit', sans-serif",
            fontSize: '1.6rem',
            fontWeight: 900,
            color: '#ffffff',
            margin: 0,
            lineHeight: 1
          }}>
            {improvWins}
          </h3>
          <span style={{
            color: '#8b949e',
            fontSize: '0.68rem',
            fontWeight: 800,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginTop: '0.35rem'
          }}>
            Improvs Won
          </span>
        </div>

        {/* Remaining Tasks */}
        <div style={{
          background: '#111218',
          border: '1px solid #1e202c',
          borderRadius: '6px',
          padding: '1.25rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '4px',
            background: 'rgba(255, 85, 0, 0.12)',
            border: '1px solid rgba(255, 85, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.5rem'
          }}>
            <Target size={18} color="#ff5500" strokeWidth={2.4} />
          </div>
          <h3 style={{
            fontFamily: "var(--font-heading), 'Outfit', sans-serif",
            fontSize: '1.6rem',
            fontWeight: 900,
            color: '#ffffff',
            margin: 0,
            lineHeight: 1
          }}>
            {totalCount - completedCount}
          </h3>
          <span style={{
            color: '#8b949e',
            fontSize: '0.68rem',
            fontWeight: 800,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginTop: '0.35rem'
          }}>
            In Progress
          </span>
        </div>

        {/* Streak Rate */}
        <div style={{
          background: '#111218',
          border: '1px solid #1e202c',
          borderRadius: '6px',
          padding: '1.25rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '4px',
            background: 'rgba(234, 88, 12, 0.12)',
            border: '1px solid rgba(234, 88, 12, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.5rem'
          }}>
            <Flame size={18} color="#ea580c" strokeWidth={2.4} />
          </div>
          <h3 style={{
            fontFamily: "var(--font-heading), 'Outfit', sans-serif",
            fontSize: '1.6rem',
            fontWeight: 900,
            color: '#ffffff',
            margin: 0,
            lineHeight: 1
          }}>
            {completedCount > 0 ? '1.5X' : '1.0X'}
          </h3>
          <span style={{
            color: '#8b949e',
            fontSize: '0.68rem',
            fontWeight: 800,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginTop: '0.35rem'
          }}>
            Multiplier
          </span>
        </div>
      </div>

      {/* Pro Tips Box */}
      <div style={{
        background: '#111218',
        border: '1px solid #1e202c',
        borderRadius: '6px',
        padding: '1.25rem',
        textAlign: 'left'
      }}>
        <h4 style={{
          fontFamily: "var(--font-heading), 'Outfit', sans-serif",
          fontSize: '0.88rem',
          fontWeight: 900,
          color: '#ffffff',
          letterSpacing: '0.04em',
          margin: '0 0 0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          textTransform: 'uppercase'
        }}>
          <Zap size={15} color="#ff5500" /> Modular Studio Tips
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', color: '#94a3b8', fontSize: '0.8rem', lineHeight: 1.5 }}>
          <div>
            <strong style={{ color: '#e2e8f0' }}>Customize Your Workspace:</strong> Click the gear icon in the top right header at any time to toggle features like Improv Studio, Quick Notes, or Recurring Loops!
          </div>
          <div>
            <strong style={{ color: '#e2e8f0' }}>Touch Swiping:</strong> Swipe any task right to mark complete or left to delete!
          </div>
          <div>
            <strong style={{ color: '#e2e8f0' }}>Habit Loop Multiplier:</strong> Complete all daily tasks to keep your 1.5X loop bonus active!
          </div>
        </div>
      </div>
    </div>
  );
};
