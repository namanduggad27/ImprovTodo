import React from 'react';
import type { Todo } from '../types/todo';
import { CheckCircle, Circle, Trash2, Sparkles, Tag } from 'lucide-react';

interface TodoCardProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoCard: React.FC<TodoCardProps> = ({ todo, onToggle, onDelete }) => {
  return (
    <div className={`glass-card animate-fade-in ${todo.completed ? 'todo-completed' : ''}`} style={{
      marginBottom: '0.75rem',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: '0.75rem',
      position: 'relative',
      overflow: 'hidden',
      borderLeft: todo.isImprovPrompt ? '4px solid var(--accent-primary)' : undefined,
      opacity: todo.completed ? 0.6 : 1
    }}>
      <button
        onClick={() => onToggle(todo.id)}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
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
            margin: 0
          }}>
            {todo.description}
          </p>
        )}
      </div>

      <button
        onClick={() => onDelete(todo.id)}
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
  );
};
