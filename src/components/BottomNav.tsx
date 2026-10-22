import React from 'react';
import type { TabType, AppSettings } from '../types/todo';
import { CheckSquare, Target, Calendar, Sparkles, BarChart2 } from 'lucide-react';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  settings?: AppSettings;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, settings }) => {
  const allNavItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'todos', label: 'TASKS', icon: <CheckSquare size={20} /> },
    { id: 'goals', label: 'GOALS', icon: <Target size={20} /> },
    { id: 'calendar', label: 'CALENDAR', icon: <Calendar size={20} /> },
    { id: 'improv', label: 'STUDIO', icon: <Sparkles size={20} /> },
    { id: 'stats', label: 'PROGRESS', icon: <BarChart2 size={20} /> },
  ];

  const navItems = allNavItems.filter(item => {
    if (!settings) return true;
    if (item.id === 'goals' && !settings.enableGoals) return false;
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
      background: '#090a0e',
      borderTop: '1px solid #161822',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      paddingBottom: 'env(safe-area-inset-bottom, 8px)',
      zIndex: 100,
      maxWidth: '480px',
      margin: '0 auto'
    }}>
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            id={`nav-tab-${item.id}`}
            aria-label={item.label}
            onClick={() => onTabChange(item.id)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '5px',
              color: isActive ? '#ff5500' : '#64748b',
              transition: 'all var(--transition-fast)',
              position: 'relative',
              padding: '0.6rem 0.5rem',
              flex: 1
            }}
          >
            {item.icon}
            <span style={{
              fontSize: '0.66rem',
              fontWeight: 800,
              letterSpacing: '0.05em',
              whiteSpace: 'nowrap'
            }}>
              {item.label}
            </span>
            {isActive && (
              <div style={{
                position: 'absolute',
                top: 0,
                width: '32px',
                height: '2.5px',
                background: '#ff5500',
                borderRadius: '2px',
                boxShadow: '0 0 8px rgba(255, 85, 0, 0.6)'
              }} />
            )}
          </button>
        );
      })}
    </nav>
  );
};
