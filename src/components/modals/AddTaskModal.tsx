import React from 'react';
import type { Priority, DateScheduleType, AppSettings, Todo } from '../../types/todo';
import { Calendar as CalendarIcon } from 'lucide-react';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Todo, 'id' | 'createdAt' | 'completed'>) => void;
  settings: AppSettings;
  defaultScheduleType?: DateScheduleType;
  defaultDate?: string;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  settings,
  defaultScheduleType = 'single',
  defaultDate
}) => {
  const [title, setTitle] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [priority, setPriority] = React.useState<Priority>('medium');
  const [category, setCategory] = React.useState('General');
  
  const [scheduleType, setScheduleType] = React.useState<DateScheduleType>(defaultScheduleType);
  const [date, setDate] = React.useState(() => defaultDate || new Date().toISOString().split('T')[0]);
  const [startDate, setStartDate] = React.useState(() => new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = React.useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [selectedDays, setSelectedDays] = React.useState<number[]>([1, 3, 5]);
  const [showScheduleOptions, setShowScheduleOptions] = React.useState(defaultScheduleType !== 'single');
  const [reminderTime, setNewReminderTime] = React.useState('');

  React.useEffect(() => {
    if (isOpen) {
      if (defaultDate) setDate(defaultDate);
      if (defaultScheduleType) setScheduleType(defaultScheduleType);
      setShowScheduleOptions(defaultScheduleType !== 'single');
    }
  }, [isOpen, defaultDate, defaultScheduleType]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: desc.trim() || undefined,
      priority,
      category: category.trim() || 'General',
      isImprovPrompt: priority === 'improv',
      scheduleType,
      date: scheduleType === 'single' ? date : undefined,
      startDate: scheduleType === 'range' || scheduleType === 'days' ? startDate : undefined,
      endDate: scheduleType === 'range' || scheduleType === 'days' ? endDate : undefined,
      selectedDays: scheduleType === 'days' ? selectedDays : undefined,
      reminderTime: reminderTime || undefined
    });

    setTitle('');
    setDesc('');
    setPriority('medium');
    setCategory('General');
    setNewReminderTime('');
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'max(env(safe-area-inset-top, 48px), 48px) 1.5rem 1.5rem',
      zIndex: 1000
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        background: '#111218',
        border: '1px solid #1e202c',
        borderRadius: '6px',
        padding: '1.5rem',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 8px 32px rgba(0,0,0,0.8)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '4px',
            background: 'rgba(255, 85, 0, 0.15)',
            border: '1px solid rgba(255, 85, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CalendarIcon size={16} color="#ff5500" strokeWidth={2.4} />
          </div>
          <h2 style={{
            fontFamily: "var(--font-heading), 'Outfit', sans-serif",
            fontSize: '1.2rem',
            fontWeight: 900,
            margin: 0,
            color: '#ffffff',
            letterSpacing: '0.03em'
          }}>
            ADD TASK
          </h2>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
          <div>
            <label style={{ fontSize: '0.76rem', color: '#8b949e', display: 'block', marginBottom: '4px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Title *
            </label>
            <input
              type="text"
              required
              placeholder="What needs to be done?"
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={{
                width: '100%', padding: '0.75rem', borderRadius: '4px',
                border: '1px solid #222434', background: '#14151f',
                color: '#ffffff', fontSize: '0.9rem', outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.76rem', color: '#8b949e', display: 'block', marginBottom: '4px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Description (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Add details, notes or links..."
              value={desc}
              onChange={e => setDesc(e.target.value)}
              style={{
                width: '100%', padding: '0.75rem', borderRadius: '4px',
                border: '1px solid #222434', background: '#14151f',
                color: '#ffffff', fontSize: '0.85rem', outline: 'none', resize: 'none'
              }}
            />
          </div>

          {/* SCHEDULING MODE SELECTOR */}
          <div style={{ background: '#0e1017', padding: '0.75rem', borderRadius: '4px', border: '1px solid #1e202c' }}>
            <button
              type="button"
              onClick={() => setShowScheduleOptions(!showScheduleOptions)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'transparent',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <label style={{ fontSize: '0.78rem', color: '#ffffff', fontWeight: 800, cursor: 'pointer', letterSpacing: '0.03em' }}>
                📅 DATE & SCHEDULE OPTIONS
              </label>
              <span style={{ fontSize: '0.75rem', color: '#8b949e' }}>
                {showScheduleOptions ? '▲' : '▼'}
              </span>
            </button>

            <div style={{
              display: 'grid',
              gridTemplateRows: showScheduleOptions ? '1fr' : '0fr',
              transition: 'grid-template-rows 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              marginTop: showScheduleOptions ? '12px' : '0'
            }}>
              <div style={{ overflow: 'hidden' }}>
                <div>
                  {settings.enableRecurring && (
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '0.75rem' }}>
                      {[
                        { id: 'single', label: 'Single Date' },
                        { id: 'range', label: 'Date Range' },
                        { id: 'days', label: 'Specific Days' }
                      ].map(mode => (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => setScheduleType(mode.id as DateScheduleType)}
                          style={{
                            flex: 1,
                            padding: '0.5rem 0.25rem',
                            borderRadius: '4px',
                            border: scheduleType === mode.id ? 'none' : '1px solid #222434',
                            background: scheduleType === mode.id ? '#ff5500' : '#14151f',
                            color: scheduleType === mode.id ? '#ffffff' : '#8b949e',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            cursor: 'pointer'
                          }}
                        >
                          {mode.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* SINGLE DATE MODE */}
                  {scheduleType === 'single' && (
                    <div>
                      <label style={{ fontSize: '0.72rem', color: '#8b949e', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Select Date</label>
                      <input
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        style={{
                          width: '100%', padding: '0.6rem', borderRadius: '4px',
                          border: '1px solid #222434', background: '#14151f',
                          color: '#ffffff', fontSize: '0.85rem', outline: 'none'
                        }}
                      />
                    </div>
                  )}

                  {/* RANGE & DAYS MODE */}
                  {(scheduleType === 'range' || scheduleType === 'days') && settings.enableRecurring && (
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: scheduleType === 'days' ? '0.75rem' : 0 }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.72rem', color: '#8b949e', display: 'block', marginBottom: '4px', fontWeight: 700 }}>Start Date</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={e => setStartDate(e.target.value)}
                          style={{
                            width: '100%', padding: '0.6rem', borderRadius: '4px',
                            border: '1px solid #222434', background: '#14151f',
                            color: '#ffffff', fontSize: '0.85rem', outline: 'none'
                          }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.72rem', color: '#8b949e', display: 'block', marginBottom: '4px', fontWeight: 700 }}>End Date</label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={e => setEndDate(e.target.value)}
                          style={{
                            width: '100%', padding: '0.6rem', borderRadius: '4px',
                            border: '1px solid #222434', background: '#14151f',
                            color: '#ffffff', fontSize: '0.85rem', outline: 'none'
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* SPECIFIC DAYS OF WEEK MODE */}
                  {scheduleType === 'days' && settings.enableRecurring && (
                    <div>
                      <label style={{ fontSize: '0.72rem', color: '#8b949e', display: 'block', marginBottom: '6px', fontWeight: 700 }}>
                        Repeat on Days of Week
                      </label>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {[
                          { idx: 0, label: 'Su' },
                          { idx: 1, label: 'Mo' },
                          { idx: 2, label: 'Tu' },
                          { idx: 3, label: 'We' },
                          { idx: 4, label: 'Th' },
                          { idx: 5, label: 'Fr' },
                          { idx: 6, label: 'Sa' }
                        ].map(day => {
                          const isSelected = selectedDays.includes(day.idx);
                          return (
                            <button
                              key={day.idx}
                              type="button"
                              onClick={() => {
                                if (isSelected && selectedDays.length > 1) {
                                  setSelectedDays(prev => prev.filter(d => d !== day.idx));
                                } else if (!isSelected) {
                                  setSelectedDays(prev => [...prev, day.idx].sort((a, b) => a - b));
                                }
                              }}
                              style={{
                                flex: 1, padding: '0.4rem 0', borderRadius: '4px',
                                border: isSelected ? 'none' : '1px solid #222434',
                                background: isSelected ? '#ff5500' : '#14151f',
                                color: isSelected ? '#ffffff' : '#8b949e',
                                fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer'
                              }}
                            >
                              {day.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* REMINDER TIME */}
                  <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #1a1c26' }}>
                    <label style={{ fontSize: '0.72rem', color: '#8b949e', display: 'block', marginBottom: '4px', fontWeight: 700 }}>
                      Reminder Time (Optional)
                    </label>
                    <input
                      type="time"
                      value={reminderTime}
                      onChange={e => setNewReminderTime(e.target.value)}
                      style={{
                        width: '100%', padding: '0.6rem', borderRadius: '4px',
                        border: '1px solid #222434', background: '#14151f',
                        color: '#ffffff', fontSize: '0.85rem', outline: 'none'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.76rem', color: '#8b949e', display: 'block', marginBottom: '4px', fontWeight: 800, textTransform: 'uppercase' }}>
                Priority
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as Priority)}
                style={{
                  width: '100%', padding: '0.75rem', borderRadius: '4px',
                  border: '1px solid #222434', background: '#14151f',
                  color: '#ffffff', fontSize: '0.85rem', outline: 'none'
                }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                {settings.enableImprov && <option value="improv">Improv Challenge</option>}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.76rem', color: '#8b949e', display: 'block', marginBottom: '4px', fontWeight: 800, textTransform: 'uppercase' }}>
                Category
              </label>
              <input
                type="text"
                placeholder="e.g. Work, Studio"
                value={category}
                onChange={e => setCategory(e.target.value)}
                style={{
                  width: '100%', padding: '0.75rem', borderRadius: '4px',
                  border: '1px solid #222434', background: '#14151f',
                  color: '#ffffff', fontSize: '0.85rem', outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '0.8rem',
                borderRadius: '4px',
                border: '1px solid #222434',
                background: '#14151f',
                color: '#8b949e',
                fontSize: '0.82rem',
                fontWeight: 900,
                letterSpacing: '0.04em',
                cursor: 'pointer'
              }}
            >
              CANCEL
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '0.8rem',
                borderRadius: '4px',
                border: 'none',
                background: '#ff5500',
                color: '#ffffff',
                fontSize: '0.82rem',
                fontWeight: 900,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                boxShadow: '0 4px 18px rgba(255, 85, 0, 0.35)'
              }}
            >
              SAVE TASK
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
