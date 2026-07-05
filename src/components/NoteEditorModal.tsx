import React, { useState, useEffect } from 'react';
import type { Note, NoteItem, NoteColor } from '../types/todo';
import { ChevronLeft, CheckSquare, FileText, Plus, Trash2, CheckCircle2, Circle, Palette, Save } from 'lucide-react';

interface NoteEditorModalProps {
  isOpen: boolean;
  note: Note | null;
  onClose: () => void;
  onSave: (noteData: Omit<Note, 'id' | 'updatedAt'>, existingId?: string) => void;
  onDelete?: (id: string) => void;
}

const COLORS: { id: NoteColor; label: string; bgBtn: string; pageBg: string }[] = [
  { id: 'default', label: 'Default', bgBtn: 'hsl(0, 0%, 98%)', pageBg: 'var(--bg-primary)' },
  { id: 'blue', label: 'Sky Blue', bgBtn: 'hsl(210, 85%, 85%)', pageBg: 'hsl(210, 80%, 96%)' },
  { id: 'sage', label: 'Sage Green', bgBtn: 'hsl(165, 60%, 82%)', pageBg: 'hsl(165, 55%, 95%)' },
  { id: 'yellow', label: 'Warm Cream', bgBtn: 'hsl(45, 90%, 82%)', pageBg: 'hsl(45, 85%, 96%)' },
  { id: 'lavender', label: 'Lavender', bgBtn: 'hsl(265, 75%, 85%)', pageBg: 'hsl(265, 70%, 96%)' },
  { id: 'pink', label: 'Rose Pink', bgBtn: 'hsl(340, 80%, 85%)', pageBg: 'hsl(340, 80%, 96%)' },
];

export const NoteEditorModal: React.FC<NoteEditorModalProps> = ({
  isOpen,
  note,
  onClose,
  onSave,
  onDelete
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isList, setIsList] = useState(false);
  const [items, setItems] = useState<NoteItem[]>([]);
  const [color, setColor] = useState<NoteColor>('default');
  const [newItemText, setNewItemText] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
      setIsList(!!note.isList);
      setItems(note.items || []);
      setColor(note.color || 'default');
    } else {
      setTitle('');
      setContent('');
      setIsList(false);
      setItems([]);
      setColor('default');
    }
    setNewItemText('');
  }, [note, isOpen]);

  if (!isOpen) return null;

  const handleAddItem = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newItemText.trim()) return;
    const newItem: NoteItem = {
      id: Math.random().toString(36).substring(2, 9),
      text: newItemText.trim(),
      completed: false
    };
    setItems(prev => [...prev, newItem]);
    setNewItemText('');
  };

  const handleToggleItem = (itemId: string) => {
    setItems(prev => prev.map(item => item.id === itemId ? { ...item, completed: !item.completed } : item));
  };

  const handleDeleteItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim() && !content.trim() && items.length === 0) {
      onClose();
      return;
    }
    onSave({
      title: title.trim() || 'Untitled Note',
      content: content.trim(),
      isList,
      items: isList ? items : undefined,
      color
    }, note?.id);
    onClose();
  };

  const activeColorObj = COLORS.find(c => c.id === color) || COLORS[0];

  return (
    <div className="animate-fade-in" style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: activeColorObj.pageBg,
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column',
      maxWidth: '480px',
      margin: '0 auto',
      overflowY: 'auto',
      boxShadow: '0 0 50px rgba(0,0,0,0.1)',
      transition: 'background-color var(--transition-smooth)'
    }}>
      {/* Top Navigation Bar */}
      <header style={{
        minHeight: '64px',
        padding: 'max(env(safe-area-inset-top, 48px), 48px) 1rem 0.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid hsla(220, 20%, 80%, 0.4)',
        background: 'hsla(0, 0%, 100%, 0.7)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <button
          onClick={() => handleSave()}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '4px',
            color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.95rem',
            padding: '0.5rem 0.25rem'
          }}
          title="Save & Return"
        >
          <ChevronLeft size={24} color="var(--accent-primary)" />
          <span>Notes</span>
        </button>

        {/* Mode Toggle Switch */}
        <div style={{ display: 'flex', background: 'var(--bg-tertiary)', padding: '3px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)' }}>
          <button
            type="button"
            onClick={() => setIsList(false)}
            style={{
              padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-full)', border: 'none',
              background: !isList ? 'var(--bg-secondary)' : 'transparent',
              color: !isList ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontWeight: !isList ? 700 : 500, fontSize: '0.8rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '4px',
              boxShadow: !isList ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all var(--transition-fast)'
            }}
          >
            <FileText size={14} /> Text
          </button>
          <button
            type="button"
            onClick={() => setIsList(true)}
            style={{
              padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-full)', border: 'none',
              background: isList ? 'var(--bg-secondary)' : 'transparent',
              color: isList ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontWeight: isList ? 700 : 500, fontSize: '0.8rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '4px',
              boxShadow: isList ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all var(--transition-fast)'
            }}
          >
            <CheckSquare size={14} /> Checklist
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {note && onDelete && (
            <button
              type="button"
              onClick={() => { onDelete(note.id); onClose(); }}
              style={{
                background: 'hsla(350, 80%, 55%, 0.1)', border: '1px solid hsla(350, 80%, 55%, 0.3)',
                color: 'hsl(350, 80%, 55%)', cursor: 'pointer', padding: '0.45rem',
                borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center'
              }}
              title="Delete Note"
            >
              <Trash2 size={18} />
            </button>
          )}
          <button
            onClick={() => handleSave()}
            className="btn btn-primary"
            style={{ padding: '0.45rem 0.95rem', fontSize: '0.85rem' }}
          >
            <Save size={16} /> Save
          </button>
        </div>
      </header>

      {/* Main Full-Screen Content Area */}
      <form onSubmit={handleSave} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '1.25rem' }}>
        
        {/* Title Input */}
        <input
          type="text"
          placeholder="Title..."
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem 0',
            border: 'none',
            background: 'transparent',
            color: 'var(--text-primary)',
            fontSize: '1.75rem',
            fontWeight: 800,
            outline: 'none',
            fontFamily: 'var(--font-heading)'
          }}
        />

        {/* Color Palette Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '0.75rem', borderBottom: '1px solid hsla(220, 20%, 80%, 0.4)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginRight: '4px', fontWeight: 600 }}>
            <Palette size={16} color="var(--accent-primary)" /> Color:
          </span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {COLORS.map(c => (
              <button
                key={c.id}
                type="button"
                onClick={() => setColor(c.id)}
                title={c.label}
                style={{
                  width: '32px', height: '32px', borderRadius: 'var(--radius-full)',
                  background: c.bgBtn,
                  border: color === c.id ? '2px solid var(--text-primary)' : '1px solid var(--border-color)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyItems: 'center',
                  boxShadow: color === c.id ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
                  transition: 'transform var(--transition-fast)',
                  transform: color === c.id ? 'scale(1.1)' : 'scale(1)'
                }}
              >
                {color === c.id && <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--text-primary)', margin: 'auto' }} />}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area (Text Note vs Checklist) */}
        {!isList ? (
          <textarea
            placeholder="Type your notes, thoughts, improv scripts, or brainstorm ideas here..."
            value={content}
            onChange={e => setContent(e.target.value)}
            style={{
              width: '100%',
              flex: 1,
              minHeight: '380px',
              border: 'none',
              background: 'transparent',
              color: 'var(--text-primary)',
              fontSize: '1.05rem',
              lineHeight: 1.6,
              outline: 'none',
              resize: 'none',
              fontFamily: 'var(--font-body)'
            }}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '0.75rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {items.length === 0 ? (
                <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.95rem', padding: '1.5rem 0', textAlign: 'center' }}>
                  No items in this list yet. Add your first item below!
                </p>
              ) : (
                items.map(item => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      background: 'hsla(0, 0%, 100%, 0.6)',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid hsla(220, 20%, 80%, 0.4)',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleItem(item.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: item.completed ? 'var(--accent-secondary)' : 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}
                    >
                      {item.completed ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                    </button>
                    <span style={{
                      flex: 1,
                      textDecoration: item.completed ? 'line-through' : 'none',
                      color: item.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                      fontSize: '1rem',
                      fontWeight: 500
                    }}>
                      {item.text}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px', display: 'flex', alignItems: 'center' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add New List Item Input */}
            <div style={{
              display: 'flex',
              gap: '8px',
              marginTop: '0.5rem',
              background: 'hsla(0, 0%, 100%, 0.8)',
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
            }}>
              <input
                type="text"
                placeholder="Add new list item..."
                value={newItemText}
                onChange={e => setNewItemText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddItem(); } }}
                style={{
                  flex: 1, padding: '0.75rem', border: 'none', background: 'transparent',
                  color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none'
                }}
              />
              <button
                type="button"
                onClick={() => handleAddItem()}
                className="btn btn-primary"
                style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}
              >
                <Plus size={18} /> Add Item
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
