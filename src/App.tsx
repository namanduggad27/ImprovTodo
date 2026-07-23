import React, { useState, useEffect } from 'react';
import type { Todo, Priority, TabType, DateScheduleType, Note, ImprovPrompt, AppSettings } from './types/todo';
import { DEFAULT_APP_SETTINGS } from './types/todo';
import { Header } from './components/Header';
import { TodoCard } from './components/TodoCard';
import { ImprovModal } from './components/ImprovModal';
import { CustomImprovModal } from './components/CustomImprovModal';
import { SprintTimerModal } from './components/SprintTimerModal';
import { SettingsModal } from './components/SettingsModal';
import { BottomNav } from './components/BottomNav';
import { FloatingActionButton } from './components/FloatingActionButton';
import { CalendarView } from './components/CalendarView';
import { formatLocalDateStr } from './utils/date';
import { NoteCard } from './components/NoteCard';
import { NoteEditorModal } from './components/NoteEditorModal';
import { IMPROV_PROMPTS } from './data/improvPrompts';
import { sound } from './utils/audio';
import { Sparkles, Filter, Flame, Trophy, CheckCircle2, Zap, Clock, Plus, Calendar as CalendarIcon, FileText, Trash2 } from 'lucide-react';
import { App as CapApp } from '@capacitor/app';
import { CapgoWidgetKit } from '@capgo/capacitor-widget-kit';

const INITIAL_TODOS: Todo[] = [
  {
    id: '1',
    title: 'Weekly Improv Sprint Review',
    description: 'Recurring review of completed challenges and improv goals every Mon, Wed, Fri.',
    completed: false,
    priority: 'high',
    category: 'Recurring',
    createdAt: Date.now() - 3600000,
    startDate: formatLocalDateStr(new Date()),
    endDate: formatLocalDateStr(new Date(Date.now() + 864000000)),
    selectedDays: [1, 3, 5],
    scheduleType: 'days'
  },
  {
    id: '2',
    title: 'Test Capacitor Mobile Build',
    description: 'Run npx cap sync and open in Android Studio or Xcode to test native APIs.',
    completed: false,
    priority: 'high',
    category: 'Development',
    createdAt: Date.now() - 3600000,
    date: new Date().toISOString().split('T')[0],
    scheduleType: 'single'
  },
  {
    id: '3',
    title: 'The 2-Minute Sprint',
    description: 'Pick the smallest annoying task on your list and finish it before a 120-second timer runs out.',
    completed: true,
    priority: 'improv',
    category: 'quick-win',
    isImprovPrompt: true,
    createdAt: Date.now() - 7200000,
    date: new Date().toISOString().split('T')[0],
    scheduleType: 'single'
  }
];

const INITIAL_NOTES: Note[] = [
  {
    id: 'note-1',
    title: 'Improv Script Ideas',
    content: '1. The elevator pitch challenge: explain a complex tech stack in 30 seconds to a medieval knight.\n2. Reverse psychology interview.',
    isList: false,
    color: 'blue',
    updatedAt: Date.now() - 3600000
  },
  {
    id: 'note-2',
    title: 'Daily Micro-Wins Checklist',
    content: '',
    isList: true,
    items: [
      { id: 'item-1', text: 'Drink 500ml water first thing', completed: true },
      { id: 'item-2', text: '2-minute desk stretch', completed: false },
      { id: 'item-3', text: 'Clear downloads folder', completed: false }
    ],
    color: 'sage',
    updatedAt: Date.now() - 7200000
  }
];

export function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('improv_todos');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_TODOS;
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('improv_notes');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_NOTES;
  });

  const [customPrompts, setCustomPrompts] = useState<ImprovPrompt[]>(() => {
    const saved = localStorage.getItem('improv_custom_prompts');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  const [appSettings, setAppSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('improv_settings');
    if (saved) {
      try { return { ...DEFAULT_APP_SETTINGS, ...JSON.parse(saved) }; } catch (e) { console.error(e); }
    }
    return DEFAULT_APP_SETTINGS;
  });

  const [activeTab, setActiveTab] = useState<TabType>('todos');
  const [homeSection, setHomeSection] = useState<'daily' | 'scheduled' | 'notes'>('daily');
  
  // Modals
  const [isImprovModalOpen, setIsImprovModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeSprintTodo, setActiveSprintTodo] = useState<Todo | null>(null);

  // Separate Priority Filters for Section 1 and Section 2
  const [filterScheduled, setFilterScheduled] = useState<string>('all');
  const [filterDaily, setFilterDaily] = useState<string>('all');

  // Notes Modal State
  const [isNoteEditorOpen, setIsNoteEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  // New Todo Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>('medium');
  const [newCategory, setNewCategory] = useState('General');
  
  // Date Scheduling Form State
  const [newScheduleType, setNewScheduleType] = useState<DateScheduleType>('single');
  const [newDate, setNewDate] = useState(() => formatLocalDateStr(new Date()));
  const [newStartDate, setNewStartDate] = useState(() => formatLocalDateStr(new Date()));
  const [newEndDate, setNewEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return formatLocalDateStr(d);
  });
  const [newSelectedDays, setNewSelectedDays] = useState<number[]>([1, 3, 5]); // Mon, Wed, Fri

  const allImprovPrompts = [...customPrompts, ...IMPROV_PROMPTS];

  useEffect(() => {
    localStorage.setItem('improv_todos', JSON.stringify(todos));
    
    // Sync to Widget Storage (all uncompleted tasks)
    const syncWidget = async () => {
      try {
        const topTasks = todos.filter(t => !t.completed);
        await CapgoWidgetKit.startWidgetSession({
          widgetId: 'todo-widget-session',
          kind: 'todo-list',
          state: { tasks: topTasks },
          metadata: {}
        });
      } catch (err) {
        console.error('Widget sync failed:', err);
      }
    };
    syncWidget();
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('improv_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('improv_custom_prompts', JSON.stringify(customPrompts));
  }, [customPrompts]);

  useEffect(() => {
    localStorage.setItem('improv_settings', JSON.stringify(appSettings));
    sound.isMuted = !appSettings.enableSound;
  }, [appSettings]);

  // Fallback if current section or tab is disabled
  useEffect(() => {
    if (homeSection === 'scheduled' && !appSettings.enableRecurring) setHomeSection('daily');
    if (homeSection === 'notes' && !appSettings.enableNotes) setHomeSection('daily');
    if (activeTab === 'calendar' && !appSettings.enableRecurring) setActiveTab('todos');
    if (activeTab === 'improv' && !appSettings.enableImprov) setActiveTab('todos');
    if (activeTab === 'stats' && !appSettings.enableStats) setActiveTab('todos');
  }, [appSettings, homeSection, activeTab]);

  // Native Android Hardware Back Button Handler
  useEffect(() => {
    const handleBackButton = async () => {
      if (isSettingsOpen) {
        setIsSettingsOpen(false);
        return;
      }
      if (activeSprintTodo) {
        setActiveSprintTodo(null);
        return;
      }
      if (isCustomModalOpen) {
        setIsCustomModalOpen(false);
        return;
      }
      if (editingNote || isNoteEditorOpen) {
        setEditingNote(null);
        setIsNoteEditorOpen(false);
        return;
      }
      if (isAddModalOpen) {
        setIsAddModalOpen(false);
        return;
      }
      if (isImprovModalOpen) {
        setIsImprovModalOpen(false);
        return;
      }
      if (activeTab === 'todos' && homeSection !== 'daily') {
        setHomeSection('daily');
        return;
      }
      if (activeTab !== 'todos') {
        setActiveTab('todos');
        return;
      }
      try {
        await CapApp.minimizeApp();
      } catch {
        try {
          await CapApp.exitApp();
        } catch {}
      }
    };

    const handle = CapApp.addListener('backButton', handleBackButton);
    return () => {
      handle.then(h => h.remove());
    };
  }, [isAddModalOpen, isImprovModalOpen, isNoteEditorOpen, editingNote, activeTab, homeSection, activeSprintTodo, isCustomModalOpen, isSettingsOpen]);

  const handleToggleTodo = (id: string) => {
    setTodos(prev => prev.map(t => {
      if (t.id === id) {
        const nextCompleted = !t.completed;
        if (nextCompleted) {
          if (t.isImprovPrompt || t.priority === 'improv') {
            sound.playVictoryFanfare();
          } else {
            sound.playTick();
          }
        }
        return { ...t, completed: nextCompleted };
      }
      return t;
    }));
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const handleAddTodo = (todoData: Omit<Todo, 'id' | 'createdAt' | 'completed'>) => {
    const newTodo: Todo = {
      ...todoData,
      id: Math.random().toString(36).substring(2, 9),
      completed: false,
      createdAt: Date.now()
    };
    setTodos(prev => [newTodo, ...prev]);
  };

  const handleOpenAddForDate = (dateStr: string) => {
    setNewDate(dateStr);
    setNewScheduleType('single');
    setIsAddModalOpen(true);
  };

  const handleCreateCustomTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const baseData = {
      title: newTitle.trim(),
      description: newDesc.trim() || undefined,
      priority: newPriority,
      category: newCategory.trim() || 'General',
      scheduleType: newScheduleType
    };

    if (newScheduleType === 'single') {
      handleAddTodo({
        ...baseData,
        date: newDate
      });
    } else if (newScheduleType === 'range') {
      handleAddTodo({
        ...baseData,
        startDate: newStartDate,
        endDate: newEndDate
      });
    } else if (newScheduleType === 'days') {
      if (newSelectedDays.length === 0) {
        alert('Please select at least one day of the week.');
        return;
      }
      handleAddTodo({
        ...baseData,
        startDate: newStartDate,
        endDate: newEndDate,
        selectedDays: newSelectedDays
      });
    }

    setNewTitle('');
    setNewDesc('');
    setIsAddModalOpen(false);
  };

  // Custom Improv Idea Handlers
  const handleSaveCustomPrompt = (promptData: Omit<ImprovPrompt, 'id'>) => {
    const newPrompt: ImprovPrompt = {
      ...promptData,
      id: 'custom-' + Math.random().toString(36).substring(2, 9)
    };
    setCustomPrompts(prev => [newPrompt, ...prev]);
  };

  const handleDeleteCustomPrompt = (id: string) => {
    setCustomPrompts(prev => prev.filter(p => p.id !== id));
  };

  // Notes Handlers
  const handleOpenNewNote = () => {
    setEditingNote(null);
    setIsNoteEditorOpen(true);
  };

  const handleOpenEditNote = (note: Note) => {
    setEditingNote(note);
    setIsNoteEditorOpen(true);
  };

  const handleSaveNote = (noteData: Omit<Note, 'id' | 'updatedAt'>, existingId?: string) => {
    if (existingId) {
      setNotes(prev => prev.map(n => n.id === existingId ? { ...n, ...noteData, updatedAt: Date.now() } : n));
    } else {
      const newNote: Note = {
        ...noteData,
        id: Math.random().toString(36).substring(2, 9),
        updatedAt: Date.now()
      };
      setNotes(prev => [newNote, ...prev]);
    }
  };

  const handleDeleteNote = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;

  // Filter logic for Section 1 (Scheduled & Recurring)
  const scheduledTodos = todos
    .filter(t => t.scheduleType === 'range' || t.scheduleType === 'days')
    .filter(t => {
      if (filterScheduled === 'all') return true;
      if (filterScheduled === 'improv') return t.isImprovPrompt;
      return t.priority === filterScheduled;
    });

  // Filter logic for Section 2 (Normal Daily Tasks)
  const dailyTodos = todos
    .filter(t => !t.scheduleType || t.scheduleType === 'single')
    .filter(t => {
      if (filterDaily === 'all') return true;
      if (filterDaily === 'improv') return t.isImprovPrompt;
      return t.priority === filterDaily;
    });

  const availableSections = [
    { id: 'daily', label: 'Daily Tasks', icon: <CheckCircle2 size={16} />, show: true },
    { id: 'scheduled', label: 'Recurring', icon: <CalendarIcon size={16} />, show: appSettings.enableRecurring },
    { id: 'notes', label: 'Quick Notes', icon: <FileText size={16} />, show: appSettings.enableNotes }
  ].filter(sec => sec.show);

  const filterOptions = ['all', 'high', 'medium', 'low', 'improv'].filter(f => f !== 'improv' || appSettings.enableImprov);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <Header
        completedCount={completedCount}
        totalCount={totalCount}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <main style={{ padding: '1rem', flex: 1 }}>
        {/* TAB 1: HOME (WITH SECTION TOGGLE BUTTON BAR) */}
        {activeTab === 'todos' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* SEGMENTED CONTROL / SECTION TOGGLE BUTTON BAR */}
            {availableSections.length > 1 && (
              <div style={{
                display: 'flex',
                background: 'var(--bg-tertiary)',
                padding: '5px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-color)',
                gap: '4px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
              }}>
                {availableSections.map(sec => (
                  <button
                    key={sec.id}
                    onClick={() => setHomeSection(sec.id as any)}
                    style={{
                      flex: 1,
                      padding: '0.6rem 0.5rem',
                      borderRadius: 'var(--radius-full)',
                      border: 'none',
                      background: homeSection === sec.id ? 'var(--bg-secondary)' : 'transparent',
                      color: homeSection === sec.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      fontWeight: homeSection === sec.id ? 700 : 500,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      boxShadow: homeSection === sec.id ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    {sec.icon}
                    <span style={{ whiteSpace: 'nowrap' }}>{sec.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* SUB-SECTION 1: DAILY TASKS */}
            {homeSection === 'daily' && (
              <div className="glass-card animate-fade-in" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 color="var(--accent-secondary)" size={20} />
                    <h2 style={{ fontSize: '1.15rem', margin: 0 }}>Daily Tasks ({dailyTodos.length})</h2>
                  </div>
                  {/* Filter Pills */}
                  <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', scrollbarWidth: 'none' }}>
                    {filterOptions.map(filter => (
                      <button
                        key={filter}
                        onClick={() => setFilterDaily(filter)}
                        style={{
                          padding: '0.35rem 0.75rem',
                          borderRadius: 'var(--radius-full)',
                          border: '1px solid var(--border-color)',
                          background: filterDaily === filter ? 'var(--accent-secondary)' : 'var(--bg-secondary)',
                          color: filterDaily === filter ? 'white' : 'var(--text-secondary)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          textTransform: 'capitalize',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                          transition: 'all var(--transition-fast)'
                        }}
                      >
                        {filter === 'improv' && <Sparkles size={10} />}
                        {filter === 'all' && <Filter size={10} />}
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>

                {dailyTodos.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                    <Sparkles size={36} color="var(--accent-secondary)" style={{ margin: '0 auto 0.75rem', opacity: 0.7 }} />
                    <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                      No daily tasks matching this filter.
                    </p>
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="btn btn-primary"
                      style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                    >
                      <Plus size={16} /> Add Task
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {dailyTodos.map(todo => (
                      <TodoCard
                        key={todo.id}
                        todo={todo}
                        onToggle={handleToggleTodo}
                        onDelete={handleDeleteTodo}
                        onStartSprint={setActiveSprintTodo}
                        showSprintButton={appSettings.enableSprintTimer}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SUB-SECTION 2: CALENDAR SCHEDULED & RECURRING TASKS */}
            {homeSection === 'scheduled' && appSettings.enableRecurring && (
              <div className="glass-card animate-fade-in" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CalendarIcon color="var(--accent-primary)" size={20} />
                    <h2 style={{ fontSize: '1.15rem', margin: 0 }}>Calendar Recurring ({scheduledTodos.length})</h2>
                  </div>
                  {/* Filter Pills */}
                  <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', scrollbarWidth: 'none' }}>
                    {filterOptions.map(filter => (
                      <button
                        key={filter}
                        onClick={() => setFilterScheduled(filter)}
                        style={{
                          padding: '0.35rem 0.75rem',
                          borderRadius: 'var(--radius-full)',
                          border: '1px solid var(--border-color)',
                          background: filterScheduled === filter ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                          color: filterScheduled === filter ? 'white' : 'var(--text-secondary)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          textTransform: 'capitalize',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                          transition: 'all var(--transition-fast)'
                        }}
                      >
                        {filter === 'improv' && <Sparkles size={10} />}
                        {filter === 'all' && <Filter size={10} />}
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>

                {scheduledTodos.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                    <CalendarIcon size={36} color="var(--accent-primary)" style={{ margin: '0 auto 0.75rem', opacity: 0.7 }} />
                    <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                      No recurring or range tasks scheduled. Use Date Range or Specific Days when adding a task!
                    </p>
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="btn btn-primary"
                      style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                    >
                      <Plus size={16} /> Schedule Recurring Task
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {scheduledTodos.map(todo => (
                      <TodoCard
                        key={todo.id}
                        todo={todo}
                        onToggle={handleToggleTodo}
                        onDelete={handleDeleteTodo}
                        onStartSprint={setActiveSprintTodo}
                        showSprintButton={appSettings.enableSprintTimer}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SUB-SECTION 3: QUICK NOTES & NOTEBOOKS */}
            {homeSection === 'notes' && appSettings.enableNotes && (
              <div className="glass-card animate-fade-in" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText color="hsl(40, 95%, 45%)" size={20} />
                    <h2 style={{ fontSize: '1.15rem', margin: 0 }}>Quick Notes & Lists ({notes.length})</h2>
                  </div>
                  <button
                    onClick={handleOpenNewNote}
                    className="btn btn-primary"
                    style={{ padding: '0.45rem 0.95rem', fontSize: '0.85rem', background: 'linear-gradient(135deg, hsl(40, 95%, 45%), hsl(25, 90%, 50%))' }}
                  >
                    <Plus size={16} /> New Note
                  </button>
                </div>

                {notes.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                    <FileText size={36} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem', opacity: 0.6 }} />
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                      No notes or checklists yet. Capture your quick thoughts or improv lists!
                    </p>
                    <button
                      onClick={handleOpenNewNote}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.85rem' }}
                    >
                      + Create First Note
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
                    {notes.map(note => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        onClick={handleOpenEditNote}
                        onDelete={handleDeleteNote}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        )}

        {/* TAB 2: CALENDAR VIEW */}
        {activeTab === 'calendar' && appSettings.enableRecurring && (
          <CalendarView
            todos={todos}
            onToggleTodo={handleToggleTodo}
            onDeleteTodo={handleDeleteTodo}
            onAddTaskForDate={handleOpenAddForDate}
          />
        )}

        {/* TAB 3: IMPROV STUDIO */}
        {activeTab === 'improv' && appSettings.enableImprov && (
          <div className="animate-fade-in">
            <div className="glass-card" style={{
              background: 'linear-gradient(135deg, hsla(210, 85%, 52%, 0.12), hsla(165, 70%, 42%, 0.1))',
              border: '1px solid var(--border-glow)',
              marginBottom: '1.5rem',
              textAlign: 'center',
              padding: '1.5rem'
            }}>
              <Flame size={40} color="var(--accent-primary)" style={{ margin: '0 auto 0.5rem' }} className="animate-pulse" />
              <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Improv Studio</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                Break creative blocks, beat procrastination, and turn tedious chores into games.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                  onClick={() => setIsImprovModalOpen(true)}
                  className="btn btn-improv"
                  style={{ flex: 1, minWidth: '180px' }}
                >
                  <Sparkles size={18} /> Launch Challenge Wheel
                </button>
                <button
                  onClick={() => setIsCustomModalOpen(true)}
                  className="btn btn-secondary"
                  style={{ flex: 1, minWidth: '160px', background: 'var(--bg-secondary)' }}
                >
                  <Plus size={18} /> Create Your Idea
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyItems: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Zap size={18} color="var(--accent-secondary)" /> All Challenges ({allImprovPrompts.length})
              </h3>
              <button
                onClick={() => setIsCustomModalOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-primary)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                + Add New Idea
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {allImprovPrompts.map(prompt => {
                const isCustom = prompt.id.startsWith('custom-');
                return (
                  <div key={prompt.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', borderLeft: isCustom ? '4px solid var(--accent-secondary)' : undefined }}>
                    <div style={{ textAlign: 'left', flex: 1 }}>
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span className="badge badge-improv">{prompt.category}</span>
                        {isCustom && (
                          <span style={{ fontSize: '0.7rem', background: 'hsla(165, 70%, 42%, 0.15)', color: 'var(--accent-secondary)', padding: '2px 6px', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
                            Custom Idea
                          </span>
                        )}
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Clock size={12} /> {prompt.timeEstimate}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '1rem', margin: '0 0 0.25rem' }}>{prompt.title}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>{prompt.description}</p>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
                      {isCustom && (
                        <button
                          onClick={() => handleDeleteCustomPrompt(prompt.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            padding: '0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            transition: 'color var(--transition-fast)'
                          }}
                          title="Delete Custom Idea"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleAddTodo({
                          title: prompt.title,
                          description: prompt.description,
                          priority: 'improv',
                          category: prompt.category,
                          isImprovPrompt: true,
                          date: formatLocalDateStr(new Date()),
                          scheduleType: 'single'
                        })}
                        className="btn btn-secondary"
                        style={{ padding: '0.6rem', borderRadius: 'var(--radius-sm)' }}
                        title="Add to Tasks Today"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: STATS & PROGRESS */}
        {activeTab === 'stats' && appSettings.enableStats && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="glass-card" style={{ textAlign: 'center', padding: '1.5rem' }}>
              <Trophy size={44} color="hsl(40, 95%, 45%)" style={{ margin: '0 auto 0.5rem' }} />
              <h2 style={{ fontSize: '1.5rem', margin: 0 }}>
                {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
              </h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Overall Completion Rate
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="glass-card" style={{ textAlign: 'center' }}>
                <CheckCircle2 size={28} color="var(--accent-primary)" style={{ margin: '0 auto 0.5rem' }} />
                <h3 style={{ fontSize: '1.4rem', margin: 0 }}>{completedCount}</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tasks Done</span>
              </div>
              <div className="glass-card" style={{ textAlign: 'center' }}>
                <Sparkles size={28} color="var(--accent-secondary)" style={{ margin: '0 auto 0.5rem' }} />
                <h3 style={{ fontSize: '1.4rem', margin: 0 }}>
                  {todos.filter(t => t.isImprovPrompt && t.completed).length}
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Improvs Won</span>
              </div>
            </div>

            <div className="glass-card" style={{ background: 'var(--bg-tertiary)', textAlign: 'left' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Zap size={18} color="var(--accent-primary)" /> Modular Studio Tips
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.5rem' }}>
                • **Customize Your Workspace**: Click the gear icon in the top right header at any time to toggle features like Improv Studio, Quick Notes, or Recurring Schedules!
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                • **Touch Swiping**: Swipe any task right to complete or left to delete!
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Custom Add Task Modal with Calendar Scheduling */}
      {isAddModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'max(env(safe-area-inset-top, 48px), 48px) 1.5rem 1.5rem',
          zIndex: 1000
        }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '440px', background: 'var(--bg-secondary)', padding: '1.5rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <CalendarIcon color="var(--accent-primary)" />
              <h2 style={{ fontSize: '1.25rem', margin: 0, textAlign: 'left' }}>Add Task</h2>
            </div>

            <form onSubmit={handleCreateCustomTodo} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Title *</label>
                <input
                  type="text"
                  required
                  placeholder="What needs to be done?"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  style={{
                    width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)',
                    color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Description (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Add details, notes or links..."
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  style={{
                    width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)',
                    color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none', resize: 'none'
                  }}
                />
              </div>

              {/* SCHEDULING MODE SELECTOR */}
              <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                  📅 Date & Schedule Options
                </label>
                {appSettings.enableRecurring ? (
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '0.75rem' }}>
                    {[
                      { id: 'single', label: 'Single Date' },
                      { id: 'range', label: 'Date Range' },
                      { id: 'days', label: 'Specific Days' }
                    ].map(mode => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setNewScheduleType(mode.id as any)}
                        style={{
                          flex: 1,
                          padding: '0.5rem 0.25rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-color)',
                          background: newScheduleType === mode.id ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                          color: newScheduleType === mode.id ? 'white' : 'var(--text-secondary)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all var(--transition-fast)'
                        }}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                ) : null}

                {/* SINGLE DATE MODE */}
                {newScheduleType === 'single' && (
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Select Date</label>
                    <input
                      type="date"
                      value={newDate}
                      onChange={e => setNewDate(e.target.value)}
                      style={{
                        width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)', background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none'
                      }}
                    />
                  </div>
                )}

                {/* RANGE & DAYS MODE */}
                {(newScheduleType === 'range' || newScheduleType === 'days') && appSettings.enableRecurring && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: newScheduleType === 'days' ? '0.75rem' : 0 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Start Date</label>
                      <input
                        type="date"
                        value={newStartDate}
                        onChange={e => setNewStartDate(e.target.value)}
                        style={{
                          width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-color)', background: 'var(--bg-secondary)',
                          color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none'
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>End Date</label>
                      <input
                        type="date"
                        value={newEndDate}
                        onChange={e => setNewEndDate(e.target.value)}
                        style={{
                          width: '100%', padding: '0.6rem', borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-color)', background: 'var(--bg-secondary)',
                          color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* SPECIFIC DAYS OF WEEK MODE */}
                {newScheduleType === 'days' && appSettings.enableRecurring && (
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                      Repeat on Days of Week
                    </label>
                    <div style={{ display: 'flex', gap: '4px', justifyItems: 'space-between' }}>
                      {[
                        { idx: 0, label: 'Su' },
                        { idx: 1, label: 'Mo' },
                        { idx: 2, label: 'Tu' },
                        { idx: 3, label: 'We' },
                        { idx: 4, label: 'Th' },
                        { idx: 5, label: 'Fr' },
                        { idx: 6, label: 'Sa' }
                      ].map(day => {
                        const isSelected = newSelectedDays.includes(day.idx);
                        return (
                          <button
                            key={day.idx}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setNewSelectedDays(prev => prev.filter(d => d !== day.idx));
                              } else {
                                setNewSelectedDays(prev => [...prev, day.idx]);
                              }
                            }}
                            style={{
                              flex: 1,
                              height: '34px',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--border-color)',
                              background: isSelected ? 'var(--accent-secondary)' : 'var(--bg-secondary)',
                              color: isSelected ? 'white' : 'var(--text-primary)',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            {day.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Priority</label>
                  <select
                    value={newPriority}
                    onChange={e => setNewPriority(e.target.value as Priority)}
                    style={{
                      width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)',
                      color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none'
                    }}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    {appSettings.enableImprov && <option value="improv">Improv Challenge</option>}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Work, Quick-Win"
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    style={{
                      width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)',
                      color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Google Keep Style Notebook Editor Modal */}
      <NoteEditorModal
        isOpen={isNoteEditorOpen}
        note={editingNote}
        onClose={() => setIsNoteEditorOpen(false)}
        onSave={handleSaveNote}
        onDelete={handleDeleteNote}
      />

      {/* Improv Challenge Wheel Modal */}
      <ImprovModal
        isOpen={isImprovModalOpen}
        prompts={allImprovPrompts}
        onClose={() => setIsImprovModalOpen(false)}
        onAddAsTodo={handleAddTodo}
        onOpenCustomModal={() => setIsCustomModalOpen(true)}
      />

      {/* Custom Improv Creator Modal */}
      <CustomImprovModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onSave={handleSaveCustomPrompt}
      />

      {/* Interactive Sprint Timer Modal */}
      <SprintTimerModal
        isOpen={!!activeSprintTodo}
        todo={activeSprintTodo}
        onClose={() => setActiveSprintTodo(null)}
        onCompleteTodo={(id) => {
          setTodos(prev => prev.map(t => {
            if (t.id === id) {
              return { ...t, completed: true };
            }
            return t;
          }));
        }}
      />

      {/* Modular Studio Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={appSettings}
        onUpdateSettings={setAppSettings}
      />

      {/* Floating Action Button */}
      <FloatingActionButton
        onClick={() => setIsAddModalOpen(true)}
        onImprovClick={appSettings.enableImprov ? () => setIsImprovModalOpen(true) : undefined}
      />

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        settings={appSettings}
      />
    </div>
  );
}
export default App;
