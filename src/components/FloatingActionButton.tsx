import React from 'react';
import { Plus, Sparkles } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
  onImprovClick?: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick, onImprovClick }) => {
  return (
    <div style={{
      position: 'fixed',
      bottom: 'calc(var(--bottom-nav-height) + 1rem)',
      right: '1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      zIndex: 90,
      alignItems: 'flex-end'
    }}>
      {onImprovClick && (
        <button
          onClick={onImprovClick}
          style={{
            width: '46px',
            height: '46px',
            borderRadius: 'var(--radius-full)',
            background: 'linear-gradient(135deg, var(--accent-secondary), var(--accent-primary))',
            color: 'white',
            border: 'none',
            boxShadow: '0 4px 15px var(--accent-secondary-glow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'transform var(--transition-bounce)'
          }}
          aria-label="Open Improv Challenge"
          title="Improv Challenge"
        >
          <Sparkles size={20} className="animate-pulse" />
        </button>
      )}

      <button
        onClick={onClick}
        style={{
          width: '58px',
          height: '58px',
          borderRadius: 'var(--radius-full)',
          background: 'linear-gradient(135deg, var(--accent-primary), hsl(280, 90%, 55%))',
          color: 'white',
          border: 'none',
          boxShadow: '0 6px 20px var(--accent-primary-glow)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'transform var(--transition-bounce)'
        }}
        aria-label="Add new task"
        title="Add Task"
      >
        <Plus size={28} />
      </button>
    </div>
  );
};
