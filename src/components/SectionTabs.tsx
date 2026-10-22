import React from 'react';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';
import { sound } from '../utils/audio';

export type SectionType = 'daily' | 'scheduled' | 'notes';

interface SectionTabsProps {
  currentSection: SectionType;
  onSelectSection: (section: SectionType) => void;
  dailyCount: number;
  enableRecurring: boolean;
  enableNotes: boolean;
  onOpenAdd: () => void;
}

export const SectionTabs: React.FC<SectionTabsProps> = ({
  currentSection,
  onSelectSection,
  dailyCount,
  enableRecurring,
  enableNotes,
  onOpenAdd
}) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      {/* Daily Tasks button */}
      <button
        onClick={() => {
          sound.playPop();
          onSelectSection('daily');
        }}
        style={{
          flex: 1.25,
          height: '42px',
          background: currentSection === 'daily' ? '#ffffff' : '#14151f',
          border: currentSection === 'daily' ? 'none' : '1px solid #222434',
          borderRadius: '4px',
          padding: '0 0.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          transition: 'all var(--transition-fast)',
          boxShadow: currentSection === 'daily' ? '0 2px 10px rgba(255,255,255,0.1)' : 'none'
        }}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          lineHeight: 1.15,
          textAlign: 'left'
        }}>
          <span style={{
            color: currentSection === 'daily' ? '#000000' : '#8b949e',
            fontSize: '0.68rem',
            fontWeight: 900,
            letterSpacing: '0.04em'
          }}>
            DAILY
          </span>
          <span style={{
            color: currentSection === 'daily' ? '#000000' : '#8b949e',
            fontSize: '0.68rem',
            fontWeight: 900,
            letterSpacing: '0.04em'
          }}>
            TASKS
          </span>
        </div>
        {currentSection === 'daily' && (
          <div style={{
            background: '#000000',
            color: '#ffffff',
            fontSize: '0.72rem',
            fontWeight: 900,
            padding: '1px 5px',
            borderRadius: '2px',
            minWidth: '18px',
            textAlign: 'center'
          }}>
            {dailyCount}
          </div>
        )}
      </button>

      {/* Recurring button */}
      {enableRecurring && (
        <button
          onClick={() => {
            sound.playPop();
            onSelectSection('scheduled');
          }}
          style={{
            flex: 1.2,
            height: '42px',
            background: currentSection === 'scheduled' ? '#ffffff' : '#14151f',
            border: currentSection === 'scheduled' ? 'none' : '1px solid #222434',
            borderRadius: '4px',
            padding: '0 0.5rem',
            color: currentSection === 'scheduled' ? '#000000' : '#8b949e',
            fontSize: '0.72rem',
            fontWeight: 900,
            letterSpacing: '0.04em',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all var(--transition-fast)',
            boxShadow: currentSection === 'scheduled' ? '0 2px 10px rgba(255,255,255,0.1)' : 'none'
          }}
        >
          {currentSection === 'scheduled' && (
            <CalendarIcon size={14} color="#ff5500" strokeWidth={2.6} />
          )}
          <span>RECURRING</span>
        </button>
      )}

      {/* Quick Notes button */}
      {enableNotes && (
        <button
          onClick={() => {
            sound.playPop();
            onSelectSection('notes');
          }}
          style={{
            flex: 1,
            height: '42px',
            background: currentSection === 'notes' ? '#ffffff' : '#14151f',
            border: currentSection === 'notes' ? 'none' : '1px solid #222434',
            borderRadius: '4px',
            padding: '0 0.5rem',
            color: currentSection === 'notes' ? '#000000' : '#8b949e',
            fontSize: '0.7rem',
            fontWeight: 900,
            letterSpacing: '0.04em',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all var(--transition-fast)',
            boxShadow: currentSection === 'notes' ? '0 2px 10px rgba(255,255,255,0.1)' : 'none'
          }}
        >
          NOTES
        </button>
      )}

      {/* Inline Add Button [+] */}
      <button
        onClick={() => {
          sound.playPop();
          onOpenAdd();
        }}
        style={{
          width: '42px',
          height: '42px',
          background: '#14151f',
          border: '1px solid #222434',
          borderRadius: '4px',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0,
          transition: 'transform var(--transition-fast)'
        }}
        title="Add Task"
        aria-label="Add Task"
      >
        <Plus size={18} strokeWidth={2.4} />
      </button>
    </div>
  );
};
