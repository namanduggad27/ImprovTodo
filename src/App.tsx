import React, { useState } from 'react';
import type { Todo, TabType, DateScheduleType, Note, ImprovPrompt, AppSettings } from './types/todo';
import { DEFAULT_APP_SETTINGS } from './types/todo';
import { Header } from './components/Header';
import { SectionTabs } from './components/SectionTabs';
import { ImprovModal } from './components/ImprovModal';
import { CustomImprovModal } from './components/CustomImprovModal';
import { SprintTimerModal } from './components/SprintTimerModal';
import { SettingsModal } from './components/SettingsModal';
import { BottomNav } from './components/BottomNav';
import { FloatingActionButton } from './components/FloatingActionButton';
import { NoteEditorModal } from './components/NoteEditorModal';
import { AddTaskModal } from './components/modals/AddTaskModal';
import { Tasks, Recurring, QuickNotes, Calendar, Goals, Progress, Studio } from './pages';
import { IMPROV_PROMPTS } from './data/improvPrompts';
import { sound } from './utils/audio';
import { formatLocalDateStr } from './utils/date';
import { LocalNotifications } from '@capacitor/local-notifications';
import { useNativeSync } from './hooks/useNativeSync';

// One-time automatic purge of legacy local data to ensure a completely fresh application
const DATA_PURGE_KEY = 'improv_data_cleared_v1';
if (typeof window !== 'undefined' && !localStorage.getItem(DATA_PURGE_KEY)) {
  localStorage.removeItem('improv_todos');
  localStorage.removeItem('improv_notes');
  localStorage.removeItem('improv_custom_prompts');
  localStorage.removeItem('improv_goals');
  localStorage.removeItem('improv_goal_stats');
  localStorage.setItem(DATA_PURGE_KEY, 'true');
}

const INITIAL_TODOS: Todo[] = [];
const INITIAL_NOTES: Note[] = [];

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

  // Filters for Section 1 and Section 2
  const [filterScheduled, setFilterScheduled] = useState<string>('all');
  const [filterDaily, setFilterDaily] = useState<string>('all');

  // Notes Modal State
  const [isNoteEditorOpen, setIsNoteEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  // Add Task Modal Prefills
  const [addScheduleType, setAddScheduleType] = useState<DateScheduleType>('single');
  const [addDate, setAddDate] = useState(() => formatLocalDateStr(new Date()));

  const allImprovPrompts = [...customPrompts, ...IMPROV_PROMPTS];

  // Native synchronization, persistent storage, and hardware back button
  useNativeSync({
    todos,
    setTodos,
    notes,
    setNotes,
    customPrompts,
    setCustomPrompts,
    appSettings,
    setAppSettings,
    activeTab,
    setActiveTab,
    homeSection,
    setHomeSection,
    isSettingsOpen,
    setIsSettingsOpen,
    activeSprintTodo,
    setActiveSprintTodo,
    isCustomModalOpen,
    setIsCustomModalOpen,
    isNoteEditorOpen,
    setIsNoteEditorOpen,
    editingNote,
    setEditingNote,
    isAddModalOpen,
    setIsAddModalOpen,
    isImprovModalOpen,
    setIsImprovModalOpen
  });

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
          if (t.notificationId) {
            LocalNotifications.cancel({ notifications: [{ id: t.notificationId }] }).catch(console.error);
          }
        }
        return { ...t, completed: nextCompleted, updatedAt: Date.now() };
      }
      return t;
    }));
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(prev => {
      const todo = prev.find(t => t.id === id);
      if (todo?.notificationId) {
        LocalNotifications.cancel({ notifications: [{ id: todo.notificationId }] }).catch(console.error);
      }
      return prev.filter(t => t.id !== id);
    });
  };

  const handleAddTodo = async (todoData: Omit<Todo, 'id' | 'createdAt' | 'completed'>) => {
    let notificationId: number | undefined;

    if (todoData.reminderTime && todoData.date) {
      notificationId = Math.floor(Math.random() * 1000000);
      const [hours, minutes] = todoData.reminderTime.split(':').map(Number);
      const scheduleDate = new Date(todoData.date);
      scheduleDate.setHours(hours, minutes, 0, 0);

      if (scheduleDate.getTime() > Date.now()) {
        try {
          await LocalNotifications.schedule({
            notifications: [
              {
                id: notificationId,
                title: 'Task Reminder',
                body: todoData.title,
                schedule: { at: scheduleDate },
                smallIcon: 'ic_stat_icon_config_sample'
              }
            ]
          });
        } catch (e) {
          console.error('Failed to schedule notification', e);
        }
      }
    }

    const newTodo: Todo = {
      ...todoData,
      id: Math.random().toString(36).substring(2, 9),
      completed: false,
      createdAt: Date.now(),
      notificationId
    };
    setTodos(prev => [newTodo, ...prev]);
  };

  const handleOpenAddForDate = (dateStr: string) => {
    setAddDate(dateStr);
    setAddScheduleType('single');
    setIsAddModalOpen(true);
  };

  const handleOpenAddRecurring = () => {
    setAddScheduleType('range');
    setIsAddModalOpen(true);
  };

  const handleQuickFill = () => {
    sound.playVictoryFanfare();
    const sampleItems: Todo[] = [
      {
        id: 'sample-' + Math.random().toString(36).substring(2, 7),
        title: 'Morning 15-minute Focus Sprint',
        priority: 'high',
        category: 'Focus',
        completed: false,
        createdAt: Date.now()
      },
      {
        id: 'sample-' + Math.random().toString(36).substring(2, 7),
        title: 'Drink 1L fresh water',
        priority: 'medium',
        category: 'Health',
        completed: false,
        createdAt: Date.now() + 1
      },
      {
        id: 'sample-' + Math.random().toString(36).substring(2, 7),
        title: 'Improv: 2-minute creative break',
        priority: 'improv',
        category: 'Creative',
        isImprovPrompt: true,
        completed: false,
        createdAt: Date.now() + 2
      }
    ];
    setTodos(prev => [...sampleItems, ...prev]);
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

  const handleSaveNote = (noteData: Omit<Note, 'id' | 'updatedAt'>, existingId?: string): string => {
    if (existingId) {
      setNotes(prev => prev.map(n => n.id === existingId ? { ...n, ...noteData, updatedAt: Date.now() } : n));
      return existingId;
    } else {
      const newId = Math.random().toString(36).substring(2, 9);
      const newNote: Note = {
        ...noteData,
        id: newId,
        updatedAt: Date.now()
      };
      setNotes(prev => [newNote, ...prev]);
      return newId;
    }
  };

  const handleDeleteNote = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;
  const dailyTasksCount = todos.filter(t => !t.scheduleType || t.scheduleType === 'single').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {activeTab !== 'goals' && (
        <Header
          completedCount={completedCount}
          totalCount={totalCount}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      )}

      <main style={{ padding: activeTab === 'goals' ? '0' : '1rem', flex: 1 }}>
        {/* TAB 1: TASKS & HOME SECTIONS */}
        {activeTab === 'todos' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <SectionTabs
              currentSection={homeSection}
              onSelectSection={setHomeSection}
              dailyCount={dailyTasksCount}
              enableRecurring={appSettings.enableRecurring}
              enableNotes={appSettings.enableNotes}
              onOpenAdd={() => {
                setAddScheduleType('single');
                setAddDate(formatLocalDateStr(new Date()));
                setIsAddModalOpen(true);
              }}
            />

            {/* MODULAR PAGE 1: DAILY TASKS */}
            {homeSection === 'daily' && (
              <Tasks
                todos={todos}
                filter={filterDaily}
                onSelectFilter={setFilterDaily}
                onToggleTodo={handleToggleTodo}
                onDeleteTodo={handleDeleteTodo}
                onStartSprint={setActiveSprintTodo}
                onOpenAdd={() => {
                  setAddScheduleType('single');
                  setAddDate(formatLocalDateStr(new Date()));
                  setIsAddModalOpen(true);
                }}
                onQuickFill={handleQuickFill}
                settings={appSettings}
              />
            )}

            {/* MODULAR PAGE 2: RECURRING TASKS */}
            {homeSection === 'scheduled' && appSettings.enableRecurring && (
              <Recurring
                todos={todos}
                filter={filterScheduled}
                onSelectFilter={setFilterScheduled}
                onToggleTodo={handleToggleTodo}
                onDeleteTodo={handleDeleteTodo}
                onStartSprint={setActiveSprintTodo}
                onOpenAddRecurring={handleOpenAddRecurring}
                settings={appSettings}
              />
            )}

            {/* MODULAR PAGE 3: QUICK NOTES */}
            {homeSection === 'notes' && appSettings.enableNotes && (
              <QuickNotes
                notes={notes}
                onOpenNewNote={handleOpenNewNote}
                onOpenEditNote={handleOpenEditNote}
                onDeleteNote={handleDeleteNote}
              />
            )}
          </div>
        )}

        {/* TAB 2: GOALS & 66-DAY HABIT CHALLENGE */}
        {activeTab === 'goals' && appSettings.enableGoals && (
          <Goals onOpenSettings={() => setIsSettingsOpen(true)} />
        )}

        {/* TAB 3: CALENDAR VIEW */}
        {activeTab === 'calendar' && appSettings.enableRecurring && (
          <Calendar
            todos={todos}
            onToggleTodo={handleToggleTodo}
            onDeleteTodo={handleDeleteTodo}
            onAddTaskForDate={handleOpenAddForDate}
          />
        )}

        {/* TAB 4: IMPROV STUDIO */}
        {activeTab === 'improv' && appSettings.enableImprov && (
          <Studio
            prompts={allImprovPrompts}
            onLaunchWheel={() => setIsImprovModalOpen(true)}
            onCreateIdea={() => setIsCustomModalOpen(true)}
            onDeleteCustomPrompt={handleDeleteCustomPrompt}
            onAddPromptAsTodo={prompt => {
              handleAddTodo({
                title: prompt.title,
                description: prompt.description,
                priority: 'improv',
                category: prompt.category,
                isImprovPrompt: true,
                date: formatLocalDateStr(new Date()),
                scheduleType: 'single'
              });
            }}
          />
        )}

        {/* TAB 5: STATS & PROGRESS */}
        {activeTab === 'stats' && appSettings.enableStats && (
          <Progress todos={todos} />
        )}
      </main>

      {/* Custom Add Task Modal with Calendar Scheduling */}
      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddTodo}
        settings={appSettings}
        defaultScheduleType={addScheduleType}
        defaultDate={addDate}
      />

      {/* Google Keep Style Notebook Editor Modal */}
      <NoteEditorModal
        isOpen={isNoteEditorOpen}
        note={editingNote}
        onClose={() => setIsNoteEditorOpen(false)}
        onSave={handleSaveNote}
        onDelete={handleDeleteNote}
      />

      {/* Improv Prompt Roulette Modal */}
      <ImprovModal
        isOpen={isImprovModalOpen}
        onClose={() => setIsImprovModalOpen(false)}
        onAddAsTodo={handleAddTodo}
        prompts={allImprovPrompts}
        onOpenCustomModal={() => {
          setIsImprovModalOpen(false);
          setIsCustomModalOpen(true);
        }}
      />

      {/* Custom Improv Creation Modal */}
      <CustomImprovModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onSave={handleSaveCustomPrompt}
      />

      {/* Sprint Countdown Timer Modal */}
      <SprintTimerModal
        isOpen={activeSprintTodo !== null}
        todo={activeSprintTodo}
        onClose={() => setActiveSprintTodo(null)}
        onCompleteTodo={handleToggleTodo}
      />

      {/* App Feature Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={appSettings}
        onUpdateSettings={setAppSettings}
      />

      {/* Bottom Sticky Action Trigger for Mobile Thumb Access */}
      {activeTab === 'todos' && homeSection === 'daily' && (
        <FloatingActionButton
          onClick={() => {
            setAddScheduleType('single');
            setAddDate(formatLocalDateStr(new Date()));
            setIsAddModalOpen(true);
          }}
          onImprovClick={appSettings.enableImprov ? () => setIsImprovModalOpen(true) : undefined}
        />
      )}

      {/* Persistent Bottom Bar Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        settings={appSettings}
      />
    </div>
  );
}

export default App;
