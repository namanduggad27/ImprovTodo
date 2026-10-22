import React from 'react';
import type { Todo, AppSettings } from '../types/todo';
import { TodoCard } from '../components/TodoCard';
import { Calendar as CalendarIcon, Filter, Sparkles, Plus, Zap } from 'lucide-react';
import { sound } from '../utils/audio';

interface RecurringProps {
  todos: Todo[];
  filter: string;
  onSelectFilter: (filter: string) => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onStartSprint: (todo: Todo) => void;
  onOpenAddRecurring: () => void;
  settings: AppSettings;
}

export const Recurring: React.FC<RecurringProps> = ({
  todos,
  filter,
  onSelectFilter,
  onToggleTodo,
  onDeleteTodo,
  onStartSprint,
  onOpenAddRecurring,
  settings
}) => {
  const scheduledTodos = todos
    .filter(t => t.scheduleType && t.scheduleType !== 'single')
    .filter(t => {
      if (filter === 'all') return true;
      if (filter === 'improv') return t.isImprovPrompt;
      return t.priority === filter;
    });

  const filterOptions = ['all', 'high', 'medium', 'low', 'improv'].filter(
    f => f !== 'improv' || settings.enableImprov
  );

  return (
    <div style={{
      background: '#111218',
      border: '1px solid #1e202c',
      borderRadius: '6px',
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
      width: '100%'
    }}>
      {/* Header Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CalendarIcon size={22} color="#ff5500" strokeWidth={2.4} />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
            <span style={{
              fontFamily: "var(--font-heading), 'Outfit', sans-serif",
              fontSize: '1.15rem',
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '0.04em'
            }}>
              CALENDAR
            </span>
            <span style={{
              fontFamily: "var(--font-heading), 'Outfit', sans-serif",
              fontSize: '1.15rem',
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '0.04em'
            }}>
              RECURRING <span style={{ color: '#64748b', fontWeight: 700 }}>({scheduledTodos.length})</span>
            </span>
          </div>
        </div>

        <div style={{
          background: '#14151f',
          border: '1px solid #222434',
          borderRadius: '4px',
          padding: '3px 8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          lineHeight: 1.15
        }}>
          <span style={{ color: '#64748b', fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.06em' }}>
            AUTO-
          </span>
          <span style={{ color: '#64748b', fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.06em' }}>
            SYNC
          </span>
        </div>
      </div>

      {/* Filter Chips Row */}
      <div style={{
        display: 'flex',
        gap: '6px',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        marginBottom: '1.25rem'
      }}>
        {filterOptions.map(f => {
          const isActive = filter === f;
          return (
            <button
              key={f}
              onClick={() => {
                sound.playPop();
                onSelectFilter(f);
              }}
              style={{
                height: '34px',
                padding: '0 0.85rem',
                borderRadius: '4px',
                border: isActive ? 'none' : '1px solid #222434',
                background: isActive ? '#ff5500' : '#14151f',
                color: isActive ? '#ffffff' : f === 'improv' ? '#c084fc' : '#e2e8f0',
                fontSize: '0.75rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all var(--transition-fast)'
              }}
            >
              {f === 'all' && <Filter size={11} strokeWidth={2.8} />}
              {f === 'improv' && <Sparkles size={11} color={isActive ? '#ffffff' : '#c084fc'} />}
              <span>{f}</span>
            </button>
          );
        })}
      </div>

      {/* Scheduled Task List or Recessed Empty State */}
      {scheduledTodos.length === 0 ? (
        <div style={{
          background: '#090a0e',
          border: '1px solid #191b26',
          borderRadius: '6px',
          padding: '3.5rem 1.5rem 2.5rem',
          minHeight: '380px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          {/* Dark Box with Orange Corner Brackets [ ┌ ┘ ] */}
          <div style={{
            width: '68px',
            height: '68px',
            background: '#14151f',
            border: '1px solid #222434',
            borderRadius: '6px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 18px rgba(0,0,0,0.5)'
          }}>
            {/* Top-left corner bracket */}
            <div style={{
              position: 'absolute',
              top: -5,
              left: -5,
              width: 12,
              height: 12,
              borderTop: '2.5px solid #ff5500',
              borderLeft: '2.5px solid #ff5500'
            }} />
            {/* Bottom-right corner bracket */}
            <div style={{
              position: 'absolute',
              bottom: -5,
              right: -5,
              width: 12,
              height: 12,
              borderBottom: '2.5px solid #ff5500',
              borderRight: '2.5px solid #ff5500'
            }} />

            <CalendarIcon size={32} color="#ff5500" strokeWidth={2.2} />
          </div>

          <h3 style={{
            fontFamily: "var(--font-heading), 'Outfit', sans-serif",
            fontSize: '1.25rem',
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '0.04em',
            margin: '1.5rem 0 0.75rem',
            textAlign: 'center',
            lineHeight: 1.25
          }}>
            NO SCHEDULED<br />LOOPS
          </h3>

          <p style={{
            color: '#94a3b8',
            fontStyle: 'italic',
            fontSize: '0.8rem',
            lineHeight: 1.55,
            textAlign: 'center',
            maxWidth: '260px',
            margin: '0 0 1.5rem'
          }}>
            No recurring or range tasks scheduled.<br />
            Use <strong style={{ color: '#ffffff', fontStyle: 'normal' }}>Date Range</strong> or <strong style={{ color: '#ffffff', fontStyle: 'normal' }}>Specific Days</strong> when adding a task!
          </p>

          <button
            onClick={() => {
              sound.playPop();
              onOpenAddRecurring();
            }}
            style={{
              width: '100%',
              maxWidth: '280px',
              background: '#ff5500',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '0.8rem',
              letterSpacing: '0.05em',
              padding: '0.8rem',
              border: 'none',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 4px 18px rgba(255, 85, 0, 0.4)',
              transition: 'transform var(--transition-fast)'
            }}
          >
            <Plus size={16} strokeWidth={3} /> SCHEDULE RECURRING TASK
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {scheduledTodos.map(todo => (
            <TodoCard
              key={todo.id}
              todo={todo}
              onToggle={onToggleTodo}
              onDelete={onDeleteTodo}
              onStartSprint={onStartSprint}
              showSprintButton={settings.enableSprintTimer}
            />
          ))}
        </div>
      )}

      {/* Footer Streak Multiplier Banner */}
      <div style={{
        background: '#14151f',
        border: '1px solid rgba(255, 85, 0, 0.4)',
        borderRadius: '4px',
        padding: '0.75rem 1rem',
        marginTop: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={14} color="#ff5500" fill="#ff5500" />
          <span style={{
            color: '#94a3b8',
            fontSize: '0.72rem',
            fontWeight: 800,
            letterSpacing: '0.04em'
          }}>
            STREAK MULTIPLIER ACTIVE ON DAILY LOOPS
          </span>
        </div>

        <div style={{
          background: '#090a0e',
          border: '1px solid #222434',
          borderRadius: '3px',
          padding: '2px 8px',
          color: '#ffffff',
          fontSize: '0.75rem',
          fontWeight: 900
        }}>
          1.5X
        </div>
      </div>
    </div>
  );
};
