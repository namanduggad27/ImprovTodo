import React from 'react';
import { Sparkles, Settings } from 'lucide-react';
import { CircularProgress } from './CircularProgress';

interface HeaderProps {
  completedCount: number;
  totalCount: number;
  onOpenSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ completedCount, totalCount, onOpenSettings }) => {
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isComplete = totalCount > 0 && completedCount === totalCount;

  return (
    <header className="header-container animate-fade-in" style={{
      padding: 'max(env(safe-area-inset-top, 48px), 48px) 1rem 1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid var(--border-color)',
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: 'var(--radius-sm)',
          background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px var(--accent-primary-glow)'
        }}>
          <Sparkles size={22} color="white" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.4rem', margin: 0, lineHeight: 1.1 }}>ImprovTodo</h1>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', fontWeight: 600, letterSpacing: '0.05em' }}>
            MOBILE STUDIO
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        
        {/* New Circular Progress Indicator */}
        <CircularProgress 
          percentage={percentage}
          completedCount={completedCount}
          totalCount={totalCount}
        />

        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              flexShrink: 0
            }}
            title="Modular App Settings"
            aria-label="Open Settings"
          >
            <Settings size={18} />
          </button>
        )}
      </div>

      {/* Ambient Horizontal Progress Bar at the very bottom edge of Header */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: 'transparent',
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          width: `${percentage}%`,
          background: isComplete ? 'hsl(165, 70%, 42%)' : 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))',
          transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1), background 0.4s ease',
          boxShadow: isComplete ? '0 0 8px hsl(165, 70%, 42%)' : 'none'
        }} />
      </div>
    </header>
  );
};
