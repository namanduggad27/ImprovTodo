import React from 'react';
import { Plus } from 'lucide-react';
import type { GoalStatus } from '../../types/goals';
import { sound } from '../../utils/audio';

interface GoalFilterStripProps {
  activeStatus: GoalStatus;
  onSelectStatus: (status: GoalStatus) => void;
  counts: {
    todo: number;
    done: number;
    skipped: number;
  };
  onOpenAdd: () => void;
}

export const GoalFilterStrip: React.FC<GoalFilterStripProps> = ({
  activeStatus,
  onSelectStatus,
  counts,
  onOpenAdd
}) => {
  const tabs: { status: GoalStatus; label: string; count: number }[] = [
    { status: 'todo', label: 'TO-DOS', count: counts.todo },
    { status: 'done', label: 'DONE', count: counts.done },
    { status: 'skipped', label: 'SKIPPED', count: counts.skipped }
  ];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.2rem 1rem 1rem',
      userSelect: 'none',
      gap: '8px'
    }}>
      {/* Segmented Filter Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
        {tabs.map(tab => {
          const isActive = activeStatus === tab.status;
          return (
            <button
              key={tab.status}
              onClick={() => {
                sound.playPop();
                onSelectStatus(tab.status);
              }}
              style={{
                height: '38px',
                padding: '0 0.85rem',
                borderRadius: '4px',
                border: isActive ? 'none' : '1px solid #222434',
                background: isActive ? '#ffffff' : '#14151f',
                color: isActive ? '#000000' : '#8b949e',
                fontSize: '0.72rem',
                fontWeight: 900,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all var(--transition-fast)',
                boxShadow: isActive ? '0 2px 10px rgba(255,255,255,0.1)' : 'none'
              }}
            >
              <span>{tab.label}</span>
              {isActive ? (
                <span style={{
                  background: '#000000',
                  color: '#ffffff',
                  fontSize: '0.68rem',
                  fontWeight: 900,
                  padding: '1px 5px',
                  borderRadius: '2px',
                  minWidth: '16px',
                  textAlign: 'center'
                }}>
                  {tab.count}
                </span>
              ) : (
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 900,
                  color: '#8b949e'
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Add Button [+] */}
      <button
        onClick={() => {
          sound.playPop();
          onOpenAdd();
        }}
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '4px',
          border: '1px solid #222434',
          background: '#14151f',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          padding: 0,
          flexShrink: 0,
          transition: 'transform var(--transition-fast)'
        }}
        title="Add Goal"
        aria-label="Add Goal"
      >
        <Plus size={18} strokeWidth={2.4} />
      </button>
    </div>
  );
};
