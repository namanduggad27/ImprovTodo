import { useEffect } from 'react';
import type { Todo, Note, ImprovPrompt, AppSettings, TabType } from '../types/todo';
import { App as CapApp } from '@capacitor/app';
import { CapgoWidgetKit } from '@capgo/capacitor-widget-kit';
import { Preferences } from '@capacitor/preferences';
import { LocalNotifications } from '@capacitor/local-notifications';
import { autoBackup, checkForBackup } from '../utils/backup';
import { formatLocalDateStr, isTodoOnDate } from '../utils/date';
import { sound } from '../utils/audio';

interface UseNativeSyncParams {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  customPrompts: ImprovPrompt[];
  setCustomPrompts: React.Dispatch<React.SetStateAction<ImprovPrompt[]>>;
  appSettings: AppSettings;
  setAppSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  homeSection: 'daily' | 'scheduled' | 'notes';
  setHomeSection: (section: 'daily' | 'scheduled' | 'notes') => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  activeSprintTodo: Todo | null;
  setActiveSprintTodo: (todo: Todo | null) => void;
  isCustomModalOpen: boolean;
  setIsCustomModalOpen: (open: boolean) => void;
  isNoteEditorOpen: boolean;
  setIsNoteEditorOpen: (open: boolean) => void;
  editingNote: Note | null;
  setEditingNote: (note: Note | null) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  isImprovModalOpen: boolean;
  setIsImprovModalOpen: (open: boolean) => void;
}

export function useNativeSync({
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
}: UseNativeSyncParams) {

  // Auto-Restore from Persistent Backup on First Launch
  useEffect(() => {
    const runRestore = async () => {
      const hasLocalData = localStorage.getItem('improv_todos') !== null;
      if (!hasLocalData) {
        const backup = await checkForBackup();
        if (backup) {
          if (backup.todos && Array.isArray(backup.todos)) setTodos(backup.todos);
          if (backup.notes && Array.isArray(backup.notes)) setNotes(backup.notes);
          if (backup.customPrompts && Array.isArray(backup.customPrompts)) setCustomPrompts(backup.customPrompts);
          if (backup.appSettings) {
            setAppSettings(prev => ({ ...prev, ...backup.appSettings }));
          }
        }
      }
    };
    runRestore();
  }, []);

  // Debounced Auto-Backup to Persistent Storage
  useEffect(() => {
    const timer = setTimeout(() => {
      autoBackup({ todos, notes, customPrompts, appSettings });
    }, 2000);
    return () => clearTimeout(timer);
  }, [todos, notes, customPrompts, appSettings]);

  // Save todos to localStorage and sync to WidgetKit
  useEffect(() => {
    localStorage.setItem('improv_todos', JSON.stringify(todos));
    
    const syncWidget = async () => {
      try {
        const todayStr = formatLocalDateStr(new Date());
        const topTasks = todos
          .filter(t => isTodoOnDate(t, todayStr))
          .sort((a, b) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt));
        await CapgoWidgetKit.startWidgetSession({
          widgetId: 'todo-widget-session',
          kind: 'todo-list',
          state: { tasks: topTasks as any },
          metadata: {}
        });
      } catch (err) {
        console.error('Widget sync failed:', err);
      }
    };
    syncWidget();
  }, [todos]);

  // Request Notification Permissions on mount
  useEffect(() => {
    const initNotifications = async () => {
      try {
        await LocalNotifications.requestPermissions();
      } catch (err) {
        console.error('Notification perms error', err);
      }
    };
    initNotifications();
  }, []);

  // Sync completed tasks & newly created tasks from Widget
  useEffect(() => {
    const syncUpdatesFromWidget = async () => {
      try {
        const { value } = await Preferences.get({ key: 'widget_task_updates' });
        if (value) {
          const updates: Record<string, boolean> = JSON.parse(value);
          const updateKeys = Object.keys(updates);
          if (updateKeys.length > 0) {
            setTodos(prev => {
              let changed = false;
              const next = prev.map(t => {
                if (updateKeys.includes(t.id) && t.completed !== updates[t.id]) {
                  changed = true;
                  const nextCompleted = updates[t.id];
                  if (nextCompleted && t.notificationId) {
                    LocalNotifications.cancel({ notifications: [{ id: t.notificationId }] }).catch(console.error);
                  }
                  return { ...t, completed: nextCompleted, updatedAt: Date.now() };
                }
                return t;
              });
              return changed ? next : prev;
            });
            await Preferences.remove({ key: 'widget_task_updates' });
          }
        }

        const newTasksPref = await Preferences.get({ key: 'widget_new_tasks' });
        if (newTasksPref.value) {
          const newTasks: string[] = JSON.parse(newTasksPref.value);
          if (newTasks.length > 0) {
            const todayStr = formatLocalDateStr(new Date());
            const createdTodos: Todo[] = newTasks.map(title => ({
              id: Math.random().toString(36).substring(2, 9),
              title,
              completed: false,
              createdAt: Date.now(),
              date: todayStr,
              scheduleType: 'single',
              priority: 'medium',
              category: 'General'
            }));
            
            setTodos(prev => [...createdTodos, ...prev]);
            await Preferences.remove({ key: 'widget_new_tasks' });
          }
        }
      } catch (err) {
        console.error('Failed to sync widget task updates', err);
      }
    };

    syncUpdatesFromWidget();
    const interval = setInterval(syncUpdatesFromWidget, 1000);

    const listener = CapApp.addListener('appStateChange', ({ isActive }) => {
      if (isActive) {
        syncUpdatesFromWidget();
      }
    });

    return () => {
      clearInterval(interval);
      listener.then(l => l.remove());
    };
  }, []);

  // LocalStorage persistence for notes, custom prompts, and settings
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
  }, [
    isAddModalOpen,
    isImprovModalOpen,
    isNoteEditorOpen,
    editingNote,
    activeTab,
    homeSection,
    activeSprintTodo,
    isCustomModalOpen,
    isSettingsOpen
  ]);
}
