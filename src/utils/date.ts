import type { Todo } from '../types/todo';

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
