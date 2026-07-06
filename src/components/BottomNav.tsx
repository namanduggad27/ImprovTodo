import React from 'react';
import type { TabType, AppSettings } from '../types/todo';
import { CheckSquare, Calendar, Sparkles, BarChart2 } from 'lucide-react';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  settings?: AppSettings;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, settings }) => {
  const allNavItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'todos', label: 'Tasks', icon: <CheckSquare size={22} /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar size={22} /> },
    { id: 'improv', label: 'Improv Studio', icon: <Sparkles size={22} /> },
    { id: 'stats', label: 'Progress', icon: <BarChart2 size={22} /> },
  ];

  const navItems = allNavItems.filter(item => {
    if (!settings) return true;
    if (item.id === 'calendar' && !settings.enableRecurring) return false;
    if (item.id === 'improv' && !settings.enableImprov) return false;
    if (item.id === 'stats' && !settings.enableStats) return false;
    return true;
  });

  if (navItems.length === 0) return null;

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: 'var(--bottom-nav-height)',
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      paddingBottom: 'env(safe-area-inset-bottom, 10px)',
      zIndex: 100,
      maxWidth: '480px',
      margin: '0 auto'
    }}>
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
              transition: 'all var(--transition-fast)',
              position: 'relative',
              padding: '0.5rem 0.75rem',
              transform: isActive ? 'translateY(-2px)' : 'none',
              flex: 1
            }}
          >
            {item.icon}
            <span style={{
              fontSize: '0.75rem',
              fontWeight: isActive ? 600 : 400,
              letterSpacing: '0.02em',
              whiteSpace: 'nowrap'
            }}>
              {item.label}
            </span>
            {isActive && (
              <div style={{
                position: 'absolute',
                top: 0,
                width: '24px',
                height: '3px',
                background: 'var(--accent-primary)',
                borderRadius: 'var(--radius-full)',
                boxShadow: '0 0 10px var(--accent-primary)'
              }} />
            )}
          </button>
        );
      })}
    </nav>
  );
};
