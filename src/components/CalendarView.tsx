import React, { useState } from 'react';
import type { Todo } from '../types/todo';
import { TodoCard } from './TodoCard';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, Sparkles } from 'lucide-react';

export function formatLocalDateStr(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseLocalDateStr(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

interface CalendarViewProps {
  todos: Todo[];
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onAddTaskForDate: (dateStr: string) => void;
}

export function isTodoOnDate(todo: Todo, dateStr: string): boolean {
  if (todo.scheduleType === 'range') {
    return dateStr >= (todo.startDate || '') && dateStr <= (todo.endDate || '');
  }
  if (todo.scheduleType === 'days') {
    if (todo.startDate && dateStr < todo.startDate) return false;
    if (todo.endDate && dateStr > todo.endDate) return false;
    const dayOfWeek = parseLocalDateStr(dateStr).getDay();
    return !!(todo.selectedDays && todo.selectedDays.includes(dayOfWeek));
  }
  if (todo.date) {
    return todo.date === dateStr;
  }
  const createdDateStr = formatLocalDateStr(new Date(todo.createdAt));
  return createdDateStr === dateStr;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  todos,
  onToggleTodo,
  onDeleteTodo,
  onAddTaskForDate
}) => {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(() => {
    return formatLocalDateStr(new Date());
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateStr(formatLocalDateStr(today));
  };

  // Calendar grid calculation
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const days: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = [];

  // Previous month padding
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, prevMonthDays - i);
    days.push({
      dateStr: formatLocalDateStr(d),
      dayNum: prevMonthDays - i,
      isCurrentMonth: false
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i);
    days.push({
      dateStr: formatLocalDateStr(d),
      dayNum: i,
      isCurrentMonth: true
    });
  }

  // Next month padding to fill 42 cells (6 rows)
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(year, month + 1, i);
    days.push({
      dateStr: formatLocalDateStr(d),
      dayNum: i,
      isCurrentMonth: false
    });
  }

  const selectedDateTodos = todos.filter(t => isTodoOnDate(t, selectedDateStr));
  const todayStr = formatLocalDateStr(new Date());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const selectedDateFormatted = parseLocalDateStr(selectedDateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Calendar Header */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CalendarIcon size={22} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '1.3rem', margin: 0 }}>
              {monthNames[month]} {year}
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleToday}
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
              title="Jump to Today"
            >
              Today
            </button>
            <button
              onClick={handlePrevMonth}
              className="btn btn-secondary"
              style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)' }}
              aria-label="Previous Month"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNextMonth}
              className="btn btn-secondary"
              style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)' }}
              aria-label="Next Month"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Day Names Header */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: '0.5rem' }}>
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(dayName => (
            <span key={dayName} style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              {dayName}
            </span>
          ))}
        </div>

        {/* Days Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
          {days.map((dayItem, idx) => {
            const isSelected = dayItem.dateStr === selectedDateStr;
            const isToday = dayItem.dateStr === todayStr;
            const dayTodos = todos.filter(t => isTodoOnDate(t, dayItem.dateStr));
            const completedCount = dayTodos.filter(t => t.completed).length;

            return (
              <button
                key={idx}
                onClick={() => setSelectedDateStr(dayItem.dateStr)}
                title={dayTodos.length > 0 ? `${completedCount}/${dayTodos.length} tasks completed` : undefined}
                style={{
                  minHeight: '52px',
                  padding: '4px',
                  borderRadius: 'var(--radius-sm)',
                  border: isSelected ? '2px solid var(--accent-primary)' : isToday ? '1px dashed var(--accent-secondary)' : '1px solid transparent',
                  background: isSelected ? 'var(--accent-primary-glow)' : dayItem.isCurrentMonth ? 'var(--bg-tertiary)' : 'transparent',
                  color: !dayItem.isCurrentMonth ? 'var(--text-muted)' : isSelected ? 'var(--accent-primary)' : 'var(--text-primary)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  position: 'relative',
                  opacity: dayItem.isCurrentMonth ? 1 : 0.4
                }}
              >
                <span style={{
                  fontSize: '0.85rem',
                  fontWeight: isSelected || isToday ? 700 : 500
                }}>
                  {dayItem.dayNum}
                </span>

                {/* Task Dots Indicator */}
                {dayTodos.length > 0 && (
                  <div style={{ display: 'flex', gap: '2px', marginTop: 'auto', paddingBottom: '2px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '100%' }}>
                    {dayTodos.slice(0, 3).map((t, dotIdx) => (
                      <span
                        key={dotIdx}
                        style={{
                          width: '5px',
                          height: '5px',
                          borderRadius: 'var(--radius-full)',
                          background: t.completed ? 'var(--text-muted)' : t.isImprovPrompt ? 'var(--priority-improv)' : 'var(--accent-primary)'
                        }}
                      />
                    ))}
                    {dayTodos.length > 3 && (
                      <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', lineHeight: 1 }}>+</span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Task List */}
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--text-primary)' }}>
              {selectedDateFormatted}
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {selectedDateTodos.length} {selectedDateTodos.length === 1 ? 'task' : 'tasks'} scheduled
            </span>
          </div>
          <button
            onClick={() => onAddTaskForDate(selectedDateStr)}
            className="btn btn-primary"
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            <Plus size={16} /> Add to Date
          </button>
        </div>

        {selectedDateTodos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
            <Sparkles size={32} color="var(--text-muted)" style={{ margin: '0 auto 0.5rem', opacity: 0.6 }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              No tasks scheduled for this date yet.
            </p>
            <button
              onClick={() => onAddTaskForDate(selectedDateStr)}
              className="btn btn-secondary"
              style={{ fontSize: '0.85rem' }}
            >
              + Create Task for {parseLocalDateStr(selectedDateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {selectedDateTodos.map(todo => (
              <TodoCard
                key={todo.id}
                todo={todo}
                onToggle={onToggleTodo}
                onDelete={onDeleteTodo}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
