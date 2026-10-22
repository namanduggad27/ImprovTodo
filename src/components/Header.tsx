import React from 'react';
import { Sparkles, Settings } from 'lucide-react';

interface HeaderProps {
  completedCount: number;
  totalCount: number;
  onOpenSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ completedCount, totalCount, onOpenSettings }) => {
  return (
    <header className="header-container animate-fade-in" style={{
      padding: 'max(env(safe-area-inset-top, 1rem), 1rem) 1rem 0.85rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid #161822',
      background: '#090a0e',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      {/* Left: Brand Logo & Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '6px',
          background: '#14151f',
          border: '1px solid #222434',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
        }}>
          <Sparkles size={20} color="#ff5500" />
        </div>
        <div>
          <h1 style={{
            fontSize: '1.25rem',
            margin: 0,
            lineHeight: 1.1,
            letterSpacing: '0.02em',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span style={{ color: '#ffffff', fontWeight: 900 }}>IMPROV</span>
            <span style={{ color: '#ff5500', fontWeight: 900 }}>TODO</span>
          </h1>
          <span style={{
            fontSize: '0.62rem',
            color: '#ff5500',
            fontWeight: 800,
            letterSpacing: '0.12em',
            display: 'block',
            marginTop: '2px'
          }}>
            MOBILE STUDIO
          </span>
        </div>
      </div>

      {/* Right: Counter Pill [0 / 0] and Settings Gear */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <div style={{
          background: '#14151f',
          border: '1px solid #222434',
          borderRadius: '4px',
          padding: '4px 10px',
          display: 'flex',
          alignItems: 'center',
          fontSize: '0.82rem',
          fontWeight: 800,
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
        }}>
          <span style={{ color: '#ff5500' }}>{completedCount}</span>
          <span style={{ color: '#64748b', margin: '0 4px' }}>/</span>
          <span style={{ color: '#ffffff' }}>{totalCount}</span>
        </div>

        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            style={{
              background: '#14151f',
              border: '1px solid #222434',
              color: '#ffffff',
              width: '36px',
              height: '36px',
              borderRadius: '6px',
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
    </header>
  );
};

