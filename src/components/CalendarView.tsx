import React, { useState } from 'react';
import type { Todo } from '../types/todo';
import { TodoCard } from './TodoCard';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, Sparkles } from 'lucide-react';
import { formatLocalDateStr, parseLocalDateStr, isTodoOnDate } from '../utils/date';
import { sound } from '../utils/audio';

interface CalendarViewProps {
  todos: Todo[];
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onAddTaskForDate: (dateStr: string) => void;
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
    sound.playPop();
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    sound.playPop();
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    sound.playPop();
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

  // Next month padding to fill 35 or 42 cells (5 or 6 rows)
  const totalGridCells = days.length > 35 ? 42 : 35;
  const remaining = totalGridCells - days.length;
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(year, month + 1, i);
    days.push({
      dateStr: formatLocalDateStr(d),
      dayNum: i,
      isCurrentMonth: false
    });
  }

  const selectedDateTodos = todos.filter(t => isTodoOnDate(t, selectedDateStr));

  const monthNames = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
  ];

  const selectedDateObj = parseLocalDateStr(selectedDateStr);
  const selectedWeekday = selectedDateObj.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const selectedMonthShort = selectedDateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const selectedDayNum = selectedDateObj.getDate();

  return (
    <div className="animate-fade-in" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.85rem',
      width: '100%',
      paddingBottom: 'calc(var(--bottom-nav-height) + 1.25rem)'
    }}>
      {/* Telemetry Ticker Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.68rem',
        fontFamily: "var(--font-mono, monospace)",
        letterSpacing: '0.08em',
        padding: '0 0.25rem',
        userSelect: 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ff5500', fontWeight: 800 }}>
          <span style={{ fontSize: '0.65rem' }}>■</span>
          <span style={{ color: '#8b949e' }}>SYS:CALENDAR_V2.0</span>
        </div>
        <div style={{ color: '#64748b', fontWeight: 700 }}>
          SCHEDULE_MATRIX // ACTIVE
        </div>
      </div>

      {/* 1. TOP CARD: CALENDAR GRID */}
      <div style={{
        position: 'relative',
        background: '#101218',
        border: '1px solid #1e202c',
        borderRadius: '6px',
        padding: '1.25rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        backgroundImage: 'linear-gradient(rgba(255,85,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,85,0,0.02) 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }}>
        {/* Top-left corner bracket accent */}
        <div style={{
          position: 'absolute',
          top: '-1px',
          left: '-1px',
          width: '10px',
          height: '10px',
          borderTop: '2.5px solid #ff5500',
          borderLeft: '2.5px solid #ff5500',
          borderTopLeftRadius: '5px'
        }} />
        {/* Bottom-right corner bracket accent */}
        <div style={{
          position: 'absolute',
          bottom: '-1px',
          right: '-1px',
          width: '10px',
          height: '10px',
          borderBottom: '2.5px solid #ff5500',
          borderRight: '2.5px solid #ff5500',
          borderBottomRightRadius: '5px'
        }} />

        {/* Month Header & Nav Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem'
        }}>
          {/* Month & Year Display */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '4px',
              border: '1px solid rgba(255, 85, 0, 0.4)',
              background: 'rgba(255, 85, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CalendarIcon size={18} color="#ff5500" strokeWidth={2.4} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <span style={{
                fontFamily: "var(--font-heading), 'Outfit', sans-serif",
                fontSize: '1.35rem',
                fontWeight: 900,
                color: '#ffffff',
                letterSpacing: '0.04em'
              }}>
                {monthNames[month]}
              </span>
              <span style={{
                fontFamily: "var(--font-heading), 'Outfit', sans-serif",
                fontSize: '1.15rem',
                fontWeight: 900,
                color: '#ff5500',
                letterSpacing: '0.03em'
              }}>
                {year}
              </span>
            </div>
          </div>

          {/* Navigation Controls: TODAY, <, > */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={handleToday}
              style={{
                height: '32px',
                padding: '0 0.85rem',
                borderRadius: '4px',
                border: '1px solid #222434',
                background: '#14151f',
                color: '#ffffff',
                fontSize: '0.72rem',
                fontWeight: 900,
                letterSpacing: '0.05em',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
              title="Jump to Today"
            >
              TODAY
            </button>

            <button
              onClick={handlePrevMonth}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '4px',
                border: '1px solid #222434',
                background: '#14151f',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: 0,
                transition: 'all var(--transition-fast)'
              }}
              aria-label="Previous Month"
            >
              <ChevronLeft size={16} strokeWidth={2.4} />
            </button>

            <button
              onClick={handleNextMonth}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '4px',
                border: '1px solid #222434',
                background: '#14151f',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: 0,
                transition: 'all var(--transition-fast)'
              }}
              aria-label="Next Month"
            >
              <ChevronRight size={16} strokeWidth={2.4} />
            </button>
          </div>
        </div>

        {/* Days of Week Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          textAlign: 'center',
          marginBottom: '0.65rem'
        }}>
          {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map(dayName => (
            <span
              key={dayName}
              style={{
                fontSize: '0.68rem',
                fontWeight: 900,
                color: '#64748b',
                letterSpacing: '0.04em'
              }}
            >
              {dayName}
            </span>
          ))}
        </div>

        {/* Days Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
          {days.map((dayItem, idx) => {
            const isSelected = dayItem.dateStr === selectedDateStr;
            const dayTodos = todos.filter(t => isTodoOnDate(t, dayItem.dateStr));

            return (
              <button
                key={idx}
                onClick={() => {
                  sound.playPop();
                  setSelectedDateStr(dayItem.dateStr);
                }}
                style={{
                  height: '42px',
                  borderRadius: '4px',
                  border: isSelected
                    ? '1.5px solid #ff5500'
                    : '1px solid #1a1c28',
                  background: isSelected
                    ? '#1f1514'
                    : dayItem.isCurrentMonth
                    ? '#14151f'
                    : 'transparent',
                  color: !dayItem.isCurrentMonth
                    ? '#2b3042'
                    : isSelected
                    ? '#ffffff'
                    : '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  padding: 0,
                  boxShadow: isSelected ? '0 0 10px rgba(255, 85, 0, 0.35)' : 'none',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <span style={{
                  fontSize: '0.86rem',
                  fontWeight: 900,
                  fontFamily: "var(--font-heading), 'Outfit', sans-serif"
                }}>
                  {dayItem.dayNum}
                </span>

                {/* Task Dot Indicator */}
                {dayTodos.length > 0 && dayItem.isCurrentMonth && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '4px',
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      background: isSelected ? '#ff5500' : '#ea580c'
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. BOTTOM CARD: SELECTED DATE DETAIL */}
      <div style={{
        position: 'relative',
        background: '#101218',
        border: '1px solid #1e202c',
        borderRadius: '6px',
        padding: '1.25rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
      }}>
        {/* Top-left corner bracket accent */}
        <div style={{
          position: 'absolute',
          top: '-1px',
          left: '-1px',
          width: '10px',
          height: '10px',
          borderTop: '2.5px solid #ff5500',
          borderLeft: '2.5px solid #ff5500',
          borderTopLeftRadius: '5px'
        }} />
        {/* Bottom-right corner bracket accent */}
        <div style={{
          position: 'absolute',
          bottom: '-1px',
          right: '-1px',
          width: '10px',
          height: '10px',
          borderBottom: '2.5px solid #ff5500',
          borderRight: '2.5px solid #ff5500',
          borderBottomRightRadius: '5px'
        }} />

        {/* Selected Date Header & Add Button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          gap: '10px'
        }}>
          {/* Date Label with Orange Vertical Accent Bar */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <div style={{
              width: '4px',
              height: '32px',
              borderRadius: '2px',
              background: '#ff5500',
              marginTop: '2px'
            }} />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
              <span style={{
                fontFamily: "var(--font-heading), 'Outfit', sans-serif",
                fontSize: '1.15rem',
                fontWeight: 900,
                color: '#ffffff',
                letterSpacing: '0.03em'
              }}>
                {selectedWeekday},
              </span>
              <span style={{
                fontFamily: "var(--font-heading), 'Outfit', sans-serif",
                fontSize: '1.15rem',
                fontWeight: 900,
                color: '#ffffff',
                letterSpacing: '0.03em'
              }}>
                {selectedMonthShort} {selectedDayNum}
              </span>
              <span style={{
                fontSize: '0.72rem',
                color: '#64748b',
                fontFamily: "var(--font-mono, monospace)",
                fontWeight: 700,
                marginTop: '3px'
              }}>
                {selectedDateTodos.length} tasks scheduled
              </span>
            </div>
          </div>

          {/* + ADD TO DATE Button */}
          <button
            onClick={() => {
              sound.playPop();
              onAddTaskForDate(selectedDateStr);
            }}
            style={{
              background: '#ff5500',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '0.74rem',
              letterSpacing: '0.06em',
              padding: '0.65rem 0.95rem',
              border: 'none',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(255, 85, 0, 0.35)',
              textAlign: 'center',
              lineHeight: 1.15,
              transition: 'transform var(--transition-fast)'
            }}
          >
            <Plus size={15} strokeWidth={3} />
            <span>ADD TO<br />DATE</span>
          </button>
        </div>

        {/* Task List or Recessed Empty State */}
        {selectedDateTodos.length === 0 ? (
          <div style={{
            background: '#090a0e',
            border: '1px solid #1a1c26',
            borderRadius: '4px',
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Center Graphic Box */}
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '4px',
              background: '#14151f',
              border: '1px solid #222434',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              boxShadow: '0 4px 14px rgba(0,0,0,0.5)'
            }}>
              <Sparkles size={20} color="#ff5500" />
            </div>

            <p style={{
              color: '#94a3b8',
              fontFamily: "var(--font-mono, monospace)",
              fontSize: '0.8rem',
              fontWeight: 700,
              margin: '0 0 0.25rem'
            }}>
              No tasks scheduled for this date yet.
            </p>

            <span style={{
              color: '#475569',
              fontFamily: "var(--font-mono, monospace)",
              fontSize: '0.68rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '1.25rem'
            }}>
              TAP BELOW TO INITIALIZE WORKFLOW
            </span>

            <button
              onClick={() => {
                sound.playPop();
                onAddTaskForDate(selectedDateStr);
              }}
              style={{
                background: '#14151f',
                border: '1px solid #282b3d',
                color: '#ffffff',
                fontFamily: "var(--font-mono, monospace)",
                fontWeight: 800,
                fontSize: '0.78rem',
                padding: '0.65rem 1.25rem',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all var(--transition-fast)'
              }}
            >
              <span style={{ color: '#ff5500', fontWeight: 900 }}>+</span> Create Task for {selectedMonthShort} {selectedDayNum}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
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
