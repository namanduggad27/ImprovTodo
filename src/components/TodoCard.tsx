import React, { useState, useRef } from 'react';
import type { Todo } from '../types/todo';
import { CheckCircle, Circle, Trash2, Sparkles, Tag, Zap, Check } from 'lucide-react';
import { sound } from '../utils/audio';

interface TodoCardProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onStartSprint?: (todo: Todo) => void;
  showSprintButton?: boolean;
}

export const TodoCard: React.FC<TodoCardProps> = ({ todo, onToggle, onDelete, onStartSprint, showSprintButton }) => {
  const [offsetX, setOffsetX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const startX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    const diff = e.touches[0].clientX - startX.current;
    // Limit drag resistance beyond 150px
    if (Math.abs(diff) < 180) {
      setOffsetX(diff);
    }
  };

  const handleTouchEnd = () => {
    if (startX.current === null) return;
    setIsSwiping(false);

    if (offsetX > 100) {
      // Swiped right -> Toggle Complete
      sound.playPop();
      onToggle(todo.id);
    } else if (offsetX < -100) {
      // Swiped left -> Delete
      sound.playPop();
      onDelete(todo.id);
    }

    setOffsetX(0);
    startX.current = null;
  };

  return (
    <div style={{ position: 'relative', marginBottom: '0.75rem', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
      {/* Background Swipe Action Indicators */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.25rem',
        borderRadius: 'var(--radius-md)',
        background: offsetX > 0 
          ? 'linear-gradient(90deg, hsl(165, 70%, 42%), hsl(165, 80%, 35%))' 
          : offsetX < 0 
          ? 'linear-gradient(270deg, hsl(350, 80%, 55%), hsl(350, 90%, 45%))' 
          : 'transparent',
        color: 'white',
        fontWeight: 700,
        fontSize: '0.9rem',
        transition: 'background 0.2s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: offsetX > 30 ? 1 : 0, transition: 'opacity 0.2s' }}>
          <Check size={20} /> {todo.completed ? 'Undo' : 'Complete'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: offsetX < -30 ? 1 : 0, transition: 'opacity 0.2s' }}>
          Delete <Trash2 size={20} />
        </div>
      </div>

      {/* Main Card Content */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`glass-card animate-fade-in ${todo.completed ? 'todo-completed' : ''}`}
        style={{
          margin: 0,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '0.75rem',
          position: 'relative',
          borderLeft: todo.isImprovPrompt ? '4px solid var(--accent-primary)' : undefined,
          opacity: todo.completed ? 0.6 : 1,
          transform: `translateX(${offsetX}px)`,
          transition: isSwiping ? 'none' : 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'grab',
          userSelect: 'none'
        }}
      >
        <button
          onClick={() => {
            sound.playPop();
            onToggle(todo.id);
          }}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.2rem',
            color: todo.completed ? 'var(--accent-primary)' : 'var(--text-secondary)',
            transition: 'transform var(--transition-fast)'
          }}
          aria-label={todo.completed ? "Mark incomplete" : "Mark complete"}
        >
          {todo.completed ? <CheckCircle size={24} className="animate-pulse" /> : <Circle size={24} />}
        </button>

        <div style={{ flex: 1, textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
            <span className={`badge badge-${todo.priority}`}>
              {todo.isImprovPrompt && <Sparkles size={12} style={{ marginRight: '4px' }} />}
              {todo.priority}
            </span>
            {todo.category && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <Tag size={12} /> {todo.category}
              </span>
            )}
          </div>

          <h3 style={{
            fontSize: '1rem',
            fontWeight: 600,
            margin: '0 0 0.25rem',
            textDecoration: todo.completed ? 'line-through' : 'none',
            color: todo.completed ? 'var(--text-secondary)' : 'var(--text-primary)'
          }}>
            {todo.title}
          </h3>

          {todo.description && (
            <p style={{
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.4,
              margin: '0 0 0.5rem'
            }}>
              {todo.description}
            </p>
          )}

          {/* Quick Sprint Button for Uncompleted Tasks */}
          {!todo.completed && onStartSprint && showSprintButton !== false && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStartSprint(todo);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '0.3rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--accent-primary-glow)',
                background: 'linear-gradient(135deg, hsla(210, 85%, 52%, 0.15), hsla(165, 70%, 42%, 0.15))',
                color: 'var(--accent-primary)',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
              title="Start Timer Sprint for this task"
            >
              <Zap size={13} fill="var(--accent-primary)" /> Start Sprint
            </button>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            sound.playPop();
            onDelete(todo.id);
          }}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            padding: '0.4rem',
            borderRadius: 'var(--radius-sm)',
            transition: 'color var(--transition-fast), background var(--transition-fast)'
          }}
          aria-label="Delete task"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};
