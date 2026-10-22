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
    { status: 'todo', label: 'To-dos', count: counts.todo },
    { status: 'done', label: 'Done', count: counts.done },
    { status: 'skipped', label: 'Skipped', count: counts.skipped }
  ];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '0.2rem 1rem 0.85rem',
      userSelect: 'none'
    }}>
      {/* Segmented Filter Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'nowrap' }}>
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
                height: '36px',
                padding: '0 0.85rem',
                borderRadius: '6px',
                border: isActive ? '1.5px solid #121212' : '1.5px solid #1a1a1a',
                background: isActive ? '#121212' : '#ffffff',
                color: isActive ? '#ffffff' : '#1a1a1a',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                transition: 'all var(--transition-fast)',
                boxShadow: isActive ? '0 2px 6px rgba(0,0,0,0.15)' : 'none'
              }}
            >
              <span>{tab.label}</span>
              <sup style={{
                fontSize: '0.65rem',
                fontWeight: 800,
                lineHeight: 1,
                opacity: 0.9,
                transform: 'translateY(-2px)'
              }}>
                {tab.count}
              </sup>
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
          marginLeft: 'auto',
          width: '36px',
          height: '36px',
          borderRadius: '6px',
          border: '1.5px solid #1a1a1a',
          background: '#ffffff',
          color: '#121212',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          padding: 0,
          transition: 'transform var(--transition-fast)'
        }}
        aria-label="Add New Goal"
        title="Add New Goal"
      >
        <Plus size={20} strokeWidth={2.2} />
      </button>
    </div>
  );
};
