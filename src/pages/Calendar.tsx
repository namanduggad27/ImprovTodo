import React from 'react';
import type { Todo } from '../types/todo';
import { CalendarView } from '../components/CalendarView';

interface CalendarPageProps {
  todos: Todo[];
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onAddTaskForDate: (dateStr: string) => void;
}

export const Calendar: React.FC<CalendarPageProps> = ({
  todos,
  onToggleTodo,
  onDeleteTodo,
  onAddTaskForDate
}) => {
  return (
    <div style={{ width: '100%' }}>
      <CalendarView
        todos={todos}
        onToggleTodo={onToggleTodo}
        onDeleteTodo={onDeleteTodo}
        onAddTaskForDate={onAddTaskForDate}
      />
    </div>
  );
};
