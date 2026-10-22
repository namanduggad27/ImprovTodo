import React from 'react';
import type { Todo, AppSettings } from '../types/todo';
import { TodoCard } from '../components/TodoCard';
import { Filter, Sparkles, Plus, Check } from 'lucide-react';
import { sound } from '../utils/audio';

interface TasksProps {
  todos: Todo[];
  filter: string;
  onSelectFilter: (filter: string) => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onStartSprint: (todo: Todo) => void;
  onOpenAdd: () => void;
  onQuickFill: () => void;
  settings: AppSettings;
}

export const Tasks: React.FC<TasksProps> = ({
  todos,
  filter,
  onSelectFilter,
  onToggleTodo,
  onDeleteTodo,
  onStartSprint,
  onOpenAdd,
  onQuickFill,
  settings
}) => {
  const dailyTodos = todos
    .filter(t => !t.scheduleType || t.scheduleType === 'single')
    .filter(t => {
      if (filter === 'all') return true;
      if (filter === 'improv') return t.isImprovPrompt;
      return t.priority === filter;
    });

  const filterOptions = ['all', 'high', 'medium', 'low', 'improv'].filter(
    f => f !== 'improv' || settings.enableImprov
  );

  const completedCount = dailyTodos.filter(t => t.completed).length;

  return (
    <div style={{
      background: '#111218',
      border: '1px solid #1e202c',
      borderRadius: '6px',
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
    }}>
      {/* Header Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '22px',
            height: '22px',
            borderRadius: '4px',
            border: '1.5px solid #ff5500',
            background: 'rgba(255,85,0,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Check size={14} color="#ff5500" strokeWidth={3} />
          </div>
          <h2 style={{
            fontSize: '1.05rem',
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '0.03em',
            margin: 0
          }}>
            DAILY TASKS <span style={{ color: '#64748b', fontWeight: 700 }}>/ {dailyTodos.length}</span>
          </h2>
        </div>
        <span style={{
          color: '#64748b',
          fontSize: '0.72rem',
          fontWeight: 800,
          letterSpacing: '0.08em'
        }}>
          TODAY
        </span>
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
                color: isActive ? '#ffffff' : f === 'improv' ? '#ff5500' : '#e2e8f0',
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
              {f === 'improv' && <Sparkles size={11} color={isActive ? '#ffffff' : '#ff5500'} />}
              <span>{f}</span>
            </button>
          );
        })}
      </div>

      {/* Task List or Recessed Empty State */}
      {dailyTodos.length === 0 ? (
        <div style={{
          background: '#090a0e',
          border: '1px solid #1a1c26',
          borderRadius: '6px',
          padding: '3.5rem 1.5rem',
          minHeight: '380px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          {/* Glowing Star with Orange Accent Corner Tab */}
          <div style={{
            width: '52px',
            height: '52px',
            background: '#14151f',
            border: '1.5px solid #222434',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            boxShadow: '0 4px 18px rgba(0,0,0,0.5)'
          }}>
            <Sparkles size={26} color="#ff5500" />
            <div style={{
              position: 'absolute',
              bottom: '-4px',
              right: '-4px',
              width: '10px',
              height: '10px',
              background: '#ff5500',
              borderRadius: '1px'
            }} />
          </div>

          <p style={{
            color: '#94a3b8',
            fontSize: '0.76rem',
            fontWeight: 800,
            letterSpacing: '0.06em',
            textAlign: 'center',
            maxWidth: '220px',
            margin: '1.5rem 0',
            textTransform: 'uppercase',
            lineHeight: 1.45
          }}>
            NO DAILY TASKS MATCHING THIS FILTER.
          </p>

          <button
            onClick={onOpenAdd}
            style={{
              width: '100%',
              maxWidth: '260px',
              background: '#ff5500',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '0.82rem',
              letterSpacing: '0.06em',
              padding: '0.8rem',
              border: 'none',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 4px 18px rgba(255, 85, 0, 0.35)',
              transition: 'transform var(--transition-fast)'
            }}
          >
            <Plus size={16} strokeWidth={3} /> ADD TASK
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {dailyTodos.map(todo => (
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

      {/* Footer Status Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '1.25rem',
        paddingTop: '0.75rem',
        borderTop: '1px solid #1a1c26'
      }}>
        <span style={{
          color: '#64748b',
          fontSize: '0.72rem',
          fontWeight: 800,
          letterSpacing: '0.06em'
        }}>
          {completedCount} COMPLETED
        </span>

        <button
          onClick={onQuickFill}
          style={{
            background: 'none',
            border: 'none',
            color: '#64748b',
            fontSize: '0.72rem',
            fontWeight: 800,
            letterSpacing: '0.06em',
            cursor: 'pointer'
          }}
        >
          TAP TO QUICK-FILL
        </button>
      </div>
    </div>
  );
};
