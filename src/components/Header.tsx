import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  completedCount: number;
  totalCount: number;
}

export const Header: React.FC<HeaderProps> = ({ completedCount, totalCount }) => {
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

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

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        background: 'var(--bg-tertiary)',
        padding: '0.4rem 0.75rem',
        borderRadius: 'var(--radius-full)',
        border: '1px solid var(--border-color)'
      }}>
        <CheckCircle2 size={16} color="var(--accent-primary)" />
        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
          {completedCount}/{totalCount}
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          ({percentage}%)
        </span>
      </div>
    </header>
  );
};
